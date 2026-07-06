import React, { useState, useMemo } from 'react';
import { Search, Filter, Radio, Clock, CheckCircle } from 'lucide-react';
import { Match } from '../types/match';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatTime } from '../utils/time';

interface MatchesListProps {
  matches: Match[];
  isLoading: boolean;
  onMatchSelect: (matchId: string) => void;
}

type FilterType = 'all' | 'live' | 'scheduled' | 'finished';

export const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  isLoading,
  onMatchSelect,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredMatches = useMemo(() => {
    let result = matches;

    if (filter !== 'all') {
      result = result.filter((m) => m.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q)
      );
    }

    return result;
  }, [matches, filter, search]);

  const filterButtons: { value: FilterType; label: string; icon: React.ReactNode; count: number }[] = [
    { value: 'all', label: 'Todos', icon: <Filter size={13} />, count: matches.length },
    { value: 'live', label: 'En Vivo', icon: <Radio size={13} />, count: matches.filter(m => m.status === 'live').length },
    { value: 'scheduled', label: 'Programados', icon: <Clock size={13} />, count: matches.filter(m => m.status === 'scheduled').length },
    { value: 'finished', label: 'Finalizados', icon: <CheckCircle size={13} />, count: matches.filter(m => m.status === 'finished').length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Cargando partidos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white text-shadow-sm">
          Partidos
        </h2>
        <p className="text-sm text-white/40 mt-1">
          {matches.length} partidos en el sistema
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por equipo o sede..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-custom pb-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200 border
                ${filter === btn.value
                  ? 'bg-white/15 text-white border-white/20'
                  : 'text-white/40 border-transparent hover:bg-white/5 hover:text-white/60'
                }
              `}
            >
              {btn.icon}
              {btn.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold
                ${filter === btn.value ? 'bg-white/15' : 'bg-white/5'}`}>
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Match list */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <Search size={32} className="mx-auto text-white/10 mb-3" />
            <p className="text-white/30 font-medium">No se encontraron partidos</p>
            <p className="text-xs text-white/20 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <MatchListItem
              key={match.id}
              match={match}
              onClick={() => onMatchSelect(match.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const MatchListItem: React.FC<{ match: Match; onClick: () => void }> = ({ match, onClick }) => {
  const statusVariant = match.status === 'live' ? 'live'
    : match.status === 'finished' ? 'finished'
    : match.status === 'halftime' ? 'halftime'
    : match.status === 'postponed' ? 'postponed'
    : 'scheduled';

  return (
    <button
      onClick={onClick}
      className="w-full glass-panel p-4 text-left hover:bg-white/15 transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        {/* Home team */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${match.homeTeam.primaryColor}40, ${match.homeTeam.primaryColor}15)`,
              border: `1.5px solid ${match.homeTeam.primaryColor}40`,
            }}
          >
            {match.homeTeam.shortName.substring(0, 3)}
          </div>
          <span className="text-sm font-bold text-white truncate">{match.homeTeam.name}</span>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-center px-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tabular-nums w-8 text-right">{match.homeScore}</span>
            <span className="text-sm text-white/20">-</span>
            <span className="text-xl font-black text-white tabular-nums w-8 text-left">{match.awayScore}</span>
          </div>
          <Badge variant={statusVariant} pulse={match.status === 'live'} className="mt-1" />
        </div>

        {/* Away team */}
        <div className="flex-1 min-w-0 flex items-center gap-3 justify-end">
          <span className="text-sm font-bold text-white truncate text-right">{match.awayTeam.name}</span>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${match.awayTeam.primaryColor}40, ${match.awayTeam.primaryColor}15)`,
              border: `1.5px solid ${match.awayTeam.primaryColor}40`,
            }}
          >
            {match.awayTeam.shortName.substring(0, 3)}
          </div>
        </div>
      </div>

      {/* Venue + time */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <span className="text-[11px] text-white/25">{match.venue}</span>
        <span className="text-[11px] text-white/25">
          {new Date(match.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </button>
  );
};

export default MatchesList;