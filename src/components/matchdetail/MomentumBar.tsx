'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Circle,
  Square,
  Eye,
  Zap,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import type { Match, MatchEvent } from '@/types';

// ---------- constantes de momentum ----------
const MOMENTUM_GOAL = 15;
const MOMENTUM_YELLOW = -5;
const MOMENTUM_RED = -15;
const MOMENTUM_VAR = -3;

// ---------- tipos internos ----------
interface MomentumPoint {
  minute: number;
  homeMomentum: number;
  awayMomentum: number;
  /** -1 = home dominates, 0 = neutral, 1 = away dominates */
  balance: number;
}

interface MarkerData {
  event: MatchEvent;
  minute: number;
  team: 'home' | 'away';
  type: 'goal' | 'yellow_card' | 'red_card' | 'var_review' | 'other';
  label: string;
  iconColor: string;
}

// ---------- props ----------
interface MomentumBarProps {
  match: Match;
}

// ---------- helpers ----------
function getMomentumDelta(event: MatchEvent): { team: 'home' | 'away'; delta: number } {
  const team = event.team;
  switch (event.type) {
    case 'goal':
    case 'penalty_goal':
    case 'own_goal':
      return { team, delta: MOMENTUM_GOAL };
    case 'yellow_card':
      return { team, delta: MOMENTUM_YELLOW };
    case 'red_card':
      return { team, delta: MOMENTUM_RED };
    case 'var_review':
      return { team, delta: MOMENTUM_VAR };
    default:
      return { team, delta: 0 };
  }
}

function getMarkerInfo(event: MatchEvent): Omit<MarkerData, 'minute' | 'team' | 'label'> & { label: string } {
  switch (event.type) {
    case 'goal':
    case 'penalty_goal':
      return { type: 'goal', label: 'Gol', iconColor: 'text-blue-400' };
    case 'own_goal':
      return { type: 'goal', label: 'Gol en contra', iconColor: 'text-blue-400' };
    case 'yellow_card':
      return { type: 'yellow_card', label: 'Tarjeta amarilla', iconColor: 'text-amber-400' };
    case 'red_card':
      return { type: 'red_card', label: 'Tarjeta roja', iconColor: 'text-red-400' };
    case 'var_review':
      return { type: 'var_review', label: 'Revisión VAR', iconColor: 'text-blue-400' };
    default:
      return { type: 'other', label: event.description, iconColor: 'text-white/40' };
  }
}

