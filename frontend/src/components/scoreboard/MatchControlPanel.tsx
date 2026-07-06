import React, { useState } from 'react';
import {
  Play, Pause, Square, SkipForward, RotateCcw,
  Plus, Minus, Clock, Settings2, AlertTriangle,
} from 'lucide-react';
import { Match, MatchStatus, MatchPeriod } from '../../types/match';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface MatchControlPanelProps {
  match: Match;
  onStatusChange: (status: MatchStatus) => void;
  onPeriodChange: (period: MatchPeriod) => void;
  onScoreChange: (team: 'home' | 'away', score: number) => void;
  onTimeChange: (seconds: number) => void;
  onAddedTimeChange: (addedTime: number) => void;
}

const statusOptions: { value: MatchStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'scheduled', label: 'Programado', icon: <Clock size={14} />, color: 'text-blue-400' },
  { value: 'live', label: 'En Vivo', icon: <Play size={14} />, color: 'text-red-400' },
  { value: 'halftime', label: 'Medio Tiempo', icon: <Pause size={14} />, color: 'text-yellow-400' },
  { value: 'finished', label: 'Finalizado', icon: <Square size={14} />, color: 'text-green-400' },
  { value: 'postponed', label: 'Postergado', icon: <AlertTriangle size={14} />, color: 'text-gray-400' },
];

const periodOptions: { value: MatchPeriod; label: string }[] = [
  { value: 'first_half', label: '1er Tiempo' },
  { value: 'second_half', label: '2do Tiempo' },
  { value: 'extra_time_first', label: 'Prórroga 1' },
  { value: 'extra_time_second', label: 'Prórroga 2' },
  { value: 'penalties', label: 'Penales' },
];

export const MatchControlPanel: React.FC<MatchControlPanelProps> = ({
  match,
  onStatusChange,
  onPeriodChange,
  onScoreChange,
  onTimeChange,
  onAddedTimeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const currentMinute = Math.floor(match.currentTime / 60);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between hover:bg-white/8 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-white/40" />
          <h3 className="text-base font-bold text-white">Panel de Control</h3>
          <Badge variant={match.status} pulse={match.status === 'live'} />
        </div>
        <svg
          className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-5 space-y-5 animate-slide-down">
          {/* Status Controls */}
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Estado del Partido
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(opt.value)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                    border transition-all duration-200
                    ${match.status === opt.value
                      ? 'bg-white/15 text-white border-white/25 shadow-lg'
                      : `bg-white/5 text-white/35 border-white/10 hover:bg-white/10 hover:text-white/50`
                    }
                  `}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Period Controls */}
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Período
            </label>
            <div className="flex flex-wrap gap-2">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onPeriodChange(opt.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                    ${match.period === opt.value
                      ? 'bg-white/15 text-white border-white/25'
                      : 'bg-white/5 text-white/35 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Controls */}
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Reloj del Partido
            </label>
            <div className="flex items-center gap-3">
              <div className="glass-input px-4 py-2.5 flex items-center gap-2 flex-1">
                <Clock size={14} className="text-white/30" />
                <span className="text-lg font-mono font-black text-white number-highlight">
                  {currentMinute.toString().padStart(2, '0')}:{(match.currentTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-white/30 font-semibold">({currentMinute}&apos;)</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onTimeChange(Math.max(0, match.currentTime - 60))}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all"
                  title="-1 min"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => onTimeChange(match.currentTime + 60)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all"
                  title="+1 min"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => onTimeChange(0)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Added Time */}
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Tiempo Añadido
            </label>
            <div className="flex items-center gap-3">
              <div className="glass-input px-4 py-2.5 flex-1">
                <span className="text-lg font-mono font-black text-white number-highlight">
                  +{match.addedTime}&apos;
                </span>
              </div>
              <button
                onClick={() => onAddedTimeChange(Math.max(0, match.addedTime - 1))}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition-all"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => onAddedTimeChange(match.addedTime + 1)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Score Override */}
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Ajuste Manual de Marcador
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-input p-3">
                <p className="text-[10px] text-white/30 font-semibold mb-2">{match.homeTeam.shortName}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onScoreChange('home', Math.max(0, match.homeScore - 1))}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-2xl font-black text-white number-highlight">{match.homeScore}</span>
                  <button
                    onClick={() => onScoreChange('home', match.homeScore + 1)}
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="glass-input p-3">
                <p className="text-[10px] text-white/30 font-semibold mb-2">{match.awayTeam.shortName}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onScoreChange('away', Math.max(0, match.awayScore - 1))}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-2xl font-black text-white number-highlight">{match.awayScore}</span>
                  <button
                    onClick={() => onScoreChange('away', match.awayScore + 1)}
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <Button variant="secondary" size="sm" icon={<SkipForward size={13} />} className="flex-1">
              Iniciar 2do Tiempo
            </Button>
            <Button variant="danger" size="sm" icon={<Square size={13} />} className="flex-1">
              Finalizar Partido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchControlPanel;