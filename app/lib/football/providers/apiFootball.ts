/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// BABIscore — API-Football Provider (Support API-Sports & RapidAPI)
// 100% gratuit + Fallback intelligent si aucune clé n'est configurée
// ============================================================================

import type { FootballFixture } from '../types';
import type { FootballProvider, FootballProviderResponse } from '../provider';
import { getCached, setCache, TTL } from '../cache';

// Matchs de démonstration / fallback orientés Afrique & International
const FALLBACK_MATCHES: FootballFixture[] = [
  {
    id: 9001,
    timezone: 'UTC',
    date: new Date().toISOString(),
    timestamp: Date.now(),
    status: { long: 'Second Half', short: '2H', elapsed: 68 },
    venue: { name: 'Stade Félix Houphouët-Boigny', city: 'Abidjan' },
    league: {
      id: 189,
      name: 'Ligue 1 Lonaci',
      country: 'Ivory Coast',
      countryCode: 'CI',
      logo: '',
      season: 2024,
    },
    teams: {
      home: { id: 1, name: 'ASEC Mimosas', logo: '' },
      away: { id: 2, name: 'Africa Sports', logo: '' }
    },
    goals: { home: 2, away: 1 }
  },
  {
    id: 9002,
    timezone: 'UTC',
    date: new Date().toISOString(),
    timestamp: Date.now(),
    status: { long: 'First Half', short: '1H', elapsed: 35 },
    venue: { name: 'Stade Mohammed V', city: 'Casablanca' },
    league: {
      id: 79,
      name: 'Botola Pro',
      country: 'Morocco',
      countryCode: 'MA',
      logo: '',
      season: 2024,
    },
    teams: {
      home: { id: 10, name: 'Wydad Casablanca', logo: '' },
      away: { id: 11, name: 'Raja Club Athletic', logo: '' }
    },
    goals: { home: 1, away: 1 }
  },
  {
    id: 9003,
    timezone: 'UTC',
    date: new Date(Date.now() + 3600000 * 3).toISOString(),
    timestamp: Date.now() + 3600000 * 3,
    status: { long: 'Not Started', short: 'NS' },
    venue: { name: 'Cairo International Stadium', city: 'Cairo' },
    league: {
      id: 87,
      name: 'Premier League',
      country: 'Egypt',
      countryCode: 'EG',
      logo: '',
      season: 2024,
    },
    teams: {
      home: { id: 20, name: 'Al Ahly', logo: '' },
      away: { id: 21, name: 'Zamalek SC', logo: '' }
    },
    goals: { home: null, away: null }
  },
  {
    id: 9004,
    timezone: 'UTC',
    date: new Date(Date.now() + 3600000 * 6).toISOString(),
    timestamp: Date.now() + 3600000 * 6,
    status: { long: 'Not Started', short: 'NS' },
    venue: { name: 'Wembley Stadium', city: 'London' },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      countryCode: 'GB',
      logo: '',
      season: 2024,
    },
    teams: {
      home: { id: 33, name: 'Manchester United', logo: '' },
      away: { id: 34, name: 'Arsenal', logo: '' }
    },
    goals: { home: null, away: null }
  }
];

async function apiFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const footballApiKey = process.env.FOOTBALL_API_KEY;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  const key = footballApiKey || rapidApiKey;
  if (!key) {
    console.warn('WARNING: No API key (FOOTBALL_API_KEY or RAPIDAPI_KEY) configured. Using fallback data.');
    return { response: null };
  }

  const isRapidAPI = !footballApiKey && !!rapidApiKey;
  const API_BASE = isRapidAPI 
    ? 'https://api-football-v1.p.rapidapi.com/v3' 
    : 'https://v3.football.api-sports.io';

  const headers: Record<string, string> = isRapidAPI
    ? {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      }
    : {
        'x-apisports-key': key,
      };

  const url = new URL(`${API_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.warn(`API-Football error ${res.status}: ${text}. Using fallback data.`);
      return { response: null };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('API-Football fetch failed:', err);
    return { response: null };
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
    let fixtures: FootballFixture[] = [];

    if (json && json.response && json.response.length > 0) {
      fixtures = json.response.map(mapFixture);
    } else {
      fixtures = FALLBACK_MATCHES.filter(m => ['1H', '2H', 'HT', 'ET', 'P'].includes(m.status.short));
    }

    setCache(cacheKey, fixtures, TTL.LIVE);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getMatchesByDate(date: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `date:${date}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { date });
    let fixtures: FootballFixture[] = [];

    if (json && json.response && json.response.length > 0) {
      fixtures = json.response.map(mapFixture);
    } else {
      fixtures = FALLBACK_MATCHES;
    }

    setCache(cacheKey, fixtures, TTL.FIXTURES_TODAY);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getFixturesForDateRange(startDate: string, endDate: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `range:${startDate}:${endDate}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { from: startDate, to: endDate });
    let fixtures: FootballFixture[] = [];

    if (json && json.response && json.response.length > 0) {
      fixtures = json.response.map(mapFixture);
    } else {
      fixtures = FALLBACK_MATCHES;
    }

    setCache(cacheKey, fixtures, TTL.FIXTURES_WEEK);
    return { data: fixtures, provider: this.name, cached: false };
  }

  async getMatchById(id: number): Promise<FootballProviderResponse<FootballFixture | null>> {
    const cacheKey = `match:${id}`;
    const cached = getCached<FootballFixture>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    const json = await apiFetch('fixtures', { id: String(id) });
    const fixtures = json?.response ?? [];
    let fixture = fixtures.length > 0 ? mapFixture(fixtures[0]) : null;

    if (!fixture) {
      fixture = FALLBACK_MATCHES.find((m: FootballFixture) => m.id === id) || null;
    }

    if (fixture) setCache(cacheKey, fixture, TTL.FIXTURES_TODAY);
    return { data: fixture, provider: this.name, cached: false };
  }
}
