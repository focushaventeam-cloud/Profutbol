import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MatchEvent } from '../../types/event';
import { EventItem } from './EventItem';

interface EventTimelineProps {
  events: MatchEvent[];
  homeTeamId: string;
  awayTeamId: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  homeTeamId,
  awayTeamId,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.type === filter);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => b.minute - a.minute
  );

  const eventCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const filterButtons = [
    { id: 'all', label: 'Todos', count: events.length },
    { id: 'goal', label: 'Goles', count: (eventCounts['goal'] || 0) + (eventCounts['own_goal'] || 0) + (eventCounts['penalty'] || 0) },
    { id: 'yellow_card', label: 'Amarillas', count: eventCounts['yellow_card'] || 0 },
    { id: 'red_card', label: 'Rojas', count: eventCounts['red_card'] || 0 },
    { id: 'substitution', label: 'Cambios', count: eventCounts['substitution'] || 0 },
  ];

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-purple-500" />
          Eventos del Partido
        </h3>
        <p className="text-xs text-white/40 mt-1">{events.length} eventos registrados</p>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 border-b border-white/10 flex gap-2 overflow-x-auto scrollbar-custom">
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-200
              ${filter === btn.id
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }
            `}
          >
            {btn.label}
            {btn.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px]">
                {btn.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto scrollbar-custom">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-white/30">Sin eventos registrados</p>
          </div>
        ) : (
          sortedEvents.map((event, idx) => (
            <EventItem
              key={event.id}
              event={event}
              isHomeTeam={event.team === 'home'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventTimeline;