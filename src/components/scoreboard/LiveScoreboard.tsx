'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Match, MatchStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy } from 'lucide-react';
import ShareMatchButton from './ShareMatchButton';

function getMinuteDisplay(match: Match): string {
  if (match.status === 'scheduled') {
    return new Date(match.startTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (match.status === 'halftime') return 'MT';
  if (match.status === 'finished') return 'FT';
  if (match.addedTime > 0 && match.minute >= 45) {
    return `${match.minute}+${match.addedTime}'`;
  }
  return `${match.minute}'`;
}

function getStatusText(status: MatchStatus): string {
  switch (status) {
    case 'live': return 'EN VIVO';
    case 'halftime': return 'MEDIO TIEMPO';
    case 'finished': return 'FINALIZADO';
    case 'scheduled': return 'PROGRAMADO';
  }
}

function StatusColor({ status }: { status: MatchStatus }) {
  switch (status) {
    case 'live': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'halftime': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'finished': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

export default function LiveScoreboard({ match }: { match: Match }) {
  const homeLeading = match.homeScore > match.awayScore;
  const awayLeading = match.awayScore > match.homeScore;

  return (
    <div className="glass-deep rounded-2xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
      {/* Share button */}
      <div className="absolute top-3 right-3 z-10">
        <ShareMatchButton match={match} />
      </div>
      {/* Ambient inner glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-emerald-500/[0.04] blur-[80px] pointer-events-none" />
      {/* League */}
      <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
        <Trophy className="w-3.5 h-3.5" />
        {match.league}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 border-white/20 select-none"
            style={{ backgroundColor: match.homeTeam.primaryColor }}
          >
            <span className="pointer-events-none">{match.homeTeam.logo}</span>
          </div>
          <span
            className="font-bold text-sm sm:text-base truncate max-w-[140px]"
            style={{ color: homeLeading ? '#34d399' : undefined }}
          >
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`home-${match.homeScore}-${match.id}`}
                initial={{ scale: 1.5, y: -10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`text-6xl sm:text-7xl md:text-8xl font-black tabular-nums ${
                  homeLeading ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {match.homeScore}
              </motion.span>
            </AnimatePresence>

            <span className="text-3xl sm:text-4xl text-white/20 font-extralight">:</span>

            <AnimatePresence mode="popLayout">
              <motion.span
                key={`away-${match.awayScore}-${match.id}`}
                initial={{ scale: 1.5, y: -10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`text-6xl sm:text-7xl md:text-8xl font-black tabular-nums ${
                  awayLeading ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {match.awayScore}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Minute */}
          <div className="flex items-center gap-2">
            {match.status === 'live' && <span className="live-dot w-2.5 h-2.5" />}
            <span className="text-lg font-bold text-white/80">
              {getMinuteDisplay(match)}
            </span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 border-white/20 select-none"
            style={{ backgroundColor: match.awayTeam.primaryColor }}
          >
            <span className="pointer-events-none">{match.awayTeam.logo}</span>
          </div>
          <span
            className="font-bold text-sm sm:text-base truncate max-w-[140px]"
            style={{ color: awayLeading ? '#34d399' : undefined }}
          >
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <Badge className={`${StatusColor({ status: match.status })} px-4 py-1 text-xs font-semibold shadow-lg`}>
        {getStatusText(match.status)}
      </Badge>

      {/* Stadium */}
      <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs">
        <MapPin className="w-3 h-3" />
        {match.stadium}
      </div>
    </div>
  );
}