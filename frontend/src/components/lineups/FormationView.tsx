import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lineup, Player, Position } from '../../types/team';
import { POSITIONS } from '../../utils/constants';

interface FormationViewProps {
  lineup: Lineup;
  teamName: string;
  teamColor: string;
  flip?: boolean;
}

/* Formation position coordinates (percentage-based) for common formations */
const FORMATION_POSITIONS: Record<string, { x: number; y: number; pos: Position }[]> = {
  '4-3-3': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 15, y: 74, pos: 'DEF' }, { x: 38, y: 76, pos: 'DEF' }, { x: 62, y: 76, pos: 'DEF' }, { x: 85, y: 74, pos: 'DEF' },
    { x: 25, y: 54, pos: 'MID' }, { x: 50, y: 50, pos: 'MID' }, { x: 75, y: 54, pos: 'MID' },
    { x: 18, y: 28, pos: 'FWD' }, { x: 50, y: 22, pos: 'FWD' }, { x: 82, y: 28, pos: 'FWD' },
  ],
  '4-4-2': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 15, y: 74, pos: 'DEF' }, { x: 38, y: 76, pos: 'DEF' }, { x: 62, y: 76, pos: 'DEF' }, { x: 85, y: 74, pos: 'DEF' },
    { x: 12, y: 52, pos: 'MID' }, { x: 37, y: 54, pos: 'MID' }, { x: 63, y: 54, pos: 'MID' }, { x: 88, y: 52, pos: 'MID' },
    { x: 35, y: 26, pos: 'FWD' }, { x: 65, y: 26, pos: 'FWD' },
  ],
  '4-2-3-1': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 15, y: 74, pos: 'DEF' }, { x: 38, y: 76, pos: 'DEF' }, { x: 62, y: 76, pos: 'DEF' }, { x: 85, y: 74, pos: 'DEF' },
    { x: 35, y: 56, pos: 'MID' }, { x: 65, y: 56, pos: 'MID' },
    { x: 15, y: 38, pos: 'MID' }, { x: 50, y: 34, pos: 'MID' }, { x: 85, y: 38, pos: 'MID' },
    { x: 50, y: 20, pos: 'FWD' },
  ],
  '3-5-2': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 25, y: 74, pos: 'DEF' }, { x: 50, y: 76, pos: 'DEF' }, { x: 75, y: 74, pos: 'DEF' },
    { x: 10, y: 52, pos: 'MID' }, { x: 30, y: 56, pos: 'MID' }, { x: 50, y: 50, pos: 'MID' }, { x: 70, y: 56, pos: 'MID' }, { x: 90, y: 52, pos: 'MID' },
    { x: 35, y: 26, pos: 'FWD' }, { x: 65, y: 26, pos: 'FWD' },
  ],
  '3-4-3': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 25, y: 74, pos: 'DEF' }, { x: 50, y: 76, pos: 'DEF' }, { x: 75, y: 74, pos: 'DEF' },
    { x: 15, y: 52, pos: 'MID' }, { x: 40, y: 54, pos: 'MID' }, { x: 60, y: 54, pos: 'MID' }, { x: 85, y: 52, pos: 'MID' },
    { x: 18, y: 28, pos: 'FWD' }, { x: 50, y: 22, pos: 'FWD' }, { x: 82, y: 28, pos: 'FWD' },
  ],
  '4-1-4-1': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 15, y: 74, pos: 'DEF' }, { x: 38, y: 76, pos: 'DEF' }, { x: 62, y: 76, pos: 'DEF' }, { x: 85, y: 74, pos: 'DEF' },
    { x: 50, y: 60, pos: 'MID' },
    { x: 12, y: 44, pos: 'MID' }, { x: 37, y: 46, pos: 'MID' }, { x: 63, y: 46, pos: 'MID' }, { x: 88, y: 44, pos: 'MID' },
    { x: 50, y: 22, pos: 'FWD' },
  ],
  '5-3-2': [
    { x: 50, y: 92, pos: 'GK' },
    { x: 10, y: 74, pos: 'DEF' }, { x: 30, y: 76, pos: 'DEF' }, { x: 50, y: 78, pos: 'DEF' }, { x: 70, y: 76, pos: 'DEF' }, { x: 90, y: 74, pos: 'DEF' },
    { x: 25, y: 52, pos: 'MID' }, { x: 50, y: 50, pos: 'MID' }, { x: 75, y: 52, pos: 'MID' },
    { x: 35, y: 26, pos: 'FWD' }, { x: 65, y: 26, pos: 'FWD' },
  ],
};

