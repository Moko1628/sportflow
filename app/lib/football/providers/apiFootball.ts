/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// BABIscore — API-Football Provider
// Fournisseur gratuit (100 requêtes/jour, pas de carte bancaire)
// https://www.api-football.com/
// ============================================================================

import type { FootballFixture } from '../types';
import type { FootballProvider, FootballProviderResponse } from '../provider';
import { getCached, setCache, TTL } from '../cache';

const API_BASE = 'https://v3.football.api-sports.io';

async function apiFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) {
    console.warn('WARNING: FOOTBALL_API_KEY is not configured in environment variables. Returning empty response.');
    return { response: [] };
  }

  const url = new URL(`${API_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': key,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.warn(`API-Football error ${res.status}: ${text}. Returning empty response.`);
      return { response: [] };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('API-Football fetch failed:', err);
    return { response: [] };
  }
}

function mapFixture(raw: any): FootballFixture {
  const f = raw.fixture;
  const l = raw.league;
  const t = raw.teams;
  const g = raw.goals;
  const s = raw.score;

  return {
    id: f.id,
    referee: f.referee ?? undefined,
    timezone: f.timezone,
    timestamp: f.timestamp,
    date: f.date,
    venue: f.venue ? { id: f.venue.id, name: f.venue.name, city: f.venue.city } : undefined,
    status: {
      long: f.status?.long ?? 'Not Started',
      short: f.status?.short ?? 'NS',
      elapsed: f.status?.elapsed ?? undefined,
      extra: f.status?.extra ?? undefined,
    },
    league: {
      id: l.id,
      name: l.name,
      country: l.country ?? undefined,
      countryCode: l.country_code ?? undefined,
      logo: l.logo ?? undefined,
      flag: l.flag ?? undefined,
      season: l.season ?? undefined,
      round: l.round ?? undefined,
    },
    teams: {
      home: {
        id: t.home.id,
        name: t.home.name,
        logo: t.home.logo,
        winner: t.home.winner,
      },
      away: {
        id: t.away.id,
        name: t.away.name,
        logo: t.away.logo,
        winner: t.away.winner,
      },
    },
    goals: {
      home: g.home,
      away: g.away,
    },
    score: {
      halftime: { home: s?.halftime?.home ?? null, away: s?.halftime?.away ?? null },
      fulltime: { home: s?.fulltime?.home ?? null, away: s?.fulltime?.away ?? null },
      extratime: { home: s?.extratime?.home ?? null, away: s?.extratime?.away ?? null },
      penalty: { home: s?.penalty?.home ?? null, away: s?.penalty?.away ?? null },
    },
    events: raw.events?.map((e: any) => ({
      time: { elapsed: e.time?.elapsed ?? 0, extra: e.time?.extra ?? undefined },
      team: { id: e.team?.id ?? 0, name: e.team?.name ?? '', logo: e.team?.logo ?? '' },
      player: { id: e.player?.id ?? 0, name: e.player?.name ?? '' },
      assist: e.assist ? { id: e.assist.id, name: e.assist.name } : undefined,
      type: e.type ?? '',
      detail: e.detail ?? '',
    })),
  };
}

export class ApiFootballProvider implements FootballProvider {
  readonly name = 'api-football';

  async getLiveMatches(): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = 'live';
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { live: 'all' });
    const fixtures = (json.response ?? []).map(mapFixture);

    setCache(cacheKey, fixtures, TTL.LIVE);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getMatchesByDate(date: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `date:${date}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { date });
    const fixtures = (json.response ?? []).map(mapFixture);

    setCache(cacheKey, fixtures, TTL.FIXTURES_TODAY);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getFixturesForDateRange(startDate: string, endDate: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `range:${startDate}:${endDate}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    // API-Football: use /fixtures with `from` and `to`
    const json = await apiFetch('fixtures', { from: startDate, to: endDate });
    const fixtures = (json.response ?? []).map(mapFixture);

    setCache(cacheKey, fixtures, TTL.FIXTURES_WEEK);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getMatchById(id: number): Promise<FootballProviderResponse<FootballFixture | null>> {
    const cacheKey = `match:${id}`;
    const cached = getCached<FootballFixture>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { id: String(id) });
    const fixtures = json.response ?? [];
    const fixture = fixtures.length > 0 ? mapFixture(fixtures[0]) : null;

    if (fixture) setCache(cacheKey, fixture, TTL.FIXTURES_TODAY);
    return { data: fixture, provider: this.name, cached: false };
  }
}
