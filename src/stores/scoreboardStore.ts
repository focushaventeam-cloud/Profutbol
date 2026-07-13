import { create } from 'zustand';
import {
  MatchState,
  MatchEvent,
  MatchStatus,
  MatchPeriod,
  TeamSide,
  MatchFormat,
  EventType,
  SkinData,
  AdData,
  DEFAULT_SKIN,
  createDefaultMatch,
} from '@/types';
import { broadcastState, onDisplayJoined, broadcastDisplayJoined } from '@/lib/broadcast-sync';

interface ScoreboardStore {
  // Match
  match: MatchState;
  setMatch: (match: Partial<MatchState>) => void;
  resetMatch: () => void;

  // Timer
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerSeconds: (seconds: number) => void;
  tickTimer: () => void;

  // Score
  updateScore: (team: TeamSide, delta: number) => void;
  setScore: (team: TeamSide, value: number) => void;

  // Status & Period
  setStatus: (status: MatchStatus) => void;
  setPeriod: (period: MatchPeriod) => void;
  setAddedTime: (seconds: number) => void;
  setExtraTimeAdded: (seconds: number) => void;

  // Teams
  setTeamName: (side: TeamSide, name: string, shortName: string) => void;
  setTeamColor: (side: TeamSide, color: string, colorSecondary: string) => void;
  setTeamLogo: (side: TeamSide, logo: string) => void;
  setField: (field: string) => void;
  setFormat: (format: MatchFormat) => void;
  setHalfDuration: (minutes: number) => void;

  // Events
  addEvent: (event: MatchEvent) => void;
  removeEvent: (eventId: string) => void;
  clearEvents: () => void;

  // Skins
  skins: SkinData[];
  activeSkinId: string;
  getActiveSkin: () => SkinData;
  addSkin: (skin: SkinData) => void;
  removeSkin: (skinId: string) => void;
  setActiveSkin: (skinId: string) => void;
  updateSkin: (skinId: string, data: Partial<SkinData>) => void;

  // Ads
  ads: AdData[];
  activeAdIndex: number;
  addAd: (ad: AdData) => void;
  removeAd: (adId: string) => void;
  updateAd: (adId: string, data: Partial<AdData>) => void;
  cycleAd: () => void;
  setActiveAd: (index: number) => void;

  // Sync
  applySyncState: (state: Record<string, unknown>) => void;
}

// ── Broadcast batching ────────────────────────────────────────────────────────

let broadcastQueued = false;

