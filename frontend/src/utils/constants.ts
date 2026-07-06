export const MATCH_PERIODS = {
  FIRST_HALF: 'first_half',
  SECOND_HALF: 'second_half',
  EXTRA_TIME_FIRST: 'extra_time_first',
  EXTRA_TIME_SECOND: 'extra_time_second',
  PENALTIES: 'penalties',
} as const;

export const EVENT_TYPES = {
  GOAL: 'goal',
  YELLOW_CARD: 'yellow_card',
  RED_CARD: 'red_card',
  SUBSTITUTION: 'substitution',
  VAR_REVIEW: 'var_review',
  INJURY: 'injury',
  PENALTY: 'penalty',
  OWN_GOAL: 'own_goal',
} as const;

export const POSITIONS = {
  GK: 'Portero',
  DEF: 'Defensa',
  MID: 'Mediocampista',
  FWD: 'Delantero',
} as const;

export const API_ENDPOINTS = {
  MATCHES: '/api/matches',
  TEAMS: '/api/teams',
  PLAYERS: '/api/players',
  EVENTS: '/api/events',
  ADS: '/api/ads',
} as const;

export const WS_EVENTS = {
  MATCH_UPDATE: 'match:update',
  EVENT_CREATED: 'event:created',
  STATS_UPDATE: 'stats:update',
  TIMER_UPDATE: 'timer:update',
} as const;