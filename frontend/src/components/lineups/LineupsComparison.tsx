import React from 'react';
import { Lineup } from '../../types/team';
import FormationView from './FormationView';

interface LineupsComparisonProps {
  homeLineup: Lineup;
  awayLineup: Lineup;
  homeTeamName: string;
  awayTeamName: string;
  homeColor: string;
  awayColor: string;
}

export const LineupsComparison: React.FC<LineupsComparisonProps> = ({
  homeLineup,
  awayLineup,
  homeTeamName,
  awayTeamName,
  homeColor,
  awayColor,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500" />
        <h3 className="text-base font-bold text-white">Alineaciones</h3>
        <span className="text-xs text-white/30 ml-2">Toca un jugador para ver detalles</span>
      </div>

      {/* Formations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormationView
          lineup={homeLineup}
          teamName={homeTeamName}
          teamColor={homeColor}
        />
        <FormationView
          lineup={awayLineup}
          teamName={awayTeamName}
          teamColor={awayColor}
          flip
        />
      </div>
    </div>
  );
};

export default LineupsComparison;