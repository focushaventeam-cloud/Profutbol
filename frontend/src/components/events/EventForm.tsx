import React, { useState } from 'react';
import {
  Goal, Square, ArrowRightLeft, AlertTriangle, Monitor,
} from 'lucide-react';
import Button from '../ui/Button';
import { EventType } from '../../types/event';
import { EVENT_TYPES } from '../../utils/constants';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
  homeTeamName: string;
  awayTeamName: string;
  currentMinute: number;
}

export interface EventFormData {
  type: EventType;
  team: 'home' | 'away';
  playerName: string;
  playerNumber: number;
  minute: number;
  description?: string;
  playerInName?: string;
  playerInNumber?: number;
}

const eventOptions: { value: EventType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'goal', label: 'Gol', icon: <Goal size={16} />, color: 'from-emerald-500 to-emerald-600' },
  { value: 'own_goal', label: 'Autogol', icon: <Goal size={16} />, color: 'from-orange-500 to-orange-600' },
  { value: 'penalty', label: 'Penal', icon: <Goal size={16} />, color: 'from-blue-500 to-blue-600' },
  { value: 'yellow_card', label: 'Amarilla', icon: <Square size={16} />, color: 'from-yellow-500 to-yellow-600' },
  { value: 'red_card', label: 'Roja', icon: <Square size={16} />, color: 'from-red-500 to-red-600' },
  { value: 'substitution', label: 'Cambio', icon: <ArrowRightLeft size={16} />, color: 'from-cyan-500 to-cyan-600' },
  { value: 'var_review', label: 'VAR', icon: <Monitor size={16} />, color: 'from-orange-400 to-orange-500' },
  { value: 'injury', label: 'Lesión', icon: <AlertTriangle size={16} />, color: 'from-amber-500 to-amber-600' },
];

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  isLoading = false,
  homeTeamName,
  awayTeamName,
  currentMinute,
}) => {
  const [form, setForm] = useState<EventFormData>({
    type: 'goal',
    team: 'home',
    playerName: '',
    playerNumber: 0,
    minute: currentMinute,
    description: '',
    playerInName: '',
    playerInNumber: 0,
  });

  const handleChange = (field: keyof EventFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.playerName.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Event type selection */}
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
          Tipo de Evento
        </label>
        <div className="grid grid-cols-4 gap-2">
          {eventOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('type', opt.value)}
              className={`
                flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold
                transition-all duration-200
                ${form.type === opt.value
                  ? `bg-gradient-to-b ${opt.color} text-white border-white/20 shadow-lg`
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'
                }
              `}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team + Minute */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
            Equipo
          </label>
          <div className="flex gap-2">
            {(['home', 'away'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('team', t)}
                className={`
                  flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200
                  ${form.team === t
                    ? 'bg-white/15 text-white border-white/20'
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                  }
                `}
              >
                {t === 'home' ? homeTeamName : awayTeamName}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
            Minuto
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={form.minute}
            onChange={(e) => handleChange('minute', parseInt(e.target.value) || 0)}
            className="glass-input w-full px-3 py-2.5 text-white text-sm text-center font-mono"
          />
        </div>
      </div>

      {/* Player name + number */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
            Jugador
          </label>
          <input
            type="text"
            placeholder="Nombre del jugador"
            value={form.playerName}
            onChange={(e) => handleChange('playerName', e.target.value)}
            className="glass-input w-full px-3 py-2.5 text-white text-sm placeholder-white/20"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
            # Dorsal
          </label>
          <input
            type="number"
            min={1}
            max={99}
            placeholder="#"
            value={form.playerNumber || ''}
            onChange={(e) => handleChange('playerNumber', parseInt(e.target.value) || 0)}
            className="glass-input w-full px-3 py-2.5 text-white text-sm text-center font-mono placeholder-white/20"
          />
        </div>
      </div>

      {/* Substitution fields */}
      {form.type === 'substitution' && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 animate-fade-in">
          <p className="text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wider">
            Jugador que Entra
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Nombre del jugador"
                value={form.playerInName}
                onChange={(e) => handleChange('playerInName', e.target.value)}
                className="glass-input w-full px-3 py-2.5 text-white text-sm placeholder-white/20"
              />
            </div>
            <div>
              <input
                type="number"
                min={1}
                max={99}
                placeholder="#"
                value={form.playerInNumber || ''}
                onChange={(e) => handleChange('playerInNumber', parseInt(e.target.value) || 0)}
                className="glass-input w-full px-3 py-2.5 text-white text-sm text-center font-mono placeholder-white/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
          Descripción (opcional)
        </label>
        <input
          type="text"
          placeholder="Detalle adicional..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="glass-input w-full px-3 py-2.5 text-white text-sm placeholder-white/20"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Registrar Evento
      </Button>
    </form>
  );
};

export default EventForm;