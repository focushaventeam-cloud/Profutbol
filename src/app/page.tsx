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

// ── Control Panel Page ─────────────────────────────────────────────────────────
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

export default function Home() {
  return <ControlWindow />;
}