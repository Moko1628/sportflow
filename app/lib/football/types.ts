// ============================================================================
// BABIscore — Types football partagés
// Fournisseur interchangeable (API-Football, Sportmonks, etc.)
// ============================================================================

export interface FootballTeam {
  id: number;
  name: string;
  shortName?: string;
  logo?: string;
  country?: string;
  countryCode?: string;
}

export interface FootballLeague {
  id: number;
  name: string;
  country?: string;
  countryCode?: string;
  logo?: string;
  flag?: string;
  season?: number;
  round?: string;
}

export interface FootballFixture {
  id: number;
  referee?: string;
  timezone: string;
  timestamp: number;
  date: string; // ISO 8601
  periods?: {
    first?: number;
    second?: number;
    extraFirst?: number;
    extraSecond?: number;
  };
  venue?: {
    id?: number;
    name?: string;
    city?: string;
  };
  status: {
    long: string;   // e.g. "Match Finished", "1st Half", "Halftime"
    short: string;  // e.g. "FT", "1H", "HT"
    elapsed?: number;
    extra?: number;
  };
  league: FootballLeague;
  teams: {
    home: FootballTeam & { winner?: boolean };
    away: FootballTeam & { winner?: boolean };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score?: {
    halftime?: { home: number | null; away: number | null };
    fulltime?: { home: number | null; away: number | null };
    extratime?: { home: number | null; away: number | null };
    penalty?: { home: number | null; away: number | null };
  };
  events?: FootballEvent[];
}

export interface FootballEvent {
  time: {
    elapsed: number;
    extra?: number;
  };
  team: { id: number; name: string; logo?: string };
  player: { id?: number; name: string };
  assist?: { id?: number; name?: string };
  type: 'Goal' | 'Card' | 'Substitution' | 'Var' | string;
  detail: string; // e.g. "Normal Goal", "Yellow Card", "Substitution 1"
}

// Catégories de priorité BABIscore
export type MatchPriority = 'cote_divoire' | 'afrique' | 'caf' | 'selections_africaines' | 'international_afrique' | 'monde';

export interface CategorizedMatch {
  fixture: FootballFixture;
  priority: MatchPriority;
}

// Cache metadata
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Réponse API standardisée
export interface FootballProviderResponse<T> {
  data: T;
  cached: boolean;
  provider: string;
  remaining?: number; // requêtes restantes
}
