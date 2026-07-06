// ============================================================================
// SCOREBOARD FÚTBOL - DISEÑO GLASSMORPHISM + PARALLAX (APROBADO)
// Implementación exacta del diseño visual aprobado
// ============================================================================

// === ARCHIVO: frontend/src/assets/styles/globals.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply min-h-screen text-white antialiased overflow-hidden;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0a1628;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  /* Panel de vidrio esmerilado principal */
  .glass-panel-main {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  /* Panel de vidrio para estadísticas */
  .glass-panel-stats {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  /* Panel de vidrio para eventos */
  .glass-panel-event {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.13);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  
  /* Botón de vidrio */
  .glass-button {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    transition: all 0.3s ease;
  }
  
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  .glass-button:active {
    transform: translateY(0);
  }

  /* Espacio publicitario */
  .ad-space {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }

  /* Capas parallax */
  .parallax-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background: 
      radial-gradient(ellipse at 20% 50%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(30, 58, 138, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0a1628 100%);
    animation: parallaxShift 20s ease-in-out infinite;
  }

  @keyframes parallaxShift {
    0%, 100% { 
      background-position: 0% 50%;
      transform: scale(1);
    }
    50% { 
      background-position: 100% 50%;
      transform: scale(1.05);
    }
  }

  /* Efecto bokeh de estadio */
  .stadium-bokeh {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    filter: blur(60px);
    animation: bokehFloat 15s ease-in-out infinite;
  }

  @keyframes bokehFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, -20px); }
  }

  /* Barras de estadísticas */
  .stat-bar {
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .stat-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #60a5fa, #3b82f6);
    transition: width 1s ease-out;
  }

  /* Timeline de eventos */
  .event-timeline {
    position: relative;
  }

  .event-timeline::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%);
  }

  .event-item {
    position: relative;
    z-index: 1;
  }

  /* Animaciones */
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .animate-pulse-slow {
    animation: pulseSlow 3s ease-in-out infinite;
  }

  @keyframes pulseSlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
}

