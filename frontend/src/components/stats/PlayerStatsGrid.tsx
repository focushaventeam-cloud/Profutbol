import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlayerStats } from '../../types/player';
import PlayerCard from '../ui/PlayerCard';

interface PlayerStatsGridProps {
  playerStats: PlayerStats[];
  getPlayerName: (playerId: string) => string;
  getPlayerNumber: (playerId: string) => number;
  getPlayerPosition: (playerId: string) => string;
  getPlayerTeamColor: (playerId: string) => string;
  teamName?: string;
}

type SortField = 'rating' | 'goals' | 'assists' | 'minutesPlayed' | 'passes' | 'tackles';

export const PlayerStatsGrid: React.FC<PlayerStatsGridProps> = ({
  playerStats,
  getPlayerName,
  getPlayerNumber,
  getPlayerPosition,
  getPlayerTeamColor,
  teamName,
}) => {
  const [sortBy, setSortBy] = useState<SortField>('rating');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const sorted = useMemo(() => {
    return [...playerStats].sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b[sortBy] || 0) - (a[sortBy] || 0);
    });
  }, [playerStats, sortBy]);

  const sortOptions: { field: SortField; label: string }[] = [
    { field: 'rating', label: 'Rating' },
    { field: 'goals', label: 'Goles' },
    { field: 'assists', label: 'Asistencias' },
    { field: 'minutesPlayed', label: 'Minutos' },
    { field: 'passes', label: 'Pases' },
    { field: 'tackles', label: 'Recuperaciones' },
  ];

  const bestPlayer = sorted[0];
  const mvp = sorted.find((p) => p.rating === Math.max(...sorted.map(s => s.rating || 0)));

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
              Valoraciones de Jugadores
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {playerStats.length} jugadores evaluados
              {teamName && ` · ${teamName}`}
            </p>
          </div>
          {mvp && mvp.rating && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-amber-400 font-bold uppercase">MVP</span>
              <span className="text-sm font-black text-amber-300">{mvp.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-custom">
          {sortOptions.map((opt) => (
            <button
              key={opt.field}
              onClick={() => setSortBy(opt.field)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200
                ${sortBy === opt.field
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/35 hover:text-white/50 hover:bg-white/5'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-0.5 rounded-lg bg-white/5">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all
              ${viewMode === 'cards' ? 'bg-white/15 text-white' : 'text-white/30'}`}
          >
            Tarjetas
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all
              ${viewMode === 'table' ? 'bg-white/15 text-white' : 'text-white/30'}`}
          >
            Tabla
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto scrollbar-custom">
            {sorted.map((ps, idx) => (
              <PlayerCard
                key={ps.playerId}
                stats={ps}
                playerName={getPlayerName(ps.playerId)}
                playerNumber={getPlayerNumber(ps.playerId)}
                position={getPlayerPosition(ps.playerId)}
                teamColor={getPlayerTeamColor(ps.playerId)}
                rank={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-custom">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-2">#</th>
                  <th className="text-left text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-2">Jugador</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">Pos</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">Min</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">G</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">A</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">T/TP</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">Pases%</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">Recup</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">🟨</th>
                  <th className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-3 px-1">Rating</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((ps, idx) => (
                  <tr
                    key={ps.playerId}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2.5 px-2 text-xs text-white/20 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{getPlayerName(ps.playerId)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-1 text-center text-[11px] text-white/40">{getPlayerPosition(ps.playerId)}</td>
                    <td className="py-2.5 px-1 text-center text-xs text-white/50 tabular-nums">{ps.minutesPlayed}'</td>
                    <td className="py-2.5 px-1 text-center text-xs font-bold tabular-nums">{ps.goals > 0 ? <span className="text-white">{ps.goals}</span> : <span className="text-white/20">0</span>}</td>
                    <td className="py-2.5 px-1 text-center text-xs font-bold tabular-nums">{ps.assists > 0 ? <span className="text-white">{ps.assists}</span> : <span className="text-white/20">0</span>}</td>
                    <td className="py-2.5 px-1 text-center text-xs text-white/50 tabular-nums">{ps.shotsOnTarget}/{ps.shots}</td>
                    <td className="py-2.5 px-1 text-center text-xs text-white/50 tabular-nums">{ps.passAccuracy.toFixed(0)}%</td>
                    <td className="py-2.5 px-1 text-center text-xs text-white/50 tabular-nums">{ps.tackles}</td>
                    <td className="py-2.5 px-1 text-center text-xs tabular-nums">{ps.yellowCards > 0 ? <span className="text-yellow-400">{'●'.repeat(ps.yellowCards)}</span> : <span className="text-white/15">-</span>}</td>
                    <td className="py-2.5 px-1 text-center">
                      <span className={`text-sm font-black ${ps.rating && ps.rating >= 7 ? 'rating-good' : ps.rating && ps.rating >= 6 ? 'rating-average' : 'rating-poor'}`}>
                        {ps.rating?.toFixed(1) || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsGrid;