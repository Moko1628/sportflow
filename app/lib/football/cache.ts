// ============================================================================
// BABIscore — Cache en mémoire pour limiter les appels API
// Le free tier API-Football = 100 requêtes/jour
// On cache agressivement : 3min pour live, 15min pour fixtures, 1h pour standings
// ============================================================================

import type { CacheEntry } from './types';

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

export function clearCache(): void {
  store.clear();
}

// TTL prédéfinis (en ms)
export const TTL = {
  LIVE: 3 * 60 * 1000,       // 3 min — scores live changent vite
  FIXTURES_TODAY: 5 * 60 * 1000,  // 5 min — matchs du jour
  FIXTURES_WEEK: 15 * 60 * 1000,  // 15 min — 7 prochains jours
  LEAGUES: 60 * 60 * 1000,        // 1 heure — liste des ligues ne change pas
} as const;
