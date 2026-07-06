import React from 'react';
import { MapPin, User, Cloud, Users } from 'lucide-react';
import { Match } from '../../types/match';
import TeamBadge from './TeamBadge';
import MatchTimer from './MatchTimer';
import ScoreDisplay from './ScoreDisplay';
import Badge from '../ui/Badge';
import { useMatchStore } from '../../store/matchStore';

interface ScoreboardProps {
  match: Match;
  isAdmin?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ match, isAdmin = false }) => {
  const { updateScore } = useMatchStore();

  const statusVariant = match.status === 'live' ? 'live' 
    : match.status === 'finished' ? 'finished'
    : match.status === 'halftime' ? 'halftime'
    : match.status === 'postponed' ? 'postponed'
    : 'scheduled';

  const handleScoreChange = (team: 'home' | 'away', delta: number) => {
    const current = team === 'home' ? match.homeScore : match.awayScore;
    const newScore = Math.max(0, current + delta);
    updateScore(team, newScore);
  };

  return (
    <div className="glass-panel-strong overflow-hidden">
      {/* Match status bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5">
        <Badge variant={statusVariant} pulse={match.status === 'live'} />
        <div className="flex items-center gap-3 text-[11px] text-white/40">
          {match.venue && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {match.venue}
            </span>
          )}
          {match.referee && (
            <span className="hidden sm:flex items-center gap-1">
              <User size={11} />
              {match.referee}
            </span>
          )}
        </div>
      </div>

      {/* Main scoreboard area */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Home Team */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <TeamBadge
              name={match.homeTeam.name}
              shortName={match.homeTeam.shortName}
              logo={match.homeTeam.logo}
              primaryColor={match.homeTeam.primaryColor}
              size="lg"
            />
          </div>

          {/* Center: Timer + Score */}
          <div className="flex flex-col items-center gap-4">
            <MatchTimer
              currentTime={match.currentTime}
              period={match.period}
              status={match.status}
              addedTime={match.addedTime}
            />
            <ScoreDisplay
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
              isLive={match.status === 'live'}
              onScoreChange={handleScoreChange}
              isAdmin={isAdmin}
            />
          </div>

          {/* Away Team */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <TeamBadge
              name={match.awayTeam.name}
              shortName={match.awayTeam.shortName}
              logo={match.awayTeam.logo}
              primaryColor={match.awayTeam.primaryColor}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Match info footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-white/40">
        {match.weather && (
          <span className="flex items-center gap-1">
            <Cloud size={12} />
            {match.weather.condition === 'sunny' ? 'Soleado' : match.weather.condition === 'cloudy' ? 'Nublado' : match.weather.condition === 'rainy' ? 'Lluvia' : 'Nieve'}
            {' '}{match.weather.temperature}°C
          </span>
        )}
        {match.attendance && (
          <span className="flex items-center gap-1">
            <Users size={12} />
            {match.attendance.toLocaleString('es-ES')} asistentes
          </span>
        )}
        {match.startTime && (
          <span>
            {new Date(match.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;