'use client';

import { useEffect, useRef } from 'react';
import { useScoreboardStore, enableControlBroadcasting, disableControlBroadcasting } from '@/stores/scoreboardStore';
import { ControlPanel } from '@/components/control/ControlPanel';

function useTimerTick() {
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const tickTimer = useScoreboardStore((s) => s.tickTimer);
  const currentTime = useScoreboardStore((s) => s.match.currentTime);
  const matchPeriod = useScoreboardStore((s) => s.match.period);
  const halfDuration = useScoreboardStore((s) => s.match.halfDuration);
  const addedTime = useScoreboardStore((s) => s.match.addedTime);
  const extraTimeAdded = useScoreboardStore((s) => s.match.extraTimeAdded);
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
  }, [currentTime, matchPeriod, halfDuration, addedTime, extraTimeAdded, isTimerRunning, setStatus]);
}

function ControlWindow() {
  useEffect(() => { enableControlBroadcasting(); return () => disableControlBroadcasting(); }, []);
  useTimerTick();
  return <ControlPanel />;
}

export default function Home() {
  return <ControlWindow />;
}