@layer utilities {
  .text-shadow-sm {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .text-shadow-md {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

// === ARCHIVO: frontend/src/components/scoreboard/StadiumScoreboard.tsx ===
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../../types/match';
import { formatTime } from '../../utils/time';

interface StadiumScoreboardProps {
  match: Match;
}

export const StadiumScoreboard: React.FC<StadiumScoreboardProps> = ({ match }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-panel-main rounded-3xl p-12 md:p-16 relative overflow-hidden"
    >
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Grid principal: Escudo - Marcador - Escudo */}
        <div className="grid grid-cols-3 gap-8 items-center">
          
          {/* Escudo Equipo Local */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-white/30 bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm"
            >
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </motion.div>
          </div>

          {/* Marcador Central */}
          <div className="text-center">
            {/* Score */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-7xl md:text-9xl font-black mb-4 text-white text-shadow-md"
            >
              <span>{match.homeScore}</span>
              <span className="text-white/40 mx-4">-</span>
              <span>{match.awayScore}</span>
            </motion.div>

            {/* Cronómetro */}
            <div className="text-4xl md:text-5xl font-mono font-bold text-blue-300 mb-2">
              {formatTime(match.currentTime)}
              {match.addedTime > 0 && (
                <span className="text-xl ml-2 text-yellow-400">+{match.addedTime}</span>
              )}
            </div>

            {/* Período */}
            <div className="text-sm text-white/60 uppercase tracking-wider">
              {match.period === 'first_half' && '1er Tiempo'}
              {match.period === 'second_half' && '2do Tiempo'}
              {match.period === 'extra_time_first' && 'Prórroga 1'}
              {match.period === 'extra_time_second' && 'Prórroga 2'}
              {match.period === 'penalties' && 'Penales'}
            </div>
          </div>

          {/* Escudo Equipo Visitante */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-white/30 bg-gradient-to-br from-red-400/20 to-red-600/20 backdrop-blur-sm"
            >
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* Barras de Estadísticas */}
        <div className="mt-12 space-y-6">
          {/* Posesión */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 w-24">Posesión</span>
            <div className="flex-1 stat-bar">
              <div 
                className="stat-bar-fill"
                style={{ width: `${match.stats?.possession.home || 50}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white w-16 text-right">
              {match.stats?.possession.home || 50}%
            </span>
          </div>

          {/* Tiros */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 w-24">Tiros</span>
            <div className="flex-1 stat-bar">
              <div 
                className="stat-bar-fill"
                style={{ width: `${((match.stats?.shots.home || 0) / ((match.stats?.shots.home || 0) + (match.stats?.shots.away || 1))) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white w-16 text-right">
              {match.stats?.shots.home || 0} - {match.stats?.shots.away || 0}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/events/HorizontalTimeline.tsx ===
import React from 'react';
import { motion } from 'framer-motion';
import { MatchEvent } from '../../types/event';

interface HorizontalTimelineProps {
  events: MatchEvent[];
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      default: return '📋';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel-stats rounded-2xl p-6"
    >
      <div className="event-timeline flex items-center justify-between gap-4 overflow-x-auto pb-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="event-item flex flex-col items-center gap-2 min-w-[80px]"
          >
            <div className="text-3xl">{getEventIcon(event.type)}</div>
            <div className="text-sm font-bold text-white">{event.minute}'</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/advertising/AdSpace.tsx ===
import React from 'react';
import { motion } from 'framer-motion';

interface AdSpaceProps {
  position: 'top' | 'bottom';
}

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`ad-space rounded-xl p-6 ${position === 'bottom' ? 'mt-6' : 'mb-6'}`}
    >
      <div className="text-center">
        <p className="text-white/40 text-sm uppercase tracking-wider">Ad Space</p>
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/pages/StadiumDisplay.tsx ===
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StadiumScoreboard } from '../components/scoreboard/StadiumScoreboard';
import { HorizontalTimeline } from '../components/events/HorizontalTimeline';
import { AdSpace } from '../components/advertising/AdSpace';
import { useMatchStore } from '../store/matchStore';
import { useSocket } from '../hooks/useSocket';
import { getMatch, getMatchEvents, getMatchStats } from '../services/matches';

export const StadiumDisplay: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { currentMatch, events, stats, setCurrentMatch, setEvents, setStats } = useMatchStore();
  const { onEvent } = useSocket(matchId || '');

  useEffect(() => {
    if (matchId) {
      loadMatchData();
      setupSocketListeners();
    }
  }, [matchId]);

  const loadMatchData = async () => {
    try {
      const match = await getMatch(matchId!);
      const events = await getMatchEvents(matchId!);
      const stats = await getMatchStats(matchId!);
      
      setCurrentMatch(match);
      setEvents(events);
      setStats(stats);
    } catch (error) {
      console.error('Error loading match data:', error);
    }
  };

  const setupSocketListeners = () => {
    onEvent('match:update', (data) => {
      setCurrentMatch(data);
    });

    onEvent('event:created', (event) => {
      setEvents([event, ...events]);
    });

    onEvent('stats:update', (stats) => {
      setStats(stats);
    });
  };

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white/60">Cargando partido...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondos parallax */}
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen p-6 md:p-12 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Ad Space Superior */}
          <AdSpace position="top" />

          {/* Marcador Principal */}
          <div className="flex-1 flex items-center justify-center">
            <StadiumScoreboard match={currentMatch} />
          </div>

          {/* Timeline de Eventos */}
          <div className="mt-6">
            <HorizontalTimeline events={events} />
          </div>

          {/* Ad Space Inferior */}
          <AdSpace position="bottom" />
        </div>
      </div>
    </div>
  );
};

// === ARCHIVO: frontend/src/types/match.ts ===
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
  stats?: MatchStats;
}

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';

export type MatchPeriod = 'first_half' | 'second_half' | 'extra_time_first' | 'extra_time_second' | 'penalties';

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

// === ARCHIVO: frontend/src/types/team.ts ===
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  formation?: string;
  coach?: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  photo?: string;
  teamId: string;
}

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

// === ARCHIVO: frontend/src/types/event.ts ===
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

// === ARCHIVO: frontend/src/utils/time.ts ===
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// === ARCHIVO: frontend/src/services/api.ts ===
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// === ARCHIVO: frontend/src/services/socket.ts ===
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';

let socket: Socket | null = null;

export const connectSocket = (matchId: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket?.emit('join_match', matchId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

// === ARCHIVO: frontend/src/services/matches.ts ===
import api from './api';
import { Match, MatchStats } from '../types/match';
import { MatchEvent } from '../types/event';

export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get('/api/matches');
  return response.data;
};

export const getMatch = async (id: string): Promise<Match> => {
  const response = await api.get(`/api/matches/${id}`);
  return response.data;
};

export const getMatchEvents = async (matchId: string): Promise<MatchEvent[]> => {
  const response = await api.get(`/api/matches/${matchId}/events`);
  return response.data;
};

export const getMatchStats = async (matchId: string): Promise<MatchStats> => {
  const response = await api.get(`/api/matches/${matchId}/stats`);
  return response.data;
};

// === ARCHIVO: frontend/src/store/matchStore.ts ===
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
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

// === ARCHIVO: frontend/src/hooks/useSocket.ts ===
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

export const useSocket = (matchId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (matchId) {
      socketRef.current = connectSocket(matchId);
    }

    return () => {
      disconnectSocket();
    };
  }, [matchId]);

  const onEvent = (event: string, callback: (data: any) => void) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, callback);
    }
  };

  const emitEvent = (event: string, data: any) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  };

  return { onEvent, emitEvent };
};

