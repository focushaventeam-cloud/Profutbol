import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ScoreDisplayProps {
  homeScore: number;
  awayScore: number;
  homeTeamName: string;
  awayTeamName: string;
  isLive: boolean;
  onScoreChange?: (team: 'home' | 'away', delta: number) => void;
  isAdmin?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  homeScore,
  awayScore,
  homeTeamName,
  awayTeamName,
  isLive,
  onScoreChange,
  isAdmin = false,
}) => {
  return (
    <div className="flex items-center gap-4 sm:gap-8">
      {/* Home Score */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdmin && isLive && onScoreChange && (
          <button
            onClick={() => onScoreChange('home', -1)}
            className="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 
                       transition-colors text-white/30"
          >
            <Minus size={14} />
          </button>
        )}
        <div
          className={`
            w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center
            font-black text-3xl sm:text-4xl lg:text-5xl tabular-nums
            transition-all duration-300 text-shadow-lg
            ${isLive
              ? 'bg-gradient-to-b from-blue-500/30 to-blue-600/10 text-white border-2 border-blue-500/30 shadow-xl shadow-blue-500/10'
              : 'bg-white/5 text-white/80 border border-white/10'
            }
          `}
        >
          {homeScore}
        </div>
        {isAdmin && isLive && onScoreChange && (
          <button
            onClick={() => onScoreChange('home', 1)}
            className="p-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 
                       transition-colors text-white/30"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Separator */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl sm:text-3xl font-light text-white/20">:</span>
        {isLive && (
          <span className="text-[9px] text-red-400/60 font-bold uppercase tracking-widest animate-pulse">
            Live
          </span>
        )}
      </div>

      {/* Away Score */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdmin && isLive && onScoreChange && (
          <button
            onClick={() => onScoreChange('away', -1)}
            className="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 
                       transition-colors text-white/30"
          >
            <Minus size={14} />
          </button>
        )}
        <div
          className={`
            w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center
            font-black text-3xl sm:text-4xl lg:text-5xl tabular-nums
            transition-all duration-300 text-shadow-lg
            ${isLive
              ? 'bg-gradient-to-b from-purple-500/30 to-purple-600/10 text-white border-2 border-purple-500/30 shadow-xl shadow-purple-500/10'
              : 'bg-white/5 text-white/80 border border-white/10'
            }
          `}
        >
          {awayScore}
        </div>
        {isAdmin && isLive && onScoreChange && (
          <button
            onClick={() => onScoreChange('away', 1)}
            className="p-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 
                       transition-colors text-white/30"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;