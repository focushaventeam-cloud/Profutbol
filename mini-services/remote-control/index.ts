import { Server, Socket } from 'socket.io';

// ============================================================================
// PROFUTBOL - Remote Control WebSocket Service
// Manages multiple scoreboard screens, display clients, and remote controls
// ============================================================================

const PORT = 3003;

interface Team {
  name: string;
  shortName: string;
  color: string;
  colorSecondary: string;
  logo: string;
}

interface MatchEvent {
  id: string;
  type: string;
  team: 'home' | 'away';
  playerName?: string;
  minute: number;
  description?: string;
  playerInName?: string;
  playerOutName?: string;
}

interface MatchState {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'waiting' | 'live' | 'halftime' | 'finished';
  period: 'first_half' | 'second_half' | 'extra_time_first' | 'extra_time_second' | 'penalties';
  currentTime: number;
  halfDuration: number;
  format: 'futbol5' | 'futbol7' | 'futbol8' | 'futbol11';
  events: MatchEvent[];
  field: string;
  addedTime: number;
  extraTimeAdded: number;
}

interface SkinData {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  scoreColor: string;
  timerColor: string;
  accentColor: string;
  panelBackground: string;
  panelBorder: string;
}

interface AdData {
  id: string;
  text: string;
  mediaData: string;
  mediaType: 'image' | 'video' | 'none';
  duration: number;
  active: boolean;
}

interface ScreenInfo {
  id: string;
  name: string;
  match: MatchState;
  isTimerRunning: boolean;
  skins: SkinData[];
  activeSkinId: string;
  ads: AdData[];
  activeAdIndex: number;
  displayClients: Set<string>;
  remoteClients: Set<string>;
  timerInterval: ReturnType<typeof setInterval> | null;
}

// Default skin
const DEFAULT_SKIN: SkinData = {
  id: 'default',
  name: 'Predeterminado',
  backgroundColor: '#0c1220',
  textColor: '#ffffff',
  scoreColor: '#ffffff',
  timerColor: '#ffffff',
  accentColor: '#10b981',
  panelBackground: 'rgba(255,255,255,0.03)',
  panelBorder: 'rgba(255,255,255,0.06)',
};

function createDefaultMatch(id: string, name: string): MatchState {
  return {
    id,
    homeTeam: { name: 'Equipo Local', shortName: 'LOCAL', color: '#3b82f6', colorSecondary: '#1e40af', logo: '' },
    awayTeam: { name: 'Equipo Visitante', shortName: 'VISITA', color: '#ef4444', colorSecondary: '#b91c1c', logo: '' },
    homeScore: 0,
    awayScore: 0,
    status: 'waiting',
    period: 'first_half',
    currentTime: 0,
    halfDuration: 12,
    format: 'futbol5',
    events: [],
    field: name,
    addedTime: 0,
    extraTimeAdded: 0,
  };
}

function createScreen(id: string, name: string): ScreenInfo {
  return {
    id,
    name,
    match: createDefaultMatch(id, name),
    isTimerRunning: false,
    skins: [DEFAULT_SKIN],
    activeSkinId: 'default',
    ads: [],
    activeAdIndex: 0,
    displayClients: new Set(),
    remoteClients: new Set(),
    timerInterval: null,
  };
}

// ── Server Setup ────────────────────────────────────────────────────────────

