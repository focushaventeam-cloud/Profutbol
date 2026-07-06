import React from 'react';
import { motion } from 'framer-motion';
import {
  Circle, Square, ArrowRightLeft, AlertTriangle, Monitor,
  Goal, Footprints,
} from 'lucide-react';
import { MatchEvent, EventType } from '../../types/event';
import { POSITIONS } from '../../utils/constants';

interface EventItemProps {
  event: MatchEvent;
  isHomeTeam: boolean;
}

const eventIcons: Record<EventType, React.ReactNode> = {
  goal: <Goal size={14} />,
  own_goal: <Goal size={14} />,
  penalty: <Circle size={14} />,
  yellow_card: <Square size={14} className="text-yellow-400" />,
  red_card: <Square size={14} className="text-red-500" />,
  substitution: <ArrowRightLeft size={14} />,
  var_review: <Monitor size={14} className="text-orange-400" />,
  injury: <AlertTriangle size={14} className="text-amber-400" />,
};

const eventColors: Record<EventType, string> = {
  goal: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  own_goal: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  penalty: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  yellow_card: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
  red_card: 'from-red-500/20 to-red-600/10 border-red-500/30',
  substitution: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  var_review: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  injury: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
};

const eventLabels: Record<EventType, string> = {
  goal: 'GOL',
  own_goal: 'AUTOGOL',
  penalty: 'PENAL',
  yellow_card: 'TARJETA AMARILLA',
  red_card: 'TARJETA ROJA',
  substitution: 'CAMBIO',
  var_review: 'VAR',
  injury: 'LESIÓN',
};

export const EventItem: React.FC<EventItemProps> = ({ event, isHomeTeam }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isHomeTeam ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        flex items-center gap-3 p-3 rounded-xl border
        bg-gradient-to-r ${eventColors[event.type]}
        hover:brightness-110 transition-all duration-200
      `}
    >
      {/* Time */}
      <div className="flex-shrink-0 w-12 text-center">
        <span className="text-sm font-black text-white/90">
          {event.minute}'
        </span>
        {event.addedMinute && (
          <span className="text-[10px] text-white/40 font-bold">
            +{event.addedMinute}
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
        {eventIcons[event.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            {eventLabels[event.type]}
          </span>
        </div>
        <p className="text-sm font-semibold text-white truncate mt-0.5">
          {event.player.name}
          {event.player.number && (
            <span className="text-white/40 font-normal"> #{event.player.number}</span>
          )}
        </p>
        {(event.type === 'substitution' && 'playerIn' in event && 'playerOut' in event) && (
          <p className="text-[11px] text-white/40 mt-0.5">
            ↑ {event.playerIn.name} ↓ {event.playerOut.name}
          </p>
        )}
        {event.description && (
          <p className="text-[11px] text-white/30 mt-0.5 truncate">{event.description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default EventItem;