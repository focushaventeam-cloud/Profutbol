'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Match, MatchEvent, MatchStatus } from '@/types';
import { useMatchStore } from '@/stores/matchStore';
import { useToast } from '@/components/layout/ToastProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Settings,
  ChevronDown,
  Play,
  Pause,
  Clock,
  Plus,
  Minus,
  Target,
  Square,
  ArrowRightLeft,
  SkipForward,
} from 'lucide-react';

export default function MatchControlPanel({ match }: { match: Match }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateMatchStatus = useMatchStore((s) => s.updateMatchStatus);
  const updateScore = useMatchStore((s) => s.updateScore);
  const updateMinute = useMatchStore((s) => s.updateMinute);
  const setPeriod = useMatchStore((s) => s.setPeriod);
  const setAddedTime = useMatchStore((s) => s.setAddedTime);
  const addEvent = useMatchStore((s) => s.addEvent);
  const { addToast } = useToast();

  const nextStatus = (current: MatchStatus): MatchStatus => {
    switch (current) {
      case 'scheduled': return 'live';
      case 'live': return 'halftime';
      case 'halftime': return 'live';
      case 'finished': return 'scheduled';
    }
  };

  const handleQuickGoal = (team: 'home' | 'away') => {
    const teamName = team === 'home' ? match.homeTeam.shortName : match.awayTeam.shortName;
    updateScore(match.id, team, 1);
    const event: MatchEvent = {
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'goal',
      minute: match.minute,
      team,
      description: `Gol de ${teamName}`,
    };
    addEvent(match.id, event);
    addToast(`⚽ ¡GOL de ${teamName}! ${match.homeScore + (team === 'home' ? 1 : 0)} - ${match.awayScore + (team === 'away' ? 1 : 0)}`, 'success');
  };

  const handleQuickCard = (team: 'home' | 'away', type: 'yellow_card' | 'red_card') => {
    const teamName = team === 'home' ? match.homeTeam.shortName : match.awayTeam.shortName;
    const cardLabel = type === 'yellow_card' ? 'Amarilla' : 'Roja';
    const event: MatchEvent = {
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      minute: match.minute,
      team,
      description: `${cardLabel} para ${teamName}`,
    };
    addEvent(match.id, event);
    addToast(`🟨 ${cardLabel} para ${teamName} (${match.minute}')`, type === 'red_card' ? 'warning' : 'info');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full glass-card hover:bg-white/10 transition-colors mb-3 flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2 text-white/70">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Panel de Control</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-white/50" />
          </motion.div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="glass-card p-4 space-y-5 overflow-hidden"
        >
          {/* Status Control */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Estado del Partido
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => updateMatchStatus(match.id, 'live')}
                size="sm"
                className={
                  match.status === 'live'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                En Vivo
              </Button>
              <Button
                onClick={() => updateMatchStatus(match.id, 'halftime')}
                size="sm"
                className={
                  match.status === 'halftime'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }
              >
                <Pause className="w-3.5 h-3.5 mr-1.5" />
                MT
              </Button>
              <Button
                onClick={() => updateMatchStatus(match.id, 'finished')}
                size="sm"
                className={
                  match.status === 'finished'
                    ? 'bg-slate-600 hover:bg-slate-700 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }
              >
                <SkipForward className="w-3.5 h-3.5 mr-1.5" />
                Final
              </Button>
              <Button
                onClick={() => updateMatchStatus(match.id, nextStatus(match.status))}
                size="sm"
                variant="outline"
                className="border-white/10 text-white/50 hover:text-white hover:bg-white/5"
              >
                Siguiente →
              </Button>
            </div>
          </div>

          {/* Timer Control */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Temporizador
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-white/50">Minuto</label>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => updateMinute(match.id, Math.max(0, match.minute - 1))}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={match.minute}
                    onChange={(e) => updateMinute(match.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-center bg-white/5 border-white/10 text-white text-sm"
                    min={0}
                    max={120}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => updateMinute(match.id, Math.min(120, match.minute + 1))}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Slider
                  value={[match.minute]}
                  onValueChange={([v]) => updateMinute(match.id, v)}
                  max={120}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/50">Periodo</label>
                <Select
                  value={match.period}
                  onValueChange={(v) => setPeriod(match.id, v as Match['period'])}
                >
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="first_half">1er Tiempo</SelectItem>
                    <SelectItem value="second_half">2do Tiempo</SelectItem>
                    <SelectItem value="extra_time">Tiempo Extra</SelectItem>
                    <SelectItem value="penalties">Penales</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-1">
                  <label className="text-xs text-white/50">Tiempo Añadido</label>
                  <Input
                    type="number"
                    value={match.addedTime}
                    onChange={(e) => setAddedTime(match.id, parseInt(e.target.value) || 0)}
                    className="w-full h-8 bg-white/5 border-white/10 text-white text-sm"
                    min={0}
                    max={30}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Score Control */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Marcador
            </h4>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1.5">{match.homeTeam.shortName}</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => updateScore(match.id, 'home', -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Badge className="text-2xl font-black px-3 py-1 bg-white/5 border-white/10 text-white">
                    {match.homeScore}
                  </Badge>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                    onClick={handleQuickGoal.bind(null, 'home')}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="text-2xl font-light text-white/20">:</div>
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1.5">{match.awayTeam.shortName}</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                    onClick={handleQuickGoal.bind(null, 'away')}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Badge className="text-2xl font-black px-3 py-1 bg-white/5 border-white/10 text-white">
                    {match.awayScore}
                  </Badge>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => updateScore(match.id, 'away', -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Acciones Rápidas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 justify-start"
                onClick={handleQuickGoal.bind(null, 'home')}
              >
                <Target className="w-3.5 h-3.5 mr-1.5" />
                Gol {match.homeTeam.shortName}
              </Button>
              <Button
                size="sm"
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 justify-start"
                onClick={handleQuickGoal.bind(null, 'away')}
              >
                <Target className="w-3.5 h-3.5 mr-1.5" />
                Gol {match.awayTeam.shortName}
              </Button>
              <Button
                size="sm"
                className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 justify-start"
                onClick={handleQuickCard.bind(null, 'home', 'yellow_card')}
              >
                <Square className="w-3 h-3 mr-1.5 fill-amber-400" />
                Amarilla Local
              </Button>
              <Button
                size="sm"
                className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 justify-start"
                onClick={handleQuickCard.bind(null, 'away', 'yellow_card')}
              >
                <Square className="w-3 h-3 mr-1.5 fill-amber-400" />
                Amarilla Visitante
              </Button>
              <Button
                size="sm"
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 justify-start"
                onClick={handleQuickCard.bind(null, 'home', 'red_card')}
              >
                <Square className="w-3 h-3 mr-1.5 fill-red-400" />
                Roja Local
              </Button>
              <Button
                size="sm"
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 justify-start"
                onClick={handleQuickCard.bind(null, 'away', 'red_card')}
              >
                <Square className="w-3 h-3 mr-1.5 fill-red-400" />
                Roja Visitante
              </Button>
              <Button
                size="sm"
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 justify-start col-span-2"
                onClick={() => {
                  const event: MatchEvent = {
                    id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    type: 'var_review',
                    minute: match.minute,
                    team: 'home',
                    description: 'Revisión VAR',
                  };
                  addEvent(match.id, event);
                  addToast('📺 Revisión VAR activada', 'info');
                }}
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                Revisión VAR
              </Button>
            </div>
          </div>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}