// ---------- componente principal ----------
export default function MomentumBar({ match }: MomentumBarProps) {
  const { momentumPoints, markers, totalMinutes } = useMemo(() => {
    const sorted = [...match.events]
      .filter((e) => e.type !== 'substitution' && e.type !== 'injury')
      .sort((a, b) => a.minute - b.minute);

    const maxMinute =
      match.status === 'finished' || match.status === 'halftime'
        ? Math.max(match.minute, 90)
        : Math.max(match.minute, 1);

    // Construir puntos de momentum cada minuto
    let homeAccum = 50;
    let awayAccum = 50;
    const points: MomentumPoint[] = [];

    // Mapeo de deltas por minuto
    const deltasByMinute = new Map<number, { team: 'home' | 'away'; delta: number }[]>();
    for (const event of sorted) {
      const d = getMomentumDelta(event);
      if (d.delta !== 0) {
        const existing = deltasByMinute.get(event.minute) ?? [];
        existing.push(d);
        deltasByMinute.set(event.minute, existing);
      }
    }

    for (let m = 0; m <= maxMinute; m++) {
      const deltas = deltasByMinute.get(m) ?? [];
      for (const d of deltas) {
        if (d.team === 'home') {
          homeAccum += d.delta;
          awayAccum -= d.delta * 0.5; // efecto contrario parcial
        } else {
          awayAccum += d.delta;
          homeAccum -= d.delta * 0.5;
        }
      }

      // Limitar rango
      homeAccum = Math.max(0, Math.min(100, homeAccum));
      awayAccum = Math.max(0, Math.min(100, awayAccum));

      const total = homeAccum + awayAccum || 1;
      // balance: -1 (todo home) a +1 (todo away)
      const balance = (awayAccum - homeAccum) / total;

      points.push({
        minute: m,
        homeMomentum: homeAccum,
        awayMomentum: awayAccum,
        balance,
      });
    }

    // Construir marcadores
    const mkrs: MarkerData[] = sorted.map((event) => {
      const info = getMarkerInfo(event);
      return {
        event,
        minute: event.minute,
        team: event.team,
        type: info.type,
        label: info.label,
        iconColor: info.iconColor,
      };
    });

    return { momentumPoints: points, markers: mkrs, totalMinutes: maxMinute };
  }, [match.events, match.minute, match.status]);

  // Calcular porcentaje total home vs away
  const lastPoint = momentumPoints[momentumPoints.length - 1];
  const homePct = lastPoint ? ((1 - lastPoint.balance) / 2) * 100 : 50;

  // Verificar si hay datos
  const hasEvents = match.events.some(
    (e) =>
      e.type === 'goal' ||
      e.type === 'penalty_goal' ||
      e.type === 'own_goal' ||
      e.type === 'yellow_card' ||
      e.type === 'red_card' ||
      e.type === 'var_review'
  );

  if (!hasEvents && match.status === 'scheduled') {
    return (
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-8 text-white/30 gap-3">
          <Activity className="h-10 w-10 opacity-40" />
          <p className="text-sm font-medium">Sin momentum</p>
          <p className="text-xs text-white/20">
            El momentum aparecerá cuando inicie el partido
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card p-4 sm:p-6"
    >
      {/* Título */}
      <div className="mb-5 flex items-center gap-2">
        <Zap className="h-4 w-4 text-blue-400" />
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Momentum del Partido
        </h3>
      </div>

      {/* Nombres de equipos */}
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1">
        <span className="text-xs font-bold text-blue-400 text-right truncate tracking-wide uppercase">
          {match.homeTeam.shortName}
        </span>
        <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-semibold">
          {totalMinutes}&apos;
        </span>
        <span className="text-xs font-bold text-blue-400 truncate tracking-wide uppercase">
          {match.awayTeam.shortName}
        </span>
      </div>

      {/* Barra de momentum principal */}
      <div className="relative mb-3">
        {/* Fondo de la barra */}
        <div className="relative h-10 w-full rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06]">
          {/* Gradiente base neutral en el centro */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.08] via-transparent to-blue-500/[0.08]" />

          {/* Barra de momentum home (izquierda) */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600/70 to-blue-500/50"
            initial={{ width: '50%' }}
            animate={{ width: `${homePct}%` }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ borderRadius: homePct >= 98 ? '0.75rem' : '0.75rem 0 0 0.75rem' }}
          />

          {/* Barra de momentum away (derecha) */}
          <motion.div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-blue-600/70 to-blue-500/50"
            initial={{ width: '50%' }}
            animate={{ width: `${100 - homePct}%` }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ borderRadius: 100 - homePct >= 98 ? '0.75rem' : '0 0.75rem 0.75rem 0' }}
          />

          {/* Línea central */}
          <motion.div
            className="absolute top-0 h-full w-px bg-white/20 z-10"
            initial={{ left: '50%' }}
            animate={{ left: `${homePct}%` }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Marcadores de eventos */}
          {markers.map((marker, i) => {
            const pct = (marker.minute / totalMinutes) * 100;
            const isHome = marker.team === 'home';

            return (
              <Tooltip key={marker.event.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.0 + i * 0.08,
                      ease: 'easeOut',
                    }}
                    className="absolute z-20 -translate-y-1/2 top-1/2 group cursor-pointer"
                    style={{ left: `${pct}%` }}
                  >
                    {/* Indicador de posición */}
                    <div className="relative flex flex-col items-center">
                      <div className="absolute -top-8 whitespace-nowrap text-[9px] font-bold text-white/50 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                        {marker.minute}&apos;
                      </div>
                      <MarkerIcon type={marker.type} colorClass={marker.iconColor} />
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={12}
                  className="bg-zinc-900/95 border border-white/10 text-white px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-white/90">
                      {marker.minute}&apos; — {marker.label}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        isHome ? 'text-blue-400' : 'text-blue-400'
                      }`}
                    >
                      {isHome ? match.homeTeam.shortName : match.awayTeam.shortName}
                      {marker.event.player ? ` · ${marker.event.player.name}` : ''}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Etiquetas de minuto debajo de la barra */}
        <div className="relative mt-1 h-4">
          {[0, 15, 30, 45, 60, 75, 90].map((m) => {
            if (m > totalMinutes) return null;
            const pct = (m / totalMinutes) * 100;
            return (
              <span
                key={m}
                className="absolute -translate-x-1/2 text-[9px] text-white/20 tabular-nums"
                style={{ left: `${pct}%` }}
              >
                {m}
              </span>
            );
          })}
          {/* Tiempo adicionado */}
          {totalMinutes > 90 && (
            <span
              className="absolute -translate-x-1/2 text-[9px] text-white/25 tabular-nums font-semibold"
              style={{ left: '100%' }}
            >
              {totalMinutes}
            </span>
          )}
        </div>
      </div>

      {/* Indicador de dominio actual */}
      <div className="mb-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-1.5"
        >
          <span
            className={`text-[11px] font-semibold ${
              homePct > 55
                ? 'text-blue-400'
                : homePct < 45
                  ? 'text-blue-400'
                  : 'text-white/40'
            }`}
          >
            {homePct > 58
              ? `${match.homeTeam.shortName} domina`
              : homePct < 42
                ? `${match.awayTeam.shortName} domina`
                : 'Equilibrio'}
          </span>
          <span className="text-[10px] text-white/20">·</span>
          <span className="text-[10px] text-white/30 tabular-nums">
            {Math.round(homePct)}% — {Math.round(100 - homePct)}%
          </span>
        </motion.div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <LegendItem
          icon={<GoalIcon />}
          label="Gol"
          colorClass="text-blue-400"
        />
        <LegendItem
          icon={<YellowCardIcon />}
          label="Amarilla"
          colorClass="text-amber-400"
        />
        <LegendItem
          icon={<RedCardIcon />}
          label="Roja"
          colorClass="text-red-400"
        />
        <LegendItem
          icon={<VarIcon />}
          label="VAR"
          colorClass="text-blue-400"
        />
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-sm bg-gradient-to-r from-blue-500/60 to-blue-400/30" />
          <span className="text-[10px] text-white/30">Local</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-sm bg-gradient-to-l from-blue-500/60 to-blue-400/30" />
          <span className="text-[10px] text-white/30">Visitante</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- sub-componentes de icono de marcador ----------
function MarkerIcon({ type, colorClass }: { type: string; colorClass: string }) {
  switch (type) {
    case 'goal':
      return (
        <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-white/10 ${colorClass}`}>
          <Circle className="h-3 w-3" fill="currentColor" />
        </div>
      );
    case 'yellow_card':
      return (
        <div className={`flex h-5 w-5 items-center justify-center rounded-sm bg-white/10 ${colorClass}`}>
          <div className="w-3 h-3.5 rounded-[2px] bg-amber-400" />
        </div>
      );
    case 'red_card':
      return (
        <div className={`flex h-5 w-5 items-center justify-center rounded-sm bg-white/10 ${colorClass}`}>
          <div className="w-3 h-3.5 rounded-[2px] bg-red-500" />
        </div>
      );
    case 'var_review':
      return (
        <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-white/10 ${colorClass}`}>
          <Eye className="h-3 w-3" />
        </div>
      );
    default:
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <Square className="h-2.5 w-2.5 text-white/40" />
        </div>
      );
  }
}

// ---------- íconos de leyenda ----------
function GoalIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-400/15">
      <Circle className="h-2 w-2 text-blue-400" fill="currentColor" />
    </div>
  );
}

function YellowCardIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-amber-400/15">
      <div className="w-2 h-2.5 rounded-[1px] bg-amber-400" />
    </div>
  );
}

function RedCardIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-red-400/15">
      <div className="w-2 h-2.5 rounded-[1px] bg-red-500" />
    </div>
  );
}

function VarIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-400/15">
      <Eye className="h-2 w-2 text-blue-400" />
    </div>
  );
}

// ---------- leyenda ----------
function LegendItem({
  icon,
  label,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className={`text-[10px] ${colorClass}`}>{label}</span>
    </div>
  );
}