import React, { useState } from 'react';
import { Plus, BarChart3, List, Users, Gamepad2 } from 'lucide-react';
import { Match } from '../types/match';
import { MatchEvent } from '../types/event';
import { MatchStats } from '../types/match';
import Scoreboard from '../components/scoreboard/Scoreboard';
import MatchControlPanel from '../components/scoreboard/MatchControlPanel';
import EventTimeline from '../components/events/EventTimeline';
import StatsComparison from '../components/stats/StatsComparison';
import PlayerStatsGrid from '../components/stats/PlayerStatsGrid';
import LineupsComparison from '../components/lineups/LineupsComparison';
import EventForm, { EventFormData } from '../components/events/EventForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AdBanner from '../components/ads/AdBanner';
import { Lineup } from '../types/team';
import { PlayerStats } from '../types/player';
import { getDemoLineup, getDemoPlayerStats, demoPlayers } from '../services/mockData';

type TabSection = 'events' | 'stats' | 'lineups' | 'players';

interface MatchPageProps {
  match: Match | null;
  events: MatchEvent[];
  stats: MatchStats | null;
  isLoading: boolean;
  error: string | null;
  isAdmin?: boolean;
  onCreateEvent?: (data: EventFormData) => Promise<void>;
}

export const MatchPage: React.FC<MatchPageProps> = ({
  match,
  events,
  stats,
  isLoading,
  error,
  isAdmin = false,
  onCreateEvent,
}) => {
  const [activeSection, setActiveSection] = useState<TabSection>('events');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMatch, setLocalMatch] = useState<Match | null>(match);

  React.useEffect(() => {
    if (match) setLocalMatch(match);
  }, [match]);

  const handleCreateEvent = async (data: EventFormData) => {
    if (!onCreateEvent) return;
    setIsSubmitting(true);
    try {
      await onCreateEvent(data);
      setIsEventModalOpen(false);
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Cargando partido..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    );
  }

  const current = localMatch || match;
  if (!current) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="text-white/30 font-medium">Selecciona un partido para ver los detalles</p>
      </div>
    );
  }

  const currentMinute = current.status === 'live'
    ? Math.floor(current.currentTime / 60)
    : 0;

  /* Demo lineups & player stats */
  const homeLineup = getDemoLineup(current.homeTeam.id);
  const awayLineup = getDemoLineup(current.awayTeam.id);
  const playerStats = getDemoPlayerStats(current.id);

  const playerNameMap = new Map<string, string>();
  const playerNumberMap = new Map<string, number>();
  const playerPosMap = new Map<string, string>();
  const playerColorMap = new Map<string, string>();

  const allPlayers = [
    ...(demoPlayers[current.homeTeam.id] || []),
    ...(demoPlayers[current.awayTeam.id] || []),
  ];
  allPlayers.forEach((p) => {
    playerNameMap.set(p.id, p.name);
    playerNumberMap.set(p.id, p.number);
    playerPosMap.set(p.id, p.position);
    playerColorMap.set(p.id, p.teamId === current.homeTeam.id ? current.homeTeam.primaryColor : current.awayTeam.primaryColor);
  });

  /* Control panel handlers */
  const handleStatusChange = (status: any) => {
    if (localMatch) setLocalMatch({ ...localMatch, status });
  };
  const handlePeriodChange = (period: any) => {
    if (localMatch) setLocalMatch({ ...localMatch, period });
  };
  const handleScoreChange = (team: 'home' | 'away', score: number) => {
    if (localMatch) setLocalMatch({ ...localMatch, [`${team}Score`]: score });
  };
  const handleTimeChange = (seconds: number) => {
    if (localMatch) setLocalMatch({ ...localMatch, currentTime: seconds });
  };
  const handleAddedTimeChange = (addedTime: number) => {
    if (localMatch) setLocalMatch({ ...localMatch, addedTime });
  };

  const tabs: { id: TabSection; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'events', label: 'Eventos', icon: <List size={15} />, count: events.length },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart3 size={15} /> },
    { id: 'lineups', label: 'Alineaciones', icon: <Users size={15} /> },
    { id: 'players', label: 'Jugadores', icon: <Gamepad2 size={15} />, count: playerStats.length },
  ];

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <Scoreboard match={current} isAdmin={isAdmin} />

      {/* Admin Control Panel */}
      {isAdmin && (
        <MatchControlPanel
          match={current}
          onStatusChange={handleStatusChange}
          onPeriodChange={handlePeriodChange}
          onScoreChange={handleScoreChange}
          onTimeChange={handleTimeChange}
          onAddedTimeChange={handleAddedTimeChange}
        />
      )}

      {/* Ad Banner */}
      <AdBanner className="hidden sm:block" />

      {/* Section tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 p-1 glass-panel rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap
                transition-all duration-200
                ${activeSection === tab.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white/60'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {isAdmin && current.status === 'live' && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setIsEventModalOpen(true)}
          >
            Nuevo Evento
          </Button>
        )}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {activeSection === 'events' && (
            <EventTimeline
              events={events}
              homeTeamId={current.homeTeam.id}
              awayTeamId={current.awayTeam.id}
            />
          )}

          {activeSection === 'stats' && (
            stats ? (
              <StatsComparison
                stats={stats}
                homeTeamName={current.homeTeam.shortName}
                awayTeamName={current.awayTeam.shortName}
              />
            ) : (
              <div className="glass-panel p-12 text-center">
                <p className="text-white/30 font-medium">Estadísticas no disponibles</p>
              </div>
            )
          )}

          {activeSection === 'lineups' && homeLineup && awayLineup && (
            <LineupsComparison
              homeLineup={homeLineup}
              awayLineup={awayLineup}
              homeTeamName={current.homeTeam.shortName}
              awayTeamName={current.awayTeam.shortName}
              homeColor={current.homeTeam.primaryColor}
              awayColor={current.awayTeam.primaryColor}
            />
          )}

          {activeSection === 'players' && (
            <PlayerStatsGrid
              playerStats={playerStats}
              getPlayerName={(id) => playerNameMap.get(id) || 'Desconocido'}
              getPlayerNumber={(id) => playerNumberMap.get(id) || 0}
              getPlayerPosition={(id) => playerPosMap.get(id) || '-'}
              getPlayerTeamColor={(id) => playerColorMap.get(id) || '#3b82f6'}
            />
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Match info card */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Información del Partido
            </h4>
            <div className="space-y-3">
              <InfoRow label="Sede" value={current.venue} />
              <InfoRow label="Árbitro" value={current.referee} />
              {current.weather && (
                <InfoRow
                  label="Clima"
                  value={`${current.weather.temperature}°C · ${current.weather.condition === 'sunny' ? 'Soleado' : current.weather.condition === 'cloudy' ? 'Nublado' : current.weather.condition === 'rainy' ? 'Lluvia' : 'Nieve'}`}
                />
              )}
              {current.attendance && (
                <InfoRow label="Asistencia" value={current.attendance.toLocaleString('es-ES')} />
              )}
              <InfoRow label="Inicio" value={
                new Date(current.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              } />
            </div>
          </div>

          {/* Quick formation summary */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Formaciones
            </h4>
            <div className="space-y-3">
              <FormationSummary
                teamName={current.homeTeam.shortName}
                formation={current.homeTeam.formation || '4-4-2'}
                color={current.homeTeam.primaryColor}
              />
              <div className="border-t border-white/10 pt-3">
                <FormationSummary
                  teamName={current.awayTeam.shortName}
                  formation={current.awayTeam.formation || '4-4-2'}
                  color={current.awayTeam.primaryColor}
                />
              </div>
            </div>
          </div>

          {/* Top performers mini */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Mejores del Partido
            </h4>
            <div className="space-y-2">
              {playerStats
                .filter(p => p.rating && p.rating >= 7)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3)
                .map((ps) => (
                  <div key={ps.playerId} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
                      style={{
                        background: `linear-gradient(135deg, ${playerColorMap.get(ps.playerId) || '#3b82f6'}40, transparent)`,
                        border: `1px solid ${playerColorMap.get(ps.playerId) || '#3b82f6'}30`,
                      }}
                    >
                      {playerNumberMap.get(ps.playerId) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{playerNameMap.get(ps.playerId)}</p>
                      <p className="text-[10px] text-white/30">
                        {ps.goals}G · {ps.assists}A
                      </p>
                    </div>
                    <span className={`text-sm font-black ${ps.rating && ps.rating >= 7.5 ? 'rating-excellent' : 'rating-good'}`}>
                      {ps.rating?.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Registrar Evento"
        size="lg"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          isLoading={isSubmitting}
          homeTeamName={current.homeTeam.shortName}
          awayTeamName={current.awayTeam.shortName}
          currentMinute={currentMinute}
        />
      </Modal>
    </div>
  );
};

/* Sub-components */
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-white/40">{label}</span>
    <span className="text-white/80 font-medium text-right max-w-[60%] truncate">{value}</span>
  </div>
);

const FormationSummary: React.FC<{ teamName: string; formation: string; color: string }> = ({
  teamName, formation, color,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-xs font-semibold text-white/70">{teamName}</span>
    </div>
    <span className="text-sm font-black text-white number-highlight tracking-wider">{formation}</span>
  </div>
);

export default MatchPage;