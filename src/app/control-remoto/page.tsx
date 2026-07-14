'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRemoteClient, ScreenState } from '@/hooks/useSocket';
import { PERIOD_LABELS, STATUS_LABELS, EVENT_LABELS, EVENT_ICONS } from '@/types';
import { Button } from '@/components/ui/button';
import { WifiOff, Smartphone } from 'lucide-react';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function RemoteControlInner() {
  const searchParams = useSearchParams();
  const screenId = searchParams.get('screen');
  const { state, screenName, connected, sendAction } = useRemoteClient(screenId);

  if (!screenId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Smartphone className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sin Pantalla Asignada</h2>
          <p className="text-sm text-zinc-500">Escanea un codigo QR para conectarte a una pantalla.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white select-none">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Control Remoto</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{screenName || 'Conectando...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connected ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">CONECTADO</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
                <WifiOff className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-red-400 font-medium">OFFLINE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {!state ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-zinc-700 border-t-violet-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-zinc-500">Conectando a pantalla...</p>
          </div>
        </div>
      ) : (
        <RemoteControlBody state={state} screenName={screenName} sendAction={sendAction} connected={connected} />
      )}
    </div>
  );
}

function RemoteControlBody({
  state,
  screenName,
  sendAction,
  connected,
}: {
  state: ScreenState;
  screenName: string;
  sendAction: (action: Record<string, unknown>) => void;
  connected: boolean;
}) {
  const { match, isTimerRunning } = state;

  const homeYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = match.events.filter(e => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = match.events.filter(e => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = match.events.filter(e => e.type === 'red_card' && e.team === 'away').length;

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Match Status Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
          {match.field} · {match.format.replace('futbol', 'Futbol ')}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          match.status === 'live' ? 'text-emerald-400' :
          match.status === 'finished' ? 'text-red-400' :
          match.status === 'halftime' ? 'text-yellow-400' : 'text-zinc-500'
        }`}>
          {STATUS_LABELS[match.status]}
        </span>
      </div>

      {/* Scoreboard Preview */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg font-black"
              style={{
                backgroundColor: `${match.homeTeam.color}20`,
                border: `2px solid ${match.homeTeam.color}40`,
                color: match.homeTeam.color,
              }}
            >
              {match.homeTeam.shortName.slice(0, 3)}
            </div>
            <p className="text-xs font-bold truncate" style={{ color: match.homeTeam.color }}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </p>
            <div className="flex gap-0.5 justify-center mt-1 min-h-[14px]">
              {Array.from({ length: homeYellows }).map((_, i) => (
                <span key={`hy-${i}`} className="inline-block w-3 h-3.5 rounded-sm bg-yellow-400" />
              ))}
              {Array.from({ length: homeReds }).map((_, i) => (
                <span key={`hr-${i}`} className="inline-block w-3 h-3.5 rounded-sm bg-red-500" />
              ))}
            </div>
          </div>

          {/* Score + Timer */}
          <div className="flex flex-col items-center px-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white tabular-nums">{match.homeScore}</span>
              <span className="text-lg font-light text-zinc-600">-</span>
              <span className="text-5xl font-black text-white tabular-nums">{match.awayScore}</span>
            </div>
            <div className="mt-1 text-center">
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
              className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg font-black"
              style={{
                backgroundColor: `${match.awayTeam.color}20`,
                border: `2px solid ${match.awayTeam.color}40`,
                color: match.awayTeam.color,
              }}
            >
              {match.awayTeam.shortName.slice(0, 3)}
            </div>
            <p className="text-xs font-bold truncate" style={{ color: match.awayTeam.color }}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </p>
            <div className="flex gap-0.5 justify-center mt-1 min-h-[14px]">
              {Array.from({ length: awayYellows }).map((_, i) => (
                <span key={`ay-${i}`} className="inline-block w-3 h-3.5 rounded-sm bg-yellow-400" />
              ))}
              {Array.from({ length: awayReds }).map((_, i) => (
                <span key={`ar-${i}`} className="inline-block w-3 h-3.5 rounded-sm bg-red-500" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Temporizador</h3>
        <div className="flex items-center gap-2">
          {isTimerRunning ? (
            <Button
              className="flex-1 h-14 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm rounded-xl active:scale-95 transition-transform"
              onClick={() => sendAction({ type: 'pause_timer' })}
            >
              PAUSAR
            </Button>
          ) : (
            <Button
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl active:scale-95 transition-transform"
              onClick={() => sendAction({ type: 'start_timer' })}
            >
              INICIAR
            </Button>
          )}
          <Button
            className="h-14 px-5 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl active:scale-95 transition-transform"
            onClick={() => sendAction({ type: 'reset_timer' })}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Score Controls */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Marcador</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Home Score */}
          <div className="space-y-2">
            <p className="text-xs text-center font-semibold truncate" style={{ color: match.homeTeam.color }}>
              {match.homeTeam.shortName}
            </p>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 h-12 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-base rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'goal', team: 'home' })}
              >
                + GOL
              </Button>
              <Button
                className="h-12 w-12 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl active:scale-95 transition-transform text-xl font-bold"
                onClick={() => sendAction({ type: 'minus_goal', team: 'home' })}
              >
                -
              </Button>
            </div>
          </div>
          {/* Away Score */}
          <div className="space-y-2">
            <p className="text-xs text-center font-semibold truncate" style={{ color: match.awayTeam.color }}>
              {match.awayTeam.shortName}
            </p>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 h-12 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-base rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'goal', team: 'away' })}
              >
                + GOL
              </Button>
              <Button
                className="h-12 w-12 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 rounded-xl active:scale-95 transition-transform text-xl font-bold"
                onClick={() => sendAction({ type: 'minus_goal', team: 'away' })}
              >
                -
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards / Fouls */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Faltas / Tarjetas</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Home Cards */}
          <div className="space-y-2">
            <p className="text-xs text-center font-semibold truncate" style={{ color: match.homeTeam.color }}>
              {match.homeTeam.shortName}
            </p>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 h-11 bg-yellow-500/80 hover:bg-yellow-400 text-zinc-900 font-bold text-[11px] rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'yellow_card', team: 'home', playerName: '' })}
              >
                AMARILLA
              </Button>
              <Button
                className="flex-1 h-11 bg-red-600/80 hover:bg-red-500 text-white font-bold text-[11px] rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'red_card', team: 'home', playerName: '' })}
              >
                ROJA
              </Button>
            </div>
          </div>
          {/* Away Cards */}
          <div className="space-y-2">
            <p className="text-xs text-center font-semibold truncate" style={{ color: match.awayTeam.color }}>
              {match.awayTeam.shortName}
            </p>
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 h-11 bg-yellow-500/80 hover:bg-yellow-400 text-zinc-900 font-bold text-[11px] rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'yellow_card', team: 'away', playerName: '' })}
              >
                AMARILLA
              </Button>
              <Button
                className="flex-1 h-11 bg-red-600/80 hover:bg-red-500 text-white font-bold text-[11px] rounded-xl active:scale-95 transition-transform"
                onClick={() => sendAction({ type: 'red_card', team: 'away', playerName: '' })}
              >
                ROJA
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      {match.events.length > 0 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">
            Eventos Recientes ({match.events.length})
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {match.events.slice(0, 10).map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white/[0.02]"
              >
                <span className="text-sm">{EVENT_ICONS[ev.type as keyof typeof EVENT_ICONS]}</span>
                <span className="text-[11px] text-zinc-300 flex-1 truncate">
                  {EVENT_LABELS[ev.type as keyof typeof EVENT_LABELS]}
                  {ev.playerName ? ` - ${ev.playerName}` : ''}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">{ev.minute}&apos;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[10px] text-zinc-600">
          Control Remoto · Profutbol
        </p>
      </div>
    </div>
  );
}

export default function RemoteControlPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-violet-400 rounded-full animate-spin" />
      </div>
    }>
      <RemoteControlInner />
    </Suspense>
  );
}