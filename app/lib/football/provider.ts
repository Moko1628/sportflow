// ============================================================================
// BABIscore — Interface du fournisseur football (abstraction)
// Tout fournisseur doit implémenter cette interface.
// On peut remplacer API-Football par Sportmonks, TheSportsDB, etc.
// ============================================================================

import type { FootballFixture } from './types';

export interface FootballProviderResponse<T> {
  data: T;
  provider: string;
  cached: boolean;
  remaining?: number;
  errors?: string[];
}

export interface FootballProvider {
  readonly name: string;
  getLiveMatches(): Promise<FootballProviderResponse<FootballFixture[]>>;
  getMatchesByDate(date: string): Promise<FootballProviderResponse<FootballFixture[]>>;
  getFixturesForDateRange(startDate: string, endDate: string): Promise<FootballProviderResponse<FootballFixture[]>>;
  getMatchById(id: number): Promise<FootballProviderResponse<FootballFixture | null>>;
}

// Types étendus pour l'affichage dans les composants
export interface Match {
  id: string;
  date: string;
  timestamp: number;
  status: {
    short: string;
    long: string;
    elapsed?: number | null;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season?: number;
    round?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
  referee?: string;
  venue?: {
    name?: string;
    city?: string;
  };
}

export interface MatchDetails extends Match {
  events: Array<{
    time: { elapsed: number; extra?: number };
    team: { id: number; name: string; logo: string };
    player: { id: number; name: string };
    assist?: { id?: number; name?: string };
    type: string;
    detail: string;
  }>;
  lineups: unknown[];
  statistics: unknown[];
}

export interface Competition {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
}
