'use client';

import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import type { Match } from '@/types';

// ---------- types ----------
interface H2HEntry {
  date: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  /** Resultado desde la perspectiva del equipo local actual */
  result: 'V' | 'E' | 'D';
}

// ---------- componente ----------
interface HeadToHeadProps {
  match: Match;
}

function generateH2H(match: Match): H2HEntry[] {
  // Datos estáticos simulados — los 5 enfrentamientos más recientes
  const home = match.homeTeam.shortName;
  const away = match.awayTeam.shortName;

  // Resultado desde perspectiva del equipo local actual (match.homeTeam)
  const entries: H2HEntry[] = [
    {
      date: '14/09/2024',
      homeScore: 2,
      awayScore: 1,
      competition: 'Liga Profesional',
      result: 'V',
    },
    {
      date: '23/02/2024',
      homeScore: 1,
      awayScore: 1,
      competition: 'Liga Profesional',
      result: 'E',
    },
    {
      date: '12/08/2023',
      homeScore: 3,
      awayScore: 0,
      competition: 'Copa Argentina',
      result: 'V',
    },
    {
      date: '05/05/2023',
      homeScore: 0,
      awayScore: 2,
      competition: 'Liga Profesional',
      result: 'D',
    },
    {
      date: '29/10/2022',
      homeScore: 1,
      awayScore: 0,
      competition: 'Liga Profesional',
      result: 'V',
    },
  ];

  return entries;
}

function getResultLabel(r: H2HEntry, homeName: string, awayName: string): string {
  // Describe el resultado de forma legible
  if (r.result === 'E') return `${r.homeScore} - ${r.awayScore} Empate`;
  return `${r.homeScore} - ${r.awayScore}`;
}

// ---------- color helpers ----------
const resultColors: Record<'V' | 'E' | 'D', { bg: string; text: string; border: string; label: string }> = {
  V: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'V' },
  E: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'E' },
  D: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'D' },
};

// ---------- componente principal ----------
export default function HeadToHead({ match }: HeadToHeadProps) {
  const h2h = generateH2H(match);
  const homeName = match.homeTeam.shortName;
  const awayName = match.awayTeam.shortName;

  const wins = h2h.filter((e) => e.result === 'V').length;
  const draws = h2h.filter((e) => e.result === 'E').length;
  const losses = h2h.filter((e) => e.result === 'D').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card p-4 sm:p-6"
    >
      {/* Título */}
      <div className="mb-5 flex items-center gap-2">
        <Swords className="h-4 w-4 text-blue-400" />
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Enfrentamientos Directos
        </h3>
      </div>

      {/* Nombres de equipos */}
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1">
        <span className="text-xs font-bold text-blue-400 text-right truncate tracking-wide uppercase">
          {homeName}
        </span>
        <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-semibold">
          vs
        </span>
        <span className="text-xs font-bold text-blue-400 truncate tracking-wide uppercase">
          {awayName}
        </span>
      </div>

      {/* Resumen Victorias / Empates / Derrotas */}
      <div className="mb-5 flex items-center justify-center gap-4">
        <RecordPill
          count={wins}
          label="Victorias"
          colorKey="V"
        />
        <RecordPill
          count={draws}
          label="Empates"
          colorKey="E"
        />
        <RecordPill
          count={losses}
          label="Derrotas"
          colorKey="D"
        />
      </div>

      {/* Cuadrícula de resultados */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {h2h.map((entry, i) => {
          const colors = resultColors[entry.result];
          return (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.07, ease: 'easeOut' }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${colors.bg} ${colors.text} ${colors.border} select-none`}
            >
              {colors.label}
            </motion.div>
          );
        })}
      </div>

      {/* Tabla de resultados detallados */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
        {/* Encabezado */}
        <div className="grid grid-cols-[4.5rem_1fr_1fr_4.5rem] items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
            Fecha
          </span>
          <span className="text-[10px] text-blue-400/60 uppercase tracking-wider font-semibold text-right">
            {homeName}
          </span>
          <span className="text-[10px] text-blue-400/60 uppercase tracking-wider font-semibold">
            {awayName}
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold text-right">
            Comp.
          </span>
        </div>

        {/* Filas */}
        {h2h.map((entry, i) => {
          const colors = resultColors[entry.result];
          return (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
              className="grid grid-cols-[4.5rem_1fr_1fr_4.5rem] items-center gap-2 px-3 py-2.5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-[11px] text-white/40 tabular-nums">
                {entry.date}
              </span>
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-md px-1.5 text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {entry.homeScore}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-md px-1.5 text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {entry.awayScore}
                </span>
              </div>
              <span className="text-[10px] text-white/25 text-right truncate">
                {entry.competition}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Pie — texto descriptivo */}
      <p className="mt-4 text-center text-[11px] text-white/20 leading-relaxed">
        Últimos 5 enfrentamientos entre {match.homeTeam.name} y {match.awayTeam.name}
      </p>
    </motion.div>
  );
}

// ---------- sub-componente ----------
function RecordPill({
  count,
  label,
  colorKey,
}: {
  count: number;
  label: string;
  colorKey: 'V' | 'E' | 'D';
}) {
  const colors = resultColors[colorKey];
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 border ${colors.bg} ${colors.border}`}
    >
      <span className={`text-lg font-extrabold tabular-nums ${colors.text}`}>
        {count}
      </span>
      <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}