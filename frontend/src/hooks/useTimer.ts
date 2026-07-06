import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  interval?: number;
  onTick?: (seconds: number) => void;
}

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSeconds: (s: number) => void;
}

export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
  const { autoStart = false, interval = 1000, onTick } = options;
  const [seconds, setSecondsState] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsState((prev) => {
          const next = prev + 1;
          onTickRef.current?.(next);
          return next;
        });
      }, interval);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, interval, clearTimer]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsState(0);
  }, []);
  const setSeconds = useCallback((s: number) => setSecondsState(s), []);

  return { seconds, isRunning, start, pause, reset, setSeconds };
};

export default useTimer;