import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MatchPage from './pages/MatchPage';
import MatchesList from './pages/MatchesList';
import NotFound from './pages/NotFound';
import { useMatchStore } from './store/matchStore';
import { useUIStore } from './store/uiStore';
import { useMatch } from './hooks/useMatch';
import { useSocket } from './hooks/useSocket';
import { getMatches } from './services/matches';
import { createEvent as createEventApi } from './services/events';
import { Match } from './types/match';
import { EventFormData } from './components/events/EventForm';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { demoMatches, getDemoEvents, getDemoStats } from './services/mockData';

/* Wrapper component for MatchPage with router params + demo data fallback */
const MatchPageRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { match, events, stats, isLoading, error, setEvents, setStats } = useMatch(id || null);
  useSocket(id || null);

  /* If API fails, populate with demo data for demo match IDs */
  useEffect(() => {
    if (id && id.startsWith('demo-')) {
      const demoEvents = getDemoEvents(id);
      const demoStats = getDemoStats(id);
      if (demoEvents.length > 0 && events.length === 0) setEvents(demoEvents);
      if (demoStats && !stats) setStats(demoStats);
    }
  }, [id, events.length, stats]);

  const handleCreateEvent = async (data: EventFormData) => {
    if (!id) return;
    try {
      await createEventApi(id, {
        type: data.type,
        team: data.team,
        player: {
          id: `temp-${Date.now()}`,
          name: data.playerName,
          number: data.playerNumber,
          position: 'MID' as any,
          teamId: '',
        },
        minute: data.minute,
        description: data.description,
        timestamp: new Date(),
      } as any);
    } catch {
      /* If API fails, add to local store anyway for demo */
      useMatchStore.getState().addEvent({
        id: `evt-${Date.now()}`,
        type: data.type,
        team: data.team,
        player: {
          id: `temp-${Date.now()}`,
          name: data.playerName,
          number: data.playerNumber,
          position: 'MID' as any,
          teamId: '',
        },
        minute: data.minute,
        timestamp: new Date(),
      } as any);
    }
  };

  return (
    <MatchPage
      match={match}
      events={events}
      stats={stats}
      isLoading={isLoading}
      error={error}
      isAdmin={true}
      onCreateEvent={handleCreateEvent}
    />
  );
};

/* Main App */
const App: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { activeTab } = useUIStore();

  const fetchMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const data = await getMatches();
      setMatches(data);
      setIsConnected(true);
    } catch (_err) {
      console.log('API no disponible, usando datos demo');
      setMatches(demoMatches);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleMatchSelect = useCallback((matchId: string) => {
    navigate(`/match/${matchId}`);
  }, [navigate]);

  const renderContent = () => {
    if (isLoadingMatches) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" text="Cargando..." />
        </div>
      );
    }

    switch (activeTab) {
      case 'matches':
        return <MatchesList matches={matches} isLoading={false} onMatchSelect={handleMatchSelect} />;
      case 'stats':
        return <GlobalStatsPage matches={matches} onMatchSelect={handleMatchSelect} />;
      case 'settings':
        return <SettingsPage />;
      case 'live':
        const liveMatches = matches.filter((m) => m.status === 'live' || m.status === 'halftime');
        return liveMatches.length > 0 ? (
          <Dashboard matches={liveMatches} onMatchSelect={handleMatchSelect} />
        ) : (
          <div className="glass-panel p-12 text-center">
            <p className="text-white/30 font-medium">No hay partidos en vivo</p>
            <p className="text-xs text-white/20 mt-1">Los partidos en vivo aparecerán aquí automáticamente</p>
          </div>
        );
      default:
        return <Dashboard matches={matches} onMatchSelect={handleMatchSelect} />;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout isConnected={isConnected}>
            {renderContent()}
          </Layout>
        }
      />
      <Route
        path="/match/:id"
        element={
          <Layout isConnected={isConnected} matchTitle="Detalle del Partido">
            <MatchPageRoute />
          </Layout>
        }
      />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

