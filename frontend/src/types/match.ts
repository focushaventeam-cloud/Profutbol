export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startTime: Date;
  currentTime: number;
  period: MatchPeriod;
  addedTime: number;
  venue: string;
  referee: string;
  weather?: Weather;
  attendance?: number;
}

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';

export type MatchPeriod = 'first_half' | 'second_half' | 'extra_time_first' | 'extra_time_second' | 'penalties';

export interface Weather {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity: number;
  windSpeed: number;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
}