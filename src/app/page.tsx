'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useScoreboardStore, enableControlBroadcasting, disableControlBroadcasting, useDisplaySync } from '@/stores/scoreboardStore';
import { onStateUpdate, broadcastDisplayJoined } from '@/lib/broadcast-sync';
import { StadiumDisplay } from '@/components/scoreboard/StadiumDisplay';
import { ControlPanel } from '@/components/control/ControlPanel';

// ── Timer hook: only runs in control mode ─────────────────────────────────────
function useTimerTick() {
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const tickTimer = useScoreboardStore((s) => s.tickTimer);
  const currentTime = useScoreboardStore((s) => s.match.currentTime);
  const matchPeriod = useScoreboardStore((s) => s.match.period);
  const addedTime = useScoreboardStore((s) => s.match.addedTime);
  const setStatus = useScoreboardStore((s) => s.setStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(tickTimer, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, tickTimer]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const mins = Math.floor(currentTime / 60);
    const ends: Record<string, number> = {
      first_half: 45,
      second_half: 90,
      extra_time_first: 105,
      extra_time_second: 120,
    };
    const end = ends[matchPeriod];
    if (end) {
      const totalEnd = end + (addedTime > 0 ? addedTime : 0);
      if (mins >= totalEnd) {
        setStatus(matchPeriod === 'second_half' || matchPeriod === 'extra_time_second' ? 'finished' : 'halftime');
      }
    }
  }, [currentTime, matchPeriod, addedTime, isTimerRunning, setStatus]);
}

// ── Display window: receives state via BroadcastChannel ───────────────────────
function DisplayWindow() {
  const applySyncRef = useRef(useScoreboardStore.getState().applySyncState);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    applySyncRef.current = useScoreboardStore.getState().applySyncState;
  });

  useEffect(() => {
    const unsub = onStateUpdate((state) => {
      applySyncRef.current(state);
      setConnected(true);
    });

    useDisplaySync();

    const syncInterval = setInterval(() => {
      broadcastDisplayJoined();
    }, 3000);

    return () => {
      unsub();
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <div className="display-mode">
      <StadiumDisplay />
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        {connected && (
          <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] text-green-300 font-medium tracking-wider">EN VIVO</span>
          </div>
        )}
        {!connected && (
          <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] text-yellow-300 font-medium tracking-wider">ESPERANDO CONEXIÓN...</span>
          </div>
        )}
        <button
          onClick={() => {
            const el = document.documentElement;
            if (!document.fullscreenElement) {
              el.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen();
            }
          }}
          className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-full px-3 py-1.5 text-[10px] text-white/50 hover:text-white transition-all backdrop-blur-sm"
        >
          ⛶ Pantalla Completa
        </button>
      </div>
    </div>
  );
}

// ── Control window ────────────────────────────────────────────────────────────
function ControlWindow() {
  useEffect(() => {
    enableControlBroadcasting();
    return () => disableControlBroadcasting();
  }, []);

  useTimerTick();

  return (
    <div className="control-mode min-h-screen">
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />
      <ControlPanel />
    </div>
  );
}

// ── Router: reads ?mode=display from URL ───────────────────────────────────────
function Router() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  if (mode === 'display') {
    return <DisplayWindow />;
  }

  return <ControlWindow />;
}

// ── Main Page (with Suspense for useSearchParams) ─────────────────────────────
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
          <div className="text-white/30 text-sm animate-pulse">Cargando PROFUTBOL...</div>
        </div>
      }
    >
      <Router />
    </Suspense>
  );
}