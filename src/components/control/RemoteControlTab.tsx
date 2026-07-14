'use client';

import { useState } from 'react';
import { useScreens, ScreenState } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Play, Pause, RotateCcw, Plus, Minus,
  Wifi, WifiOff, QrCode, Monitor, Smartphone, Tv,
  AlertTriangle, ChevronRight, Zap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  PERIOD_LABELS, STATUS_LABELS, EVENT_ICONS, EVENT_LABELS,
} from '@/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const STATUS_STYLES: Record<string, string> = {
  waiting: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  live: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  halftime: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  finished: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// ── Team Control Column ──────────────────────────────────────────────────────

function TeamControls({
  label,
  color,
  shortName,
  yellows,
  reds,
  onGoal,
  onMinusGoal,
  onYellow,
  onRed,
}: {
  label: string;
  color: string;
  shortName: string;
  yellows: number;
  reds: number;
  onGoal: () => void;
  onMinusGoal: () => void;
  onYellow: () => void;
  onRed: () => void;
}) {
  return (
    <div className="flex-1 space-y-3">
      {/* Team Badge */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all"
          style={{
            backgroundColor: `${color}18`,
            border: `2.5px solid ${color}40`,
            color,
          }}
        >
          {shortName.slice(0, 3)}
        </div>
        <p className="text-xs font-bold uppercase tracking-wider truncate max-w-full" style={{ color }}>
          {shortName}
        </p>
      </div>

      {/* Score Controls */}
      <div className="flex items-center gap-2">
        <Button
          className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.96] text-white font-black text-lg rounded-xl transition-all"
          onClick={onGoal}
        >
          <Plus className="w-5 h-5 mr-1" />GOL
        </Button>
        <Button
          className="h-14 w-14 bg-white/5 hover:bg-white/10 active:scale-[0.96] text-zinc-400 border border-white/10 rounded-xl text-2xl font-bold transition-all"
          onClick={onMinusGoal}
        >
          −
        </Button>
      </div>

      {/* Card Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="h-12 bg-yellow-500/80 hover:bg-yellow-400 active:scale-[0.96] text-zinc-900 font-bold text-xs rounded-xl transition-all flex flex-col items-center gap-0.5"
          onClick={onYellow}
        >
          <div className="w-5 h-6 rounded-sm bg-yellow-300 border border-yellow-600" />
          <span>AMARILLA</span>
        </Button>
        <Button
          className="h-12 bg-red-600/80 hover:bg-red-500 active:scale-[0.96] text-white font-bold text-xs rounded-xl transition-all flex flex-col items-center gap-0.5"
          onClick={onRed}
        >
          <div className="w-5 h-6 rounded-sm bg-red-400 border border-red-700" />
          <span>ROJA</span>
        </Button>
      </div>

      {/* Card Count */}
      {(yellows > 0 || reds > 0) && (
        <div className="flex items-center justify-center gap-1.5 py-1">
          {Array.from({ length: yellows }).map((_, i) => (
            <div key={`y-${i}`} className="w-4 h-5 rounded-sm bg-yellow-400 shadow-sm shadow-yellow-400/30" />
          ))}
          {Array.from({ length: reds }).map((_, i) => (
            <div key={`r-${i}`} className="w-4 h-5 rounded-sm bg-red-500 shadow-sm shadow-red-500/30" />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function RemoteControlTab({
  activeScreenId,
  onSelectScreen,
  wsState,
  wsSendAction,
  wsConnected,
}: {
  activeScreenId: string | null;
  onSelectScreen: (id: string) => void;
  wsState: ScreenState | null;
  wsSendAction: (action: Record<string, unknown>) => void;
  wsConnected: boolean;
}) {
  const { screens, createScreen } = useScreens();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createScreen(newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  // No screen selected — show selector
  if (!activeScreenId || !wsState) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Empty state icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-600/5 border border-violet-500/20 flex items-center justify-center mb-6">
          <Smartphone className="w-10 h-10 text-violet-400/60" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Control Remoto</h3>
        <p className="text-sm text-zinc-400 max-w-sm mb-8">
          Selecciona una pantalla para activar el control remoto. Podras manejar el marcador, temporizador, goles y tarjetas en tiempo real.
        </p>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-6">
          {wsConnected ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Servidor Conectado</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Servidor Desconectado</span>
            </div>
          )}
        </div>

        {/* Screen selector */}
        {screens.length > 0 ? (
          <div className="w-full max-w-sm space-y-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Pantallas Disponibles</p>
            <div className="space-y-2">
              {screens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectScreen(s.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                    <Monitor className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      {s.homeTeam} {s.homeScore} - {s.awayScore} {s.awayTeam}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[s.status] || STATUS_STYLES.waiting}`}>
                      {STATUS_LABELS[s.status] || s.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-400">Sin pantallas creadas</p>
                  <p className="text-[11px] text-amber-400/60 mt-0.5">
                    Ve a la pestana &quot;Pantallas&quot; para crear una nueva pantalla y poder controlarla desde aqui.
                  </p>
                </div>
              </div>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2 h-12 rounded-xl">
                  <Plus className="w-4 h-4" /> Crear Pantalla
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Pantalla</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Cancha 1, Cancha 2..."
                    className="bg-white/5 border-white/10"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost" className="text-zinc-400">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleCreate} className="bg-violet-600 hover:bg-violet-500 text-white">Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }

  // ── Screen selected — show full remote control ──────────────────────────
  const { match, isTimerRunning } = wsState;

  const homeYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = match.events.filter(e => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = match.events.filter(e => e.type === 'red_card' && e.team === 'away').length;

  const activeScreen = screens.find(s => s.id === activeScreenId);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Screen Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-5 py-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{activeScreen?.name || match.field}</p>
          <p className="text-[11px] text-violet-300/70 uppercase tracking-wider">
            {match.format.replace('futbol', 'Futbol ')} · {match.halfDuration}min · {match.field}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">EN LINEA</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5">
              <WifiOff className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-400 font-bold">OFFLINE</span>
            </div>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border ${STATUS_STYLES[match.status] || STATUS_STYLES.waiting}`}>
            {STATUS_LABELS[match.status]}
          </span>
        </div>
      </div>

      {/* ── Live Scoreboard ────────────────────────────────────────── */}
      <Card className="border-white/[0.06] bg-white/[0.03] overflow-hidden">
        <CardContent className="p-0">
          {/* Score Display */}
          <div className="flex items-center justify-between px-6 py-6">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center text-xl font-black shadow-lg"
                style={{
                  backgroundColor: `${match.homeTeam.color}15`,
                  border: `2px solid ${match.homeTeam.color}35`,
                  color: match.homeTeam.color,
                  boxShadow: `0 4px 20px ${match.homeTeam.color}15`,
                }}
              >
                {match.homeTeam.shortName.slice(0, 3)}
              </div>
              <p className="text-xs font-bold truncate max-w-[120px] mx-auto" style={{ color: match.homeTeam.color }}>
                {match.homeTeam.shortName}
              </p>
            </div>

            {/* Score + Timer Center */}
            <div className="flex flex-col items-center px-8">
              <div className="flex items-baseline gap-5">
                <span className="text-6xl font-black text-white tabular-nums tracking-tight">{match.homeScore}</span>
                <span className="text-2xl font-extralight text-zinc-600">:</span>
                <span className="text-6xl font-black text-white tabular-nums tracking-tight">{match.awayScore}</span>
              </div>
              <div className="mt-3 text-center">
                <span className={`text-3xl font-mono font-bold tabular-nums tracking-wider ${isTimerRunning ? 'text-white' : 'text-zinc-600'}`}>
                  {formatTime(match.currentTime)}
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    {PERIOD_LABELS[match.period]}
                  </p>
                  {isTimerRunning && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                      <span className="text-[9px] text-emerald-400 font-bold">EN VIVO</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center text-xl font-black shadow-lg"
                style={{
                  backgroundColor: `${match.awayTeam.color}15`,
                  border: `2px solid ${match.awayTeam.color}35`,
                  color: match.awayTeam.color,
                  boxShadow: `0 4px 20px ${match.awayTeam.color}15`,
                }}
              >
                {match.awayTeam.shortName.slice(0, 3)}
              </div>
              <p className="text-xs font-bold truncate max-w-[120px] mx-auto" style={{ color: match.awayTeam.color }}>
                {match.awayTeam.shortName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Timer Controls ─────────────────────────────────────────── */}
      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Temporizador</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="flex items-center gap-3">
            {isTimerRunning ? (
              <Button
                className="flex-1 h-14 bg-amber-600 hover:bg-amber-500 active:scale-[0.97] text-white font-black text-base rounded-xl transition-all gap-2 shadow-lg shadow-amber-600/20"
                onClick={() => wsSendAction({ type: 'pause_timer' })}
              >
                <Pause className="w-5 h-5" /> PAUSAR
              </Button>
            ) : (
              <Button
                className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] text-white font-black text-base rounded-xl transition-all gap-2 shadow-lg shadow-emerald-600/20"
                onClick={() => wsSendAction({ type: 'start_timer' })}
              >
                <Play className="w-5 h-5" /> INICIAR
              </Button>
            )}
            <Button
              className="h-14 px-6 bg-white/5 hover:bg-white/10 active:scale-[0.97] text-zinc-400 border border-white/10 rounded-xl transition-all"
              onClick={() => wsSendAction({ type: 'reset_timer' })}
              title="Reiniciar Temporizador"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Score & Cards Controls ─────────────────────────────────── */}
      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Marcador &amp; Tarjetas</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="flex items-start gap-6">
            <TeamControls
              label={match.homeTeam.name}
              color={match.homeTeam.color}
              shortName={match.homeTeam.shortName}
              yellows={homeYellows}
              reds={homeReds}
              onGoal={() => wsSendAction({ type: 'goal', team: 'home' })}
              onMinusGoal={() => wsSendAction({ type: 'minus_goal', team: 'home' })}
              onYellow={() => wsSendAction({ type: 'yellow_card', team: 'home', playerName: '' })}
              onRed={() => wsSendAction({ type: 'red_card', team: 'home', playerName: '' })}
            />
            {/* Center Divider */}
            <div className="w-px h-full bg-white/[0.06] self-stretch" />
            <TeamControls
              label={match.awayTeam.name}
              color={match.awayTeam.color}
              shortName={match.awayTeam.shortName}
              yellows={awayYellows}
              reds={awayReds}
              onGoal={() => wsSendAction({ type: 'goal', team: 'away' })}
              onMinusGoal={() => wsSendAction({ type: 'minus_goal', team: 'away' })}
              onYellow={() => wsSendAction({ type: 'yellow_card', team: 'away', playerName: '' })}
              onRed={() => wsSendAction({ type: 'red_card', team: 'away', playerName: '' })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Events List ────────────────────────────────────────────── */}
      {match.events.length > 0 && (
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Eventos del Partido ({match.events.length})
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {[...match.events].reverse().map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <span className="text-lg flex-shrink-0">{EVENT_ICONS[ev.type as keyof typeof EVENT_ICONS]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 font-medium truncate">
                      {EVENT_LABELS[ev.type as keyof typeof EVENT_LABELS]}
                      {ev.playerName ? ` — ${ev.playerName}` : ''}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">
                      {ev.team === 'home' ? match.homeTeam.shortName : match.awayTeam.shortName}
                      {ev.description ? ` · ${ev.description}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono font-bold flex-shrink-0">
                    {ev.minute}&apos;
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Connected Devices Info ─────────────────────────────────── */}
      {activeScreen && (
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[11px] text-zinc-500">
              {activeScreen.displays > 0 ? (
                <span className="text-emerald-400 font-semibold">{activeScreen.displays} pantalla{activeScreen.displays > 1 ? 's' : ''}</span>
              ) : 'Sin pantalla'}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[11px] text-zinc-500">
              {activeScreen.remotes > 0 ? (
                <span className="text-violet-400 font-semibold">{activeScreen.remotes} remoto{activeScreen.remotes > 1 ? 's' : ''}</span>
              ) : 'Sin remoto'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}