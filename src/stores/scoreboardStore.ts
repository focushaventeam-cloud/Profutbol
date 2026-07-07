import { create } from 'zustand';
import {
  MatchState,
  MatchEvent,
  MatchStatus,
  MatchPeriod,
  TeamSide,
  SkinData,
  AdData,
  createDefaultMatch,
  DEFAULT_SKIN,
} from '@/types';
import { broadcastState, onDisplayJoined, broadcastDisplayJoined } from '@/lib/broadcast-sync';

interface ScoreboardStore {
  // Mode
  mode: 'control' | 'display';
  setMode: (mode: 'control' | 'display') => void;

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
  setAddedTime: (time: number) => void;
  setExtraTimeAdded: (time: number) => void;

  // Teams
  setTeamName: (side: TeamSide, name: string, shortName: string) => void;
  setTeamColor: (side: TeamSide, primary: string, secondary: string) => void;
  setTeamLogo: (side: TeamSide, logo: string) => void;
  setVenue: (venue: string) => void;
  setCompetition: (competition: string) => void;
  loadLigaTeam: (side: TeamSide, teamId: string, name: string, shortName: string, logo: string, primary: string, secondary: string, stadium: string) => void;
  setCoach: (side: TeamSide, coach: string) => void;
  setFormation: (side: TeamSide, formation: string) => void;
  setLineup: (side: TeamSide, playerIds: string[]) => void;
  updatePlayer: (side: TeamSide, playerId: string, data: Partial<import('@/types').Player>) => void;

  // Events
  addEvent: (event: MatchEvent) => void;
  removeEvent: (eventId: string) => void;
  clearEvents: () => void;

  // Players
  addPlayer: (side: TeamSide, player: { id: string; name: string; number: number; position?: string; role?: string; isCaptain?: boolean }) => void;
  removePlayer: (side: TeamSide, playerId: string) => void;

  // Skins
  skins: SkinData[];
  activeSkinId: string;
  sponsorSkinId: string | null;
  getActiveSkin: () => SkinData;
  addSkin: (skin: SkinData) => void;
  removeSkin: (skinId: string) => void;
  setActiveSkin: (skinId: string) => void;
  setSponsorSkin: (skinId: string | null) => void;
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
  syncScoreFromEvents: () => void;
  applySyncState: (state: Record<string, unknown>) => void;
}

function createBroadcastingStore() {
  let broadcastQueued = false;

  const queueBroadcast = () => {
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
          sponsorSkinId: state.sponsorSkinId,
          ads: state.ads,
          activeAdIndex: state.activeAdIndex,
        });
      });
    }
  };

  return { queueBroadcast };
}

const { queueBroadcast } = createBroadcastingStore();

