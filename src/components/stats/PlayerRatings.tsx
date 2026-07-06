'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Player } from '@/types';

// ---------- props ----------
interface PlayerRatingsProps {
  players: { player: Player; isSubstitute: boolean }[];
  teamName: string;
  teamColor: string;
}

// ---------- helpers ----------
function ratingTier(rating: number) {
  if (rating >= 8) return 'excellent';
  if (rating >= 7) return 'good';
  if (rating >= 6) return 'average';
  if (rating >= 5) return 'poor';
  return 'bad';
}

const tierColors: Record<string, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-cyan-500',
  average: 'bg-amber-500',
  poor: 'bg-orange-500',
  bad: 'bg-red-500',
};

const tierGlow: Record<string, string> = {
  excellent: 'shadow-[0_0_10px_rgba(16,185,129,0.4)]',
  good: 'shadow-[0_0_8px_rgba(34,211,238,0.3)]',
  average: 'shadow-[0_0_6px_rgba(245,158,11,0.25)]',
  poor: 'shadow-[0_0_6px_rgba(249,115,22,0.25)]',
  bad: 'shadow-[0_0_6px_rgba(239,68,68,0.3)]',
};

const positionLabel: Record<string, string> = {
  GK: 'POR',
  DEF: 'DEF',
  MID: 'MED',
  FWD: 'DEL',
};

// ---------- component ----------
export default function PlayerRatings({
  players,
  teamName,
  teamColor,
}: PlayerRatingsProps) {
  const starters = players
    .filter((p) => !p.isSubstitute)
    .sort((a, b) => b.player.rating - a.player.rating);

  const substitutes = players
    .filter((p) => p.isSubstitute)
    .sort((a, b) => b.player.rating - a.player.rating);

  return (
    <div className="glass-card p-4">
      {/* team header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: teamColor }}
        />
        <span className="text-sm font-semibold text-foreground/90 truncate">
          {teamName}
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">
          Media{' '}
          <AverageRating
            allPlayers={[...starters, ...substitutes]}
          />
        </span>
      </div>

      <Separator className="opacity-15 mb-2" />

      {/* starters */}
      {starters.length > 0 && (
        <div className="mb-3">
          <SectionLabel label="Titulares" count={starters.length} />
          <div className="flex flex-col gap-0.5">
            {starters.map((entry, i) => (
              <PlayerRow
                key={entry.player.id}
                player={entry.player}
                isSubbedOut={entry.player.minutesPlayed < 90}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* substitutes */}
      {substitutes.length > 0 && (
        <div>
          <SectionLabel label="Suplentes" count={substitutes.length} />
          <div className="flex flex-col gap-0.5">
            {substitutes.map((entry, i) => (
              <PlayerRow
                key={entry.player.id}
                player={entry.player}
                isSubbedIn
                index={i + starters.length}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- sub-components ----------

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-1 mb-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground/50 tabular-nums">
        ({count})
      </span>
    </div>
  );
}

function PlayerRow({
  player,
  isSubbedOut = false,
  isSubbedIn = false,
  index,
}: {
  player: Player;
  isSubbedOut?: boolean;
  isSubbedIn?: boolean;
  index: number;
}) {
  const tier = ratingTier(player.rating);
  const bgColor = tierColors[tier];
  const glow = tierGlow[tier];
  const dimmed = isSubbedOut || isSubbedIn;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: 'easeOut',
      }}
      className={`flex items-center gap-2 px-1 py-[5px] rounded-md hover:bg-white/[0.03] transition-colors ${
        dimmed ? 'opacity-60' : ''
      }`}
    >
      {/* number */}
      <span
        className={`w-5 text-center text-xs font-bold tabular-nums shrink-0 ${
          dimmed ? 'text-muted-foreground/50 line-through' : 'text-foreground/70'
        }`}
      >
        {player.number}
      </span>

      {/* sub indicators */}
      {isSubbedIn && (
        <span className="text-emerald-400 text-xs font-bold shrink-0 leading-none">
          ↑
        </span>
      )}
      {isSubbedOut && (
        <span className="text-red-400 text-xs font-bold shrink-0 leading-none">
          ↓
        </span>
      )}

      {/* name */}
      <span
        className={`text-xs font-medium truncate flex-1 ${
          dimmed
            ? 'text-muted-foreground/60 line-through decoration-muted-foreground/30'
            : 'text-foreground/90'
        }`}
      >
        {player.name}
      </span>

      {/* position badge */}
      <Badge
        variant="outline"
        className="h-5 px-1.5 text-[9px] font-semibold uppercase tracking-wider bg-white/5 border-white/10 text-muted-foreground shrink-0"
      >
        {positionLabel[player.position] ?? player.position}
      </Badge>

      {/* rating circle */}
      <div
        className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${bgColor} ${glow}`}
      >
        <span className="text-sm font-bold text-white leading-none">
          {player.rating.toFixed(1)}
        </span>
      </div>
    </motion.div>
  );
}

function AverageRating({
  allPlayers,
}: {
  allPlayers: { player: Player }[];
}) {
  if (allPlayers.length === 0) return <span>—</span>;

  const avg =
    allPlayers.reduce((sum, p) => sum + p.player.rating, 0) /
    allPlayers.length;
  const tier = ratingTier(avg);

  const colorMap: Record<string, string> = {
    excellent: 'text-emerald-400',
    good: 'text-cyan-400',
    average: 'text-amber-400',
    poor: 'text-orange-400',
    bad: 'text-red-400',
  };

  return (
    <span className={`font-bold ${colorMap[tier] ?? 'text-foreground/70'}`}>
      {avg.toFixed(1)}
    </span>
  );
}