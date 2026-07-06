import React from 'react';
import {
  Target, Crosshair, Navigation, AlertCircle,
  Pause, Flag, CircleDot, Footprints, TrendingUp,
} from 'lucide-react';
import { MatchStats } from '../../types/match';
import StatsBar from './StatsBar';

interface StatsComparisonProps {
  stats: MatchStats;
  homeTeamName: string;
  awayTeamName: string;
}

export const StatsComparison: React.FC<StatsComparisonProps> = ({
  stats,
  homeTeamName,
  awayTeamName,
}) => {
  const statItems = [
    {
      key: 'possession' as const,
      label: 'Posesión',
      home: stats.possession.home,
      away: stats.possession.away,
      icon: <Target size={12} />,
    },
    {
      key: 'shots' as const,
      label: 'Tiros',
      home: stats.shots.home,
      away: stats.shots.away,
      icon: <Crosshair size={12} />,
    },
    {
      key: 'shotsOnTarget' as const,
      label: 'Tiros a Puerta',
      home: stats.shotsOnTarget.home,
      away: stats.shotsOnTarget.away,
      icon: <Target size={12} />,
    },
    {
      key: 'corners' as const,
      label: 'Córners',
      home: stats.corners.home,
      away: stats.corners.away,
      icon: <Navigation size={12} />,
    },
    {
      key: 'fouls' as const,
      label: 'Faltas',
      home: stats.fouls.home,
      away: stats.fouls.away,
      icon: <AlertCircle size={12} />,
    },
    {
      key: 'offsides' as const,
      label: 'Fuera de Juego',
      home: stats.offsides.home,
      away: stats.offsides.away,
      icon: <Flag size={12} />,
    },
    {
      key: 'yellowCards' as const,
      label: 'Tarjetas Amarillas',
      home: stats.yellowCards.home,
      away: stats.yellowCards.away,
      icon: <CircleDot size={12} className="text-yellow-400" />,
    },
    {
      key: 'redCards' as const,
      label: 'Tarjetas Rojas',
      home: stats.redCards.home,
      away: stats.redCards.away,
      icon: <Pause size={12} className="text-red-400" />,
    },
    {
      key: 'passes' as const,
      label: 'Pases',
      home: stats.passes.home,
      away: stats.passes.away,
      icon: <Footprints size={12} />,
    },
    {
      key: 'passAccuracy' as const,
      label: 'Precisión Pases',
      home: stats.passAccuracy.home,
      away: stats.passAccuracy.away,
      icon: <TrendingUp size={12} />,
    },
  ];

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-pink-500" />
          Estadísticas en Vivo
        </h3>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-semibold text-blue-400">{homeTeamName}</span>
          <span className="text-xs font-semibold text-purple-400">{awayTeamName}</span>
        </div>
      </div>

      {/* Stats list */}
      <div className="p-5 space-y-4">
        {statItems.map((item) => (
          <StatsBar
            key={item.key}
            label={item.label}
            home={item.home}
            away={item.away}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsComparison;