'use client';

import { useEffect, useRef } from 'react';
import { useMatchStore } from '@/stores/matchStore';

/**
 * Auto-advances the minute for all "live" matches every 3 seconds
 * (simulating real-time progression). Only active when there's
 * at least one live match.
 */
export function useAutoTimer() {
  const matches = useMatchStore((s) => s.matches);
  const updateMinute = useMatchStore((s) => s.updateMinute);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const liveMatches = matches.filter((m) => m.status === 'live');

  useEffect(() => {
    if (liveMatches.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Only start if not already running
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const currentMatches = useMatchStore.getState().matches;
      const currentLive = currentMatches.filter((m) => m.status === 'live');

      if (currentLive.length === 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      for (const m of currentLive) {
        const maxMinute = m.period === 'first_half' ? 45 : m.period === 'second_half' ? 90 : 120;
        if (m.minute < maxMinute) {
          updateMinute(m.id, m.minute + 1);
        }
      }
    }, 3000); // 3 seconds = 1 game minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [liveMatches.length, updateMinute]);
}