function queueBroadcast() {
  if (!broadcastQueued) {
    broadcastQueued = true;
    requestAnimationFrame(() => {
      broadcastQueued = false;
      const state = useScoreboardStore.getState();
      broadcastState({
        match: state.match,
        isTimerRunning: state.isTimerRunning,
        skins: state.skins,
        activeSkinId: state.activeSkinId,
        ads: state.ads,
        activeAdIndex: state.activeAdIndex,
      });
    });
  }
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useScoreboardStore = create<ScoreboardStore>((set, get) => {
  const defaultMatch = createDefaultMatch();

  return {
    match: defaultMatch,
    setMatch: (data) => {
      set({ match: { ...get().match, ...data } });
      queueBroadcast();
    },
    resetMatch: () => {
      set({
        match: createDefaultMatch(),
        isTimerRunning: false,
        ads: [],
        activeAdIndex: 0,
      });
      queueBroadcast();
    },

    // ── Timer ────────────────────────────────────────────────────────────────
    isTimerRunning: false,
    startTimer: () => {
      const { match } = get();
      if (match.status === 'waiting' || match.status === 'halftime') {
        const nextPeriod: MatchPeriod =
          match.status === 'waiting' ? 'first_half' : 'second_half';
        set({
          isTimerRunning: true,
          match: {
            ...match,
            status: 'live' as MatchStatus,
            period: nextPeriod,
            currentTime: match.status === 'halftime' ? 0 : match.currentTime,
            extraTimeAdded: match.status === 'halftime' ? 0 : match.extraTimeAdded,
          },
        });
      } else {
        set({ isTimerRunning: true, match: { ...match, status: 'live' as MatchStatus } });
      }
      queueBroadcast();
    },
    pauseTimer: () => {
      set({ isTimerRunning: false });
      queueBroadcast();
    },
    resetTimer: () => {
      set({
        isTimerRunning: false,
        match: {
          ...get().match,
          currentTime: 0,
          status: 'waiting' as MatchStatus,
          period: 'first_half' as MatchPeriod,
          extraTimeAdded: 0,
        },
      });
      queueBroadcast();
    },
    setTimerSeconds: (seconds) => {
      set({ match: { ...get().match, currentTime: seconds } });
      queueBroadcast();
    },
    tickTimer: () => {
      const { match, isTimerRunning } = get();
      if (!isTimerRunning) return;

      const newTime = match.currentTime + 1;
      const halfSeconds = match.halfDuration * 60;
      const maxTime = halfSeconds + match.extraTimeAdded;

      // Auto-stop and transition when time is up
      if (newTime > maxTime) {
        switch (match.period) {
          case 'first_half':
            set({
              isTimerRunning: false,
              match: { ...match, currentTime: maxTime, status: 'halftime' as MatchStatus },
            });
            break;
          case 'second_half':
            set({
              isTimerRunning: false,
              match: { ...match, currentTime: maxTime, status: 'finished' as MatchStatus },
            });
            break;
          case 'extra_time_first':
            // Auto-advance to extra time second half
            set({
              match: {
                ...match,
                period: 'extra_time_second' as MatchPeriod,
                currentTime: 0,
                extraTimeAdded: 0,
              },
            });
            break;
          case 'extra_time_second':
            set({
              isTimerRunning: false,
              match: { ...match, currentTime: maxTime, status: 'finished' as MatchStatus },
            });
            break;
          case 'penalties':
            // Timer keeps running during penalties, no auto-stop
            set({ match: { ...match, currentTime: newTime } });
            break;
        }
      } else {
        set({ match: { ...match, currentTime: newTime } });
      }
      queueBroadcast();
    },

    // ── Score ────────────────────────────────────────────────────────────────
    updateScore: (team, delta) => {
      const { match } = get();
      const currentMinute = Math.floor(match.currentTime / 60) + 1;
      const newEvent: MatchEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'goal' as EventType,
        team,
        minute: currentMinute,
      };
      set({
        match: {
          ...match,
          homeScore: team === 'home' ? Math.max(0, match.homeScore + delta) : match.homeScore,
          awayScore: team === 'away' ? Math.max(0, match.awayScore + delta) : match.awayScore,
          events: delta > 0 ? [newEvent, ...match.events] : match.events,
        },
      });
      queueBroadcast();
    },
    setScore: (team, value) => {
      const { match } = get();
      set({
        match: {
          ...match,
          homeScore: team === 'home' ? Math.max(0, value) : match.homeScore,
          awayScore: team === 'away' ? Math.max(0, value) : match.awayScore,
        },
      });
      queueBroadcast();
    },

    // ── Status & Period ──────────────────────────────────────────────────────
    setStatus: (status) => {
      set({ match: { ...get().match, status } });
      queueBroadcast();
    },
    setPeriod: (period) => {
      set({ match: { ...get().match, period, currentTime: 0, extraTimeAdded: 0 } });
      queueBroadcast();
    },
    setAddedTime: (seconds) => {
      set({ match: { ...get().match, addedTime: Math.max(0, seconds) } });
      queueBroadcast();
    },
    setExtraTimeAdded: (seconds) => {
      set({ match: { ...get().match, extraTimeAdded: Math.max(0, seconds) } });
      queueBroadcast();
    },

    // ── Teams ────────────────────────────────────────────────────────────────
    setTeamName: (side, name, shortName) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, name, shortName } } });
      queueBroadcast();
    },
    setTeamColor: (side, color, colorSecondary) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, color, colorSecondary } } });
      queueBroadcast();
    },
    setTeamLogo: (side, logo) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, logo } } });
      queueBroadcast();
    },
    setField: (field) => {
      set({ match: { ...get().match, field } });
      queueBroadcast();
    },
    setFormat: (format) => {
      set({ match: { ...get().match, format } });
      queueBroadcast();
    },
    setHalfDuration: (minutes) => {
      set({ match: { ...get().match, halfDuration: minutes } });
      queueBroadcast();
    },

    // ── Events ───────────────────────────────────────────────────────────────
    addEvent: (event) => {
      const { match } = get();
      set({ match: { ...match, events: [event, ...match.events] } });
      queueBroadcast();
    },
    removeEvent: (eventId) => {
      const { match } = get();
      set({ match: { ...match, events: match.events.filter((e) => e.id !== eventId) } });
      queueBroadcast();
    },
    clearEvents: () => {
      set({ match: { ...get().match, events: [] } });
      queueBroadcast();
    },

    // ── Skins ────────────────────────────────────────────────────────────────
    skins: [DEFAULT_SKIN],
    activeSkinId: 'default',
    getActiveSkin: () => {
      const { skins, activeSkinId } = get();
      return skins.find((s) => s.id === activeSkinId) || DEFAULT_SKIN;
    },
    addSkin: (skin) => {
      set({ skins: [...get().skins, skin] });
      queueBroadcast();
    },
    removeSkin: (skinId) => {
      const { skins, activeSkinId } = get();
      set({
        skins: skins.filter((sk) => sk.id !== skinId),
        activeSkinId: activeSkinId === skinId ? 'default' : activeSkinId,
      });
      queueBroadcast();
    },
    setActiveSkin: (skinId) => {
      set({ activeSkinId: skinId });
      queueBroadcast();
    },
    updateSkin: (skinId, data) => {
      set({ skins: get().skins.map((sk) => (sk.id === skinId ? { ...sk, ...data } : sk)) });
      queueBroadcast();
    },

    // ── Ads ──────────────────────────────────────────────────────────────────
    ads: [],
    activeAdIndex: 0,
    addAd: (ad) => {
      set({ ads: [...get().ads, ad] });
      queueBroadcast();
    },
    removeAd: (adId) => {
      const { ads, activeAdIndex } = get();
      const filtered = ads.filter((a) => a.id !== adId);
      set({
        ads: filtered,
        activeAdIndex:
          activeAdIndex >= filtered.length ? Math.max(0, filtered.length - 1) : activeAdIndex,
      });
      queueBroadcast();
    },
    updateAd: (adId, data) => {
      set({ ads: get().ads.map((a) => (a.id === adId ? { ...a, ...data } : a)) });
      queueBroadcast();
    },
    cycleAd: () => {
      const { ads, activeAdIndex } = get();
      if (ads.length <= 1) return;
      set({ activeAdIndex: (activeAdIndex + 1) % ads.length });
      queueBroadcast();
    },
    setActiveAd: (index) => {
      const { ads } = get();
      if (index >= 0 && index < ads.length) {
        set({ activeAdIndex: index });
        queueBroadcast();
      }
    },

    // ── Sync ─────────────────────────────────────────────────────────────────
    applySyncState: (state) => {
      set({
        match: state.match as MatchState,
        isTimerRunning: state.isTimerRunning as boolean,
        skins: (state.skins as SkinData[]) || [DEFAULT_SKIN],
        activeSkinId: (state.activeSkinId as string) || 'default',
        ads: (state.ads as AdData[]) || [],
        activeAdIndex: (state.activeAdIndex as number) || 0,
      });
    },
  };
});

// ── Control panel: auto-broadcast on display join ─────────────────────────────

let displayJoinedUnsub: (() => void) | null = null;

export function enableControlBroadcasting() {
  displayJoinedUnsub = onDisplayJoined(() => {
    const s = useScoreboardStore.getState();
    broadcastState({
      match: s.match,
      isTimerRunning: s.isTimerRunning,
      skins: s.skins,
      activeSkinId: s.activeSkinId,
      ads: s.ads,
      activeAdIndex: s.activeAdIndex,
    });
  });
}

export function disableControlBroadcasting() {
  if (displayJoinedUnsub) {
    displayJoinedUnsub();
    displayJoinedUnsub = null;
  }
}

export function useDisplaySync() {
  if (typeof window !== 'undefined') {
    broadcastDisplayJoined();
  }
}