'use client';

import { motion } from 'framer-motion';
import { useMatchStore } from '@/stores/matchStore';
import { players, getTeam } from '@/data/mockData';
import LeagueStandings from '@/components/stats/LeagueStandings';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Radio,
  BarChart3,
  CircleDot,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  Shield,
  Crown,
  Activity,
  Calendar,
  Trophy,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ================================================================== */
/*  STATS VIEW                                                         */
/* ================================================================== */

export default function StatsView() {
  const matches = useMatchStore((s) => s.matches);
  const getLiveMatches = useMatchStore((s) => s.getLiveMatches);
  const getFinishedMatches = useMatchStore((s) => s.getFinishedMatches);

  const liveMatches = getLiveMatches();
  const finishedMatches = getFinishedMatches();

  const totalMatches = matches.length;
  const totalGoals = matches.reduce(
    (sum, m) => sum + m.homeScore + m.awayScore,
    0
  );
  const avgGoals =
    totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : '0.0';
  const totalYellowCards = matches.reduce(
    (sum, m) => sum + m.homeStats.yellowCards + m.awayStats.yellowCards,
    0
  );

  // Top scorers: sort players by goals desc, take top 10
  const topScorers = [...players]
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 10);

  // MVP: highest rated player
  const mvp = [...players].sort((a, b) => b.rating - a.rating)[0];

  // Top assists
  const topAssists = [...players]
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 5);

  return (
    <motion.div
      {...fadeUp}
      className="space-y-6"
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
          Estadísticas Globales
        </h1>
      </div>

      {/* Stat Cards Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            label="Partidos"
            value={totalMatches}
            icon={<Calendar className="w-5 h-5 text-cyan-400" />}
            accent="cyan"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="En Vivo"
            value={liveMatches.length}
            icon={<Radio className="w-5 h-5 text-red-400" />}
            accent="red"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Finalizados"
            value={finishedMatches.length}
            icon={<CircleDot className="w-5 h-5 text-slate-400" />}
            accent="slate"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Goles Totales"
            value={totalGoals}
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            accent="emerald"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Promedio Goles"
            value={avgGoals}
            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
            accent="amber"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            label="Tarjetas Amarillas"
            value={totalYellowCards}
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            accent="yellow"
          />
        </motion.div>
      </motion.div>

      {/* MVP Card + Top Assists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MVP Card */}
        {mvp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Jugador Destacado
            </h2>
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/10 via-[#0f1525] to-transparent p-5">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 flex items-center justify-center">
                    <span className="text-2xl font-black text-amber-400 tabular-nums">{mvp.rating.toFixed(1)}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Crown className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-white truncate">{mvp.name}</p>
                  <p className="text-sm text-white/50">{getTeam(mvp.teamId)?.name ?? ''} · {mvp.position}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Target className="w-3 h-3 text-emerald-400" /> {mvp.goals} goles
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-cyan-400" /> {mvp.assists} asist.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Assists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Mejores Asistencias
          </h2>
          <div className="glass-card p-4 space-y-3">
            {topAssists.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">Sin asistencias aún</p>
            ) : (
              topAssists.map((player, i) => (
                <div key={player.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/80 flex-1 truncate font-medium">{player.name}</span>
                  <span className="text-xs text-white/40">{getTeam(player.teamId)?.shortName}</span>
                  <span className="text-sm font-bold text-cyan-400 tabular-nums w-5 text-right">{player.assists}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Scorers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          Tabla de Goleadores
        </h2>

        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2.5rem_1fr_5rem_3.5rem_3.5rem_3.5rem] gap-2 px-4 py-3 border-b border-white/5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            <span className="text-center">#</span>
            <span>Jugador</span>
            <span className="text-center">Equipo</span>
            <span className="text-center">Goles</span>
            <span className="text-center">Asist.</span>
            <span className="text-center">Rating</span>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {topScorers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/30 gap-2">
                <Target className="w-8 h-8" />
                <span className="text-sm">Sin goleadores aún</span>
              </div>
            ) : (
              topScorers.map((player, index) => {
                const team = getTeam(player.teamId);
                const rank = index + 1;

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className={`grid grid-cols-[2.5rem_1fr_5rem_3.5rem_3.5rem_3.5rem] gap-2 items-center px-4 py-2.5 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${
                      rank <= 3 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <span className="text-center">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 text-xs font-bold">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                          3
                        </span>
                      ) : (
                        <span className="text-white/40 text-xs font-medium tabular-nums">
                          {rank}
                        </span>
                      )}
                    </span>

                    {/* Player Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-white/90 truncate">
                        {player.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="h-4 px-1 text-[9px] font-semibold bg-white/5 border-white/10 text-white/40 shrink-0"
                      >
                        {player.position}
                      </Badge>
                    </div>

                    {/* Team */}
                    <span className="text-xs text-white/50 text-center truncate">
                      {team?.shortName ?? '—'}
                    </span>

                    {/* Goals */}
                    <span className="text-sm font-bold text-emerald-400 text-center tabular-nums">
                      {player.goals}
                    </span>

                    {/* Assists */}
                    <span className="text-sm font-medium text-cyan-400 text-center tabular-nums">
                      {player.assists}
                    </span>

                    {/* Rating */}
                    <span className="text-sm font-medium text-white/70 text-center tabular-nums">
                      {player.rating.toFixed(1)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          Últimos Resultados
        </h2>

        {finishedMatches.length === 0 ? (
          <div className="glass-card p-8 flex flex-col items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-white/15" />
            <p className="text-white/40 text-sm">No hay partidos finalizados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {finishedMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="glass-card p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/30 transition-all"
                onClick={() =>
                  useMatchStore.getState().selectMatch(match.id)
                }
              >
                {/* Home team */}
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-sm font-medium text-white/80 truncate text-right">
                    {match.homeTeam.shortName}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 select-none"
                    style={{ backgroundColor: match.homeTeam.primaryColor }}
                  >
                    <span className="pointer-events-none">{match.homeTeam.logo}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 px-3 shrink-0">
                  <span className="text-xl font-black text-white tabular-nums w-6 text-center">
                    {match.homeScore}
                  </span>
                  <span className="text-lg text-white/20 font-light">-</span>
                  <span className="text-xl font-black text-white tabular-nums w-6 text-center">
                    {match.awayScore}
                  </span>
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 select-none"
                    style={{ backgroundColor: match.awayTeam.primaryColor }}
                  >
                    <span className="pointer-events-none">{match.awayTeam.logo}</span>
                  </div>
                  <span className="text-sm font-medium text-white/80 truncate">
                    {match.awayTeam.shortName}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* League Standings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <LeagueStandings />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Stats sub-component ---------- */

function StatCard({
  label,
  value,
  icon,
  accent = 'emerald',
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
}) {
  const accentMap: Record<string, string> = {
    emerald: 'from-emerald-500/10 to-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20',
    red: 'from-red-500/10 to-red-500/[0.02] border-red-500/10 hover:border-red-500/20',
    cyan: 'from-cyan-500/10 to-cyan-500/[0.02] border-cyan-500/10 hover:border-cyan-500/20',
    amber: 'from-amber-500/10 to-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/20',
    slate: 'from-slate-500/10 to-slate-500/[0.02] border-slate-500/10 hover:border-slate-500/20',
    yellow: 'from-yellow-500/10 to-yellow-500/[0.02] border-yellow-500/10 hover:border-yellow-500/20',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${accentMap[accent]} border p-5 flex items-start gap-4 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-white/[0.03] blur-2xl pointer-events-none group-hover:bg-white/[0.05] transition-colors duration-500" />
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
          {label}
        </span>
        <span className="text-2xl sm:text-3xl font-black text-white/95 tabular-nums leading-tight tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}