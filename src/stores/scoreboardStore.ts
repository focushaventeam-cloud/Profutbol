import { create } from 'zustand';
import {
  MatchState,
  MatchEvent,
  MatchStatus,
  MatchPeriod,
  TeamSide,
  SkinData,
  AdData,
  ViewMode,
  createDefaultMatch,
  DEFAULT_SKIN,
} from '@/types';

interface ScoreboardStore {
  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleView: () => void;

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

  // Events
  addEvent: (event: MatchEvent) => void;
  removeEvent: (eventId: string) => void;
  clearEvents: () => void;

  // Players
  addPlayer: (side: TeamSide, player: { id: string; name: string; number: number }) => void;
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

  // Goals from events
  syncScoreFromEvents: () => void;
}

export const useScoreboardStore = create<ScoreboardStore>((set, get) => {
  const defaultMatch = createDefaultMatch();

  return {
    // View
    viewMode: 'control' as ViewMode,
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleView: () => set((s) => ({ viewMode: s.viewMode === 'control' ? 'display' : 'control' })),

    // Match
    match: defaultMatch,
    setMatch: (data) => set((s) => ({ match: { ...s.match, ...data } })),
    resetMatch: () => set({ match: createDefaultMatch(), isTimerRunning: false }),

    // Timer
    isTimerRunning: false,
    startTimer: () => {
      const { match } = get();
      if (match.status === 'scheduled') {
        set((s) => ({
          isTimerRunning: true,
          match: { ...s.match, status: 'live', period: 'first_half' },
        }));
      } else {
        set({ isTimerRunning: true });
      }
    },
    pauseTimer: () => set({ isTimerRunning: false }),
    resetTimer: () => set((s) => ({ isTimerRunning: false, match: { ...s.match, currentTime: 0 } })),
    setTimerSeconds: (seconds) =>
      set((s) => ({ match: { ...s.match, currentTime: seconds } })),
    tickTimer: () => {
      const { match } = get();
      const periodSeconds =
        match.period === 'first_half' || match.period === 'extra_time_first'
          ? 45 * 60
          : match.period === 'second_half' || match.period === 'extra_time_second'
          ? 90 * 60
          : 120 * 60;

      const newTime = match.currentTime + 1;
      set((s) => ({
        match: { ...s.match, currentTime: newTime },
      }));
    },

    // Score
    updateScore: (team, delta) =>
      set((s) => ({
        match: {
          ...s.match,
          homeScore: team === 'home' ? Math.max(0, s.match.homeScore + delta) : s.match.homeScore,
          awayScore: team === 'away' ? Math.max(0, s.match.awayScore + delta) : s.match.awayScore,
        },
      })),
    setScore: (team, value) =>
      set((s) => ({
        match: {
          ...s.match,
          homeScore: team === 'home' ? Math.max(0, value) : s.match.homeScore,
          awayScore: team === 'away' ? Math.max(0, value) : s.match.awayScore,
        },
      })),

    // Status & Period
    setStatus: (status) => {
      set((s) => ({
        match: { ...s.match, status },
        isTimerRunning: status === 'live',
      }));
    },
    setPeriod: (period) => {
      set((s) => ({
        match: {
          ...s.match,
          period,
          currentTime:
            period === 'second_half'
              ? 45 * 60
              : period === 'extra_time_first'
              ? 90 * 60
              : period === 'extra_time_second'
              ? 105 * 60
              : 0,
        },
      }));
    },
    setAddedTime: (time) =>
      set((s) => ({ match: { ...s.match, addedTime: time } })),
    setExtraTimeAdded: (time) =>
      set((s) => ({ match: { ...s.match, extraTimeAdded: time } })),

    // Teams
    setTeamName: (side, name, shortName) =>
      set((s) => ({
        match: {
          ...s.match,
          [side === 'home' ? 'homeTeam' : 'awayTeam']: {
            ...s.match[side === 'home' ? 'homeTeam' : 'awayTeam'],
            name,
            shortName,
          },
        },
      })),
    setTeamColor: (side, primary, secondary) =>
      set((s) => ({
        match: {
          ...s.match,
          [side === 'home' ? 'homeTeam' : 'awayTeam']: {
            ...s.match[side === 'home' ? 'homeTeam' : 'awayTeam'],
            primaryColor: primary,
            secondaryColor: secondary,
          },
        },
      })),
    setTeamLogo: (side, logo) =>
      set((s) => ({
        match: {
          ...s.match,
          [side === 'home' ? 'homeTeam' : 'awayTeam']: {
            ...s.match[side === 'home' ? 'homeTeam' : 'awayTeam'],
            logo,
          },
        },
      })),
    setVenue: (venue) => set((s) => ({ match: { ...s.match, venue } })),
    setCompetition: (competition) => set((s) => ({ match: { ...s.match, competition } })),

    // Events
    addEvent: (event) =>
      set((s) => ({
        match: {
          ...s.match,
          events: [event, ...s.match.events].sort((a, b) => b.minute - a.minute),
        },
      })),
    removeEvent: (eventId) =>
      set((s) => ({
        match: {
          ...s.match,
          events: s.match.events.filter((e) => e.id !== eventId),
        },
      })),
    clearEvents: () =>
      set((s) => ({ match: { ...s.match, events: [] } })),

    // Players
    addPlayer: (side, player) =>
      set((s) => {
        const team = s.match[side === 'home' ? 'homeTeam' : 'awayTeam'];
        return {
          match: {
            ...s.match,
            [side === 'home' ? 'homeTeam' : 'awayTeam']: {
              ...team,
              players: [...team.players, player],
            },
          },
        };
      }),
    removePlayer: (side, playerId) =>
      set((s) => {
        const team = s.match[side === 'home' ? 'homeTeam' : 'awayTeam'];
        return {
          match: {
            ...s.match,
            [side === 'home' ? 'homeTeam' : 'awayTeam']: {
              ...team,
              players: team.players.filter((p) => p.id !== playerId),
            },
          },
        };
      }),

    // Skins
    skins: [DEFAULT_SKIN],
    activeSkinId: 'default',
    sponsorSkinId: null,
    getActiveSkin: () => {
      const { skins, activeSkinId, sponsorSkinId } = get();
      if (sponsorSkinId) {
        const sponsor = skins.find((s) => s.id === sponsorSkinId);
        if (sponsor) return sponsor;
      }
      return skins.find((s) => s.id === activeSkinId) || DEFAULT_SKIN;
    },
    addSkin: (skin) =>
      set((s) => ({ skins: [...s.skins, skin] })),
    removeSkin: (skinId) =>
      set((s) => ({
        skins: s.skins.filter((sk) => sk.id !== skinId),
        activeSkinId: s.activeSkinId === skinId ? 'default' : s.activeSkinId,
      })),
    setActiveSkin: (skinId) => set({ activeSkinId: skinId }),
    setSponsorSkin: (skinId) => set({ sponsorSkinId: skinId }),
    updateSkin: (skinId, data) =>
      set((s) => ({
        skins: s.skins.map((sk) => (sk.id === skinId ? { ...sk, ...data } : sk)),
      })),

    // Ads
    ads: [],
    activeAdIndex: 0,
    addAd: (ad) => set((s) => ({ ads: [...s.ads, ad] })),
    removeAd: (adId) =>
      set((s) => ({
        ads: s.ads.filter((a) => a.id !== adId),
        activeAdIndex: Math.min(s.activeAdIndex, Math.max(0, s.ads.length - 2)),
      })),
    updateAd: (adId, data) =>
      set((s) => ({
        ads: s.ads.map((a) => (a.id === adId ? { ...a, ...data } : a)),
      })),
    cycleAd: () =>
      set((s) => ({
        activeAdIndex: s.ads.length > 0 ? (s.activeAdIndex + 1) % s.ads.length : 0,
      })),
    setActiveAd: (index) => set({ activeAdIndex: index }),

    // Sync
    syncScoreFromEvents: () =>
      set((s) => {
        const homeGoals = s.match.events.filter(
          (e) => (e.type === 'goal' || e.type === 'penalty_goal') && e.team === 'home'
        ).length;
        const awayGoals = s.match.events.filter(
          (e) => (e.type === 'goal' || e.type === 'penalty_goal') && e.team === 'away'
        ).length;
        return {
          match: {
            ...s.match,
            homeScore: homeGoals + s.match.events.filter((e) => e.type === 'own_goal' && e.team === 'away').length,
            awayScore: awayGoals + s.match.events.filter((e) => e.type === 'own_goal' && e.team === 'home').length,
          },
        };
      }),
  };
});