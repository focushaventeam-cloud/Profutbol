'use client';

import { useEffect, useRef } from 'react';
import { useScoreboardStore, enableControlBroadcasting, disableControlBroadcasting } from '@/stores/scoreboardStore';
import { ControlPanel } from '@/components/control/ControlPanel';

// ── Timer hook: runs in control panel only ─────────────────────────────────────
function useTimerTick() {
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const tickTimer = useScoreboardStore((s) => s.tickTimer);
  const currentTime = useScoreboardStore((s) => s.match.currentTime);
  const matchPeriod = useScoreboardStore((s) => s.match.period);
  const halfDuration = useScoreboardStore((s) => s.match.halfDuration);
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
    const halfEndsAt = halfDuration; // in minutes
    if (mins >= halfEndsAt) {
      if (matchPeriod === 'first_half') {
        setStatus('halftime');
      } else if (matchPeriod === 'second_half') {
        setStatus('finished');
      }
    }
  }, [currentTime, matchPeriod, halfDuration, isTimerRunning, setStatus]);
}

// ── Control Panel Page ─────────────────────────────────────────────────────────
function ControlWindow() {
  useEffect(() => {
    enableControlBroadcasting();
    return () => disableControlBroadcasting();
  }, []);

  useTimerTick();

  return <ControlPanel />;
}

export default function Home() {
  return <ControlWindow />;
}