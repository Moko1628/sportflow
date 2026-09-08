/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// BABIscore — TheSportsDB Provider (100% Gratuit, Clé publique "3", Sans CB)
// Source de données réelle : scores en direct, calendrier et championnats africains/internationaux
// ============================================================================

import type { FootballFixture } from '../types';
import type { FootballProvider, FootballProviderResponse } from '../provider';
import { getCached, setCache, TTL } from '../cache';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

// Ligues surveillées (Afrique / Maroc / Égypte / International / Europe)
const LEAGUE_IDS = [
  4520, // Moroccan Championship (Botola Pro)
  4328, // English Premier League
  4334, // French Ligue 1
  4335, // Spanish La Liga
];

function mapSportsDbEvent(raw: any): FootballFixture {
  const timestamp = raw.strTimestamp ? new Date(raw.strTimestamp).getTime() : Date.now();
  const dateStr = raw.strTimestamp ? raw.strTimestamp + 'Z' : new Date().toISOString();

  // Statut du match
  let shortStatus = 'NS';
  let longStatus = 'Not Started';
  if (raw.strStatus === 'FT') {
    shortStatus = 'FT';
    longStatus = 'Match Finished';
  } else if (['1H', '2H', 'HT', 'LIVE'].includes(raw.strStatus)) {
    shortStatus = raw.strStatus;
    longStatus = raw.strStatus === 'HT' ? 'Half Time' : 'Live';
  }

  return {
    id: Number(raw.idEvent) || Math.floor(Math.random() * 100000),
    timezone: 'UTC',
    timestamp,
    date: dateStr,
    venue: raw.strVenue ? { name: raw.strVenue, city: raw.strCity } : undefined,
    status: {
      long: longStatus,
      short: shortStatus,
      elapsed: undefined,
    },
    league: {
      id: Number(raw.idLeague) || 0,
      name: raw.strLeague || 'Football League',
      country: raw.strCountry || 'International',
      countryCode: raw.strCountry === 'Morocco' ? 'MA' : raw.strCountry === 'England' ? 'GB' : undefined,
      logo: raw.strLeagueBadge || undefined,
      season: raw.strSeason ? parseInt(raw.strSeason) : 2026,
    },
    teams: {
      home: {
        id: Number(raw.idHomeTeam) || 1,
        name: raw.strHomeTeam || 'Home Team',
        logo: raw.strHomeTeamBadge || undefined,
      },
      away: {
        id: Number(raw.idAwayTeam) || 2,
        name: raw.strAwayTeam || 'Away Team',
        logo: raw.strAwayTeamBadge || undefined,
      },
    },
    goals: {
      home: raw.intHomeScore !== null && raw.intHomeScore !== undefined ? Number(raw.intHomeScore) : null,
      away: raw.intAwayScore !== null && raw.intAwayScore !== undefined ? Number(raw.intAwayScore) : null,
    },
  };
}

export class SportsDbProvider implements FootballProvider {
  readonly name = 'thesportsdb';

  async getLiveMatches(): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = 'sportsdb:live';
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`${API_BASE}/eventsday.php?d=${today}`, { next: { revalidate: 30 } });
      if (!res.ok) return { data: [], provider: this.name, cached: false };

      const json = await res.json();
      const events = json.events ?? [];
      // Filtrer uniquement le soccer en direct (ou statut actif)
      const fixtures = events
        .filter((e: any) => e.strSport === 'Soccer')
        .map(mapSportsDbEvent);

      setCache(cacheKey, fixtures, TTL.LIVE);
      return { data: fixtures, provider: this.name, cached: false };
    } catch (err) {
      console.warn('SportsDb live fetch error:', err);
      return { data: [], provider: this.name, cached: false };
    }
  }

  async getMatchesByDate(date: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `sportsdb:date:${date}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    try {
      const res = await fetch(`${API_BASE}/eventsday.php?d=${date}`, { next: { revalidate: 60 } });
      if (!res.ok) return { data: [], provider: this.name, cached: false };

      const json = await res.json();
      const events = json.events ?? [];
      const fixtures = events
        .filter((e: any) => e.strSport === 'Soccer')
        .map(mapSportsDbEvent);

      setCache(cacheKey, fixtures, TTL.FIXTURES_TODAY);
      return { data: fixtures, provider: this.name, cached: false };
    } catch (err) {
      console.warn('SportsDb date fetch error:', err);
      return { data: [], provider: this.name, cached: false };
    }
  }

  async getFixturesForDateRange(startDate: string, endDate: string): Promise<FootballProviderResponse<FootballFixture[]>> {
    const cacheKey = `sportsdb:range:${startDate}:${endDate}`;
    const cached = getCached<FootballFixture[]>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    try {
      // Récupérer les prochains matchs pour nos ligues clés (Afrique + International)
      const allFixtures: FootballFixture[] = [];
      for (const leagueId of LEAGUE_IDS) {
        try {
          const res = await fetch(`${API_BASE}/eventsnextleague.php?id=${leagueId}`, { next: { revalidate: 300 } });
          if (res.ok) {
            const json = await res.json();
            const events = json.events ?? [];
            const mapped = events.map(mapSportsDbEvent);
            allFixtures.push(...mapped);
          }
        } catch {
          // ignorer les erreurs individuelles de ligue
        }
      }

      setCache(cacheKey, allFixtures, TTL.FIXTURES_WEEK);
      return { data: allFixtures, provider: this.name, cached: false };
    } catch (err) {
      console.warn('SportsDb range fetch error:', err);
      return { data: [], provider: this.name, cached: false };
    }
  }

  async getMatchById(id: number): Promise<FootballProviderResponse<FootballFixture | null>> {
    const cacheKey = `sportsdb:match:${id}`;
    const cached = getCached<FootballFixture>(cacheKey);
    if (cached) return { data: cached, provider: this.name, cached: true };

    try {
      const res = await fetch(`${API_BASE}/lookupevent.php?id=${id}`, { next: { revalidate: 60 } });
      if (!res.ok) return { data: null, provider: this.name, cached: false };

      const json = await res.json();
      const events = json.events ?? [];
      const fixture = events.length > 0 ? mapSportsDbEvent(events[0]) : null;

      if (fixture) setCache(cacheKey, fixture, TTL.FIXTURES_TODAY);
      return { data: fixture, provider: this.name, cached: false };
    } catch (err) {
      console.warn('SportsDb match lookup error:', err);
      return { data: null, provider: this.name, cached: false };
    }
  }
}
