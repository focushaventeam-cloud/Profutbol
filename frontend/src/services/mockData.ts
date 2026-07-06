import { Match } from '../types/match';
import { MatchEvent } from '../types/event';
import { MatchStats } from '../types/match';
import { Player, Lineup } from '../types/team';
import { PlayerStats } from '../types/player';

// ============================================================
// DEMO TEAMS
// ============================================================
const demoTeams = {
  rfc: {
    id: 'team-1',
    name: 'Real Fútbol Club',
    shortName: 'RFC',
    logo: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    coach: 'Carlos Martínez',
    formation: '4-3-3',
  },
  dpa: {
    id: 'team-2',
    name: 'Deportivo Aurora',
    shortName: 'DPA',
    logo: '',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6d28d9',
    coach: 'Roberto Sánchez',
    formation: '4-4-2',
  },
  ats: {
    id: 'team-3',
    name: 'Atlético Sol',
    shortName: 'ATS',
    logo: '',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    coach: 'Miguel Torres',
    formation: '3-5-2',
  },
  cle: {
    id: 'team-4',
    name: 'Club Estrella',
    shortName: 'CLE',
    logo: '',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    coach: 'Ana García',
    formation: '4-2-3-1',
  },
  spv: {
    id: 'team-5',
    name: 'Sport Valiant',
    shortName: 'SPV',
    logo: '',
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    coach: 'Luis Ramírez',
    formation: '4-4-2',
  },
  fnu: {
    id: 'team-6',
    name: 'Fénix Unido',
    shortName: 'FNU',
    logo: '',
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    coach: 'Pedro Ruiz',
    formation: '4-3-3',
  },
} as const;

// ============================================================
// DEMO PLAYERS
// ============================================================
export const demoPlayers: Record<string, Player[]> = {
  'team-1': [
    { id: 'p1', name: 'Andrés Gómez', number: 1, position: 'GK', teamId: 'team-1' },
    { id: 'p2', name: 'Carlos Ruiz', number: 2, position: 'DEF', teamId: 'team-1' },
    { id: 'p3', name: 'Miguel Herrera', number: 4, position: 'DEF', teamId: 'team-1' },
    { id: 'p4', name: 'Diego Fernández', number: 5, position: 'DEF', teamId: 'team-1' },
    { id: 'p5', name: 'Javier Morales', number: 3, position: 'DEF', teamId: 'team-1' },
    { id: 'p6', name: 'Luis Torres', number: 6, position: 'MID', teamId: 'team-1' },
    { id: 'p7', name: 'Pedro Sánchez', number: 8, position: 'MID', teamId: 'team-1' },
    { id: 'p8', name: 'Fernando López', number: 10, position: 'MID', teamId: 'team-1' },
    { id: 'p9', name: 'Roberto Díaz', number: 7, position: 'FWD', teamId: 'team-1' },
    { id: 'p10', name: 'Santiago Pérez', number: 9, position: 'FWD', teamId: 'team-1' },
    { id: 'p11', name: 'Nicolás Vega', number: 11, position: 'FWD', teamId: 'team-1' },
    { id: 'p12', name: 'Ramón Castillo', number: 13, position: 'GK', teamId: 'team-1' },
    { id: 'p13', name: 'Eduardo Reyes', number: 14, position: 'DEF', teamId: 'team-1' },
    { id: 'p14', name: 'Álvaro Núñez', number: 16, position: 'MID', teamId: 'team-1' },
  ],
  'team-2': [
    { id: 'p15', name: 'Marcos Silva', number: 1, position: 'GK', teamId: 'team-2' },
    { id: 'p16', name: 'Rafael Oliveira', number: 2, position: 'DEF', teamId: 'team-2' },
    { id: 'p17', name: 'Tomás Ferreira', number: 4, position: 'DEF', teamId: 'team-2' },
    { id: 'p18', name: 'João Costa', number: 5, position: 'DEF', teamId: 'team-2' },
    { id: 'p19', name: 'André Santos', number: 3, position: 'DEF', teamId: 'team-2' },
    { id: 'p20', name: 'Bruno Almeida', number: 6, position: 'MID', teamId: 'team-2' },
    { id: 'p21', name: 'Lucas Pereira', number: 8, position: 'MID', teamId: 'team-2' },
    { id: 'p22', name: 'Ricardo Carvalho', number: 7, position: 'MID', teamId: 'team-2' },
    { id: 'p23', name: 'Hugo Martins', number: 11, position: 'MID', teamId: 'team-2' },
    { id: 'p24', name: 'Gonçalo Ramos', number: 9, position: 'FWD', teamId: 'team-2' },
    { id: 'p25', name: 'Diogo Jota', number: 10, position: 'FWD', teamId: 'team-2' },
    { id: 'p26', name: 'José Semedo', number: 13, position: 'GK', teamId: 'team-2' },
    { id: 'p27', name: 'Nélson Semedo', number: 14, position: 'DEF', teamId: 'team-2' },
  ],
};

// ============================================================
// DEMO LINEUPS
// ============================================================
export const getDemoLineup = (teamId: string): Lineup | null => {
  const players = demoPlayers[teamId];
  if (!players) return null;

  const team = Object.values(demoTeams).find(t => t.id === teamId);
  if (!team) return null;

  const startingXI = players.slice(0, 11);
  const substitutes = players.slice(11);

  return {
    teamId,
    formation: team.formation || '4-4-2',
    startingXI,
    substitutes,
    coach: team.coach || '',
  };
};

// ============================================================
// DEMO MATCHES
// ============================================================
export const demoMatches: Match[] = [
  {
    id: 'demo-1',
    homeTeam: { ...demoTeams.rfc },
    awayTeam: { ...demoTeams.dpa },
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    startTime: new Date(Date.now() - 3600000),
    currentTime: 3420,
    period: 'second_half',
    addedTime: 3,
    venue: 'Estadio Nacional "Arturo Vidal"',
    referee: 'Juan Pérez',
    weather: { temperature: 24, condition: 'sunny', humidity: 45, windSpeed: 12 },
    attendance: 42000,
  },
  {
    id: 'demo-2',
    homeTeam: { ...demoTeams.ats },
    awayTeam: { ...demoTeams.cle },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: new Date(Date.now() + 7200000),
    currentTime: 0,
    period: 'first_half',
    addedTime: 0,
    venue: 'Estadio Municipal "El Solar"',
    referee: 'María López',
    weather: { temperature: 22, condition: 'cloudy', humidity: 60, windSpeed: 8 },
    attendance: 28000,
  },
  {
    id: 'demo-3',
    homeTeam: { ...demoTeams.spv },
    awayTeam: { ...demoTeams.fnu },
    homeScore: 3,
    awayScore: 2,
    status: 'finished',
    startTime: new Date(Date.now() - 86400000),
    currentTime: 5700,
    period: 'second_half',
    addedTime: 4,
    venue: 'Estadio Central "La Fortaleza"',
    referee: 'Diego Morales',
    attendance: 35000,
  },
  {
    id: 'demo-4',
    homeTeam: { ...demoTeams.cle },
    awayTeam: { ...demoTeams.rfc },
    homeScore: 1,
    awayScore: 1,
    status: 'halftime',
    startTime: new Date(Date.now() - 2700000),
    currentTime: 2700,
    period: 'first_half',
    addedTime: 2,
    venue: 'Estadio Verde "El Bosque"',
    referee: 'Carla Méndez',
    weather: { temperature: 20, condition: 'rainy', humidity: 80, windSpeed: 20 },
    attendance: 31500,
  },
];

