'use client';

import { motion } from 'framer-motion';
import { Crown, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { getTeamStandings } from '@/data/standingsData';

const formColors: Record<string, string> = {
  W: 'bg-emerald-500',
  D: 'bg-amber-500',
  L: 'bg-red-500',
};

const formLabels: Record<string, string> = {
  W: 'Victoria',
  D: 'Empate',
  L: 'Derrota',
};

export default function LeagueStandings() {
  const data = getTeamStandings();

  return (
    <div className="glass-card p-4 sm:p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-emerald-400" />
        <h3 className="text-base font-semibold text-white">Tabla de Posiciones</h3>
        <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold ml-auto">
          Jornada 20
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[580px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">#</th>
              <th className="text-left text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5">Equipo</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">PJ</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">G</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">E</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">P</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">GF</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-8">GC</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-10">DG</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-10">Pts</th>
              <th className="text-center text-[9px] font-bold text-white/30 uppercase tracking-wider pb-2.5 w-24">Forma</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => {
              const gd = row.goalsFor - row.goalsAgainst;
              const isTop4 = row.position <= 4;
              const isBottom = row.position === data.length;

              return (
                <motion.tr
                  key={row.teamId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className={`
                    border-b border-white/[0.03] cursor-pointer
                    transition-colors duration-200
                    hover:bg-white/[0.04]
                    ${isTop4 && !isBottom ? 'bg-emerald-500/[0.03]' : ''}
                    ${isBottom ? 'bg-red-500/[0.03]' : ''}
                  `}
                >
                  {/* Position */}
                  <td className="py-3 px-1 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {row.position === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20">
                          <Crown className="w-3 h-3 text-amber-400" />
                        </span>
                      ) : (
                        <span className={`
                          inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                          ${isTop4 ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/50'}
                          ${isBottom ? 'bg-red-500/10 text-red-400' : ''}
                        `}>
                          {row.position}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border border-white/10 select-none"
                        style={{ backgroundColor: row.primaryColor }}
                      >
                        <span className="pointer-events-none">{row.logo}</span>
                      </div>
                      <span className="text-sm font-semibold text-white/90 truncate max-w-[120px]">
                        {row.shortName}
                      </span>
                      {/* Position change */}
                      <span className="shrink-0">
                        {row.positionChange > 0 ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        ) : row.positionChange < 0 ? (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        ) : (
                          <Minus className="w-3 h-3 text-white/20" />
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="py-3 text-center text-sm tabular-nums text-white/60">{row.played}</td>
                  <td className="py-3 text-center text-sm tabular-nums text-white/80 font-medium">{row.won}</td>
                  <td className="py-3 text-center text-sm tabular-nums text-white/60">{row.drawn}</td>
                  <td className="py-3 text-center text-sm tabular-nums text-white/60">{row.lost}</td>
                  <td className="py-3 text-center text-sm tabular-nums text-white/60">{row.goalsFor}</td>
                  <td className="py-3 text-center text-sm tabular-nums text-white/60">{row.goalsAgainst}</td>

                  {/* Goal Difference */}
                  <td className="py-3 text-center text-sm tabular-nums font-bold">
                    <span className={gd > 0 ? 'text-emerald-400' : gd < 0 ? 'text-red-400' : 'text-white/50'}>
                      {gd > 0 ? `+${gd}` : gd}
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-3 text-center">
                    <span className={`
                      inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded-md text-sm font-black tabular-nums
                      ${row.position === 1
                        ? 'bg-amber-500/15 text-amber-400'
                        : isTop4
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/5 text-white/70'
                      }
                    `}>
                      {row.points}
                    </span>
                  </td>

                  {/* Form */}
                  <td className="py-3 px-1">
                    <div className="flex items-center justify-center gap-1" title={row.form.map(f => formLabels[f]).join(', ')}>
                      {row.form.map((f, fi) => (
                        <span
                          key={fi}
                          className={`w-2.5 h-2.5 rounded-full ${formColors[f]}`}
                        />
                      ))}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/30 border border-emerald-500/40" />
          <span className="text-[9px] text-white/30 font-medium">Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/30 border border-red-500/40" />
          <span className="text-[9px] text-white/30 font-medium">Descenso</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          {Object.entries(formLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${formColors[key]}`} />
              <span className="text-[9px] text-white/25">{label.charAt(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}