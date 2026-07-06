'use client';

import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import FormationView from '@/components/lineups/FormationView';
import type { Match } from '@/types';

interface LineupsComparisonProps {
  match: Match;
}

export default function LineupsComparison({ match }: LineupsComparisonProps) {
  const { homeTeam, awayTeam, homeLineup, awayLineup, homeFormation, awayFormation } = match;

  const hasHomeLineup = homeLineup && homeLineup.length > 0;
  const hasAwayLineup = awayLineup && awayLineup.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card p-4 sm:p-6"
    >
      {/* Title */}
      <div className="mb-4 flex items-center gap-2 sm:mb-6">
        <Users className="h-4 w-4 text-emerald-400" />
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Alineaciones
        </h3>
      </div>

      {/* Two-column layout — stacks on mobile */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* Home team column */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] border border-white/15 select-none" style={{ backgroundColor: homeTeam.primaryColor }}>
              <span className="pointer-events-none">{homeTeam.logo}</span>
            </div>
            <span className="text-sm font-semibold text-white/90">
              {homeTeam.name}
            </span>
          </div>

          {hasHomeLineup ? (
            <FormationView
              players={homeLineup}
              formation={homeFormation}
              teamColor={homeTeam.primaryColor}
              isHome
              teamName={homeTeam.shortName}
            />
          ) : (
            <div className="flex h-[350px] w-full items-center justify-center rounded-2xl bg-white/5 sm:h-[400px] md:h-[500px]">
              <p className="text-sm text-white/40">Alineación no disponible</p>
            </div>
          )}
        </div>

        {/* Away team column */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] border border-white/15 select-none" style={{ backgroundColor: awayTeam.primaryColor }}>
              <span className="pointer-events-none">{awayTeam.logo}</span>
            </div>
            <span className="text-sm font-semibold text-white/90">
              {awayTeam.name}
            </span>
          </div>

          {hasAwayLineup ? (
            <FormationView
              players={awayLineup}
              formation={awayFormation}
              teamColor={awayTeam.primaryColor}
              isHome={false}
              teamName={awayTeam.shortName}
            />
          ) : (
            <div className="flex h-[350px] w-full items-center justify-center rounded-2xl bg-white/5 sm:h-[400px] md:h-[500px]">
              <p className="text-sm text-white/40">Alineación no disponible</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}