/* Global Stats Page */
const GlobalStatsPage: React.FC<{ matches: Match[]; onMatchSelect: (id: string) => void }> = ({ matches, onMatchSelect }) => {
  const totalGoals = matches.reduce((s, m) => s + m.homeScore + m.awayScore, 0);
  const totalCards = matches.reduce((s, m) => {
    // Rough estimate from events - we show static count
    return s;
  }, 0);
  const avgGoals = matches.length > 0 ? (totalGoals / matches.length).toFixed(2) : '0';
  const liveCount = matches.filter(m => m.status === 'live').length;
  const finishedCount = matches.filter(m => m.status === 'finished').length;

  const statCards = [
    { label: 'Total Partidos', value: matches.length, gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20' },
    { label: 'Total Goles', value: totalGoals, gradient: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20' },
    { label: 'Promedio Goles', value: avgGoals, gradient: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20' },
    { label: 'Partidos en Vivo', value: liveCount, gradient: 'from-red-500/20 to-red-600/5', border: 'border-red-500/20' },
  ];

  /* Top scorers from demo */
  const topScorers = [
    { name: 'Santiago Pérez', team: 'RFC', goals: 3, matches: 2 },
    { name: 'Gonçalo Ramos', team: 'DPA/FNU', goals: 3, matches: 2 },
    { name: 'Nicolás Vega', team: 'RFC/SPV', goals: 2, matches: 2 },
    { name: 'Diogo Jota', team: 'FNU', goals: 1, matches: 1 },
    { name: 'Roberto Díaz', team: 'RFC/SPV', goals: 1, matches: 2 },
  ].sort((a, b) => b.goals - a.goals);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white text-shadow-sm">Estadísticas Globales</h2>
        <p className="text-sm text-white/40 mt-1">Resumen de todas las jornadas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((sc, idx) => (
          <div key={idx} className={`glass-panel p-4 bg-gradient-to-br ${sc.gradient} border ${sc.border}`}>
            <p className="text-3xl font-black text-white number-highlight">{sc.value}</p>
            <p className="text-xs text-white/40 font-semibold mt-1">{sc.label}</p>
          </div>
        ))}
      </div>

      {/* Top scorers */}
      <div className="glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            Tabla de Goleadores
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {topScorers.map((scorer, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors">
              <span className="text-sm font-black text-white/20 w-6 text-center">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{scorer.name}</p>
                <p className="text-[11px] text-white/30">{scorer.team}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-white number-highlight">{scorer.goals}</span>
                <p className="text-[10px] text-white/25">{scorer.matches} partidos</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent results */}
      <div className="glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 bg-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-green-400 to-emerald-500" />
            Últimos Resultados
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {matches.filter(m => m.status === 'finished' || m.status === 'live').map((m) => (
            <button
              key={m.id}
              onClick={() => onMatchSelect(m.id)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-white/70 truncate mr-3">{m.homeTeam.shortName}</span>
              <span className="text-sm font-black text-white number-highlight">
                {m.homeScore} - {m.awayScore}
              </span>
              <span className="text-sm font-medium text-white/70 truncate ml-3 text-right">{m.awayTeam.shortName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Settings Page */
const SettingsPage: React.FC = () => {
  const { theme, setTheme, isSidebarOpen } = useUIStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white text-shadow-sm">Configuración</h2>
        <p className="text-sm text-white/40 mt-1">Ajustes de la aplicación</p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-4">Apariencia</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-sm font-semibold text-white">Tema Oscuro</p>
                <p className="text-xs text-white/30 mt-0.5">Usar tema oscuro para la interfaz</p>
              </div>
              <div
                className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-300 relative ${
                  theme === 'dark' ? 'bg-blue-500' : 'bg-white/20'
                }`}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-lg ${
                  theme === 'dark' ? 'left-6' : 'left-0.5'
                }`} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold text-white mb-4">Acerca de</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm p-3 rounded-lg bg-white/5">
              <span className="text-white/40">Versión</span>
              <span className="text-white/80 font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm p-3 rounded-lg bg-white/5">
              <span className="text-white/40">Framework</span>
              <span className="text-white/80 font-medium">React 18 + Vite 5</span>
            </div>
            <div className="flex justify-between text-sm p-3 rounded-lg bg-white/5">
              <span className="text-white/40">Estado</span>
              <span className="text-emerald-400 font-medium">Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;