import React from 'react';
import { Clock } from 'lucide-react';
import { formatMatchTime, getPeriodLabel } from '../../utils/time';
import { MatchStatus, MatchPeriod } from '../../types/match';

interface MatchTimerProps {
  currentTime: number;
  period: MatchPeriod;
  status: MatchStatus;
  addedTime: number;
}

export const MatchTimer: React.FC<MatchTimerProps> = ({
  currentTime,
  period,
  status,
  addedTime,
}) => {
  const isLive = status === 'live';
  const isHalftime = status === 'halftime';
  const isFinished = status === 'finished';

  const displayTime = isLive ? formatMatchTime(currentTime, addedTime) : formatMatchTime(currentTime, 0);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Main timer display */}
      <div
        className={`
          relative px-5 py-2.5 rounded-2xl font-mono text-2xl sm:text-3xl font-black tracking-tight
          transition-all duration-300
          ${isLive
            ? 'bg-gradient-to-b from-red-500/20 to-red-600/10 text-red-300 border border-red-500/30 shadow-lg shadow-red-500/10'
            : isHalftime
            ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 text-yellow-300 border border-yellow-500/30'
            : isFinished
            ? 'bg-gradient-to-b from-green-500/20 to-green-600/10 text-green-300 border border-green-500/30'
            : 'bg-white/5 text-white/70 border border-white/10'
          }
        `}
      >
        {isLive && (
          <div className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock size={16} className="opacity-60" />
          {displayTime}
        </div>
      </div>

      {/* Period label */}
      <span
        className={`
          text-[11px] font-bold uppercase tracking-widest
          ${isLive ? 'text-red-400/70' : isHalftime ? 'text-yellow-400/70' : 'text-white/30'}
        `}
      >
        {status === 'scheduled' ? 'Sin Iniciar' : getPeriodLabel(period)}
      </span>
    </div>
  );
};

export default MatchTimer;