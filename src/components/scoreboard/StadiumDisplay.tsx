'use client';

import { useScoreboardStore } from '@/stores/scoreboardStore';
import { PERIOD_LABELS, STATUS_LABELS, EVENT_ICONS, EVENT_LABELS } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function StadiumDisplay() {
  const match = useScoreboardStore((s) => s.match);
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);

  const { homeTeam, awayTeam, homeScore, awayScore, status, period, currentTime, events, field, halfDuration, format } = match;
  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isHalftime = status === 'halftime';

  // Show recent events (last 6)
  const recentEvents = events.slice(0, 6);

  // Count cards
  const homeYellows = events.filter(e => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = events.filter(e => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = events.filter(e => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = events.filter(e => e.type === 'red_card' && e.team === 'away').length;

  return (
    <div className="h-screen w-screen bg-[#0c1220] flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1220] via-[#111827] to-[#0c1220]" />

      {/* Top bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">PF</span>
          </div>
          <span className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-widest">{field}</span>
          <span className="text-white/15 text-xs">|</span>
          <span className="text-white/30 text-xs uppercase tracking-wider">{format.replace('futbol', 'Fútbol ')}</span>
          <span className="text-white/15 text-xs">|</span>
          <span className="text-white/30 text-xs">{halfDuration}min c/tiempo</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/25 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[11px] text-green-400 font-bold uppercase tracking-wider">En Vivo</span>
            </div>
          )}
          {isFinished && (
            <div className="bg-red-500/15 border border-red-500/25 rounded-full px-3 py-1">
              <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">Finalizado</span>
            </div>
          )}
          {isHalftime && (
            <div className="bg-yellow-500/15 border border-yellow-500/25 rounded-full px-3 py-1">
              <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">Medio Tiempo</span>
            </div>
          )}
          {status === 'waiting' && (
            <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider">Sin Iniciar</span>
            </div>
          )}
        </div>
      </div>

      {/* Main scoreboard */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex-1 flex flex-col justify-center">
        <div className="rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
            {/* Home Team */}
            <div
              className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-14 relative"
              style={{
                background: `linear-gradient(135deg, ${homeTeam.color}15, ${homeTeam.color}05)`,
              }}
            >
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{ backgroundColor: homeTeam.color }}
              />
              <div
                className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                style={{
                  backgroundColor: `${homeTeam.color}20`,
                  border: `2px solid ${homeTeam.color}40`,
                }}
              >
                <span
                  className="text-2xl md:text-4xl lg:text-5xl font-black"
                  style={{ color: homeTeam.color }}
                >
                  {homeTeam.shortName.slice(0, 3)}
                </span>
              </div>
              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full"
                style={{ color: homeTeam.color }}
              >
                {homeTeam.shortName || homeTeam.name}
              </h2>
              {/* Cards summary */}
              <div className="flex gap-1 mt-2 min-h-[20px]">
                {Array.from({ length: homeYellows }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-yellow-400" />
                ))}
                {Array.from({ length: homeReds }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-red-500" />
                ))}
              </div>
            </div>

            {/* Score + Timer center */}
            <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 py-6 md:py-10 bg-white/[0.02] border-x border-white/[0.04] min-w-[200px] md:min-w-[280px]">
              {/* Score */}
              <div className="flex items-baseline justify-center gap-2 md:gap-4">
                <span
                  className="text-7xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black leading-none tabular-nums"
                  style={{ color: homeTeam.color }}
                >
                  {homeScore}
                </span>
                <span className="text-2xl md:text-4xl font-extralight text-white/15">-</span>
                <span
                  className="text-7xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black leading-none tabular-nums"
                  style={{ color: awayTeam.color }}
                >
                  {awayScore}
                </span>
              </div>

              {/* Timer */}
              <div className="mt-3 md:mt-4 flex flex-col items-center">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl md:text-5xl lg:text-6xl font-mono font-bold tabular-nums ${
                      isLive ? 'text-white' : 'text-white/30'
                    }`}
                  >
                    {formatTime(currentTime)}
                  </span>
                </div>
                <p className="text-[11px] md:text-sm text-white/25 uppercase tracking-[0.2em] font-semibold mt-1">
                  {PERIOD_LABELS[period]}
                </p>
              </div>
            </div>

            {/* Away Team */}
            <div
              className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-14 relative"
              style={{
                background: `linear-gradient(225deg, ${awayTeam.color}15, ${awayTeam.color}05)`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-1.5 h-full"
                style={{ backgroundColor: awayTeam.color }}
              />
              <div
                className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                style={{
                  backgroundColor: `${awayTeam.color}20`,
                  border: `2px solid ${awayTeam.color}40`,
                }}
              >
                <span
                  className="text-2xl md:text-4xl lg:text-5xl font-black"
                  style={{ color: awayTeam.color }}
                >
                  {awayTeam.shortName.slice(0, 3)}
                </span>
              </div>
              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full"
                style={{ color: awayTeam.color }}
              >
                {awayTeam.shortName || awayTeam.name}
              </h2>
              {/* Cards summary */}
              <div className="flex gap-1 mt-2 min-h-[20px]">
                {Array.from({ length: awayYellows }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-yellow-400" />
                ))}
                {Array.from({ length: awayReds }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-red-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event Timeline */}
        {recentEvents.length > 0 && (
          <div className="mt-4 md:mt-6 px-2">
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              {recentEvents.map((ev) => {
                const team = ev.team === 'home' ? homeTeam : awayTeam;
                return (
                  <div key={ev.id} className="flex items-center gap-1.5 bg-white/[0.04] rounded-full px-3 py-1.5 border border-white/[0.04]">
                    <span className="text-base md:text-lg">{EVENT_ICONS[ev.type]}</span>
                    <span
                      className="text-[10px] md:text-xs font-bold uppercase"
                      style={{ color: team.color }}
                    >
                      {team.shortName.slice(0, 5)}
                    </span>
                    {ev.playerName && (
                      <span className="text-[10px] md:text-xs text-white/30">({ev.playerName})</span>
                    )}
                    <span className="text-[10px] md:text-xs font-mono text-white/25">{ev.minute}&apos;</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 w-full px-6 md:px-10 pb-4 flex items-center justify-center">
        <p className="text-white/10 text-[10px] uppercase tracking-[0.3em]">Profutbol — Marcador para Canchas</p>
      </div>
    </div>
  );
}