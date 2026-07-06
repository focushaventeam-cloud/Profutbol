import api from './api';
import { MatchEvent } from '../types/event';

export const getMatchEvents = async (matchId: string): Promise<MatchEvent[]> => {
  const response = await api.get(`/api/matches/${matchId}/events`);
  return response.data;
};

export const createEvent = async (matchId: string, data: Partial<MatchEvent>): Promise<MatchEvent> => {
  const response = await api.post(`/api/matches/${matchId}/events`, data);
  return response.data;
};

export const updateEvent = async (matchId: string, eventId: string, data: Partial<MatchEvent>): Promise<MatchEvent> => {
  const response = await api.put(`/api/matches/${matchId}/events/${eventId}`, data);
  return response.data;
};

export const deleteEvent = async (matchId: string, eventId: string): Promise<void> => {
  await api.delete(`/api/matches/${matchId}/events/${eventId}`);
};