const positionColors: Record<Position, string> = {
  GK: 'from-amber-500 to-amber-600',
  DEF: 'from-blue-500 to-blue-600',
  MID: 'from-emerald-500 to-emerald-600',
  FWD: 'from-red-500 to-red-600',
};

const positionBorderColors: Record<Position, string> = {
  GK: 'border-amber-400/30',
  DEF: 'border-blue-400/30',
  MID: 'border-emerald-400/30',
  FWD: 'border-red-400/30',
};

export const FormationView: React.FC<FormationViewProps> = ({
  lineup,
  teamName,
  teamColor,
  flip = false,
}) => {
  const formationSlots = FORMATION_POSITIONS[lineup.formation] || FORMATION_POSITIONS['4-4-2'];

  const playersByPosition = useMemo(() => {
    const map = new Map<string, Player>();
    lineup.startingXI.forEach((p) => map.set(p.position, p));
    return map;
  }, [lineup.startingXI]);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <div
              className="w-1 h-5 rounded-full"
              style={{ background: `linear-gradient(to bottom, ${teamColor}, ${teamColor}80)` }}
            />
            {teamName}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Formación: <span className="font-bold text-white/60">{lineup.formation}</span>
            {' · '}DT: <span className="font-medium text-white/60">{lineup.coach}</span>
          </p>
        </div>
        <div className="flex gap-3 text-[10px]">
          {(['GK', 'DEF', 'MID', 'FWD'] as Position[]).map((pos) => (
            <div key={pos} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${positionColors[pos]}`} />
              <span className="text-white/30 font-medium">{POSITIONS[pos]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pitch */}
      <div className="relative aspect-[3/4] sm:aspect-[2/3] md:aspect-[3/4] pitch-gradient dot-pattern overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-4 border border-white/8 rounded-xl" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/8 -translate-x-1/2" />
        <div className="absolute left-4 right-4 top-1/2 h-px bg-white/8" />
        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 border border-white/8 rounded-full" />
        {/* Penalty areas */}
        <div className={`absolute ${flip ? 'top-4' : 'bottom-4'} left-1/4 right-1/4 h-[15%] border border-white/8 border-b-0 rounded-t-xl`} />
        <div className={`absolute ${flip ? 'bottom-4' : 'top-4'} left-1/4 right-1/4 h-[15%] border border-white/8 border-t-0 rounded-b-xl`} />

        {/* Players */}
        {formationSlots.map((slot, idx) => {
          const player = playersByPosition.get(slot.pos) || lineup.startingXI[idx];
          const x = flip ? (100 - slot.x) : slot.x;
          const y = flip ? (100 - slot.y) : slot.y;

          return (
            <motion.div
              key={player?.id || idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Player circle */}
              <div
                className={`
                  relative w-10 h-10 sm:w-12 sm:h-12 rounded-full
                  bg-gradient-to-br ${positionColors[slot.pos]}
                  border-2 ${positionBorderColors[slot.pos]}
                  flex items-center justify-center
                  shadow-lg transition-all duration-300
                  group-hover:scale-110 group-hover:shadow-xl
                `}
              >
                <span className="text-white font-black text-xs sm:text-sm">
                  {player?.number || idx + 1}
                </span>
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 15px ${teamColor}60, 0 0 30px ${teamColor}30` }}
                />
              </div>

              {/* Name tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-y-1 z-10">
                <div className="glass-panel-strong px-3 py-1.5 rounded-lg text-[10px] font-bold text-white">
                  {player?.name || `${POSITIONS[slot.pos]} #${idx + 1}`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Substitutes */}
      {lineup.substitutes.length > 0 && (
        <div className="px-5 py-3 border-t border-white/10 bg-white/5">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Suplentes</p>
          <div className="flex flex-wrap gap-2">
            {lineup.substitutes.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-[10px] font-black text-white/40 w-5 text-center">#{sub.number}</span>
                <span className="text-[11px] font-medium text-white/50">{sub.name}</span>
                <span className="text-[9px] text-white/25 uppercase">{POSITIONS[sub.position]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationView;