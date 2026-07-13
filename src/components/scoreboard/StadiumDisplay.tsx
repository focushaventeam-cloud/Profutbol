'use client';

import { useEffect, useRef } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { PERIOD_LABELS, EVENT_ICONS, DEFAULT_SKIN } from '@/types';
import type { MatchEvent, AdData, SkinData } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Ad banner component — shows current ad with auto-cycling support (image + video)
function AdBanner({ ads, activeAdIndex, skin }: { ads: AdData[]; activeAdIndex: number; skin: SkinData }) {
  const currentAd = ads.length > 0 ? ads[activeAdIndex % ads.length] : null;

  if (!currentAd) {
    return (
      <div
        className="w-full max-w-5xl mx-auto h-14 md:h-16 rounded-xl flex items-center justify-center"
        style={{ border: `1px dashed ${skin.textColor}20`, background: `${skin.textColor}05` }}
      >
        <span
          className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold"
          style={{ color: `${skin.textColor}25` }}
        >
          Espacio Publicitario
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden h-14 md:h-16 flex items-center justify-center relative"
      style={{ border: `1px solid ${skin.panelBorder}`, background: skin.panelBackground }}
    >
      {currentAd.mediaType === 'video' && currentAd.mediaData ? (
        <video
          src={currentAd.mediaData}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : currentAd.mediaType === 'image' && currentAd.mediaData ? (
        <img
          src={currentAd.mediaData}
          alt={currentAd.text || 'Patrocinador'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="text-sm md:text-base font-bold uppercase tracking-widest text-shadow-sm"
          style={{ color: `${skin.textColor}60` }}
        >
          {currentAd.text}
        </span>
      )}
    </div>
  );
}

// Event pill for the timeline
function EventPill({ ev, homeTeam, awayTeam, skin }: { ev: MatchEvent; homeTeam: { shortName: string; color: string }; awayTeam: { shortName: string; color: string }; skin: SkinData }) {
  const team = ev.team === 'home' ? homeTeam : awayTeam;
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 animate-slide-in-up"
      style={{
        background: skin.panelBackground,
        border: `1px solid ${skin.panelBorder}`,
      }}
    >
      <span className="text-base md:text-lg">{EVENT_ICONS[ev.type]}</span>
      <span
        className="text-[10px] md:text-xs font-bold uppercase text-shadow-sm"
        style={{ color: team.color }}
      >
        {team.shortName.slice(0, 5)}
      </span>
      {ev.playerName && (
        <span className="text-[10px] md:text-xs" style={{ color: `${skin.textColor}40` }}>
          ({ev.playerName})
        </span>
      )}
      <span className="text-[10px] md:text-xs font-mono" style={{ color: `${skin.textColor}30` }}>
        {ev.minute}&apos;
      </span>
    </div>
  );
}

export function StadiumDisplay() {
  const match = useScoreboardStore((s) => s.match);
  const skins = useScoreboardStore((s) => s.skins);
  const activeSkinId = useScoreboardStore((s) => s.activeSkinId);
  const ads = useScoreboardStore((s) => s.ads);
  const activeAdIndex = useScoreboardStore((s) => s.activeAdIndex);
  const cycleAd = useScoreboardStore((s) => s.cycleAd);

  const skin = skins.find((sk) => sk.id === activeSkinId) || DEFAULT_SKIN;
  const currentAd = ads.length > 0 ? ads[activeAdIndex % ads.length] : null;

  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status,
    period,
    currentTime,
    events,
    field,
    halfDuration,
    format,
  } = match;

  const extraTimeAdded = match.extraTimeAdded || 0;

  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isHalftime = status === 'halftime';

  // Last 8 events
  const recentEvents = events.slice(0, 8);

  // Card counts
  const homeYellows = events.filter((e) => e.type === 'yellow_card' && e.team === 'home').length;
  const homeReds = events.filter((e) => e.type === 'red_card' && e.team === 'home').length;
  const awayYellows = events.filter((e) => e.type === 'yellow_card' && e.team === 'away').length;
  const awayReds = events.filter((e) => e.type === 'red_card' && e.team === 'away').length;

  // Auto-cycle ads
  const adTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (adTimerRef.current) clearInterval(adTimerRef.current);
    if (ads.length > 1 && currentAd) {
      adTimerRef.current = setInterval(() => {
        cycleAd();
      }, (currentAd.duration || 15) * 1000);
    }
    return () => { if (adTimerRef.current) clearInterval(adTimerRef.current); };
  }, [ads, activeAdIndex, currentAd, cycleAd]);

  // Format display helpers
  const formatLabel = format.replace('futbol', 'Fútbol ');

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden select-none display-mode"
      style={{ backgroundColor: skin.backgroundColor }}
    >
      {/* Animated parallax background */}
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />

      {/* ── Top Ad Banner ──────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-10 pt-4">
        <AdBanner ads={ads} activeAdIndex={activeAdIndex} skin={skin} />
      </div>

      {/* ── Competition Header ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: skin.accentColor }}
          >
            <span className="text-white font-black text-[10px]">PF</span>
          </div>
          <span
            className="text-xs md:text-sm font-medium uppercase tracking-widest text-shadow-sm"
            style={{ color: `${skin.textColor}50` }}
          >
            {field}
          </span>
          <span style={{ color: `${skin.textColor}15` }}>|</span>
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: `${skin.textColor}35` }}
          >
            {formatLabel}
          </span>
          <span style={{ color: `${skin.textColor}15` }}>|</span>
          <span className="text-xs" style={{ color: `${skin.textColor}35` }}>
            {halfDuration}min c/tiempo
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isLive && (
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 animate-pulse-glow"
              style={{
                backgroundColor: `${skin.accentColor}20`,
                border: `1px solid ${skin.accentColor}30`,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: skin.accentColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: skin.accentColor }}
                />
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider text-shadow-sm"
                style={{ color: skin.accentColor }}
              >
                EN VIVO
              </span>
            </div>
          )}
          {isFinished && (
            <div
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: '#ef444420',
                border: '1px solid #ef444430',
              }}
            >
              <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider text-shadow-sm">
                FINALIZADO
              </span>
            </div>
          )}
          {isHalftime && (
            <div
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: '#f59e0b20',
                border: '1px solid #f59e0b30',
              }}
            >
              <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider text-shadow-sm">
                MEDIO TIEMPO
              </span>
            </div>
          )}
          {status === 'waiting' && (
            <div
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: `${skin.textColor}08`,
                border: `1px solid ${skin.textColor}15`,
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-wider opacity-40"
                style={{ color: skin.textColor }}
              >
                SIN INICIAR
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Scoreboard ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 flex-1 flex flex-col justify-center">
        <div className="glass-panel-strong overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
            {/* ── Home Team ─────────────────────────────────────────────── */}
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

              {/* Logo or Initials */}
              {homeTeam.logo ? (
                <img
                  src={homeTeam.logo}
                  alt={homeTeam.shortName}
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain mb-3 md:mb-4 rounded-2xl"
                />
              ) : (
                <div
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                  style={{
                    backgroundColor: `${homeTeam.color}20`,
                    border: `2px solid ${homeTeam.color}40`,
                  }}
                >
                  <span
                    className="text-2xl md:text-4xl lg:text-5xl font-black text-shadow-md"
                    style={{ color: homeTeam.color }}
                  >
                    {homeTeam.shortName.slice(0, 3)}
                  </span>
                </div>
              )}

              {/* Team Name */}
              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full text-shadow-md"
                style={{ color: homeTeam.color }}
              >
                {homeTeam.shortName || homeTeam.name}
              </h2>

              {/* Card Summary */}
              <div className="flex gap-1 mt-2 min-h-[20px]">
                {Array.from({ length: homeYellows }).map((_, i) => (
                  <span
                    key={`hy-${i}`}
                    className="inline-block w-4 h-5 rounded-sm card-yellow"
                  />
                ))}
                {Array.from({ length: homeReds }).map((_, i) => (
                  <span
                    key={`hr-${i}`}
                    className="inline-block w-4 h-5 rounded-sm card-red"
                  />
                ))}
              </div>
            </div>

            {/* ── Score + Timer ─────────────────────────────────────────── */}
            <div
              className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 py-6 md:py-10 border-x min-w-[200px] md:min-w-[280px]"
              style={{
                borderColor: skin.panelBorder,
                background: `${skin.textColor}03`,
              }}
            >
              <div className="flex items-baseline justify-center gap-2 md:gap-4">
                <span
                  className="text-[6rem] md:text-[9rem] lg:text-[11rem] xl:text-[14rem] font-black leading-none tabular-nums text-shadow-lg"
                  style={{ color: skin.scoreColor }}
                >
                  {homeScore}
                </span>
                <span
                  className="text-2xl md:text-4xl font-extralight"
                  style={{ color: `${skin.textColor}15` }}
                >
                  -
                </span>
                <span
                  className="text-[6rem] md:text-[9rem] lg:text-[11rem] xl:text-[14rem] font-black leading-none tabular-nums text-shadow-lg"
                  style={{ color: skin.scoreColor }}
                >
                  {awayScore}
                </span>
              </div>

              <div className="mt-3 md:mt-4 flex flex-col items-center">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-3xl md:text-5xl lg:text-6xl font-mono font-bold tabular-nums text-shadow-md ${isLive ? '' : 'opacity-30'}`}
                    style={{ color: skin.timerColor }}
                  >
                    {formatTime(currentTime)}
                  </span>
                  {extraTimeAdded > 0 && isLive && (
                    <span
                      className="text-base md:text-xl font-bold text-shadow-sm"
                      style={{ color: skin.timerColor, opacity: 0.7 }}
                    >
                      +{extraTimeAdded}
                    </span>
                  )}
                </div>
                <p
                  className="text-[11px] md:text-sm uppercase tracking-[0.2em] font-semibold mt-1"
                  style={{ color: `${skin.textColor}`, opacity: 0.25 }}
                >
                  {PERIOD_LABELS[period]}
                </p>
              </div>
            </div>

            {/* ── Away Team ─────────────────────────────────────────────── */}
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

              {awayTeam.logo ? (
                <img
                  src={awayTeam.logo}
                  alt={awayTeam.shortName}
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain mb-3 md:mb-4 rounded-2xl"
                />
              ) : (
                <div
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                  style={{
                    backgroundColor: `${awayTeam.color}20`,
                    border: `2px solid ${awayTeam.color}40`,
                  }}
                >
                  <span
                    className="text-2xl md:text-4xl lg:text-5xl font-black text-shadow-md"
                    style={{ color: awayTeam.color }}
                  >
                    {awayTeam.shortName.slice(0, 3)}
                  </span>
                </div>
              )}

              <h2
                className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wide text-center truncate max-w-full text-shadow-md"
                style={{ color: awayTeam.color }}
              >
                {awayTeam.shortName || awayTeam.name}
              </h2>

              <div className="flex gap-1 mt-2 min-h-[20px]">
                {Array.from({ length: awayYellows }).map((_, i) => (
                  <span
                    key={`ay-${i}`}
                    className="inline-block w-4 h-5 rounded-sm card-yellow"
                  />
                ))}
                {Array.from({ length: awayReds }).map((_, i) => (
                  <span
                    key={`ar-${i}`}
                    className="inline-block w-4 h-5 rounded-sm card-red"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Event Timeline ────────────────────────────────────────────── */}
        {recentEvents.length > 0 && (
          <div className="mt-4 md:mt-6 px-2">
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              {recentEvents.map((ev) => (
                <EventPill
                  key={ev.id}
                  ev={ev}
                  homeTeam={homeTeam as { shortName: string; color: string }}
                  awayTeam={awayTeam as { shortName: string; color: string }}
                  skin={skin}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Ad Banner (second ad if available) ─────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-10 pb-2">
        <AdBanner
          ads={ads}
          activeAdIndex={ads.length > 1 ? (activeAdIndex + 1) % ads.length : activeAdIndex}
          skin={skin}
        />
      </div>

      {/* ── Bottom Branding ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-6 md:px-10 pb-4 flex items-center justify-center">
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: `${skin.textColor}`, opacity: 0.08 }}
        >
          Profutbol — Marcador de Estadio
        </p>
      </div>
    </div>
  );
}