export const useScoreboardStore = create<ScoreboardStore>((set, get) => {
  const defaultMatch = createDefaultMatch();

  return {
    mode: 'control',
    setMode: (mode) => { set({ mode }); queueBroadcast(); },

    match: defaultMatch,
    setMatch: (data) => {
      set({ match: { ...get().match, ...data } });
      queueBroadcast();
    },
    resetMatch: () => {
      set({ match: createDefaultMatch(), isTimerRunning: false });
      queueBroadcast();
    },

    isTimerRunning: false,
    startTimer: () => {
      const { match } = get();
      if (match.status === 'scheduled') {
        set({ isTimerRunning: true, match: { ...match, status: 'live', period: 'first_half' } });
      } else {
        set({ isTimerRunning: true });
      }
      queueBroadcast();
    },
    pauseTimer: () => { set({ isTimerRunning: false }); queueBroadcast(); },
    resetTimer: () => {
      set({ isTimerRunning: false, match: { ...get().match, currentTime: 0 } });
      queueBroadcast();
    },
    setTimerSeconds: (seconds) => {
      set({ match: { ...get().match, currentTime: seconds } });
      queueBroadcast();
    },
    tickTimer: () => {
      const { match } = get();
      set({ match: { ...match, currentTime: match.currentTime + 1 } });
      queueBroadcast();
    },

    updateScore: (team, delta) => {
      const { match } = get();
      set({
        match: {
          ...match,
          homeScore: team === 'home' ? Math.max(0, match.homeScore + delta) : match.homeScore,
          awayScore: team === 'away' ? Math.max(0, match.awayScore + delta) : match.awayScore,
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

    setStatus: (status) => {
      set({ match: { ...get().match, status }, isTimerRunning: status === 'live' });
      queueBroadcast();
    },
    setPeriod: (period) => {
      const timeMap: Partial<Record<MatchPeriod, number>> = {
        second_half: 45 * 60,
        extra_time_first: 90 * 60,
        extra_time_second: 105 * 60,
      };
      set({ match: { ...get().match, period, currentTime: timeMap[period] ?? 0 } });
      queueBroadcast();
    },
    setAddedTime: (time) => { set({ match: { ...get().match, addedTime: time } }); queueBroadcast(); },
    setExtraTimeAdded: (time) => { set({ match: { ...get().match, extraTimeAdded: time } }); queueBroadcast(); },

    setTeamName: (side, name, shortName) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, name, shortName } } });
      queueBroadcast();
    },
    setTeamColor: (side, primary, secondary) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, primaryColor: primary, secondaryColor: secondary } } });
      queueBroadcast();
    },
    setTeamLogo: (side, logo) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, logo } } });
      queueBroadcast();
    },
    setVenue: (venue) => { set({ match: { ...get().match, venue } }); queueBroadcast(); },
    setCompetition: (competition) => { set({ match: { ...get().match, competition } }); queueBroadcast(); },
    loadLigaTeam: (side, teamId, name, shortName, logo, primary, secondary, stadium) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({
        match: {
          ...get().match,
          venue: stadium,
          [key]: { ...team, id: teamId, name, shortName, logo, primaryColor: primary, secondaryColor: secondary, players: [], lineup: [], coach: '' },
        },
      });
      queueBroadcast();
    },
    setCoach: (side, coach) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, coach } } });
      queueBroadcast();
    },
    setFormation: (side, formation) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, formation: formation as any } } });
      queueBroadcast();
    },
    setLineup: (side, playerIds) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({ match: { ...get().match, [key]: { ...team, lineup: playerIds } } });
      queueBroadcast();
    },
    updatePlayer: (side, playerId, data) => {
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = get().match[key];
      set({
        match: {
          ...get().match,
          [key]: { ...team, players: team.players.map((p) => (p.id === playerId ? { ...p, ...data } : p)) },
        },
      });
      queueBroadcast();
    },

    addEvent: (event) => {
      const { match } = get();
      set({ match: { ...match, events: [event, ...match.events].sort((a, b) => b.minute - a.minute) } });
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

    addPlayer: (side, player) => {
      const { match } = get();
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = match[key];
      set({ match: { ...match, [key]: { ...team, players: [...team.players, player] } } });
      queueBroadcast();
    },
    removePlayer: (side, playerId) => {
      const { match } = get();
      const key = side === 'home' ? 'homeTeam' : 'awayTeam';
      const team = match[key];
      set({ match: { ...match, [key]: { ...team, players: team.players.filter((p) => p.id !== playerId) } } });
      queueBroadcast();
    },

    skins: [DEFAULT_SKIN],
    activeSkinId: 'default',
    sponsorSkinId: null,
    getActiveSkin: () => {
      const { skins, activeSkinId, sponsorSkinId } = get();
      if (sponsorSkinId) {
        const found = skins.find((s) => s.id === sponsorSkinId);
        if (found) return found;
      }
      return skins.find((s) => s.id === activeSkinId) || DEFAULT_SKIN;
    },
    addSkin: (skin) => { set({ skins: [...get().skins, skin] }); queueBroadcast(); },
    removeSkin: (skinId) => {
      set({
        skins: get().skins.filter((sk) => sk.id !== skinId),
        activeSkinId: get().activeSkinId === skinId ? 'default' : get().activeSkinId,
      });
      queueBroadcast();
    },
    setActiveSkin: (skinId) => { set({ activeSkinId: skinId }); queueBroadcast(); },
    setSponsorSkin: (skinId) => { set({ sponsorSkinId: skinId }); queueBroadcast(); },
    updateSkin: (skinId, data) => {
      set({ skins: get().skins.map((sk) => (sk.id === skinId ? { ...sk, ...data } : sk)) });
      queueBroadcast();
    },

    ads: [],
    activeAdIndex: 0,
    addAd: (ad) => { set({ ads: [...get().ads, ad] }); queueBroadcast(); },
    removeAd: (adId) => {
      const { ads, activeAdIndex } = get();
      set({
        ads: ads.filter((a) => a.id !== adId),
        activeAdIndex: Math.min(activeAdIndex, Math.max(0, ads.length - 2)),
      });
      queueBroadcast();
    },
    updateAd: (adId, data) => {
      set({ ads: get().ads.map((a) => (a.id === adId ? { ...a, ...data } : a)) });
      queueBroadcast();
    },
    cycleAd: () => {
      const { ads, activeAdIndex } = get();
      set({ activeAdIndex: ads.length > 0 ? (activeAdIndex + 1) % ads.length : 0 });
      queueBroadcast();
    },
    setActiveAd: (index) => { set({ activeAdIndex: index }); queueBroadcast(); },

    syncScoreFromEvents: () => {
      const { match } = get();
      const homeGoals = match.events.filter(
        (e) => (e.type === 'goal' || e.type === 'penalty_goal') && e.team === 'home'
      ).length;
      const awayGoals = match.events.filter(
        (e) => (e.type === 'goal' || e.type === 'penalty_goal') && e.team === 'away'
      ).length;
      set({
        match: {
          ...match,
          homeScore: homeGoals + match.events.filter((e) => e.type === 'own_goal' && e.team === 'away').length,
          awayScore: awayGoals + match.events.filter((e) => e.type === 'own_goal' && e.team === 'home').length,
        },
      });
      queueBroadcast();
    },

    applySyncState: (state) => {
      set({
        match: state.match as MatchState,
        isTimerRunning: state.isTimerRunning as boolean,
        skins: state.skins as SkinData[],
        activeSkinId: state.activeSkinId as string,
        sponsorSkinId: state.sponsorSkinId as string | null,
        ads: state.ads as AdData[],
        activeAdIndex: state.activeAdIndex as number,
      });
    },
  };
});

// =============================================================================
// CONTROL PANEL: Auto-broadcast on display window join
// =============================================================================
let displayJoinedUnsub: (() => void) | null = null;

export function enableControlBroadcasting() {
  displayJoinedUnsub = onDisplayJoined(() => {
    const s = useScoreboardStore.getState();
    broadcastState({
      match: s.match,
      isTimerRunning: s.isTimerRunning,
      skins: s.skins,
      activeSkinId: s.activeSkinId,
      sponsorSkinId: s.sponsorSkinId,
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

// =============================================================================
// DISPLAY WINDOW: Listen for state updates from control panel
// =============================================================================
export function useDisplaySync() {
  if (typeof window !== 'undefined') {
    broadcastDisplayJoined();
  }
}