'use client';

import { useEffect, useRef } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { StadiumDisplay } from '@/components/scoreboard/StadiumDisplay';
import { ControlPanel } from '@/components/control/ControlPanel';

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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isTimerRunning, tickTimer]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const mins = Math.floor(currentTime / 60);
    const ends: Record<string, number> = { first_half: 45, second_half: 90, extra_time_first: 105, extra_time_second: 120 };
    const end = ends[matchPeriod];
    if (end && mins >= end + (addedTime > 0 ? addedTime : 0)) {
      setStatus(matchPeriod === 'second_half' || matchPeriod === 'extra_time_second' ? 'finished' : 'halftime');
    } else if (end && mins >= end && addedTime === 0) {
      setStatus(matchPeriod === 'second_half' ? 'finished' : 'halftime');
    }
  }, [currentTime, matchPeriod, addedTime, isTimerRunning, setStatus]);
}

export default function Home() {
  const viewMode = useScoreboardStore((s) => s.viewMode);
  const setViewMode = useScoreboardStore((s) => s.setViewMode);
  useTimerTick();

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && viewMode === 'display') setViewMode('control'); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [viewMode, setViewMode]);

  if (viewMode === 'display') {
    return (
      <div className="display-mode">
        <StadiumDisplay />
        <div className="fixed bottom-2 right-2 z-50 text-white/10 text-xs cursor-pointer hover:text-white/40 transition-colors" onClick={() => setViewMode('control')}>
          ESC para salir
        </div>
      </div>
    );
  }

  return (
    <div className="control-mode min-h-screen">
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />
      <ControlPanel />
    </div>
  );
}