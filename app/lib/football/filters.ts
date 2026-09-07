// ============================================================================
// BABIscore — Filtres et priorités africaines
// Définit la priorité absolue pour l'Afrique et la Côte d'Ivoire
// ============================================================================

import type { FootballFixture, MatchPriority } from './types';

// --- IDs des compétitions africaines majeures (API-Football) ---
// Source: https://www.api-football.com/documentation-v3
export const AFRICAN_LEAGUE_IDS = new Set([
  // CAF Club
  2,    // CAF Champions League (league id varies, mais couvert)
  14,   // CAF Champions League
  15,   // CAF Confederation Cup
  16,   // CAF Super Cup
  
  // CAF National
  3,    // Africa Cup of Nations
  31,   // WC Qualification Africa (CAF)
  
  // Côte d'Ivoire
  189,  // Ligue 1 Côte d'Ivoire
  190,  // Ligue 2 Côte d'Ivoire
  
  // Autres championnats africains majeurs
  78,   // Ligue 1 Maroc
  79,   // Botola Pro
  86,   // Ligue 1 Égypte
  87,   // Premier League Égypte
  88,   // South Africa PSL
  124,  // Ligue 1 Algérie
  169,  // Ligue 1 Tunisie
  170,  // League One Tunisie
  
  // Sélections africaines
  30,   // CAF Nations Cup Qualification
  29,   // FIFA World Cup Qualification (Africa)
  154,  // Friendlies (includes African)
]);

// IDs des sélections africaines
export const AFRICAN_COUNTRY_IDS = new Set([
  // Top African teams
  39, // Côte d'Ivoire
  34, // Cameroun
  40, // Sénégal
  31, // Ghana
  44, // Algérie
  45, // Tunisie
  47, // Maroc
  30, // Nigeria
  50, // Mali
  56, // Burkina Faso
  57, // RD Congo
  48, // Égypte
  49, // Afrique du Sud
  52, // Guinée
  53, // Gabon
  54, // Ouganda
  55, // Mozambique
  58, // Congo
  59, // Gambie
  60, // Bénin
  61, // Madagascar
  62, // Guinée-Bissau
  63, // Érythrée
  64, // Namibie
  65, // Kenya
  66, // Tanzanie
  67, // Soudan
  68, // Libye
  69, // Tchad
  70, // Nigeria
  71, // Zimbabwe
  72, // Zambia
  73, // Malawi
  74, // Rwanda
  75, // Burundi
  76, // Soudan du Sud
  77, // Éthiopie
  78, // Liberia
  79, // Sierra Leone
  80, // Guinée Équatoriale
  81, // Centrafrique
  82, // Comores
  83, // Île Maurice
  84, // Djibouti
  85, // Somalie
  86, // Lesotho
  87, // Eswatini
  88, // Botswana
]);

// Côte d'Ivoire IDs
export const COTE_DIVOIRE_IDS = {
  leagueIds: new Set([189, 190]),
  countryId: 39,
  countryCode: 'CI',
};

// --- Classification de priorité ---
export function classifyMatch(fixture: FootballFixture): MatchPriority {
  const leagueCountryId = fixture.league?.countryCode; // ex: "CI"
  const leagueId = fixture.league?.id;
  const homeTeamId = fixture.teams?.home?.id;
  const awayTeamId = fixture.teams?.away?.id;

  // 1. Côte d'Ivoire (ligue)
  if (COTE_DIVOIRE_IDS.leagueIds.has(leagueId)) {
    return 'cote_divoire';
  }

  // 2. CAF Champions League / Confederation Cup / Super Cup
  if ([14, 15, 16].includes(leagueId)) {
    return 'caf';
  }

  // 3. CAN / Qualifications CAN / CDM Afrique
  if ([3, 30, 31, 29].includes(leagueId)) {
    return 'caf';
  }

  // 4. Championnat africain (pays du continent)
  if (leagueCountryId && AFRICAN_LEAGUE_IDS.has(leagueId)) {
    return 'afrique';
  }

  // 5. Match impliquant une sélection africaine
  if (AFRICAN_COUNTRY_IDS.has(homeTeamId) || AFRICAN_COUNTRY_IDS.has(awayTeamId)) {
    return 'selections_africaines';
  }

  // 6. Match international (amicaux, etc.) avec pays africain
  if ([154].includes(leagueId)) {
    if (homeTeamId && AFRICAN_COUNTRY_IDS.has(homeTeamId)) return 'international_afrique';
    if (awayTeamId && AFRICAN_COUNTRY_IDS.has(awayTeamId)) return 'international_afrique';
  }

  // 7. Reste du monde
  return 'monde';
}

// Ordre d'affichage (priorité décroissante)
export const PRIORITY_ORDER: MatchPriority[] = [
  'cote_divoire',
  'afrique',
  'caf',
  'selections_africaines',
  'international_afrique',
  'monde',
];

// Label par priorité
export const PRIORITY_LABELS: Record<MatchPriority, { emoji: string; label: string }> = {
  cote_divoire: { emoji: '🇨🇮', label: 'Côte d\'Ivoire' },
  afrique: { emoji: '🌍', label: 'Afrique' },
  caf: { emoji: '🏆', label: 'Compétitions CAF' },
  selections_africaines: { emoji: '🌍', label: 'Sélections africaines' },
  international_afrique: { emoji: '🌎', label: 'International' },
  monde: { emoji: '🌐', label: 'Reste du monde' },
};

// Filtre : ne garder que les matchs d'une ou plusieurs priorités
export function filterByPriority(
  fixtures: FootballFixture[],
  minPriority?: MatchPriority
): FootballFixture[] {
  if (!minPriority) return fixtures;
  const minIndex = PRIORITY_ORDER.indexOf(minPriority);
  return fixtures.filter((f) => {
    const p = classifyMatch(f);
    return PRIORITY_ORDER.indexOf(p) >= minIndex;
  });
}
