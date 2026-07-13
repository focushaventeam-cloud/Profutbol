'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Match, LineupPlayer } from '@/types';

interface FormationViewProps {
  players: LineupPlayer[];
  formation: string;
  teamColor: string;
  isHome: boolean;
  teamName: string;
}

function getRatingClass(rating: number): string {
  if (rating >= 8) return 'rating-excellent';
  if (rating >= 7) return 'rating-good';
  if (rating >= 6) return 'rating-average';
  if (rating >= 5) return 'rating-poor';
  return 'rating-bad';
}

function PlayerMarker({
  player,
  teamColor,
  index,
}: {
  player: LineupPlayer;
  teamColor: string;
  index: number;
}) {
  const { player: p, position, substitutedIn, substitutedOut } = player;
  const y = position.y;

  const markerClasses = substitutedOut
    ? 'opacity-50 border-dashed'
    : substitutedIn
      ? 'ring-2 ring-blue-400 animate-pulse'
      : '';

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{
        left: `${position.x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.04,
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white transition-transform hover:scale-110 cursor-default ${markerClasses}`}
            style={{ backgroundColor: teamColor }}
          >
            {p.number}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="flex flex-col gap-1 rounded-lg border border-white/10 bg-gray-900/95 px-3 py-2 text-white shadow-lg"
        >
          <span className="text-sm font-semibold">{p.name}</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <span>{p.position}</span>
            <span className="text-gray-500">•</span>
            <span className={getRatingClass(p.rating)}>{p.rating.toFixed(1)}</span>
          </div>
          {substitutedIn && (
            <span className="text-[10px] text-blue-400">
              Entró min. {player.substitutedAtMinute}
            </span>
          )}
          {substitutedOut && (
            <span className="text-[10px] text-orange-400">
              Salió min. {player.substitutedAtMinute}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
      <span className="mt-0.5 max-w-[60px] truncate text-center text-[10px] font-medium text-white/90 drop-shadow-sm">
        {p.name}
      </span>
    </motion.div>
  );
}

export default function FormationView({
  players,
  formation,
  teamColor,
  isHome,
  teamName,
}: FormationViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{teamName}</span>
        <Badge
          variant="outline"
          className="border-white/20 bg-white/10 text-xs text-white/90"
        >
          {formation}
        </Badge>
      </div>

      <div className="pitch-gradient relative h-[350px] w-full overflow-hidden rounded-2xl sm:h-[400px] md:h-[500px]">
        {/* Center circle — dashed */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
          style={{ width: '20%', aspectRatio: '1' }}
        />

        {/* Center line — horizontal at 50% */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />

        {/* Center dot */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />

        {/* Top penalty area */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 border border-white/10"
          style={{ width: '18%', height: '17%' }}
        />

        {/* Top goal area */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 border border-white/10"
          style={{ width: '6%', height: '6%' }}
        />

        {/* Bottom penalty area */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 border border-white/10"
          style={{ width: '18%', height: '17%' }}
        />

        {/* Bottom goal area */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 border border-white/10"
          style={{ width: '6%', height: '6%' }}
        />

        {/* Top penalty arc hint */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-t-full border-x border-t border-dashed border-white/10"
          style={{ width: '10%', height: '5%', top: '17%' }}
        />

        {/* Bottom penalty arc hint */}
        <div
          className="pointer-events-none absolute bottom-[17%] left-1/2 -translate-x-1/2 rounded-b-full border-x border-b border-dashed border-white/10"
          style={{ width: '10%', height: '5%' }}
        />

        {/* Players */}
        {players.map((lp, index) => {
          const adjustedPlayer: LineupPlayer = {
            ...lp,
            position: {
              x: lp.position.x,
              y: isHome ? lp.position.y : 100 - lp.position.y,
            },
          };
          return (
            <PlayerMarker
              key={lp.player.id}
              player={adjustedPlayer}
              teamColor={teamColor}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}