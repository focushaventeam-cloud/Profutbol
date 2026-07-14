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

  // BroadcastChannel sync (for same-browser local tabs)
  const applySyncRef = useRef(useScoreboardStore.getState().applySyncState);
  const [bcConnected, setBcConnected] = useState(false);

  useEffect(() => {
    applySyncRef.current = useScoreboardStore.getState().applySyncState;
  });

  useEffect(() => {
    const unsub = onStateUpdate((state) => {
      applySyncRef.current(state);
      setBcConnected(true);
    });
    broadcastDisplayJoined();
    const syncInterval = setInterval(() => { broadcastDisplayJoined(); }, 3000);
    return () => { unsub(); clearInterval(syncInterval); };
  }, []);

  // WebSocket sync (for multi-device screens)
  useEffect(() => {
    if (!wsState) return;
    useScoreboardStore.getState().applySyncState({
      match: wsState.match,
      isTimerRunning: wsState.isTimerRunning,
      skins: wsState.skins,
      activeSkinId: wsState.activeSkinId,
      ads: wsState.ads,
      activeAdIndex: wsState.activeAdIndex,
    });
  }, [wsState]);

  const isConnected = wsConnected || bcConnected;

  return (
    <div
      className="display-mode cursor-none"
      style={{ cursor: 'none' }}
    >
      <StadiumDisplay />
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