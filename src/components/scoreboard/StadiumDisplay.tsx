'use client';

import { useScoreboardStore } from '@/stores/scoreboardStore';
import { PERIOD_LABELS, EVENT_ICONS, DEFAULT_SKIN } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function StadiumDisplay() {
  const match = useScoreboardStore((s) => s.match);
  const skins = useScoreboardStore((s) => s.skins);
  const activeSkinId = useScoreboardStore((s) => s.activeSkinId);
  const skin = skins.find((sk) => sk.id === activeSkinId) || DEFAULT_SKIN;
  const { homeTeam, awayTeam, homeScore, awayScore, status, period, currentTime, events, field, halfDuration, format } = match;
  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isHalftime = status === 'halftime';

  const recentEvents = events.slice(0, 6);
  const homeYellows = events.filter(e => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = events.filter(e => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = events.filter(e => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = events.filter(e => e.type === 'red_card' && e.team === 'away').length;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden select-none" style={{ backgroundColor: skin.backgroundColor }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${skin.accentColor}08, transparent 70%)` }} />

      {/* Top bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: skin.accentColor }}>
            <span className="text-white font-black text-[10px]">PF</span>
          </div>
          <span className="text-xs md:text-sm font-medium uppercase tracking-widest" style={{ color: `${skin.textColor}50` }}>{field}</span>
          <span style={{ color: `${skin.textColor}15` }}>|</span>
          <span className="text-xs uppercase tracking-wider" style={{ color: `${skin.textColor}35` }}>{format.replace('futbol', 'Fútbol ')}</span>
          <span style={{ color: `${skin.textColor}15` }}>|</span>
          <span className="text-xs" style={{ color: `${skin.textColor}35` }}>{halfDuration}min c/tiempo</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: `${skin.accentColor}20`, border: `1px solid ${skin.accentColor}30` }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: skin.accentColor }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: skin.accentColor }} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: skin.accentColor }}>En Vivo</span>
            </div>
          )}
          {isFinished && (
            <div className="rounded-full px-3 py-1" style={{ backgroundColor: '#ef444420', border: '1px solid #ef444430' }}>
              <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">Finalizado</span>
            </div>
          )}
          {isHalftime && (
            <div className="rounded-full px-3 py-1" style={{ backgroundColor: '#f59e0b20', border: '1px solid #f59e0b30' }}>
              <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">Medio Tiempo</span>
            </div>
          )}
          {status === 'waiting' && (
            <div className="rounded-full px-3 py-1" style={{ backgroundColor: `${skin.textColor}08`, border: `1px solid ${skin.textColor}15` }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `${skin.textColor}40` }}>Sin Iniciar</span>
            </div>
          )}
        </div>
      </div>

      {/* Main scoreboard */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex-1 flex flex-col justify-center">
        <div
          className="rounded-3xl overflow-hidden backdrop-blur-sm"
          style={{ border: `1px solid ${skin.panelBorder}`, background: skin.panelBackground }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
            {/* Home Team */}
            <div
              className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-14 relative"
              style={{ background: `linear-gradient(135deg, ${homeTeam.color}15, ${homeTeam.color}05)` }}
            >
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: homeTeam.color }} />
              {/* Logo or Initials */}
              {homeTeam.logo ? (
                <img
                  src={homeTeam.logo}
                  alt=""
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain mb-3 md:mb-4 rounded-2xl"
                />
              ) : (
                <div
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                  style={{ backgroundColor: `${homeTeam.color}20`, border: `2px solid ${homeTeam.color}40` }}
                >
                  <span className="text-2xl md:text-4xl lg:text-5xl font-black" style={{ color: homeTeam.color }}>
                    {homeTeam.shortName.slice(0, 3)}
                  </span>
                </div>
              )}
              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full"
                style={{ color: homeTeam.color }}
              >
                {homeTeam.shortName || homeTeam.name}
              </h2>
              <div className="flex gap-1 mt-2 min-h-[20px]">
                {Array.from({ length: homeYellows }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-yellow-400" />
                ))}
                {Array.from({ length: homeReds }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-5 rounded-sm bg-red-500" />
                ))}
              </div>
            </div>

            {/* Score + Timer */}
            <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 py-6 md:py-10 border-x min-w-[200px] md:min-w-[280px]" style={{ borderColor: skin.panelBorder, background: `${skin.textColor}03` }}>
              <div className="flex items-baseline justify-center gap-2 md:gap-4">
                <span
                  className="text-7xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black leading-none tabular-nums"
                  style={{ color: skin.scoreColor }}
                >
                  {homeScore}
                </span>
                <span className="text-2xl md:text-4xl font-extralight" style={{ color: `${skin.textColor}15` }}>-</span>
                <span
                  className="text-7xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black leading-none tabular-nums"
                  style={{ color: skin.scoreColor }}
                >
                  {awayScore}
                </span>
              </div>
              <div className="mt-3 md:mt-4 flex flex-col items-center">
                <span
                  className={`text-3xl md:text-5xl lg:text-6xl font-mono font-bold tabular-nums ${isLive ? '' : 'opacity-30'}`}
                  style={{ color: skin.timerColor }}
                >
                  {formatTime(currentTime)}
                </span>
                <p className="text-[11px] md:text-sm uppercase tracking-[0.2em] font-semibold mt-1" style={{ color: `${skin.textColor}25` }}>
                  {PERIOD_LABELS[period]}
                </p>
              </div>
            </div>

            {/* Away Team */}
            <div
              className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-14 relative"
              style={{ background: `linear-gradient(225deg, ${awayTeam.color}15, ${awayTeam.color}05)` }}
            >
              <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: awayTeam.color }} />
              {awayTeam.logo ? (
                <img
                  src={awayTeam.logo}
                  alt=""
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain mb-3 md:mb-4 rounded-2xl"
                />
              ) : (
                <div
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                  style={{ backgroundColor: `${awayTeam.color}20`, border: `2px solid ${awayTeam.color}40` }}
                >
                  <span className="text-2xl md:text-4xl lg:text-5xl font-black" style={{ color: awayTeam.color }}>
                    {awayTeam.shortName.slice(0, 3)}
                  </span>
                </div>
              )}
              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full"
                style={{ color: awayTeam.color }}
              >
                {awayTeam.shortName || awayTeam.name}
              </h2>
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
                  <div key={ev.id} className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: skin.panelBackground, border: `1px solid ${skin.panelBorder}` }}>
                    <span className="text-base md:text-lg">{EVENT_ICONS[ev.type]}</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase" style={{ color: team.color }}>
                      {team.shortName.slice(0, 5)}
                    </span>
                    {ev.playerName && (
                      <span className="text-[10px] md:text-xs" style={{ color: `${skin.textColor}30` }}>({ev.playerName})</span>
                    )}
                    <span className="text-[10px] md:text-xs font-mono" style={{ color: `${skin.textColor}25` }}>{ev.minute}&apos;</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 w-full px-6 md:px-10 pb-4 flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${skin.textColor}10` }}>Profutbol — Marcador para Canchas</p>
      </div>
    </div>
  );
}