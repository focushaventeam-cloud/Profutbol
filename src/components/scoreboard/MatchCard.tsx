'use client';

import { motion } from 'framer-motion';
import { Match, MatchStatus } from '@/types';
import { useMatchStore } from '@/stores/matchStore';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Zap } from 'lucide-react';

function StatusBadge({ status, minute }: { status: MatchStatus; minute: number }) {
  switch (status) {
    case 'live':
      return (
        <Badge className="status-pill-live gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-lg">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
          </span>
          {minute}&apos;
        </Badge>
      );
    case 'halftime':
      return (
        <Badge className="status-pill-halftime px-2.5 py-0.5 text-[11px] font-semibold rounded-lg">
          MT
        </Badge>
      );
    case 'finished':
      return (
        <Badge className="status-pill-finished px-2.5 py-0.5 text-[11px] font-semibold rounded-lg">
          Final
        </Badge>
      );
    case 'scheduled':
      return (
        <Badge className="status-pill-scheduled px-2.5 py-0.5 text-[11px] font-semibold rounded-lg">
          Programado
        </Badge>
      );
  }
}

function TeamLogo({ logo, color, name }: { logo: string; color: string; name: string }) {
  return (
    <div className="relative group/logo select-none">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border border-white/10 shadow-lg transition-transform duration-300 group-hover/logo:scale-105"
        style={{ backgroundColor: color }}
        aria-label={name}
      >
        <span className="pointer-events-none">{logo}</span>
      </div>
    </div>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  const selectMatch = useMatchStore((s) => s.selectMatch);

  const kickoffTime = new Date(match.startTime).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLive = match.status === 'live';
  const homeLeading = match.homeScore > match.awayScore;
  const awayLeading = match.awayScore > match.homeScore;

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl border p-4 cursor-pointer card-3d
        transition-all duration-300 group
        ${isLive
          ? 'border-red-500/15 glass-live hover:border-red-500/25'
          : 'border-white/[0.06] glass-card card-spotlight hover:border-emerald-500/20'
        }
      `}
      onClick={() => selectMatch(match.id)}
      layout
    >
      {/* Ambient glow for live matches */}
      {isLive && (
        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-red-500/8 blur-[60px] pointer-events-none breathe-glow" />
      )}
      {/* Subtle top light for non-live */}
      {!isLive && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-60 rounded-full bg-emerald-500/[0.02] blur-[40px] pointer-events-none group-hover:bg-emerald-500/[0.04] transition-colors duration-500" />
      )}

      {/* League row */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3 h-3 text-white/25" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
          {match.league}
        </span>
      </div>

      {/* Main score row */}
      <div className="flex items-center justify-between gap-3">
        {/* Home team */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamLogo logo={match.homeTeam.logo} color={match.homeTeam.primaryColor} name={match.homeTeam.name} />
          <div className="min-w-0">
            <p className={`font-bold text-sm sm:text-base truncate transition-colors ${homeLeading ? 'text-emerald-400' : 'text-white'}`}>
              {match.homeTeam.shortName}
            </p>
            <p className="text-[11px] text-white/30 font-medium">Local</p>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2.5 px-2">
          <motion.span
            key={`home-${match.homeScore}-${match.id}`}
            initial={{ scale: 1.3, color: '#34d399' }}
            animate={{ scale: 1, color: homeLeading ? '#34d399' : '#ffffff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-3xl sm:text-4xl font-black tabular-nums w-8 text-center"
          >
            {match.homeScore}
          </motion.span>
          <span className="text-lg text-white/15 font-extralight">:</span>
          <motion.span
            key={`away-${match.awayScore}-${match.id}`}
            initial={{ scale: 1.3, color: '#34d399' }}
            animate={{ scale: 1, color: awayLeading ? '#34d399' : '#ffffff' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-3xl sm:text-4xl font-black tabular-nums w-8 text-center"
          >
            {match.awayScore}
          </motion.span>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className={`font-bold text-sm sm:text-base truncate transition-colors ${awayLeading ? 'text-emerald-400' : 'text-white'}`}>
              {match.awayTeam.shortName}
            </p>
            <p className="text-[11px] text-white/30 font-medium">Visitante</p>
          </div>
          <TeamLogo logo={match.awayTeam.logo} color={match.awayTeam.primaryColor} name={match.awayTeam.name} />
        </div>
      </div>

      {/* Status and info row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        <StatusBadge status={match.status} minute={match.minute} />
        <div className="flex items-center gap-3 text-[11px] text-white/30 font-medium">
          {match.status === 'scheduled' ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {kickoffTime}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="hidden sm:inline">{match.stadium}</span>
              <span className="sm:hidden">{match.stadium.split(' ')[0]}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}