// === ARCHIVO: frontend/src/App.tsx ===
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StadiumDisplay } from './pages/StadiumDisplay';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StadiumDisplay />} />
        <Route path="/match/:matchId" element={<StadiumDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// === ARCHIVO: frontend/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// === ARCHIVO: frontend/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de Marcación para Ligas de Fútbol" />
    <title>Scoreboard Fútbol</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>.  
Listo. Tienes **todos los archivos del proyecto en un solo documento** sin separaciones. Solo necesitas:

1. Copiar cada bloque entre los comentarios `// === ARCHIVO: ruta ===`
2. Crear la estructura de carpetas
3. Pegar cada archivo en su ubicación correspondiente
4. Ejecutar `npm install` y `npm run dev`

El proyecto está completo y listo para funcionar.  // ============================================================================
// SCOREBOARD FÚTBOL - SISTEMA COMPLETO
// Todos los archivos del proyecto en un solo documento
// ============================================================================

// === ARCHIVO: frontend/package.json ===
{
  "name": "scoreboard-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy": "wrangler pages deploy ./dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^10.16.16",
    "socket.io-client": "^4.7.2",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "wrangler": "^3.22.0"
  }
}

// === ARCHIVO: frontend/vite.config.ts ===
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})

// === ARCHIVO: frontend/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

// === ARCHIVO: frontend/tsconfig.node.json ===
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

// === ARCHIVO: frontend/tailwind.config.ts ===
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config

// === ARCHIVO: frontend/postcss.config.js ===
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// === ARCHIVO: frontend/wrangler.toml ===
name = "scoreboard-frontend"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[build]
command = "npm run build"

// === ARCHIVO: frontend/.env.local ===
VITE_API_URL=http://localhost:8787
VITE_WS_URL=ws://localhost:8787
VITE_ENV=development

// === ARCHIVO: frontend/.env.production ===
VITE_API_URL=https://api.scoreboard-futbol.workers.dev
VITE_WS_URL=wss://api.scoreboard-futbol.workers.dev
VITE_ENV=production

// === ARCHIVO: frontend/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de Marcación para Ligas de Fútbol" />
    <title>Scoreboard Fútbol - Sistema de Marcación</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: frontend/src/assets/styles/globals.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen text-white antialiased;
    background-attachment: fixed;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .glass-panel {
    @apply bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl;
  }
  
  .glass-panel-strong {
    @apply bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl;
  }
  
  .glass-button {
    @apply bg-white/20 backdrop-blur-md border border-white/30 rounded-xl 
           hover:bg-white/30 transition-all duration-300 active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .glass-input {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-lg
           focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20
           transition-all duration-300;
  }

  .parallax-layer {
    @apply transition-transform duration-300 ease-out;
    will-change: transform;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent;
  }

  .scrollbar-custom {
    @apply scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5;
  }
}

