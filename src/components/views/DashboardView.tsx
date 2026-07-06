'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMatchStore } from '@/stores/matchStore';
import MatchCard from '@/components/scoreboard/MatchCard';
import CreateMatchDialog from '@/components/scoreboard/CreateMatchDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Radio,
  Flame,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Search,
  MapPin,
} from 'lucide-react';
import type { Match } from '@/types';

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

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function filterMatches(matches: Match[], query: string) {
  if (!query.trim()) return matches;
  const q = query.toLowerCase();
  return matches.filter(
    (m) =>
      m.homeTeam.name.toLowerCase().includes(q) ||
      m.awayTeam.name.toLowerCase().includes(q) ||
      m.homeTeam.shortName.toLowerCase().includes(q) ||
      m.awayTeam.shortName.toLowerCase().includes(q) ||
      m.league.toLowerCase().includes(q) ||
      m.stadium.toLowerCase().includes(q)
  );
}

/* ================================================================== */
/*  DashboardView                                                      */
/* ================================================================== */

export default function DashboardView() {
  const matches = useMatchStore((s) => s.matches);
  const getLiveMatches = useMatchStore((s) => s.getLiveMatches);
  const getFinishedMatches = useMatchStore((s) => s.getFinishedMatches);
  const getScheduledMatches = useMatchStore((s) => s.getScheduledMatches);
  const selectMatch = useMatchStore((s) => s.selectMatch);
  const [searchQuery, setSearchQuery] = useState('');

  const liveMatches = getLiveMatches();
  const finishedMatches = getFinishedMatches();
  const scheduledMatches = getScheduledMatches();

  const totalGoals = matches.reduce(
    (sum, m) => sum + m.homeScore + m.awayScore,
    0
  );
  const avgGoals =
    matches.length > 0 ? (totalGoals / matches.length).toFixed(1) : '0.0';

  return (
    <motion.div
      {...fadeUp}
      className="space-y-6"
    >
      {/* Hero: Featured Live Match */}
      {liveMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-[#0f1525] to-transparent cursor-pointer group gradient-border"
          onClick={() => selectMatch(liveMatches[0].id)}
        >
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-500/10 blur-[80px] pointer-events-none group-hover:bg-red-500/15 transition-colors duration-700" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/8 blur-[80px] pointer-events-none" />

          <div className="relative p-5 sm:p-6">
            {/* Live indicator row */}
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-extrabold text-red-400 tracking-[0.15em] uppercase">
                EN VIVO
              </span>
              <Separator orientation="vertical" className="h-4 bg-red-500/20" />
              <span className="text-xs text-white/50 font-medium">
                {liveMatches[0].league}
              </span>
              {liveMatches.length > 1 && (
                <Badge variant="outline" className="ml-auto border-red-500/20 bg-red-500/10 text-red-400 text-[10px] font-bold px-2">
                  +{liveMatches.length - 1} más
                </Badge>
              )}
            </div>

            {/* Featured Match Scoreboard */}
            <div className="flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 border-white/10 shadow-lg shrink-0 select-none" style={{ backgroundColor: liveMatches[0].homeTeam.primaryColor }}>
                  <span className="pointer-events-none">{liveMatches[0].homeTeam.logo}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">{liveMatches[0].homeTeam.name}</p>
                  <p className="text-[11px] text-white/40 font-medium">Local</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                  <motion.span
                    key={`feat-h-${liveMatches[0].homeScore}`}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-4xl sm:text-5xl font-black text-white tabular-nums"
                  >
                    {liveMatches[0].homeScore}
                  </motion.span>
                  <span className="text-2xl sm:text-3xl text-white/20 font-extralight">:</span>
                  <motion.span
                    key={`feat-a-${liveMatches[0].awayScore}`}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-4xl sm:text-5xl font-black text-white tabular-nums"
                  >
                    {liveMatches[0].awayScore}
                  </motion.span>
                </div>
                <span className="text-sm font-bold text-red-400 tabular-nums">
                  {liveMatches[0].minute}&apos;
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <p className="font-bold text-white text-sm sm:text-base truncate">{liveMatches[0].awayTeam.name}</p>
                  <p className="text-[11px] text-white/40 font-medium">Visitante</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 border-white/10 shadow-lg shrink-0 select-none" style={{ backgroundColor: liveMatches[0].awayTeam.primaryColor }}>
                  <span className="pointer-events-none">{liveMatches[0].awayTeam.logo}</span>
                </div>
              </div>
            </div>

            {/* Stadium info + Goal Scorers */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                <MapPin className="w-3 h-3" />
                {liveMatches[0].stadium}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                {liveMatches[0].events.filter(e => e.type === 'goal' && e.team === 'home').map(e => (
                  <span key={e.id} className="text-blue-400/80 font-medium">⚽ {e.player?.name.split(' ').pop() ?? ''} {e.minute}&apos;</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                {liveMatches[0].events.filter(e => e.type === 'goal' && e.team === 'away').map(e => (
                  <span key={e.id} className="text-blue-400/80 font-medium">⚽ {e.player?.name.split(' ').pop() ?? ''} {e.minute}&apos;</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Title + Search + Create */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10">
            <Flame className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Partidos</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-36 sm:w-52 rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.07] focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          {/* Create Match */}
          <CreateMatchDialog />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 h-10">
          <TabsTrigger
            value="todos"
            className="text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/20"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="envivo"
            className="text-white/60 data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 data-[state=active]:border-red-500/20"
          >
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              En Vivo
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="finalizados"
            className="text-white/60 data-[state=active]:bg-slate-500/15 data-[state=active]:text-slate-300 data-[state=active]:border-slate-500/20"
          >
            Finalizados
          </TabsTrigger>
          <TabsTrigger
            value="programados"
            className="text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/20"
          >
            Programados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <MatchGrid matches={filterMatches(matches, searchQuery)} />
        </TabsContent>
        <TabsContent value="envivo" className="mt-4">
          <MatchGrid matches={filterMatches(liveMatches, searchQuery)} />
        </TabsContent>
        <TabsContent value="finalizados" className="mt-4">
          <MatchGrid matches={filterMatches(finishedMatches, searchQuery)} />
        </TabsContent>
        <TabsContent value="programados" className="mt-4">
          <MatchGrid matches={filterMatches(scheduledMatches, searchQuery)} />
        </TabsContent>
      </Tabs>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Resumen Rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            label="Partidos"
            value={matches.length}
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            accent="cyan"
          />
          <SummaryCard
            label="En Vivo"
            value={liveMatches.length}
            icon={<Radio className="w-5 h-5 text-red-400" />}
            accent="red"
          />
          <SummaryCard
            label="Goles Totales"
            value={totalGoals}
            icon={<Target className="w-5 h-5 text-blue-400" />}
            accent="emerald"
          />
          <SummaryCard
            label="Promedio Goles"
            value={avgGoals}
            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
            accent="amber"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Dashboard sub-components ---------- */

function MatchGrid({ matches }: { matches: { id: string; [key: string]: unknown }[] }) {
  if (matches.length === 0) {
    return (
      <motion.div
        {...fadeUp}
        className="glass-card p-12 flex flex-col items-center justify-center gap-3"
      >
        <Calendar className="w-12 h-12 text-white/20" />
        <p className="text-white/40 text-sm">No hay partidos en esta categoría</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {matches.map((match) => (
        <motion.div key={match.id} variants={staggerItem}>
          <MatchCard match={match as Match} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function SummaryCard({
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
    emerald: 'from-blue-500/10 to-blue-500/5 border-blue-500/10',
    red: 'from-red-500/10 to-red-500/5 border-red-500/10',
    cyan: 'from-blue-500/10 to-blue-500/5 border-blue-500/10',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/10',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${accentMap[accent]} border p-4 flex flex-col gap-2.5 group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/[0.03] blur-xl pointer-events-none" />
      <div className="flex items-center gap-2 text-white/40">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">{label}</span>
      </div>
      <span className="text-2xl sm:text-3xl font-black text-white/95 tabular-nums tracking-tight">{value}</span>
    </div>
  );
}