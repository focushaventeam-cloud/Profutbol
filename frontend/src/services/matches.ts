import api from './api';
import { Match, MatchStats } from '../types/match';

export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get('/api/matches');
  return response.data;
};

export const getMatch = async (id: string): Promise<Match> => {
  const response = await api.get(`/api/matches/${id}`);
  return response.data;
};

export const createMatch = async (data: Partial<Match>): Promise<Match> => {
  const response = await api.post('/api/matches', data);
  return response.data;
};

export const updateMatch = async (id: string, data: Partial<Match>): Promise<Match> => {
  const response = await api.put(`/api/matches/${id}`, data);
  return response.data;
};

export const getMatchStats = async (matchId: string): Promise<MatchStats> => {
  const response = await api.get(`/api/matches/${matchId}/stats`);
  return response.data;
};