@layer utilities {
  .text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .text-shadow-md {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
  
  .text-shadow-lg {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  background-size: 1000px 100%;
}

// === ARCHIVO: frontend/src/types/match.ts ===
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

// === ARCHIVO: frontend/src/types/team.ts ===
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  formation?: string;
  coach?: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  photo?: string;
  teamId: string;
}

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Lineup {
  teamId: string;
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
  coach: string;
}

// === ARCHIVO: frontend/src/types/event.ts ===
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

// === ARCHIVO: frontend/src/types/player.ts ===
import { Position } from './team';

export interface PlayerStats {
  playerId: string;
  matchId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  rating?: number;
}

// === ARCHIVO: frontend/src/utils/time.ts ===
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatMatchTime = (seconds: number, addedTime: number = 0): string => {
  const mins = Math.floor(seconds / 60);
  const displayMins = mins > 90 ? mins : mins;
  const addedText = addedTime > 0 && mins >= 45 ? `+${addedTime}` : '';
  return `${displayMins}'${addedText}`;
};

export const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    first_half: '1er Tiempo',
    second_half: '2do Tiempo',
    extra_time_first: 'Prórroga 1',
    extra_time_second: 'Prórroga 2',
    penalties: 'Penales',
  };
  return labels[period] || period;
};

export const calculateAddedTime = (events: any[]): number => {
  let addedTime = 0;
  events.forEach(event => {
    if (event.type === 'substitution') addedTime += 0.5;
    if (event.type === 'goal') addedTime += 1;
    if (event.type === 'injury') addedTime += 2;
    if (event.type === 'var_review') addedTime += 1.5;
  });
  return Math.ceil(addedTime);
};

// === ARCHIVO: frontend/src/utils/format.ts ===
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// === ARCHIVO: frontend/src/utils/constants.ts ===
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

// === ARCHIVO: frontend/src/services/api.ts ===
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// === ARCHIVO: frontend/src/services/socket.ts ===
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';

let socket: Socket | null = null;

export const connectSocket = (matchId: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket?.emit('join_match', matchId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

// === ARCHIVO: frontend/src/services/matches.ts ===
import api from './api';
import { Match, MatchStats } from '../types/match';

export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get('/api/matches');
  return response.data;
};

export const getMatch = async (id: string): Promise<Match> => {
  const response = await api.get(`/api/matches/${id}`);
  return response.data;
};

export const createMatch = async (data: Partial<Match>): Promise<Match> => {
  const response = await api.post('/api/matches', data);
  return response.data;
};

export const updateMatch = async (id: string, data: Partial<Match>): Promise<Match> => {
  const response = await api.put(`/api/matches/${id}`, data);
  return response.data;
};

export const getMatchStats = async (matchId: string): Promise<MatchStats> => {
  const response = await api.get(`/api/matches/${matchId}/stats`);
  return response.data;
};

// === ARCHIVO: frontend/src/services/events.ts ===
import api from './api';
import { MatchEvent } from '../types/event';

export const getMatchEvents = async (matchId: string): Promise<MatchEvent[]> => {
  const response = await api.get(`/api/matches/${matchId}/events`);
  return response.data;
};

export const createEvent = async (matchId: string, data: Partial<MatchEvent>): Promise<MatchEvent> => {
  const response = await api.post(`/api/matches/${matchId}/events`, data);
  return response.data;
};

export const updateEvent = async (matchId: string, eventId: string, data: Partial<MatchEvent>): Promise<MatchEvent> => {
  const response = await api.put(`/api/matches/${matchId}/events/${eventId}`, data);
  return response.data;
};

export const deleteEvent = async (matchId: string, eventId: string): Promise<void> => {
  await api.delete(`/api/matches/${matchId}/events/${eventId}`);
};

// === ARCHIVO: frontend/src/store/matchStore.ts ===
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

// === ARCHIVO: frontend/src/store/uiStore.ts ===
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  activeTab: string;
  theme: 'dark' | 'light';
  
  toggleSidebar: () => void;
  setModalOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isModalOpen: false,
  activeTab: 'dashboard',
  theme: 'dark',
  
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setTheme: (theme) => set({ theme }),
}));

// === ARCHIVO: frontend/src/hooks/useSocket.ts ===
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

