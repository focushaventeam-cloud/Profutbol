import React, { useState } from 'react';
import { Plus, BarChart3, List } from 'lucide-react';
import { Match } from '../types/match';
import { MatchEvent } from '../types/event';
import { MatchStats } from '../types/match';
import Scoreboard from '../components/scoreboard/Scoreboard';
import EventTimeline from '../components/events/EventTimeline';
import StatsComparison from '../components/stats/StatsComparison';
import EventForm, { EventFormData } from '../components/events/EventForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AdBanner from '../components/ads/AdBanner';

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
  const [activeSection, setActiveSection] = useState<'events' | 'stats'>('events');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!match) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="text-white/30 font-medium">Selecciona un partido para ver los detalles</p>
      </div>
    );
  }

  const currentMinute = match.status === 'live'
    ? Math.floor(match.currentTime / 60)
    : 0;

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <Scoreboard match={match} isAdmin={isAdmin} />

      {/* Ad Banner */}
      <AdBanner />

      {/* Section tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 glass-panel rounded-xl">
          <button
            onClick={() => setActiveSection('events')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${activeSection === 'events'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            <List size={15} />
            Eventos
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-bold">
              {events.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('stats')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${activeSection === 'stats'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            <BarChart3 size={15} />
            Estadísticas
          </button>
        </div>

        {isAdmin && match.status === 'live' && (
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

      {/* Content area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {activeSection === 'events' ? (
            <EventTimeline
              events={events}
              homeTeamId={match.homeTeam.id}
              awayTeamId={match.awayTeam.id}
            />
          ) : stats ? (
            <StatsComparison
              stats={stats}
              homeTeamName={match.homeTeam.shortName}
              awayTeamName={match.awayTeam.shortName}
            />
          ) : (
            <div className="glass-panel p-12 text-center">
              <p className="text-white/30 font-medium">Estadísticas no disponibles</p>
            </div>
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
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Sede</span>
                <span className="text-white/80 font-medium">{match.venue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Árbitro</span>
                <span className="text-white/80 font-medium">{match.referee}</span>
              </div>
              {match.weather && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Clima</span>
                  <span className="text-white/80 font-medium">
                    {match.weather.temperature}°C
                  </span>
                </div>
              )}
              {match.attendance && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Asistencia</span>
                  <span className="text-white/80 font-medium">
                    {match.attendance.toLocaleString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lineup placeholder */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Alineaciones
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-blue-400 mb-2">{match.homeTeam.shortName}</p>
                <p className="text-[11px] text-white/25">Alineación por confirmar</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs font-semibold text-purple-400 mb-2">{match.awayTeam.shortName}</p>
                <p className="text-[11px] text-white/25">Alineación por confirmar</p>
              </div>
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
          homeTeamName={match.homeTeam.shortName}
          awayTeamName={match.awayTeam.shortName}
          currentMinute={currentMinute}
        />
      </Modal>
    </div>
  );
};

export default MatchPage;