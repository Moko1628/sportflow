// ============================================================================
// BABIscore — Football Client (point d'entrée unique pour les données)
// Utilise le provider sélectionné + cache + filtres africains
// ============================================================================

import type { FootballFixture } from './types';
import type { FootballProvider } from './provider';
import { ApiFootballProvider } from './providers/apiFootball';

// Singleton du provider (swap facilement en changeant cette ligne)
let provider: FootballProvider | null = null;

function getProvider(): FootballProvider {
  if (!provider) {
    // Par défaut on utilise API-Football
    // Pour changer de provider : provider = new SportmonksProvider();
    provider = new ApiFootballProvider();
  }
  return provider;
}

// --- Fonctions publiques ---

export async function getLiveAfricanMatches(): Promise<FootballFixture[]> {
  const p = getProvider();
  const res = await p.getLiveMatches();
  return res.data;
}

export async function getTodaysAfricanMatches(): Promise<FootballFixture[]> {
  const p = getProvider();
  const today = new Date().toISOString().split('T')[0];
  const res = await p.getMatchesByDate(today);
  return res.data;
}

export async function getWeekAfricanMatches(): Promise<FootballFixture[]> {
  const p = getProvider();
  const today = new Date();
  const in7 = new Date(today);
  in7.setDate(today.getDate() + 7);

  const from = today.toISOString().split('T')[0];
  const to = in7.toISOString().split('T')[0];

  const res = await p.getFixturesForDateRange(from, to);
  return res.data;
}

export async function getMatchDetail(id: number): Promise<FootballFixture | null> {
  const p = getProvider();
  const res = await p.getMatchById(id);
  return res.data;
}

// --- Helpers de regroupement ---

export function groupByLeague(fixtures: FootballFixture[]): Map<string, FootballFixture[]> {
  const map = new Map<string, FootballFixture[]>();
  for (const f of fixtures) {
    const key = `${f.league.id}-${f.league.name}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return map;
}

export function groupByDate(fixtures: FootballFixture[]): Map<string, FootballFixture[]> {
  const map = new Map<string, FootballFixture[]>();
  for (const f of fixtures) {
    const dateKey = f.date.split('T')[0]; // YYYY-MM-DD
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(f);
  }
  return map;
}

export function sortByTimestamp(fixtures: FootballFixture[]): FootballFixture[] {
  return [...fixtures].sort((a, b) => a.timestamp - b.timestamp);
}
