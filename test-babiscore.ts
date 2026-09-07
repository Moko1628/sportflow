import { classifyMatch, PRIORITY_LABELS } from './app/lib/football/filters';
import type { FootballFixture } from './app/lib/football/types';

// Test 1: Ivorian match
const ivorianFixture: FootballFixture = {
  id: 12345,
  timezone: 'UTC',
  date: new Date().toISOString(),
  timestamp: Date.now(),
  status: { short: '1H', long: 'First Half', elapsed: 25 },
  league: {
    id: 189,
    name: 'Ligue 1',
    country: 'Ivory Coast',
    countryCode: 'CI',
    logo: '',
    flag: '',
    season: 2024,
  },
  teams: {
    home: { id: 1, name: 'ASEC Mimosas', logo: '' },
    away: { id: 2, name: 'Africa Sports', logo: '' }
  },
  goals: { home: 1, away: 0 }
};

const priority1 = classifyMatch(ivorianFixture);
console.log('Ivorian match priority:', priority1);
if (priority1 !== 'cote_divoire') {
  console.error('ERROR: Ivorian match misclassified');
  process.exit(1);
}

// Test 2: International match (Premier League)
const intlFixture: FootballFixture = {
  id: 12346,
  timezone: 'UTC',
  date: new Date().toISOString(),
  timestamp: Date.now(),
  status: { short: 'NS', long: 'Not Started' },
  league: {
    id: 39,
    name: 'Premier League',
    country: 'England',
    countryCode: 'GB',
    logo: '',
    flag: '',
    season: 2024,
  },
  teams: {
    home: { id: 33, name: 'Manchester United', logo: '' },
    away: { id: 9999, name: 'Newcastle', logo: '' }
  },
  goals: { home: null, away: null }
};

const priority2 = classifyMatch(intlFixture);
console.log('International match priority:', priority2);
if (priority2 !== 'monde') {
  console.error('ERROR: International match misclassified');
  process.exit(1);
}

console.log('ALL TESTS PASSED SUCCESSFULLY!');