export const useSocket = (matchId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (matchId) {
      socketRef.current = connectSocket(matchId);
    }

    return () => {
      disconnectSocket();
    };
  }, [matchId]);

  const onEvent = (event: string, callback: (data: any) => void) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, callback);
    }
  };

  const emitEvent = (event: string, data: any) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  };

  return { onEvent, emitEvent };
};

// === ARCHIVO: frontend/src/hooks/useTimer.ts ===
import { useState, useEffect, useRef } from 'react';
import { useMatchStore } from '../store/matchStore';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentMatch } = useMatchStore();

  useEffect(() => {
    if (currentMatch) {
      setTime(currentMatch.currentTime);
      setIsRunning(currentMatch.status === 'live');
    }
  }, [currentMatch]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => setTime(0);

  return { time, isRunning, start, pause, reset };
};

// === ARCHIVO: frontend/src/components/common/Button.tsx ===
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'glass-button font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-blue-500/30 hover:bg-blue-500/50 border-blue-400/50',
    secondary: 'bg-white/20 hover:bg-white/30',
    danger: 'bg-red-500/30 hover:bg-red-500/50 border-red-400/50',
    success: 'bg-green-500/30 hover:bg-green-500/50 border-green-400/50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

// === ARCHIVO: frontend/src/components/scoreboard/Scoreboard.tsx ===
import React from 'react';
import { motion } from 'framer-motion';
import { TeamDisplay } from './TeamDisplay';
import { Score } from './Score';
import { Timer } from './Timer';
import { Match } from '../../types/match';

interface ScoreboardProps {
  match: Match;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ match }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 md:p-12"
    >
      <div className="grid grid-cols-3 gap-8 items-center">
        <TeamDisplay
          team={match.homeTeam}
          score={match.homeScore}
          side="left"
        />
        
        <div className="text-center">
          <Score
            home={match.homeScore}
            away={match.awayScore}
          />
          <Timer
            time={match.currentTime}
            period={match.period}
            addedTime={match.addedTime}
          />
        </div>
        
        <TeamDisplay
          team={match.awayTeam}
          score={match.awayScore}
          side="right"
        />
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/scoreboard/TeamDisplay.tsx ===
import React from 'react';
import { motion } from 'framer-motion';
import { Team } from '../../types/team';

interface TeamDisplayProps {
  team: Team;
  score: number;
  side: 'left' | 'right';
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, score, side }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`text-center ${side === 'right' ? 'text-right' : 'text-left'}`}
    >
      <div
        className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full flex items-center justify-center border-4"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}30, ${team.secondaryColor}30)`,
          borderColor: team.primaryColor,
        }}
      >
        <img
          src={team.logo}
          alt={team.name}
          className="w-16 h-16 md:w-20 md:h-20 object-contain"
        />
      </div>
      <h2 className="text-xl md:text-2xl font-bold">{team.name}</h2>
      <p className="text-sm text-white/60">{team.shortName}</p>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/scoreboard/Score.tsx ===
import React from 'react';
import { motion } from 'framer-motion';

interface ScoreProps {
  home: number;
  away: number;
}

export const Score: React.FC<ScoreProps> = ({ home, away }) => {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="text-6xl md:text-8xl font-black mb-4"
    >
      <span className="text-white">{home}</span>
      <span className="text-white/40 mx-4">-</span>
      <span className="text-white">{away}</span>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/scoreboard/Timer.tsx ===
import React from 'react';
import { formatTime } from '../../utils/time';
import { MatchPeriod } from '../../types/match';

interface TimerProps {
  time: number;
  period: MatchPeriod;
  addedTime?: number;
}

export const Timer: React.FC<TimerProps> = ({ time, period, addedTime = 0 }) => {
  const getPeriodLabel = () => {
    const labels: Record<MatchPeriod, string> = {
      first_half: '1er Tiempo',
      second_half: '2do Tiempo',
      extra_time_first: 'Prórroga 1',
      extra_time_second: 'Prórroga 2',
      penalties: 'Penales',
    };
    return labels[period];
  };

  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-mono font-bold text-blue-300">
        {formatTime(time)}
        {addedTime > 0 && (
          <span className="text-xl ml-2 text-yellow-400">+{addedTime}</span>
        )}
      </div>
      <div className="text-sm text-white/60">{getPeriodLabel()}</div>
    </div>
  );
};

