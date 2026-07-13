'use client';

import { useEffect, useRef, useState } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { onStateUpdate, broadcastDisplayJoined } from '@/lib/broadcast-sync';
import { StadiumDisplay } from '@/components/scoreboard/StadiumDisplay';

export default function MarcadorPage() {
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

    broadcastDisplayJoined();

    // Repeatedly request initial state until we get it
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
        {!connected && (
          <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] text-yellow-300 font-medium tracking-wider">ESPERANDO CONEXI&Oacute;N...</span>
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
          &#x26F6; Pantalla Completa
        </button>
      </div>
    </div>
  );
}