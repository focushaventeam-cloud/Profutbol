import { Player } from './team';

export interface MatchEvent {
  id: string;
  type: EventType;
  team: 'home' | 'away';
  player: Player;
  minute: number;
  addedMinute?: number;
  description?: string;
  relatedPlayer?: Player;
  timestamp: Date;
}

export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var_review' | 'injury' | 'penalty' | 'own_goal';

export interface GoalEvent extends MatchEvent {
  type: 'goal';
  goalType: 'normal' | 'penalty' | 'free_kick' | 'header' | 'own_goal';
  assist?: Player;
}

export interface CardEvent extends MatchEvent {
  type: 'yellow_card' | 'red_card';
  reason: string;
}

export interface SubstitutionEvent extends MatchEvent {
  type: 'substitution';
  playerIn: Player;
  playerOut: Player;
}