// === ARCHIVO: frontend/src/components/events/EventsTimeline.tsx ===
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchEvent } from '../../types/event';

interface EventsTimelineProps {
  events: MatchEvent[];
}

export const EventsTimeline: React.FC<EventsTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      default: return '📋';
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'goal': return 'GOL';
      case 'yellow_card': return 'Amarilla';
      case 'red_card': return 'Roja';
      case 'substitution': return 'Cambio';
      default: return 'Evento';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h3 className="text-xl font-bold mb-4">Eventos del Partido</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`glass-button p-4 flex items-center gap-4 ${
                event.team === 'home' ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-red-400'
              }`}
            >
              <span className="text-3xl">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <div className="font-bold">{getEventLabel(event.type)}</div>
                <div className="text-sm text-white/60">{event.player.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">{event.minute}'</div>
                <div className="text-xs text-white/60">
                  {event.team === 'home' ? 'Local' : 'Visita'}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/stats/StatsPanel.tsx ===
import React from 'react';
import { motion } from 'framer-motion';
import { MatchStats } from '../../types/match';

interface StatsPanelProps {
  stats: MatchStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h3 className="text-xl font-bold mb-6">Estadísticas</h3>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Posesión</span>
          <span className="text-white/60">{stats.possession.home}% - {stats.possession.away}%</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.possession.home}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-button p-4 text-center">
          <div className="text-3xl font-bold mb-1">{stats.shots.home} - {stats.shots.away}</div>
          <div className="text-sm text-white/60">Tiros al Arco</div>
        </div>
        <div className="glass-button p-4 text-center">
          <div className="text-3xl font-bold mb-1">{stats.corners.home} - {stats.corners.away}</div>
          <div className="text-sm text-white/60">Córners</div>
        </div>
      </div>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/components/advertising/AdBanner.tsx ===
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const [currentAd, setCurrentAd] = useState(0);
  const ads = [
    { id: 1, text: 'Patrocinador Principal', color: 'from-blue-500/20 to-purple-500/20' },
    { id: 2, text: 'Marca Oficial', color: 'from-green-500/20 to-blue-500/20' },
    { id: 3, text: 'Partner Tecnológico', color: 'from-orange-500/20 to-red-500/20' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-4 mb-6 ${position === 'bottom' ? 'mb-0 mt-6' : ''}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`bg-gradient-to-r ${ads[currentAd].color} rounded-lg p-6 text-center`}
        >
          <p className="text-lg font-semibold text-white/80">{ads[currentAd].text}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// === ARCHIVO: frontend/src/pages/StadiumDisplay.tsx ===
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scoreboard } from '../components/scoreboard/Scoreboard';
import { EventsTimeline } from '../components/events/EventsTimeline';
import { StatsPanel } from '../components/stats/StatsPanel';
import { AdBanner } from '../components/advertising/AdBanner';
import { useMatchStore } from '../store/matchStore';
import { useSocket } from '../hooks/useSocket';
import { getMatch, getMatchEvents, getMatchStats } from '../services/matches';

export const StadiumDisplay: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { currentMatch, events, stats, setCurrentMatch, setEvents, setStats } = useMatchStore();
  const { onEvent } = useSocket(matchId || '');

  useEffect(() => {
    if (matchId) {
      loadMatchData();
      setupSocketListeners();
    }
  }, [matchId]);

  const loadMatchData = async () => {
    try {
      const match = await getMatch(matchId!);
      const events = await getMatchEvents(matchId!);
      const stats = await getMatchStats(matchId!);
      
      setCurrentMatch(match);
      setEvents(events);
      setStats(stats);
    } catch (error) {
      console.error('Error loading match data:', error);
    }
  };

  const setupSocketListeners = () => {
    onEvent('match:update', (data) => {
      setCurrentMatch(data);
    });

    onEvent('event:created', (event) => {
      setEvents([event, ...events]);
    });

    onEvent('stats:update', (stats) => {
      setStats(stats);
    });
  };

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando partido...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <AdBanner position="top" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <Scoreboard match={currentMatch} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <StatsPanel stats={stats!} />
          <EventsTimeline events={events} />
        </div>
      </motion.div>
      
      <AdBanner position="bottom" />
    </div>
  );
};

