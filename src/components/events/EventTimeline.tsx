'use client';

import { motion } from 'framer-motion';
import {
  Circle,
  CircleOff,
  Square,
  ArrowLeftRight,
  Eye,
  Target,
  CalendarX,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MatchEvent, EventType } from '@/types';

// ---------- icon mapper ----------
const iconMap: Record<
  EventType,
  { Icon: typeof Circle; colorClass: string; bgClass: string }
> = {
  goal: {
    Icon: Circle,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/20',
  },
  own_goal: {
    Icon: CircleOff,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/20',
  },
  yellow_card: {
    Icon: Square,
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-400/20',
  },
  red_card: {
    Icon: Square,
    colorClass: 'text-red-400',
    bgClass: 'bg-red-400/20',
  },
  substitution: {
    Icon: ArrowLeftRight,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-400/20',
  },
  penalty_goal: {
    Icon: Target,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/20',
  },
  var_review: {
    Icon: Eye,
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-400/20',
  },
  injury: {
    Icon: Circle,
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-400/20',
  },
};

// ---------- props ----------
interface EventTimelineProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

// ---------- component ----------
export default function EventTimeline({
  events,
  homeTeamName,
  awayTeamName,
}: EventTimelineProps) {
  // sort chronologically
  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  if (sorted.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-3">
          <CalendarX className="h-10 w-10 opacity-40" />
          <p className="text-sm font-medium">Sin eventos</p>
          <p className="text-xs opacity-60">
            Los eventos del partido aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <ScrollArea className="max-h-96" type="scroll">
        {/* header row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 pb-3">
          <span className="text-xs font-semibold text-emerald-400 text-right truncate">
            {homeTeamName}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Min
          </span>
          <span className="text-xs font-semibold text-cyan-400 truncate">
            {awayTeamName}
          </span>
        </div>

        <Separator className="mb-2 opacity-20" />

        {/* timeline body */}
        <div className="relative event-line">
          {/* centre vertical line is handled by .event-line::before in CSS */}

          <div className="flex flex-col gap-1">
            {sorted.map((event, i) => {
              const { Icon, colorClass, bgClass } = iconMap[event.type];
              const isHome = event.team === 'home';
              const isSubstitution = event.type === 'substitution';
              const delay = i * 0.05;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay, ease: 'easeOut' }}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 min-h-[40px] py-1"
                >
                  {/* ---- HOME SIDE ---- */}
                  {isHome ? (
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <EventContent
                        event={event}
                        Icon={Icon}
                        colorClass={colorClass}
                        bgClass={bgClass}
                        isSubstitution={isSubstitution}
                        align="right"
                      />
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* ---- CENTRE MINUTE MARKER ---- */}
                  <div className="flex flex-col items-center justify-center z-10">
                    <Badge
                      variant="outline"
                      className="h-6 min-w-[36px] px-1.5 text-[10px] font-bold tabular-nums bg-white/5 border-white/10 text-foreground/80"
                    >
                      {event.minute}&apos;
                    </Badge>
                  </div>

                  {/* ---- AWAY SIDE ---- */}
                  {!isHome ? (
                    <div className="flex items-center gap-2 pl-2">
                      <EventContent
                        event={event}
                        Icon={Icon}
                        colorClass={colorClass}
                        bgClass={bgClass}
                        isSubstitution={isSubstitution}
                        align="left"
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------- event content sub-component ----------
function EventContent({
  event,
  Icon,
  colorClass,
  bgClass,
  isSubstitution,
  align,
}: {
  event: MatchEvent;
  Icon: typeof Circle;
  colorClass: string;
  bgClass: string;
  isSubstitution: boolean;
  align: 'left' | 'right';
}) {
  // For yellow/red cards, render a filled square instead of icon
  const isCard =
    event.type === 'yellow_card' || event.type === 'red_card';
  const cardBg =
    event.type === 'yellow_card'
      ? 'bg-amber-400'
      : event.type === 'red_card'
        ? 'bg-red-500'
        : '';

  return (
    <div
      className={`flex items-center gap-1.5 max-w-[180px] ${
        align === 'right' ? 'flex-row-reverse' : ''
      }`}
    >
      {/* icon */}
      <div
        className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-md ${bgClass}`}
      >
        {isCard ? (
          <div className={`w-3.5 h-4 rounded-[3px] ${cardBg}`} />
        ) : (
          <Icon className={`h-3.5 w-3.5 ${colorClass}`} strokeWidth={2} />
        )}
      </div>

      {/* text */}
      <div
        className={`flex flex-col min-w-0 ${
          align === 'right' ? 'items-end text-right' : 'items-start text-left'
        }`}
      >
        {isSubstitution ? (
          <SubstitutionText event={event} align={align} />
        ) : (
          <>
            {event.player && (
              <span className="text-xs font-semibold text-foreground/90 truncate leading-tight">
                {event.player.name}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground truncate leading-tight max-w-[140px]">
              {event.description}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- substitution sub-component ----------
function SubstitutionText({
  event,
  align,
}: {
  event: MatchEvent;
  align: 'left' | 'right';
}) {
  const playerInName = event.player?.name ?? '—';
  const playerOutName = event.playerOut?.name ?? '—';
  const direction = align === 'right' ? 'rtl' : 'ltr';

  return (
    <div
      className="flex items-center gap-1 text-[11px] leading-tight"
      dir={direction}
    >
      <span className="text-emerald-400 font-medium truncate max-w-[70px]">
        ↑ {playerInName}
      </span>
      <span className="text-muted-foreground/40 mx-0.5">→</span>
      <span className="text-muted-foreground truncate max-w-[70px] line-through decoration-muted-foreground/40">
        {playerOutName}
      </span>
    </div>
  );
}