const io = new Server(PORT, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const screens = new Map<string, ScreenInfo>();

// Client role tracking
const clientRoles = new Map<string, { role: 'control' | 'display' | 'remote'; screenId?: string }>();

// ── Helper Functions ────────────────────────────────────────────────────────

function getScreenStateForClient(screen: ScreenInfo) {
  return {
    match: screen.match,
    isTimerRunning: screen.isTimerRunning,
    skins: screen.skins,
    activeSkinId: screen.activeSkinId,
    ads: screen.ads,
    activeAdIndex: screen.activeAdIndex,
  };
}

function getScreensList(): Array<{ id: string; name: string; displays: number; remotes: number; status: string; homeScore: number; awayScore: number; homeTeam: string; awayTeam: string }> {
  const list: Array<{ id: string; name: string; displays: number; remotes: number; status: string; homeScore: number; awayScore: number; homeTeam: string; awayTeam: string }> = [];
  for (const [id, screen] of screens.entries()) {
    list.push({
      id,
      name: screen.name,
      displays: screen.displayClients.size,
      remotes: screen.remoteClients.size,
      status: screen.match.status,
      homeScore: screen.match.homeScore,
      awayScore: screen.match.awayScore,
      homeTeam: screen.match.homeTeam.shortName,
      awayTeam: screen.match.awayTeam.shortName,
    });
  }
  return list;
}

function broadcastScreenState(screen: ScreenInfo) {
  const state = getScreenStateForClient(screen);
  // Send to all displays and remotes in this screen
  for (const clientId of screen.displayClients) {
    io.to(clientId).emit('screen:state', { screenId: screen.id, ...state });
  }
  for (const clientId of screen.remoteClients) {
    io.to(clientId).emit('screen:state', { screenId: screen.id, ...state });
  }
  // Also send to control clients that selected this screen
  for (const [clientId, info] of clientRoles.entries()) {
    if (info.role === 'control' && info.screenId === screen.id) {
      io.to(clientId).emit('screen:state', { screenId: screen.id, ...state });
    }
  }
}

function broadcastScreensList() {
  const list = getScreensList();
  io.emit('screens:list', list);
}

function startScreenTimer(screen: ScreenInfo) {
  if (screen.timerInterval) return;
  screen.isTimerRunning = true;
  const match = screen.match;

  if (match.status === 'waiting' || match.status === 'halftime') {
    match.status = 'live';
    match.period = match.status === 'waiting' ? 'first_half' : 'second_half';
    if (match.status !== 'waiting') {
      match.currentTime = 0;
      match.extraTimeAdded = 0;
    }
  } else {
    match.status = 'live';
  }

  screen.timerInterval = setInterval(() => {
    const m = screen.match;
    const newTime = m.currentTime + 1;
    const halfSeconds = m.halfDuration * 60;
    const maxTime = halfSeconds + m.extraTimeAdded;

    if (newTime > maxTime) {
      switch (m.period) {
        case 'first_half':
          screen.isTimerRunning = false;
          m.currentTime = maxTime;
          m.status = 'halftime';
          stopScreenTimer(screen);
          break;
        case 'second_half':
          screen.isTimerRunning = false;
          m.currentTime = maxTime;
          m.status = 'finished';
          stopScreenTimer(screen);
          break;
        default:
          m.currentTime = newTime;
      }
    } else {
      m.currentTime = newTime;
    }

    broadcastScreenState(screen);
    broadcastScreensList();
  }, 1000);

  broadcastScreenState(screen);
  broadcastScreensList();
}

function stopScreenTimer(screen: ScreenInfo) {
  screen.isTimerRunning = false;
  if (screen.timerInterval) {
    clearInterval(screen.timerInterval);
    screen.timerInterval = null;
  }
  broadcastScreenState(screen);
  broadcastScreensList();
}

// ── Action Processing ───────────────────────────────────────────────────────

function processAction(screen: ScreenInfo, action: Record<string, unknown>, fromRemote: boolean) {
  const match = screen.match;

  switch (action.type) {
    case 'goal': {
      const team = action.team as 'home' | 'away';
      if (team === 'home') match.homeScore = Math.max(0, match.homeScore + 1);
      else match.awayScore = Math.max(0, match.awayScore + 1);
      const minute = Math.floor(match.currentTime / 60) + 1;
      match.events.unshift({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'goal',
        team,
        minute,
        playerName: action.playerName as string | undefined,
      });
      break;
    }
    case 'minus_goal': {
      const team = action.team as 'home' | 'away';
      if (team === 'home') match.homeScore = Math.max(0, match.homeScore - 1);
      else match.awayScore = Math.max(0, match.awayScore - 1);
      break;
    }
    case 'set_score': {
      const team = action.team as 'home' | 'away';
      const value = action.value as number;
      if (team === 'home') match.homeScore = Math.max(0, value);
      else match.awayScore = Math.max(0, value);
      break;
    }
    case 'start_timer':
      startScreenTimer(screen);
      return; // startScreenTimer already broadcasts
    case 'pause_timer':
      stopScreenTimer(screen);
      return; // stopScreenTimer already broadcasts
    case 'reset_timer':
      stopScreenTimer(screen);
      match.currentTime = 0;
      match.status = 'waiting';
      match.period = 'first_half';
      match.extraTimeAdded = 0;
      break;
    case 'set_status':
      match.status = action.status as MatchState['status'];
      if (match.status !== 'live') stopScreenTimer(screen);
      break;
    case 'set_period':
      match.period = action.period as MatchState['period'];
      match.currentTime = 0;
      match.extraTimeAdded = 0;
      break;
    case 'set_added_time':
      match.extraTimeAdded = Math.max(0, action.seconds as number);
      break;
    case 'set_team_name': {
      const team = action.team as 'home' | 'away';
      const key = team === 'home' ? 'homeTeam' : 'awayTeam';
      (match as Record<string, unknown>)[key] = {
        ...match[key],
        name: action.name as string,
        shortName: action.shortName as string,
      };
      break;
    }
    case 'set_team_color': {
      const team = action.team as 'home' | 'away';
      const key = team === 'home' ? 'homeTeam' : 'awayTeam';
      (match as Record<string, unknown>)[key] = {
        ...match[key],
        color: action.color as string,
        colorSecondary: action.colorSecondary as string,
      };
      break;
    }
    case 'set_team_logo': {
      const team = action.team as 'home' | 'away';
      const key = team === 'home' ? 'homeTeam' : 'awayTeam';
      (match as Record<string, unknown>)[key] = {
        ...match[key],
        logo: action.logo as string,
      };
      break;
    }
    case 'set_field':
      match.field = action.field as string;
      break;
    case 'set_format':
      match.format = action.format as MatchState['format'];
      break;
    case 'set_half_duration':
      match.halfDuration = Math.max(1, action.minutes as number);
      break;
    case 'yellow_card': {
      const team = action.team as 'home' | 'away';
      const minute = Math.floor(match.currentTime / 60) + 1;
      match.events.unshift({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'yellow_card',
        team,
        minute,
        playerName: action.playerName as string | undefined,
      });
      break;
    }
    case 'red_card': {
      const team = action.team as 'home' | 'away';
      const minute = Math.floor(match.currentTime / 60) + 1;
      match.events.unshift({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'red_card',
        team,
        minute,
        playerName: action.playerName as string | undefined,
      });
      break;
    }
    case 'add_event':
      match.events.unshift(action.event as MatchEvent);
      break;
    case 'remove_event':
      match.events = match.events.filter((e) => e.id !== action.eventId);
      break;
    case 'clear_events':
      match.events = [];
      break;
    case 'set_active_skin':
      screen.activeSkinId = action.skinId as string;
      break;
    case 'add_skin':
      screen.skins.push(action.skin as SkinData);
      break;
    case 'update_skin':
      screen.skins = screen.skins.map((s) => s.id === action.skinId ? { ...s, ...(action.data as Partial<SkinData>) } : s);
      break;
    case 'remove_skin': {
      const skinId = action.skinId as string;
      screen.skins = screen.skins.filter((s) => s.id !== skinId);
      if (screen.activeSkinId === skinId) screen.activeSkinId = 'default';
      break;
    }
    case 'add_ad':
      screen.ads.push(action.ad as AdData);
      break;
    case 'remove_ad': {
      const adId = action.adId as string;
      screen.ads = screen.ads.filter((a) => a.id !== adId);
      if (screen.activeAdIndex >= screen.ads.length) {
        screen.activeAdIndex = Math.max(0, screen.ads.length - 1);
      }
      break;
    }
    case 'cycle_ad':
      if (screen.ads.length > 1) {
        screen.activeAdIndex = (screen.activeAdIndex + 1) % screen.ads.length;
      }
      break;
    case 'reset_match':
      stopScreenTimer(screen);
      const name = screen.name;
      screen.match = createDefaultMatch(screen.id, name);
      screen.ads = [];
      screen.activeAdIndex = 0;
      break;
    default:
      console.log('Unknown action:', action.type);
      return;
  }

  broadcastScreenState(screen);
  broadcastScreensList();
}

// ── Connection Handling ─────────────────────────────────────────────────────

io.on('connection', (socket: Socket) => {
  console.log(`[Remote] Client connected: ${socket.id}`);
  clientRoles.set(socket.id, { role: 'control' });

  // Send initial screens list
  socket.emit('screens:list', getScreensList());

  // ── Screen Management ─────────────────────────────────────────────────────

  socket.on('screen:create', (name: string) => {
    const id = `screen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const screen = createScreen(id, name);
    screens.set(id, screen);
    console.log(`[Remote] Screen created: ${id} "${name}"`);
    broadcastScreensList();
    socket.emit('screen:created', { id, name });
  });

  socket.on('screen:delete', (screenId: string) => {
    const screen = screens.get(screenId);
    if (!screen) return;
    stopScreenTimer(screen);
    screens.delete(screenId);
    // Remove all clients from this screen
    for (const [clientId, info] of clientRoles.entries()) {
      if (info.screenId === screenId) {
        info.screenId = undefined;
      }
    }
    console.log(`[Remote] Screen deleted: ${screenId}`);
    broadcastScreensList();
  });

  socket.on('screen:rename', (data: { screenId: string; name: string }) => {
    const screen = screens.get(data.screenId);
    if (!screen) return;
    screen.name = data.name;
    screen.match.field = data.name;
    broadcastScreensList();
  });

  // ── Role Registration ────────────────────────────────────────────────────

  socket.on('display:join', (screenId: string) => {
    const screen = screens.get(screenId);
    if (!screen) {
      socket.emit('error', { message: 'Pantalla no encontrada' });
      return;
    }
    clientRoles.set(socket.id, { role: 'display', screenId });
    screen.displayClients.add(socket.id);
    console.log(`[Remote] Display joined screen ${screenId}: ${socket.id}`);
    // Send current state
    socket.emit('screen:state', { screenId, ...getScreenStateForClient(screen) });
    broadcastScreensList();
  });

  socket.on('remote:join', (screenId: string) => {
    const screen = screens.get(screenId);
    if (!screen) {
      socket.emit('error', { message: 'Pantalla no encontrada' });
      return;
    }
    clientRoles.set(socket.id, { role: 'remote', screenId });
    screen.remoteClients.add(socket.id);
    console.log(`[Remote] Remote joined screen ${screenId}: ${socket.id}`);
    // Send current state
    socket.emit('screen:state', { screenId, ...getScreenStateForClient(screen) });
    broadcastScreensList();
  });

  // ── Control: Subscribe to a screen ───────────────────────────────────────

  socket.on('screen:select', (screenId: string) => {
    const screen = screens.get(screenId);
    if (!screen) return;
    clientRoles.set(socket.id, { role: 'control', screenId });
    socket.emit('screen:state', { screenId, ...getScreenStateForClient(screen) });
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  socket.on('action', (data: { screenId: string; action: Record<string, unknown> }) => {
    const screen = screens.get(data.screenId);
    if (!screen) return;

    const info = clientRoles.get(socket.id);
    const fromRemote = info?.role === 'remote';

    processAction(screen, data.action, fromRemote);
  });

  // ── Bulk State Sync (from control panel) ─────────────────────────────────

  socket.on('screen:sync', (data: { screenId: string; state: Record<string, unknown> }) => {
    const screen = screens.get(data.screenId);
    if (!screen) return;

    // Apply full state from control panel (for team logos, ads with base64, etc.)
    if (data.state.match) {
      screen.match = data.state.match as MatchState;
    }
    if (data.state.skins) {
      screen.skins = data.state.skins as SkinData[];
    }
    if (data.state.activeSkinId) {
      screen.activeSkinId = data.state.activeSkinId as string;
    }
    if (data.state.ads) {
      screen.ads = data.state.ads as AdData[];
    }
    if (data.state.activeAdIndex !== undefined) {
      screen.activeAdIndex = data.state.activeAdIndex as number;
    }
    if (data.state.isTimerRunning !== undefined) {
      if (data.state.isTimerRunning && !screen.isTimerRunning) {
        startScreenTimer(screen);
        return;
      } else if (!data.state.isTimerRunning && screen.isTimerRunning) {
        stopScreenTimer(screen);
        return;
      }
    }

    broadcastScreenState(screen);
    broadcastScreensList();
  });

  // ── Disconnect ───────────────────────────────────────────────────────────

  socket.on('disconnect', () => {
    const info = clientRoles.get(socket.id);
    if (info?.screenId) {
      const screen = screens.get(info.screenId);
      if (screen) {
        screen.displayClients.delete(socket.id);
        screen.remoteClients.delete(socket.id);
        broadcastScreensList();
      }
    }
    clientRoles.delete(socket.id);
    console.log(`[Remote] Client disconnected: ${socket.id}`);
  });
});

console.log(`[Profutbol] Remote Control Service running on port ${PORT}`);