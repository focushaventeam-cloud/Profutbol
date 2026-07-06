import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Calendar, TrendingUp, Trophy, ChevronRight, Zap } from 'lucide-react';
import { Match } from '../types/match';
import Badge from '../components/ui/Badge';
import TeamBadge from '../components/scoreboard/TeamBadge';
import AdBanner from '../components/ads/AdBanner';

interface DashboardProps {
  matches: Match[];
  onMatchSelect: (matchId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ matches, onMatchSelect }) => {
  const liveMatches = matches.filter((m) => m.status === 'live');
  const scheduledMatches = matches.filter((m) => m.status === 'scheduled');
  const finishedMatches = matches.filter((m) => m.status === 'finished');

  const quickStats = [
    {
      label: 'En Vivo',
      value: liveMatches.length,
      icon: <Radio size={18} className="text-red-400" />,
      gradient: 'from-red-500/20 to-red-600/5 border-red-500/20',
    },
    {
      label: 'Programados',
      value: scheduledMatches.length,
      icon: <Calendar size={18} className="text-blue-400" />,
      gradient: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    },
    {
      label: 'Finalizados',
      value: finishedMatches.length,
      icon: <Trophy size={18} className="text-emerald-400" />,
      gradient: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    },
    {
      label: 'Total Goles',
      value: matches.reduce((sum, m) => sum + m.homeScore + m.awayScore, 0),
      icon: <TrendingUp size={18} className="text-purple-400" />,
      gradient: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome + Stats */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white text-shadow-sm">
          Panel de Control
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Resumen de la jornada — {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-4 bg-gradient-to-br ${stat.gradient}`}
          >
            <div className="flex items-center justify-between">
              {stat.icon}
              <Zap size={14} className="text-white/10" />
            </div>
            <p className="text-3xl font-black text-white mt-3 tabular-nums">{stat.value}</p>
            <p className="text-xs text-white/40 font-semibold mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Ad Banner */}
      <AdBanner className="hidden sm:block" />

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">En Vivo</h3>
          </div>
          <div className="space-y-3">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} onClick={() => onMatchSelect(match.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Matches */}
      {scheduledMatches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar size={14} />
            Próximos Partidos
          </h3>
          <div className="space-y-3">
            {scheduledMatches.map((match) => (
              <MatchCard key={match.id} match={match} onClick={() => onMatchSelect(match.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Finished Matches */}
      {finishedMatches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy size={14} />
            Resultados
          </h3>
          <div className="space-y-3">
            {finishedMatches.map((match) => (
              <MatchCard key={match.id} match={match} onClick={() => onMatchSelect(match.id)} />
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <Trophy size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 font-medium">No hay partidos disponibles</p>
          <p className="text-xs text-white/20 mt-1">Los partidos aparecerán aquí cuando se programen</p>
        </div>
      )}
    </div>
  );
};

/* Match Card Sub-Component */
const MatchCard: React.FC<{ match: Match; onClick: () => void }> = ({ match, onClick }) => {
  const statusVariant = match.status === 'live' ? 'live'
    : match.status === 'finished' ? 'finished'
    : match.status === 'halftime' ? 'halftime'
    : match.status === 'postponed' ? 'postponed'
    : 'scheduled';

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full glass-panel p-4 text-left hover:bg-white/15 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
              style={{
                background: `linear-gradient(135deg, ${match.homeTeam.primaryColor}40, ${match.homeTeam.primaryColor}20)`,
                border: `1.5px solid ${match.homeTeam.primaryColor}50`,
              }}
            >
              {match.homeTeam.shortName.substring(0, 3)}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{match.homeTeam.name}</p>
            <p className="text-[11px] text-white/30">{match.awayTeam.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center">
            <span className="text-lg font-black text-white tabular-nums">
              {match.homeScore} - {match.awayScore}
            </span>
          </div>
          <Badge variant={statusVariant} pulse={match.status === 'live'} />
          <ChevronRight
            size={16}
            className="text-white/20 group-hover:text-white/50 transition-colors"
          />
        </div>
      </div>
    </motion.button>
  );
};

export default Dashboard;