import React from 'react';
import { motion } from 'framer-motion';
import { PlayerStats } from '../../types/player';
import { formatPercentage } from '../../utils/format';

interface PlayerCardProps {
  stats: PlayerStats;
  playerName: string;
  playerNumber: number;
  position: string;
  teamColor?: string;
  rank?: number;
  compact?: boolean;
}

function getRatingClass(rating?: number): string {
  if (!rating) return 'text-white/50';
  if (rating >= 8) return 'rating-excellent';
  if (rating >= 7) return 'rating-good';
  if (rating >= 6) return 'rating-average';
  if (rating >= 5) return 'rating-poor';
  return 'rating-bad';
}

function getRatingBg(rating?: number): string {
  if (!rating) return 'bg-white/5';
  if (rating >= 8) return 'bg-emerald-500/15 border-emerald-500/20';
  if (rating >= 7) return 'bg-lime-500/15 border-lime-500/20';
  if (rating >= 6) return 'bg-yellow-500/15 border-yellow-500/20';
  if (rating >= 5) return 'bg-orange-500/15 border-orange-500/20';
  return 'bg-red-500/15 border-red-500/20';
}

const positionColors: Record<string, string> = {
  GK: 'text-amber-400 bg-amber-400/10',
  DEF: 'text-blue-400 bg-blue-400/10',
  MID: 'text-emerald-400 bg-emerald-400/10',
  FWD: 'text-red-400 bg-red-400/10',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  stats,
  playerName,
  playerNumber,
  position,
  teamColor,
  rank,
  compact = false,
}) => {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors"
      >
        {rank && (
          <span className="text-xs font-bold text-white/20 w-5 text-center">{rank}</span>
        )}
        {/* Number badge */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
          style={{
            background: teamColor
              ? `linear-gradient(135deg, ${teamColor}50, ${teamColor}30)`
              : 'rgba(255,255,255,0.1)',
            border: `1px solid ${teamColor ? teamColor + '40' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {playerNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{playerName}</p>
          <p className="text-[10px] text-white/30">{position}</p>
        </div>
        {/* Mini stats */}
        <div className="flex items-center gap-2 text-[10px]">
          {(stats.goals > 0 || stats.assists > 0) && (
            <span className="text-white/50">
              {stats.goals > 0 && <span className="text-white/70 font-bold">{stats.goals}G</span>}
              {stats.goals > 0 && stats.assists > 0 && <span className="text-white/20 mx-0.5">·</span>}
              {stats.assists > 0 && <span className="text-white/70 font-bold">{stats.assists}A</span>}
            </span>
          )}
        </div>
        {/* Rating */}
        {stats.rating && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black border ${getRatingBg(stats.rating)} ${getRatingClass(stats.rating)}`}>
            {stats.rating.toFixed(1)}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-panel p-4 card-hover relative overflow-hidden group"
    >
      {/* Top glow accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: teamColor
            ? `linear-gradient(90deg, ${teamColor}, transparent)`
            : 'linear-gradient(90deg, rgba(59,130,246,0.5), transparent)',
        }}
      />

      <div className="flex items-start gap-4">
        {/* Player avatar area */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg"
            style={{
              background: teamColor
                ? `linear-gradient(135deg, ${teamColor}60, ${teamColor}30)`
                : 'rgba(255,255,255,0.1)',
              border: `2px solid ${teamColor ? teamColor + '50' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {playerNumber}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${positionColors[position] || 'text-white/40 bg-white/10'}`}>
            {position}
          </span>
        </div>

        {/* Info + Stats */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{playerName}</h4>
          <p className="text-[11px] text-white/30 mt-0.5">{stats.minutesPlayed}' jugados</p>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            <StatPill label="Goles" value={stats.goals} highlight={stats.goals > 0} />
            <StatPill label="Asist." value={stats.assists} highlight={stats.assists > 0} />
            <StatPill label="Tiros" value={`${stats.shotsOnTarget}/${stats.shots}`} />
            <StatPill label="Pases" value={formatPercentage(stats.passAccuracy)} />
            <StatPill label="Falta" value={stats.tackles} />
            <StatPill label="Interc." value={stats.interceptions} />
            <StatPill label="Amarilla" value={stats.yellowCards} highlight={stats.yellowCards > 0} color="text-yellow-400" />
            <StatPill label="Roja" value={stats.redCards} highlight={stats.redCards > 0} color="text-red-400" />
          </div>
        </div>

        {/* Rating badge */}
        {stats.rating && (
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${getRatingBg(stats.rating)}`}>
            <span className={`text-xl font-black ${getRatingClass(stats.rating)}`}>
              {stats.rating.toFixed(1)}
            </span>
            <span className="text-[8px] text-white/30 font-medium">RATING</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatPill: React.FC<{ label: string; value: string | number; highlight?: boolean; color?: string }> = ({
  label, value, highlight = false, color,
}) => (
  <div className="text-center p-1.5 rounded-lg bg-white/5">
    <p className={`text-sm font-bold tabular-nums ${highlight ? (color || 'text-white') : 'text-white/50'}`}>
      {value}
    </p>
    <p className="text-[8px] text-white/25 font-medium mt-0.5">{label}</p>
  </div>
);

export default PlayerCard;