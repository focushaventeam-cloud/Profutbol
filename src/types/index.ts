// ============================================================================
// PROFUTBOL - MARCADOR PARA CANCHAS DE ALQUILER (FÚTBOL 5 / 7 / 8 / 11)
// ============================================================================

export type MatchStatus = 'waiting' | 'live' | 'halftime' | 'finished';
export type MatchPeriod =
  | 'first_half'
  | 'second_half'
  | 'extra_time_first'
  | 'extra_time_second'
  | 'penalties';
export type TeamSide = 'home' | 'away';
export type MatchFormat = 'futbol5' | 'futbol7' | 'futbol8' | 'futbol11';

export interface Team {
  name: string;
  shortName: string;
  color: string;
  colorSecondary: string;
  logo: string; // base64 data URL o vacío
}

export type EventType =
  | 'goal'
  | 'penalty_goal'
  | 'own_goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'var_review'
  | 'injury';

export interface MatchEvent {
  id: string;
  type: EventType;
  team: TeamSide;
  playerName?: string;
  minute: number;
  description?: string;
  // Substitution fields (no Player interface — simple strings)
  playerInName?: string;
  playerOutName?: string;
}

export interface MatchState {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  period: MatchPeriod;
  currentTime: number;
  halfDuration: number;
  format: MatchFormat;
  events: MatchEvent[];
  field: string;
  addedTime: number;
  extraTimeAdded: number; // seconds of added time for current half
}

// ── Ads ──────────────────────────────────────────────────────────────────────

export interface AdData {
  id: string;
  text: string;
  imageUrl: string;
  duration: number; // seconds to show each ad
  active: boolean;
}

// ── Skins ────────────────────────────────────────────────────────────────────

export interface SkinData {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  scoreColor: string;
  timerColor: string;
  accentColor: string;
  panelBackground: string;
  panelBorder: string;
}

export const DEFAULT_SKIN: SkinData = {
  id: 'default',
  name: 'Predeterminado',
  backgroundColor: '#0c1220',
  textColor: '#ffffff',
  scoreColor: '#ffffff',
  timerColor: '#ffffff',
  accentColor: '#10b981',
  panelBackground: 'rgba(255,255,255,0.03)',
  panelBorder: 'rgba(255,255,255,0.06)',
};

// ── Labels ────────────────────────────────────────────────────────────────────

export const FORMAT_OPTIONS: { value: MatchFormat; label: string; players: string }[] = [
  { value: 'futbol5', label: 'Fútbol 5', players: '5 vs 5' },
  { value: 'futbol7', label: 'Fútbol 7', players: '7 vs 7' },
  { value: 'futbol8', label: 'Fútbol 8', players: '8 vs 8' },
  { value: 'futbol11', label: 'Fútbol 11', players: '11 vs 11' },
];

export const HALF_DURATION_OPTIONS = [
  { value: 8, label: '8 min' },
  { value: 10, label: '10 min' },
  { value: 12, label: '12 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 25, label: '25 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
];

export const PERIOD_LABELS: Record<MatchPeriod, string> = {
  first_half: '1er Tiempo',
  second_half: '2do Tiempo',
  extra_time_first: 'Prórroga 1',
  extra_time_second: 'Prórroga 2',
  penalties: 'Penales',
};

export const STATUS_LABELS: Record<MatchStatus, string> = {
  waiting: 'Sin Iniciar',
  live: 'En Vivo',
  halftime: 'Medio Tiempo',
  finished: 'Finalizado',
};

export const EVENT_ICONS: Record<EventType, string> = {
  goal: '\u26BD',
  penalty_goal: '\u26BD',
  own_goal: '\u26BD',
  yellow_card: '\uD83D\uDFE8',
  red_card: '\uD83D\uDFE5',
  substitution: '\uD83D\uDD04',
  var_review: '\uD83D\uDCFA',
  injury: '\uD83E\uDE79',
};

export const EVENT_LABELS: Record<EventType, string> = {
  goal: 'Gol',
  penalty_goal: 'Penal',
  own_goal: 'Autogol',
  yellow_card: 'Amarilla',
  red_card: 'Roja',
  substitution: 'Cambio',
  var_review: 'VAR',
  injury: 'Lesión',
};

export function createDefaultMatch(): MatchState {
  return {
    id: 'match-1',
    homeTeam: {
      name: 'Equipo Local',
      shortName: 'LOCAL',
      color: '#3b82f6',
      colorSecondary: '#1e40af',
      logo: '',
    },
    awayTeam: {
      name: 'Equipo Visitante',
      shortName: 'VISITA',
      color: '#ef4444',
      colorSecondary: '#b91c1c',
      logo: '',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'waiting',
    period: 'first_half',
    currentTime: 0,
    halfDuration: 12,
    format: 'futbol5',
    events: [],
    field: 'Cancha 1',
    addedTime: 0,
    extraTimeAdded: 0,
  };
}