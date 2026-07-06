import { useEffect, useCallback } from 'react';
import { useMatchStore } from '../store/matchStore';
import { getMatch, getMatchEvents, getMatchStats } from '../services/matches';
import { getMatchEvents as fetchEvents } from '../services/events';
import { Match } from '../types/match';
import { MatchEvent } from '../types/event';
import { MatchStats } from '../types/match';

export const useMatch = (matchId: string | null) => {
  const { 
    currentMatch, events, stats, isLoading, error, 
    setCurrentMatch, setEvents, setStats, setLoading, setError, reset 
  } = useMatchStore();

  const fetchMatchData = useCallback(async () => {
    if (!matchId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [matchData, eventsData, statsData] = await Promise.all([
        getMatch(matchId),
        fetchEvents(matchId),
        getMatchStats(matchId).catch(() => null),
      ]);
      
      setCurrentMatch(matchData);
      setEvents(eventsData);
      if (statsData) setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error cargando el partido');
    } finally {
      setLoading(false);
    }
  }, [matchId, setCurrentMatch, setEvents, setStats, setLoading, setError]);

  useEffect(() => {
    fetchMatchData();
    return () => reset();
  }, [fetchMatchData, reset]);

  return {
    match: currentMatch,
    events,
    stats,
    isLoading,
    error,
    refetch: fetchMatchData,
  };
};

export default useMatch;