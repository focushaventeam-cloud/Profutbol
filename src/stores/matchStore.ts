import { create } from 'zustand';
import { Match, MatchEvent, MatchStatus, MatchStats } from '@/types';
import { matches as initialMatches } from '@/data/mockData';

type ViewMode = 'dashboard' | 'match' | 'stats' | 'settings';

interface MatchStore {
  matches: Match[];
  selectedMatchId: string | null;
  viewMode: ViewMode;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  selectMatch: (matchId: string) => void;
  goBack: () => void;

  // Match control
  updateMatchStatus: (matchId: string, status: MatchStatus) => void;
  updateScore: (matchId: string, team: 'home' | 'away', delta: number) => void;
  updateMinute: (matchId: string, minute: number) => void;
  setPeriod: (matchId: string, period: Match['period']) => void;
  setAddedTime: (matchId: string, time: number) => void;
  addEvent: (matchId: string, event: MatchEvent) => void;
  removeEvent: (matchId: string, eventId: string) => void;
  updateStats: (matchId: string, team: 'home' | 'away', stats: Partial<MatchStats>) => void;

  // Match creation
  createMatch: (match: Match) => void;
  deleteMatch: (matchId: string) => void;

  // Computed
  getSelectedMatch: () => Match | undefined;
  getLiveMatches: () => Match[];
  getFinishedMatches: () => Match[];
  getScheduledMatches: () => Match[];
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  matches: initialMatches,
  selectedMatchId: null,
  viewMode: 'dashboard',

  setViewMode: (mode) => set({ viewMode: mode }),
  selectMatch: (matchId) => set({ selectedMatchId: matchId, viewMode: 'match' }),
  goBack: () => set({ selectedMatchId: null, viewMode: 'dashboard' }),

  updateMatchStatus: (matchId, status) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, status } : m
      ),
    })),

  updateScore: (matchId, team, delta) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? team === 'home'
            ? { ...m, homeScore: Math.max(0, m.homeScore + delta) }
            : { ...m, awayScore: Math.max(0, m.awayScore + delta) }
          : m
      ),
    })),

  updateMinute: (matchId, minute) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, minute } : m
      ),
    })),

  setPeriod: (matchId, period) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, period } : m
      ),
    })),

  setAddedTime: (matchId, time) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, addedTime: time } : m
      ),
    })),

  addEvent: (matchId, event) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? { ...m, events: [...m.events, event].sort((a, b) => a.minute - b.minute) }
          : m
      ),
    })),

  removeEvent: (matchId, eventId) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? { ...m, events: m.events.filter((e) => e.id !== eventId) }
          : m
      ),
    })),

  updateStats: (matchId, team, stats) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? team === 'home'
            ? { ...m, homeStats: { ...m.homeStats, ...stats } }
            : { ...m, awayStats: { ...m.awayStats, ...stats } }
          : m
      ),
    })),

  getSelectedMatch: () => {
    const { matches, selectedMatchId } = get();
    return matches.find((m) => m.id === selectedMatchId);
  },

  getLiveMatches: () => get().matches.filter((m) => m.status === 'live' || m.status === 'halftime'),
  getFinishedMatches: () => get().matches.filter((m) => m.status === 'finished'),
  getScheduledMatches: () => get().matches.filter((m) => m.status === 'scheduled'),

  createMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),

  deleteMatch: (matchId) =>
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== matchId),
      selectedMatchId: state.selectedMatchId === matchId ? null : state.selectedMatchId,
      viewMode: state.selectedMatchId === matchId ? 'dashboard' : state.viewMode,
    })),
}));