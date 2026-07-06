import { teams } from './mockData';

export interface StandingEntry {
  position: number;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  positionChange: number; // positive = up, negative = down, 0 = same
}

export const standings: StandingEntry[] = [
  {
    position: 1,
    teamId: 't2',
    played: 20,
    won: 14,
    drawn: 4,
    lost: 2,
    goalsFor: 45,
    goalsAgainst: 16,
    points: 46,
    form: ['W', 'W', 'D', 'W', 'W'],
    positionChange: 0,
  },
  {
    position: 2,
    teamId: 't1',
    played: 20,
    won: 13,
    drawn: 5,
    lost: 2,
    goalsFor: 42,
    goalsAgainst: 18,
    points: 44,
    form: ['W', 'D', 'W', 'W', 'L'],
    positionChange: 1,
  },
  {
    position: 3,
    teamId: 't3',
    played: 20,
    won: 12,
    drawn: 4,
    lost: 4,
    goalsFor: 35,
    goalsAgainst: 20,
    points: 40,
    form: ['W', 'W', 'L', 'W', 'D'],
    positionChange: -1,
  },
  {
    position: 4,
    teamId: 't5',
    played: 20,
    won: 10,
    drawn: 5,
    lost: 5,
    goalsFor: 30,
    goalsAgainst: 22,
    points: 35,
    form: ['D', 'W', 'W', 'L', 'W'],
    positionChange: 2,
  },
  {
    position: 5,
    teamId: 't4',
    played: 20,
    won: 7,
    drawn: 6,
    lost: 7,
    goalsFor: 24,
    goalsAgainst: 28,
    points: 27,
    form: ['L', 'D', 'L', 'W', 'D'],
    positionChange: -1,
  },
  {
    position: 6,
    teamId: 't6',
    played: 20,
    won: 6,
    drawn: 5,
    lost: 9,
    goalsFor: 22,
    goalsAgainst: 30,
    points: 23,
    form: ['L', 'L', 'W', 'D', 'L'],
    positionChange: -1,
  },
];

export function getTeamStandings(): (StandingEntry & { name: string; shortName: string; logo: string; primaryColor: string })[] {
  return standings.map((s) => {
    const team = teams.find((t) => t.id === s.teamId);
    return {
      ...s,
      name: team?.name ?? 'Desconocido',
      shortName: team?.shortName ?? '???',
      logo: team?.logo ?? '⚪',
      primaryColor: team?.primaryColor ?? '#666',
    };
  });
}