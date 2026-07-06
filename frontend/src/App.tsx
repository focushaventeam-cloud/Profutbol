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
import AdBanner from './components/ads/AdBanner';

/* Wrapper component for MatchPage with router params */
const MatchPageRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { match, events, stats, isLoading, error } = useMatch(id || null);
  useSocket(id || null);

  const handleCreateEvent = async (data: EventFormData) => {
    if (!id) return;
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
    } catch (err) {
      console.error('Error fetching matches:', err);
      // Use demo data if API fails
      setMatches(getDemoMatches());
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
        return (
          <div className="glass-panel p-8 text-center">
            <p className="text-white/30 font-medium">Estadísticas globales próximamente</p>
          </div>
        );
      case 'settings':
        return (
          <div className="glass-panel p-8 text-center">
            <p className="text-white/30 font-medium">Configuración próximamente</p>
          </div>
        );
      case 'live':
        const liveMatches = matches.filter((m) => m.status === 'live');
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

/* Demo data for when API is not available */
function getDemoMatches(): Match[] {
  return [
    {
      id: 'demo-1',
      homeTeam: {
        id: 'team-1',
        name: 'Real Fútbol Club',
        shortName: 'RFC',
        logo: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        coach: 'Carlos Martínez',
        formation: '4-3-3',
      },
      awayTeam: {
        id: 'team-2',
        name: 'Deportivo Aurora',
        shortName: 'DPA',
        logo: '',
        primaryColor: '#8b5cf6',
        secondaryColor: '#6d28d9',
        coach: 'Roberto Sánchez',
        formation: '4-4-2',
      },
      homeScore: 2,
      awayScore: 1,
      status: 'live',
      startTime: new Date(Date.now() - 3600000),
      currentTime: 3420,
      period: 'second_half',
      addedTime: 3,
      venue: 'Estadio Nacional',
      referee: 'Juan Pérez',
      weather: {
        temperature: 24,
        condition: 'sunny',
        humidity: 45,
        windSpeed: 12,
      },
      attendance: 42000,
    },
    {
      id: 'demo-2',
      homeTeam: {
        id: 'team-3',
        name: 'Atlético Sol',
        shortName: 'ATS',
        logo: '',
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        coach: 'Miguel Torres',
        formation: '3-5-2',
      },
      awayTeam: {
        id: 'team-4',
        name: 'Club Estrella',
        shortName: 'CLE',
        logo: '',
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        coach: 'Ana García',
        formation: '4-2-3-1',
      },
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
      startTime: new Date(Date.now() + 7200000),
      currentTime: 0,
      period: 'first_half',
      addedTime: 0,
      venue: 'Estadio Municipal',
      referee: 'María López',
      weather: {
        temperature: 22,
        condition: 'cloudy',
        humidity: 60,
        windSpeed: 8,
      },
      attendance: 28000,
    },
    {
      id: 'demo-3',
      homeTeam: {
        id: 'team-5',
        name: 'Sport Valiant',
        shortName: 'SPV',
        logo: '',
        primaryColor: '#ef4444',
        secondaryColor: '#dc2626',
        coach: 'Luis Ramírez',
        formation: '4-4-2',
      },
      awayTeam: {
        id: 'team-6',
        name: 'Fénix Unido',
        shortName: 'FNU',
        logo: '',
        primaryColor: '#06b6d4',
        secondaryColor: '#0891b2',
        coach: 'Pedro Ruiz',
        formation: '4-3-3',
      },
      homeScore: 3,
      awayScore: 2,
      status: 'finished',
      startTime: new Date(Date.now() - 86400000),
      currentTime: 5700,
      period: 'second_half',
      addedTime: 4,
      venue: 'Estadio Central',
      referee: 'Diego Morales',
      attendance: 35000,
    },
  ];
}

export default App;