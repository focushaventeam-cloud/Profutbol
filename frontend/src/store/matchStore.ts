import { create } from 'zustand';
import { Match, MatchStats } from '../types/match';
import { MatchEvent } from '../types/event';

interface MatchState {
  currentMatch: Match | null;
  events: MatchEvent[];
  stats: MatchStats | null;
  isLoading: boolean;
  error: string | null;
  
  setCurrentMatch: (match: Match) => void;
  setEvents: (events: MatchEvent[]) => void;
  addEvent: (event: MatchEvent) => void;
  setStats: (stats: MatchStats) => void;
  updateScore: (team: 'home' | 'away', score: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentMatch: null,
  events: [],
  stats: null,
  isLoading: false,
  error: null,
};

export const useMatchStore = create<MatchState>((set) => ({
  ...initialState,
  
  setCurrentMatch: (match) => set({ currentMatch: match }),
  
  setEvents: (events) => set({ events }),
  
  addEvent: (event) => set((state) => ({ 
    events: [event, ...state.events] 
  })),
  
  setStats: (stats) => set({ stats }),
  
  updateScore: (team, score) => set((state) => ({
    currentMatch: state.currentMatch ? {
      ...state.currentMatch,
      [`${team}Score`]: score
    } : null
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));