// ============================================================
// DEMO EVENTS
// ============================================================
export const getDemoEvents = (matchId: string): MatchEvent[] => {
  const baseEvents: Record<string, MatchEvent[]> = {
    'demo-1': [
      {
        id: 'e1', type: 'goal', team: 'home', minute: 12,
        player: { id: 'p10', name: 'Santiago Pérez', number: 9, position: 'FWD', teamId: 'team-1' },
        timestamp: new Date(Date.now() - 3000000),
        description: 'Gol de cabeza tras centro desde la derecha',
      },
      {
        id: 'e2', type: 'yellow_card', team: 'away', minute: 18,
        player: { id: 'p17', name: 'Tomás Ferreira', number: 4, position: 'DEF', teamId: 'team-2' },
        timestamp: new Date(Date.now() - 2500000),
        description: 'Falta táctica para detener el contraataque',
      },
      {
        id: 'e3', type: 'goal', team: 'away', minute: 23,
        player: { id: 'p24', name: 'Gonçalo Ramos', number: 9, position: 'FWD', teamId: 'team-2' },
        timestamp: new Date(Date.now() - 2000000),
        description: 'Remate potente desde fuera del área',
      },
      {
        id: 'e4', type: 'substitution', team: 'home', minute: 35,
        player: { id: 'p9', name: 'Roberto Díaz', number: 7, position: 'FWD', teamId: 'team-1' },
        playerIn: { id: 'p14', name: 'Álvaro Núñez', number: 16, position: 'MID', teamId: 'team-1' } as any,
        playerOut: { id: 'p9', name: 'Roberto Díaz', number: 7, position: 'FWD', teamId: 'team-1' } as any,
        timestamp: new Date(Date.now() - 1500000),
        description: 'Cambio táctico por lesión',
      },
      {
        id: 'e5', type: 'var_review', team: 'home', minute: 40,
        player: { id: 'p10', name: 'Santiago Pérez', number: 9, position: 'FWD', teamId: 'team-1' },
        timestamp: new Date(Date.now() - 1200000),
        description: 'Revisión por posible fuera de juego en la jugada anterior',
      },
      {
        id: 'e6', type: 'goal', team: 'home', minute: 52,
        player: { id: 'p11', name: 'Nicolás Vega', number: 11, position: 'FWD', teamId: 'team-1' },
        timestamp: new Date(Date.now() - 600000),
        description: 'Gol tras jugada individual por la banda izquierda',
      },
      {
        id: 'e7', type: 'yellow_card', team: 'home', minute: 58,
        player: { id: 'p4', name: 'Diego Fernández', number: 5, position: 'DEF', teamId: 'team-1' },
        timestamp: new Date(Date.now() - 400000),
        description: 'Tirarse de la camiseta en la celebración',
      },
    ],
    'demo-3': [
      {
        id: 'e10', type: 'goal', team: 'home', minute: 8,
        player: { id: 'p9', name: 'Roberto Díaz', number: 7, position: 'FWD', teamId: 'team-5' },
        timestamp: new Date(Date.now() - 100000000),
        description: 'Gol rápido tras salida de corner',
      },
      {
        id: 'e11', type: 'goal', team: 'away', minute: 22,
        player: { id: 'p24', name: 'Gonçalo Ramos', number: 9, position: 'FWD', teamId: 'team-6' },
        timestamp: new Date(Date.now() - 90000000),
        description: 'Tiro libre magnífico desde 25 metros',
      },
      {
        id: 'e12', type: 'red_card', team: 'away', minute: 38,
        player: { id: 'p17', name: 'Tomás Ferreira', number: 4, position: 'DEF', teamId: 'team-6' },
        timestamp: new Date(Date.now() - 80000000),
        description: 'Doble amarilla por falta dura',
      },
      {
        id: 'e13', type: 'goal', team: 'home', minute: 55,
        player: { id: 'p10', name: 'Santiago Pérez', number: 9, position: 'FWD', teamId: 'team-5' },
        timestamp: new Date(Date.now() - 70000000),
        description: 'Remate de volea tras centro bombeado',
      },
      {
        id: 'e14', type: 'goal', team: 'home', minute: 78,
        player: { id: 'p11', name: 'Nicolás Vega', number: 11, position: 'FWD', teamId: 'team-5' },
        timestamp: new Date(Date.now() - 60000000),
        description: 'Gol de penalti cometido por mano en el área',
      },
      {
        id: 'e15', type: 'goal', team: 'away', minute: 85,
        player: { id: 'p25', name: 'Diogo Jota', number: 10, position: 'FWD', teamId: 'team-6' },
        timestamp: new Date(Date.now() - 55000000),
        description: 'Gol de consolación en el minuto final',
      },
    ],
    'demo-4': [
      {
        id: 'e20', type: 'goal', team: 'home', minute: 15,
        player: { id: 'p24', name: 'Gonçalo Ramos', number: 9, position: 'FWD', teamId: 'team-4' },
        timestamp: new Date(Date.now() - 2000000),
        description: 'Cabeza tras centro lateral',
      },
      {
        id: 'e21', type: 'goal', team: 'away', minute: 37,
        player: { id: 'p10', name: 'Santiago Pérez', number: 9, position: 'FWD', teamId: 'team-1' },
        timestamp: new Date(Date.now() - 1000000),
        description: 'Gol de penalti',
      },
    ],
  };

  return baseEvents[matchId] || [];
};

