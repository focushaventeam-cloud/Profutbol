export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished';

export interface MatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  fouls: number;
  corners: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  saves: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute: number;
  period: 'first_half' | 'second_half' | 'extra_time' | 'penalties';
  addedTime: number;
  startTime: string;
  league: string;
  stadium: string;
  events: MatchEvent[];
  homeStats: MatchStats;
  awayStats: MatchStats;
  homeLineup: LineupPlayer[];
  awayLineup: LineupPlayer[];
  homeFormation: string;
  awayFormation: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  teamId: string;
  age: number;
  nationality: string;
  rating: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export interface LineupPlayer {
  player: Player;
  position: { x: number; y: number };
  isSubstitute: boolean;
  substitutedIn: boolean;
  substitutedOut: boolean;
  substitutedAtMinute?: number;
}

export type EventType = 'goal' | 'own_goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty_goal' | 'var_review' | 'injury';

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  team: 'home' | 'away';
  player?: Player;
  playerOut?: Player;
  description: string;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
  isVar?: boolean;
}