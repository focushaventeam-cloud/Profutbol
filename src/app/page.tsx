'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScoreboardStore, enableControlBroadcasting, disableControlBroadcasting } from '@/stores/scoreboardStore';
import { ControlPanel } from '@/components/control/ControlPanel';
import { useSocket, useScreens, useScreenSubscription } from '@/hooks/useSocket';

function ControlWindow() {
  // ── Multi-Screen WebSocket State ──────────────────────────────────────────
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const { connected: wsConnected } = useSocket();
  const { state: wsState, sendAction, syncState } = useScreenSubscription(activeScreenId);

  // Flag to prevent echo loop between local store and WebSocket
  const syncingFromServer = useRef(false);

  // ── BroadcastChannel (for local same-browser tabs) ────────────────────────
  useEffect(() => {
    enableControlBroadcasting();
    return () => disableControlBroadcasting();
  }, []);

  // ── WebSocket → Local Store sync ──────────────────────────────────────────
  useEffect(() => {
    if (!wsState || !activeScreenId) return;
    syncingFromServer.current = true;
    useScoreboardStore.getState().applySyncState({
      match: wsState.match,
      isTimerRunning: wsState.isTimerRunning,
      skins: wsState.skins,
      activeSkinId: wsState.activeSkinId,
      ads: wsState.ads,
      activeAdIndex: wsState.activeAdIndex,
    });
    // Reset flag after state settles
    const timer = setTimeout(() => { syncingFromServer.current = false; }, 150);
    return () => clearTimeout(timer);
  }, [wsState, activeScreenId]);

  // ── Local Store → WebSocket sync ──────────────────────────────────────────
  const syncStateRef = useRef(syncState);
  useEffect(() => { syncStateRef.current = syncState; }, [syncState]);

  useEffect(() => {
    if (!activeScreenId) return;
    const unsub = useScoreboardStore.subscribe(() => {
      if (syncingFromServer.current) return;
      const s = useScoreboardStore.getState();
      syncStateRef.current({
        match: s.match,
        isTimerRunning: s.isTimerRunning,
        skins: s.skins,
        activeSkinId: s.activeSkinId,
        ads: s.ads,
        activeAdIndex: s.activeAdIndex,
      });
    });
    return unsub;
  }, [activeScreenId]);

  // ── Timer (only local when no WebSocket screen selected) ──────────────────
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const tickTimer = useScoreboardStore((s) => s.tickTimer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // When a screen is active, the server handles the timer
    if (activeScreenId && wsConnected) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    // Local timer
    if (isTimerRunning) {
      intervalRef.current = setInterval(tickTimer, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isTimerRunning, tickTimer, activeScreenId, wsConnected]);

  // ── Status/Period auto-transition (only local when no screen) ─────────────
  const currentTime = useScoreboardStore((s) => s.match.currentTime);
  const matchPeriod = useScoreboardStore((s) => s.match.period);
  const halfDuration = useScoreboardStore((s) => s.match.halfDuration);
  const addedTime = useScoreboardStore((s) => s.match.addedTime);
  const extraTimeAdded = useScoreboardStore((s) => s.match.extraTimeAdded);
  const setStatus = useScoreboardStore((s) => s.setStatus);

  useEffect(() => {
    if (!isTimerRunning || (activeScreenId && wsConnected)) return;
    const mins = Math.floor(currentTime / 60);
    const ends: Record<string, number> = {
      first_half: halfDuration,
      second_half: halfDuration,
      extra_time_first: halfDuration,
      extra_time_second: halfDuration,
    };
    const end = ends[matchPeriod];
    if (end) {
      const isExtra = matchPeriod === 'extra_time_first' || matchPeriod === 'extra_time_second';
      const add = isExtra ? extraTimeAdded : addedTime;
      const totalEnd = end + (add > 0 ? add : 0);
      if (mins >= totalEnd) {
        if (matchPeriod === 'first_half') setStatus('halftime');
        else if (matchPeriod === 'second_half' || matchPeriod === 'extra_time_second') setStatus('finished');
      }
    }
  }, [currentTime, matchPeriod, halfDuration, addedTime, extraTimeAdded, isTimerRunning, setStatus, activeScreenId, wsConnected]);

  return (
    <ControlPanel
      activeScreenId={activeScreenId}
      onSelectScreen={setActiveScreenId}
      wsConnected={wsConnected}
    />
  );
}

export default function Home() {
  return <ControlWindow />;
}