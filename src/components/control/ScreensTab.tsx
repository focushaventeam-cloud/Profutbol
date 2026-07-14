'use client';

import { useState } from 'react';
import { useScreens, ScreenListItem, ScreenState } from '@/hooks/useSocket';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Monitor, Plus, Trash2, QrCode, Wifi, WifiOff,
  Smartphone, Tv, Edit2, Check, X, Play, Pause, RotateCcw,
} from 'lucide-react';
import { PERIOD_LABELS, STATUS_LABELS, EVENT_ICONS, EVENT_LABELS } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const STATUS_COLORS: Record<string, string> = {
  waiting: 'text-zinc-400',
  live: 'text-emerald-400',
  halftime: 'text-yellow-400',
  finished: 'text-red-400',
};

// ── Inline Remote Control Panel (shown when a screen is selected) ──────────

function InlineRemoteControl({
  state,
  sendAction,
}: {
  state: ScreenState;
  sendAction: (action: Record<string, unknown>) => void;
}) {
  const { match, isTimerRunning } = state;

  const homeYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = match.events.filter(e => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = match.events.filter(e => e.type === 'red_card' && e.team === 'away').length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Active Screen Header */}
      <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{match.field}</p>
          <p className="text-[10px] text-violet-300 uppercase tracking-wider">
            {match.format.replace('futbol', 'Futbol ')} · {match.halfDuration}min
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          match.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
          match.status === 'finished' ? 'bg-red-500/20 text-red-400' :
          match.status === 'halftime' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-white/5 text-zinc-400'
        }`}>
          {STATUS_LABELS[match.status]}
        </span>
      </div>

      {/* Scoreboard */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div
              className="w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg font-black"
              style={{
                backgroundColor: `${match.homeTeam.color}20`,
                border: `2px solid ${match.homeTeam.color}40`,
                color: match.homeTeam.color,
              }}
            >
              {match.homeTeam.shortName.slice(0, 3)}
            </div>
            <p className="text-xs font-bold truncate mb-1" style={{ color: match.homeTeam.color }}>
              {match.homeTeam.shortName}
            </p>
            <div className="flex gap-0.5 justify-center min-h-[14px]">
              {Array.from({ length: homeYellows }).map((_, i) => (
                <span key={`hy-${i}`} className="inline-block w-3 h-4 rounded-sm bg-yellow-400" />
              ))}
              {Array.from({ length: homeReds }).map((_, i) => (
                <span key={`hr-${i}`} className="inline-block w-3 h-4 rounded-sm bg-red-500" />
              ))}
            </div>
          </div>

          {/* Score + Timer */}
          <div className="flex flex-col items-center px-6">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-white tabular-nums">{match.homeScore}</span>
              <span className="text-xl font-light text-zinc-600">-</span>
              <span className="text-5xl font-black text-white tabular-nums">{match.awayScore}</span>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-2xl font-mono font-bold tabular-nums ${isTimerRunning ? '' : 'opacity-40'}`}>
                {formatTime(match.currentTime)}
              </span>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">
                {PERIOD_LABELS[match.period]}
              </p>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div
              className="w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg font-black"
              style={{
                backgroundColor: `${match.awayTeam.color}20`,
                border: `2px solid ${match.awayTeam.color}40`,
                color: match.awayTeam.color,
              }}
            >
              {match.awayTeam.shortName.slice(0, 3)}
            </div>
            <p className="text-xs font-bold truncate mb-1" style={{ color: match.awayTeam.color }}>
              {match.awayTeam.shortName}
            </p>
            <div className="flex gap-0.5 justify-center min-h-[14px]">
              {Array.from({ length: awayYellows }).map((_, i) => (
                <span key={`ay-${i}`} className="inline-block w-3 h-4 rounded-sm bg-yellow-400" />
              ))}
              {Array.from({ length: awayReds }).map((_, i) => (
                <span key={`ar-${i}`} className="inline-block w-3 h-4 rounded-sm bg-red-500" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2">
          {isTimerRunning ? (
            <Button
              className="flex-1 h-12 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm rounded-xl gap-2"
              onClick={() => sendAction({ type: 'pause_timer' })}
            >
              <Pause className="w-4 h-4" /> PAUSAR
            </Button>
          ) : (
            <Button
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl gap-2"
              onClick={() => sendAction({ type: 'start_timer' })}
            >
              <Play className="w-4 h-4" /> INICIAR
            </Button>
          )}
          <Button
            className="h-12 px-5 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl"
            onClick={() => sendAction({ type: 'reset_timer' })}
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Score + Cards Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Home Controls */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-center truncate" style={{ color: match.homeTeam.color }}>
            {match.homeTeam.shortName}
          </p>
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 h-11 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl"
              onClick={() => sendAction({ type: 'goal', team: 'home' })}
            >
              + GOL
            </Button>
            <Button
              className="h-11 w-11 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl text-lg font-bold"
              onClick={() => sendAction({ type: 'minus_goal', team: 'home' })}
            >
              -
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 h-10 bg-yellow-500/80 hover:bg-yellow-400 text-zinc-900 font-bold text-xs rounded-xl"
              onClick={() => sendAction({ type: 'yellow_card', team: 'home', playerName: '' })}
            >
              AMARILLA
            </Button>
            <Button
              className="flex-1 h-10 bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
              onClick={() => sendAction({ type: 'red_card', team: 'home', playerName: '' })}
            >
              ROJA
            </Button>
          </div>
        </div>

        {/* Away Controls */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-center truncate" style={{ color: match.awayTeam.color }}>
            {match.awayTeam.shortName}
          </p>
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 h-11 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl"
              onClick={() => sendAction({ type: 'goal', team: 'away' })}
            >
              + GOL
            </Button>
            <Button
              className="h-11 w-11 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl text-lg font-bold"
              onClick={() => sendAction({ type: 'minus_goal', team: 'away' })}
            >
              -
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 h-10 bg-yellow-500/80 hover:bg-yellow-400 text-zinc-900 font-bold text-xs rounded-xl"
              onClick={() => sendAction({ type: 'yellow_card', team: 'away', playerName: '' })}
            >
              AMARILLA
            </Button>
            <Button
              className="flex-1 h-10 bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
              onClick={() => sendAction({ type: 'red_card', team: 'away', playerName: '' })}
            >
              ROJA
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {match.events.length > 0 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">
            Eventos ({match.events.length})
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {match.events.slice(0, 8).map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/[0.02]">
                <span className="text-sm">{EVENT_ICONS[ev.type as keyof typeof EVENT_ICONS]}</span>
                <span className="text-[11px] text-zinc-300 flex-1 truncate">
                  {EVENT_LABELS[ev.type as keyof typeof EVENT_LABELS]}
                  {ev.playerName ? ` — ${ev.playerName}` : ''}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">{ev.minute}&apos;</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Screen Card ──────────────────────────────────────────────────────────────

function ScreenCard({
  screen,
  onDelete,
  onRename,
  onOpenDisplay,
  onOpenRemote,
  onSelect,
  isSelected,
  connected,
}: {
  screen: ScreenListItem;
  onDelete: () => void;
  onRename: (name: string) => void;
  onOpenDisplay: () => void;
  onOpenRemote: () => void;
  onSelect: () => void;
  isSelected: boolean;
  connected: boolean;
}) {
  const [showQR, setShowQR] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(screen.name);

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}control-remoto?screen=${screen.id}`
    : '';

  return (
    <>
      <Card
        className={`cursor-pointer transition-all duration-200 group ${
          isSelected
            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}
              >
                <Monitor className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
              </div>
              <div className="min-w-0 flex-1">
                {editing ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-7 text-sm bg-white/5 border-white/10"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { onRename(editName); setEditing(false); }
                        if (e.key === 'Escape') setEditing(false);
                      }}
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { onRename(editName); setEditing(false); }}>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(false)}>
                      <X className="w-3.5 h-3.5 text-zinc-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-white truncate">{screen.name}</CardTitle>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(true); setEditName(screen.name); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100"
                    >
                      <Edit2 className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[screen.status] || ''}`}>
                    {STATUS_LABELS[screen.status] || screen.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenDisplay(); }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Desplegar Pantalla"
              >
                <Tv className="w-4 h-4 text-zinc-400 hover:text-emerald-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowQR(true); }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="QR Control Remoto"
              >
                <QrCode className="w-4 h-4 text-zinc-400 hover:text-violet-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-400" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Score display */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">{screen.homeTeam}</p>
              <span className="text-3xl font-black text-white tabular-nums">{screen.homeScore}</span>
            </div>
            <span className="text-lg font-light text-zinc-600">-</span>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">{screen.awayTeam}</p>
              <span className="text-3xl font-black text-white tabular-nums">{screen.awayScore}</span>
            </div>
          </div>

          {/* Connection indicators */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] text-zinc-400">
                {screen.displays > 0 ? (
                  <span className="text-emerald-400 font-semibold">{screen.displays} pantalla{screen.displays > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-zinc-600">Sin pantalla</span>
                )}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] text-zinc-400">
                {screen.remotes > 0 ? (
                  <span className="text-violet-400 font-semibold">{screen.remotes} remoto{screen.remotes > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-zinc-600">Sin remoto</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-violet-400" />
              Control Remoto — {screen.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white rounded-2xl p-4">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="M"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#0c1220"
              />
            </div>
            <p className="text-xs text-zinc-400 text-center">
              Escanea este codigo con tu celular para controlar esta pantalla desde tu telefono
            </p>
            <div className="w-full bg-white/5 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">URL de Control Remoto</p>
              <p className="text-xs text-zinc-300 font-mono break-all">{qrUrl}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Main Screens Tab ─────────────────────────────────────────────────────────

export function ScreensTab({
  activeScreenId,
  onSelectScreen,
  wsState,
  wsSendAction,
}: {
  activeScreenId: string | null;
  onSelectScreen: (screenId: string) => void;
  wsState: ScreenState | null;
  wsSendAction: (action: Record<string, unknown>) => void;
}) {
  const { connected, screens, createScreen, deleteScreen, renameScreen } = useScreens();
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createScreen(newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  const handleOpenDisplay = (screenId: string) => {
    const url = `marcador?screen=${screenId}`;
    window.open(url, '_blank');
  };

  // Find selected screen from list for info
  const selectedScreen = screens.find(s => s.id === activeScreenId);

  return (
    <div className="space-y-4">
      {/* Connection Status + Create */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Servidor Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Desconectado</span>
            </>
          )}
        </div>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
              <Plus className="w-4 h-4" />
              Nueva Pantalla
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Pantalla</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Nombre de la Pantalla
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Cancha 1, Cancha 2..."
                  className="bg-white/5 border-white/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              <p className="text-xs text-zinc-500">
                Cada pantalla es un marcador independiente que se despliega en un monitor/TV. Selecciona una pantalla para controlarla directamente desde aqui.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="text-zinc-400">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inline Remote Control (when a screen is selected) */}
      {activeScreenId && wsState && (
        <InlineRemoteControl state={wsState} sendAction={wsSendAction} />
      )}

      {/* Screens Grid */}
      {screens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">Sin Pantallas</h3>
          <p className="text-sm text-zinc-600 max-w-xs">
            Crea una nueva pantalla para desplegar un marcador en un monitor/TV. Selecciona una pantalla para controlarla desde aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {screens.map((screen) => (
            <ScreenCard
              key={screen.id}
              screen={screen}
              onDelete={() => deleteScreen(screen.id)}
              onRename={(name) => renameScreen(screen.id, name)}
              onOpenDisplay={() => handleOpenDisplay(screen.id)}
              onOpenRemote={() => {}}
              onSelect={() => onSelectScreen(screen.id)}
              isSelected={screen.id === activeScreenId}
              connected={connected}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {screens.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-3 text-xs text-zinc-500">
          <span>{screens.length} pantalla{screens.length > 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.displays > 0).length} desplegada{screens.filter(s => s.displays > 0).length !== 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.remotes > 0).length} con remoto</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.status === 'live').length} en vivo</span>
        </div>
      )}
    </div>
  );
}