// ============================================================
// DEMO STATS
// ============================================================
export const getDemoStats = (matchId: string): MatchStats | null => {
  const baseStats: Record<string, MatchStats> = {
    'demo-1': {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 7 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 5, away: 3 },
      fouls: { home: 9, away: 14 },
      offsides: { home: 2, away: 4 },
      yellowCards: { home: 1, away: 1 },
      redCards: { home: 0, away: 0 },
      passes: { home: 342, away: 248 },
      passAccuracy: { home: 87.3, away: 79.8 },
    },
    'demo-3': {
      possession: { home: 45, away: 55 },
      shots: { home: 10, away: 15 },
      shotsOnTarget: { home: 5, away: 7 },
      corners: { home: 3, away: 6 },
      fouls: { home: 16, away: 11 },
      offsides: { home: 3, away: 1 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 1 },
      passes: { home: 298, away: 387 },
      passAccuracy: { home: 76.5, away: 84.2 },
    },
    'demo-4': {
      possession: { home: 48, away: 52 },
      shots: { home: 4, away: 5 },
      shotsOnTarget: { home: 2, away: 2 },
      corners: { home: 2, away: 1 },
      fouls: { home: 5, away: 6 },
      offsides: { home: 1, away: 2 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
      passes: { home: 156, away: 171 },
      passAccuracy: { home: 82.1, away: 85.4 },
    },
  };

  return baseStats[matchId] || null;
};

// ============================================================
// DEMO PLAYER STATS
// ============================================================
export const getDemoPlayerStats = (matchId: string): PlayerStats[] => {
  const players = [...(demoPlayers['team-1'] || []), ...(demoPlayers['team-2'] || [])];
  return players.slice(0, 11).map((p, idx) => ({
    playerId: p.id,
    matchId,
    goals: [2, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0][idx] || 0,
    assists: [0, 1, 0, 0, 0, 2, 0, 1, 0, 0, 1][idx] || 0,
    yellowCards: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0][idx] || 0,
    redCards: 0,
    minutesPlayed: idx < 10 ? 90 : 45,
    shots: [3, 0, 0, 1, 0, 2, 4, 1, 5, 4, 2][idx] || 0,
    shotsOnTarget: [2, 0, 0, 0, 0, 1, 2, 1, 3, 2, 1][idx] || 0,
    passes: [25, 38, 42, 35, 40, 52, 48, 55, 20, 22, 30][idx] || 0,
    passAccuracy: [80, 88, 85, 82, 90, 92, 86, 94, 70, 75, 83][idx] || 0,
    tackles: [0, 3, 4, 2, 3, 1, 0, 0, 0, 0, 2][idx] || 0,
    interceptions: [0, 2, 1, 3, 1, 2, 1, 0, 0, 0, 1][idx] || 0,
    rating: [7.8, 6.5, 6.8, 6.2, 7.0, 7.5, 7.2, 8.1, 7.9, 8.3, 6.9][idx],
  }));
};