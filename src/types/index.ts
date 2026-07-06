// ============================================================================
// PROFUTBOL - STADIUM SCOREBOARD TYPES
// ============================================================================

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed';
export type MatchPeriod = 'first_half' | 'second_half' | 'extra_time_first' | 'extra_time_second' | 'penalties';
export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var_review' | 'injury' | 'penalty_goal' | 'own_goal';
export type TeamSide = 'home' | 'away';
export type ViewMode = 'control' | 'display';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
}

export interface MatchEvent {
  id: string;
  type: EventType;
  team: TeamSide;
  player?: Player;
  playerIn?: Player;
  playerOut?: Player;
  minute: number;
  description?: string;
}

export interface MatchState {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  period: MatchPeriod;
  currentTime: number; // seconds
  addedTime: number;
  extraTimeAdded: number;
  events: MatchEvent[];
  homeSkins: SkinData[];
  awaySkins: SkinData[];
  activeSkinId: string | null;
  sponsorSkinId: string | null;
  ads: AdData[];
  activeAdIndex: number;
  venue: string;
  competition: string;
}

export interface SkinData {
  id: string;
  name: string;
  teamId: string;
  type: 'team' | 'sponsor';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  scoreColor: string;
  timerColor: string;
  logoUrl: string;
  sponsorLogoUrl: string;
  sponsorText: string;
}

export interface AdData {
  id: string;
  text: string;
  imageUrl: string;
  duration: number; // seconds to show
  active: boolean;
}

export const DEFAULT_SKIN: SkinData = {
  id: 'default',
  name: 'Profutbol Default',
  teamId: '',
  type: 'sponsor',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  accentColor: '#60a5fa',
  backgroundColor: '#0a1628',
  textColor: '#ffffff',
  scoreColor: '#ffffff',
  timerColor: '#60a5fa',
  logoUrl: '',
  sponsorLogoUrl: '',
  sponsorText: '',
};

export const PERIOD_LABELS: Record<MatchPeriod, string> = {
  first_half: '1er Tiempo',
  second_half: '2do Tiempo',
  extra_time_first: 'Prórroga 1',
  extra_time_second: 'Prórroga 2',
  penalties: 'Penales',
};

export const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Programado',
  live: 'En Vivo',
  halftime: 'Medio Tiempo',
  finished: 'Finalizado',
  postponed: 'Pospuesto',
};

export const EVENT_ICONS: Record<EventType, string> = {
  goal: '\u26BD',
  yellow_card: '\uD83D\uDFE8',
  red_card: '\uD83D\uDFE5',
  substitution: '\uD83D\uDD04',
  var_review: '\uD83D\uDCFA',
  injury: '\uD83E\uDDE5',
  penalty_goal: '\u26BD',
  own_goal: '\u26BD',
};

export const EVENT_LABELS: Record<EventType, string> = {
  goal: 'GOL',
  yellow_card: 'Amarilla',
  red_card: 'Roja',
  substitution: 'Cambio',
  var_review: 'VAR',
  injury: 'Lesión',
  penalty_goal: 'Penal',
  own_goal: 'Autogol',
};

export function createDefaultMatch(): MatchState {
  return {
    id: 'match-1',
    homeTeam: {
      id: 'team-1',
      name: 'Equipo Local',
      shortName: 'LOCAL',
      logo: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      players: [],
    },
    awayTeam: {
      id: 'team-2',
      name: 'Equipo Visitante',
      shortName: 'VISITA',
      logo: '',
      primaryColor: '#ef4444',
      secondaryColor: '#b91c1c',
      players: [],
    },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    period: 'first_half',
    currentTime: 0,
    addedTime: 0,
    extraTimeAdded: 0,
    events: [],
    homeSkins: [],
    awaySkins: [],
    activeSkinId: 'default',
    sponsorSkinId: null,
    ads: [],
    activeAdIndex: 0,
    venue: 'Estadio Principal',
    competition: 'Liga Local',
  };
}