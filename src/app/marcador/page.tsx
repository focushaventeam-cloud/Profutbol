'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDisplayClient, ScreenState } from '@/hooks/useSocket';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { onStateUpdate, broadcastDisplayJoined } from '@/lib/broadcast-sync';
import { StadiumDisplay } from '@/components/scoreboard/StadiumDisplay';

function MarcadorInner() {
  const searchParams = useSearchParams();
  const screenId = searchParams.get('screen');
  const { state: wsState, connected: wsConnected } = useDisplayClient(screenId);

  // Also maintain BroadcastChannel for local tab sync
  const applySyncRef = useRef(useScoreboardStore.getState().applySyncState);
  const [bcConnected, setBcConnected] = useState(false);

  useEffect(() => {
    applySyncRef.current = useScoreboardStore.getState().applySyncState;
  });

  // BroadcastChannel sync (for same-browser tabs)
  useEffect(() => {
    const unsub = onStateUpdate((state) => {
      applySyncRef.current(state);
      setBcConnected(true);
    });
    broadcastDisplayJoined();
    const syncInterval = setInterval(() => { broadcastDisplayJoined(); }, 3000);
    return () => { unsub(); clearInterval(syncInterval); };
  }, []);

  // WebSocket sync (for cross-device/multi-screen)
  useEffect(() => {
    if (!wsState) return;
    const s = useScoreboardStore.getState();
    s.applySyncState({
      match: wsState.match,
      isTimerRunning: wsState.isTimerRunning,
      skins: wsState.skins,
      activeSkinId: wsState.activeSkinId,
      ads: wsState.ads,
      activeAdIndex: wsState.activeAdIndex,
    });
  }, [wsState]);

  const isConnected = wsConnected || bcConnected;
  const isWebSocketMode = !!screenId;

  return (
    <div className="display-mode">
      <StadiumDisplay />
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        {!isConnected && (
          <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] text-yellow-300 font-medium tracking-wider">ESPERANDO CONEXION...</span>
          </div>
        )}
        {isWebSocketMode && wsConnected && (
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-300 font-medium tracking-wider">PANTALLA CONECTADA</span>
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
          Pantalla Completa
        </button>
      </div>
    </div>
  );
}

export default function MarcadorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    }>
      <MarcadorInner />
    </Suspense>
  );
}