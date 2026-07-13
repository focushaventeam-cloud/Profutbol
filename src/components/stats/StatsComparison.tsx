'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { MatchStats } from '@/types';

// ---------- stat definition ----------
interface StatRow {
  key: keyof MatchStats;
  label: string;
  suffix?: string;
  isNeutral?: boolean;
}

const statRows: StatRow[] = [
  { key: 'possession', label: 'Posesión', suffix: '%' },
  { key: 'shots', label: 'Tiros' },
  { key: 'shotsOnTarget', label: 'Tiros a puerta' },
  { key: 'passes', label: 'Pases' },
  { key: 'passAccuracy', label: 'Precisión pases', suffix: '%' },
  { key: 'fouls', label: 'Faltas', isNeutral: true },
  { key: 'corners', label: 'Córners' },
  { key: 'offsides', label: 'Fuera de juego', isNeutral: true },
  { key: 'yellowCards', label: 'Amarillas', isNeutral: true },
  { key: 'redCards', label: 'Rojas', isNeutral: true },
  { key: 'saves', label: 'Atajadas' },
];

interface StatsComparisonProps {
  homeStats: MatchStats;
  awayStats: MatchStats;
  homeTeamName: string;
  awayTeamName: string;
}

export default function StatsComparison({
  homeStats,
  awayStats,
  homeTeamName,
  awayTeamName,
}: StatsComparisonProps) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const hasData = statRows.some(
    (r) => homeStats[r.key] !== 0 || awayStats[r.key] !== 0
  );

  if (!hasData) {
    return (
      <div className="glass-card p-6">
        <div className="flex flex-col items-center justify-center py-8 text-white/30 gap-3">
          <p className="text-sm font-medium">Sin estadísticas</p>
          <p className="text-xs text-white/20">
            Las estadísticas aparecerán cuando inicie el partido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      {/* header with team names */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1 pb-4 mb-1 border-b border-white/5">
        <span className="text-xs font-bold text-blue-400 text-right truncate tracking-wide uppercase">
          {homeTeamName}
        </span>
        <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-semibold">
          vs
        </span>
        <span className="text-xs font-bold text-blue-400 truncate tracking-wide uppercase">
          {awayTeamName}
        </span>
      </div>

      {/* stat rows */}
      <div className="flex flex-col">
        {statRows.map((row, i) => {
          const homeVal = homeStats[row.key] as number;
          const awayVal = awayStats[row.key] as number;
          const total = homeVal + awayVal || 1;
          const homePct = (homeVal / total) * 100;
          const awayPct = (awayVal / total) * 100;
          const homeLeads = homeVal > awayVal;
          const isTie = homeVal === awayVal;
          const isNeutral = row.isNeutral ?? false;

          return (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03, ease: 'easeOut' }}
              className="group"
            >
              <div className="grid grid-cols-[3.5rem_1fr_auto_1fr_3.5rem] items-center gap-2 py-2.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors">
                {/* home value */}
                <span
                  className={`text-right text-sm font-bold tabular-nums ${
                    isNeutral || isTie
                      ? 'text-white/50'
                      : homeLeads
                        ? 'text-white font-extrabold'
                        : 'text-white/35'
                  }`}
                >
                  {homeVal}
                  {row.suffix ?? ''}
                </span>

                {/* home bar portion */}
                <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: isNeutral
                        ? 'rgba(148,163,184,0.25)'
                        : homeLeads
                          ? 'rgba(96,165,250,0.65)'
                          : 'rgba(96,165,250,0.2)',
                    }}
                    initial={{ width: '0%' }}
                    animate={animate ? { width: `${homePct}%` } : { width: '0%' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                {/* center label */}
                <span className="stat-label text-center min-w-[100px]">
                  {row.label}
                </span>

                {/* away bar portion */}
                <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full ml-auto"
                    style={{
                      backgroundColor: isNeutral
                        ? 'rgba(148,163,184,0.25)'
                        : !homeLeads
                          ? 'rgba(59,130,246,0.65)'
                          : 'rgba(59,130,246,0.2)',
                    }}
                    initial={{ width: '0%' }}
                    animate={animate ? { width: `${awayPct}%` } : { width: '0%' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                {/* away value */}
                <span
                  className={`text-left text-sm font-bold tabular-nums ${
                    isNeutral || isTie
                      ? 'text-white/50'
                      : !homeLeads
                        ? 'text-white font-extrabold'
                        : 'text-white/35'
                  }`}
                >
                  {awayVal}
                  {row.suffix ?? ''}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}