import React from 'react';
import { MatchStats } from '../../types/match';
import { formatPercentage } from '../../utils/format';

interface StatsBarProps {
  label: string;
  home: number;
  away: number;
  homeLabel?: string;
  awayLabel?: string;
  icon?: React.ReactNode;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  label,
  home,
  away,
  icon,
}) => {
  const total = home + away;
  const homePercent = total > 0 ? (home / total) * 100 : 50;
  const awayPercent = total > 0 ? (away / total) * 100 : 50;
  const isPercentage = label.toLowerCase().includes('posesión') || 
                       label.toLowerCase().includes('precisión') ||
                       label.toLowerCase().includes('accuracy');

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-white/90 tabular-nums w-12 text-right">
          {isPercentage ? formatPercentage(home) : home}
        </span>
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5 px-2">
          {icon}
          {label}
        </span>
        <span className="text-sm font-bold text-white/90 tabular-nums w-12">
          {isPercentage ? formatPercentage(away) : away}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5 gap-px">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full transition-all duration-700 ease-out group-hover:from-blue-400 group-hover:to-blue-300"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-gradient-to-l from-purple-500 to-purple-400 rounded-r-full transition-all duration-700 ease-out group-hover:from-purple-400 group-hover:to-purple-300"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
};

export default StatsBar;