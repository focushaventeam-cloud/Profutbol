import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useMatchStore } from '../store/matchStore';
import { WS_EVENTS } from '../utils/constants';
import { Match } from '../types/match';
import { MatchEvent } from '../types/event';
import { MatchStats } from '../types/match';

export const useSocket = (matchId: string | null) => {
  const { setCurrentMatch, addEvent, setStats, updateScore } = useMatchStore();
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!matchId) return;

    const socket = connectSocket(matchId);

    socket.on(WS_EVENTS.MATCH_UPDATE, (match: Match) => {
      if (mountedRef.current) setCurrentMatch(match);
    });

    socket.on(WS_EVENTS.EVENT_CREATED, (event: MatchEvent) => {
      if (mountedRef.current) {
        addEvent(event);
        if (event.type === 'goal' || event.type === 'own_goal' || event.type === 'penalty') {
          // Score update handled by match:update event
        }
      }
    });

    socket.on(WS_EVENTS.STATS_UPDATE, (stats: MatchStats) => {
      if (mountedRef.current) setStats(stats);
    });

    socket.on(WS_EVENTS.TIMER_UPDATE, (data: { currentTime: number; period: string; addedTime: number }) => {
      if (mountedRef.current) {
        const store = useMatchStore.getState();
        if (store.currentMatch) {
          setCurrentMatch({
            ...store.currentMatch,
            currentTime: data.currentTime,
            period: data.period as any,
            addedTime: data.addedTime,
          });
        }
      }
    });

    return () => {
      mountedRef.current = false;
      disconnectSocket();
    };
  }, [matchId, setCurrentMatch, addEvent, setStats, updateScore]);

  const emitEvent = useCallback((eventName: string, data: any) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(eventName, data);
    }
  }, []);

  return { emitEvent };
};

export default useSocket;