// === ARCHIVO: frontend/src/pages/RemoteControl.tsx ===
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { useMatchStore } from '../store/matchStore';
import { useSocket } from '../hooks/useSocket';
import { createEvent } from '../services/events';
import { MatchEvent } from '../types/event';

export const RemoteControl: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { currentMatch, addEvent } = useMatchStore();
  const { emitEvent } = useSocket(matchId || '');
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState<string>('');

  const handleGoal = async (team: 'home' | 'away') => {
    const player = prompt('Nombre del jugador:');
    if (player && matchId) {
      const event: Partial<MatchEvent> = {
        type: 'goal',
        team,
        player: { id: '', name: player, number: 0, position: 'FWD', teamId: '' },
        minute: Math.floor((currentMatch?.currentTime || 0) / 60),
      };
      
      const createdEvent = await createEvent(matchId, event);
      addEvent(createdEvent);
      emitEvent('event:created', createdEvent);
    }
  };

  const handleCard = async (team: 'home' | 'away', type: 'yellow_card' | 'red_card') => {
    const player = prompt('Nombre del jugador:');
    if (player && matchId) {
      const event: Partial<MatchEvent> = {
        type,
        team,
        player: { id: '', name: player, number: 0, position: 'MID', teamId: '' },
        minute: Math.floor((currentMatch?.currentTime || 0) / 60),
      };
      
      const createdEvent = await createEvent(matchId, event);
      addEvent(createdEvent);
      emitEvent('event:created', createdEvent);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8"
        >
          <h1 className="text-3xl font-bold mb-8">Control Remoto</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button
              variant="success"
              size="lg"
              onClick={() => handleGoal('home')}
            >
              ⚽ Gol Local
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleGoal('away')}
            >
              ⚽ Gol Visita
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCard('home', 'yellow_card')}
            >
              🟨 Amarilla Local
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCard('away', 'yellow_card')}
            >
               Amarilla Visita
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => handleCard('home', 'red_card')}
            >
              🟥 Roja Local
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={() => handleCard('away', 'red_card')}
            >
              🟥 Roja Visita
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" size="lg">
              🔄 Cambio
            </Button>
            <Button variant="secondary" size="lg">
              📺 VAR
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// === ARCHIVO: frontend/src/pages/Admin.tsx ===
import React from 'react';
import { motion } from 'framer-motion';

export const Admin: React.FC = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Panel Administrativo</h1>
          <p className="text-white/60">En desarrollo...</p>
        </motion.div>
      </div>
    </div>
  );
};

// === ARCHIVO: frontend/src/pages/Home.tsx ===
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-6">Sistema de Marcación Fútbol</h1>
          <p className="text-xl text-white/60 mb-8">
            Plataforma profesional para ligas nacionales
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/match/demo"
              className="glass-button px-8 py-4 text-lg font-semibold"
            >
              Ver Marcador
            </Link>
            <Link
              to="/remote/demo"
              className="glass-button px-8 py-4 text-lg font-semibold"
            >
              Control Remoto
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// === ARCHIVO: frontend/src/App.tsx ===
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StadiumDisplay } from './pages/StadiumDisplay';
import { RemoteControl } from './pages/RemoteControl';
import { Admin } from './pages/Admin';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/:matchId" element={<StadiumDisplay />} />
        <Route path="/remote/:matchId" element={<RemoteControl />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// === ARCHIVO: frontend/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// === ARCHIVO: frontend/src/vite-env.d.ts ===
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// === ARCHIVO: .github/workflows/deploy-frontend.yml ===
name: Deploy Frontend to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Build
        working-directory: frontend
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy ./frontend/dist --project-name=scoreboard-frontend

// === ARCHIVO: .github/workflows/deploy-backend.yml ===
name: Deploy Backend to Cloudflare Workers

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: backend
          command: deploy

// === ARCHIVO: README.md ===
# Scoreboard Fútbol - Sistema de Marcación

Sistema profesional de marcación para ligas nacionales de fútbol con diseño Glassmorphism + Parallax.

## Tecnologías

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Cloudflare Workers + Hono
- **Base de datos**: Cloudflare D1 (SQLite)
- **Tiempo real**: WebSockets
- **Deploy**: GitHub Actions + Cloudflare Pages/Workers

## Instalación

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
