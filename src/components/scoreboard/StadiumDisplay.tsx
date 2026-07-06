'use client';

import { useScoreboardStore } from '@/stores/scoreboardStore';
import { PERIOD_LABELS, STATUS_LABELS, EVENT_ICONS, SkinData } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function AdBanner({ skin }: { skin: SkinData }) {
  const ads = useScoreboardStore((s) => s.ads);
  const idx = useScoreboardStore((s) => s.activeAdIndex);
  const ad = ads.length > 0 ? ads[idx % ads.length] : null;

  if (!ad) {
    return (
      <div className="ad-space rounded-xl py-2 px-4" style={{ borderColor: `${skin.primaryColor}30` }}>
        <div className="rounded-lg py-2 text-center" style={{ background: `${skin.primaryColor}08` }}>
          <p className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.2em]" style={{ color: `${skin.textColor}30` }}>
            Patrocinador Oficial
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-space rounded-xl py-2 px-4" style={{ borderColor: `${skin.primaryColor}30` }}>
      <div className="rounded-lg py-2 px-4 flex items-center justify-center gap-3" style={{ background: `${skin.primaryColor}10` }}>
        {ad.imageUrl && <img src={ad.imageUrl} alt={ad.text} className="h-6 sm:h-8 md:h-10 object-contain" />}
        <p className="text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.2em]" style={{ color: `${skin.textColor}50` }}>
          {ad.text}
        </p>
      </div>
    </div>
  );
}

function EventTimeline({ skin }: { skin: SkinData }) {
  const events = useScoreboardStore((s) => s.match.events);
  const homeTeam = useScoreboardStore((s) => s.match.homeTeam);
  const awayTeam = useScoreboardStore((s) => s.match.awayTeam);
  const recent = events.slice(0, 8);

  if (recent.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-4 md:p-5" style={{ background: `${skin.secondaryColor}15`, borderColor: `${skin.primaryColor}20` }}>
      <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-1">
        <div className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2" style={{ background: `${skin.textColor}10` }} />
        {recent.map((ev) => {
          const team = ev.team === 'home' ? homeTeam : awayTeam;
          return (
            <div key={ev.id} className="relative z-10 flex flex-col items-center gap-1 min-w-[52px] sm:min-w-[64px]">
              <div className="text-xl sm:text-2xl md:text-3xl leading-none">{EVENT_ICONS[ev.type]}</div>
              <div className="text-[10px] sm:text-xs font-bold font-mono" style={{ color: skin.textColor }}>{ev.minute}&apos;</div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: team.primaryColor }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StadiumDisplay() {
  const skin = useScoreboardStore((s) => s.getActiveSkin());
  const homeTeam = useScoreboardStore((s) => s.match.homeTeam);
  const awayTeam = useScoreboardStore((s) => s.match.awayTeam);
  const homeScore = useScoreboardStore((s) => s.match.homeScore);
  const awayScore = useScoreboardStore((s) => s.match.awayScore);
  const status = useScoreboardStore((s) => s.match.status);
  const period = useScoreboardStore((s) => s.match.period);
  const currentTime = useScoreboardStore((s) => s.match.currentTime);
  const addedTime = useScoreboardStore((s) => s.match.addedTime);
  const competition = useScoreboardStore((s) => s.match.competition);
  const venue = useScoreboardStore((s) => s.match.venue);

  const isLive = status === 'live';
  const displayAdded = (period === 'extra_time_first' || period === 'extra_time_second')
    ? useScoreboardStore((s) => s.match.extraTimeAdded)
    : addedTime;

  return (
    <div className="h-screen w-screen relative overflow-hidden select-none" style={{ backgroundColor: skin.backgroundColor }}>
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />

      <div className="relative z-10 h-full p-3 sm:p-5 md:p-8 lg:p-10 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5">

          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-shadow-sm" style={{ color: `${skin.textColor}90` }}>
                {competition}
              </span>
              <span className="text-[10px] sm:text-xs" style={{ color: `${skin.textColor}30` }}>│</span>
              <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider" style={{ color: `${skin.textColor}50` }}>{venue}</span>
            </div>
            {isLive ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500" />
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider font-black text-green-400">
                  {STATUS_LABELS[status]}
                </span>
              </div>
            ) : status !== 'scheduled' ? (
              <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider font-bold" style={{ color: `${skin.textColor}60` }}>
                {STATUS_LABELS[status]}
              </span>
            ) : null}
          </div>

          {/* Top Ad */}
          <AdBanner skin={skin} />

          {/* Main Scoreboard */}
          <div className="glass-panel-strong rounded-3xl p-4 sm:p-6 md:p-10 lg:p-14 relative overflow-hidden" style={{ borderColor: `${skin.primaryColor}20`, background: `linear-gradient(135deg, ${skin.secondaryColor}20, ${skin.backgroundColor}40)` }}>
            <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: `linear-gradient(135deg, ${skin.primaryColor}08, transparent 60%)` }} />
            <div className="relative z-10">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 md:gap-8 items-center">
                {/* Home Team */}
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  {homeTeam.logo && (
                    <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center border-2 md:border-4" style={{ borderColor: `${homeTeam.primaryColor}50`, background: `linear-gradient(135deg, ${homeTeam.primaryColor}20, ${homeTeam.secondaryColor}15)` }}>
                      <img src={homeTeam.logo} alt={homeTeam.shortName} className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain" />
                    </div>
                  )}
                  <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-wide text-shadow-md truncate max-w-full" style={{ color: homeTeam.primaryColor || skin.primaryColor }}>
                    {homeTeam.shortName || homeTeam.name}
                  </span>
                </div>

                {/* Score + Timer */}
                <div className="text-center px-1 sm:px-4">
                  <div className="flex items-baseline justify-center">
                    <span key={`h${homeScore}`} className="text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] font-black leading-none text-shadow-lg tabular-nums animate-score-flash" style={{ color: skin.scoreColor }}>
                      {homeScore}
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mx-1 sm:mx-3 md:mx-5 lg:mx-6 text-shadow-md" style={{ color: `${skin.textColor}25` }}>–</span>
                    <span key={`a${awayScore}`} className="text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] font-black leading-none text-shadow-lg tabular-nums animate-score-flash" style={{ color: skin.scoreColor }}>
                      {awayScore}
                    </span>
                  </div>
                  <div className="mt-1 sm:mt-2 md:mt-3 flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mono font-bold text-shadow-md tabular-nums" style={{ color: skin.timerColor }}>
                      {formatTime(currentTime)}
                    </span>
                    {displayAdded > 0 && (
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono font-bold text-shadow-sm" style={{ color: skin.primaryColor }}>
                        +{displayAdded}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.2em] font-semibold mt-1 sm:mt-2 text-shadow-sm" style={{ color: `${skin.textColor}45` }}>
                    {PERIOD_LABELS[period]}
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  {awayTeam.logo && (
                    <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center border-2 md:border-4" style={{ borderColor: `${awayTeam.primaryColor}50`, background: `linear-gradient(135deg, ${awayTeam.primaryColor}20, ${awayTeam.secondaryColor}15)` }}>
                      <img src={awayTeam.logo} alt={awayTeam.shortName} className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain" />
                    </div>
                  )}
                  <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-wide text-shadow-md truncate max-w-full" style={{ color: awayTeam.primaryColor || skin.primaryColor }}>
                    {awayTeam.shortName || awayTeam.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <EventTimeline skin={skin} />

          {/* Bottom Ad */}
          <AdBanner skin={skin} />
        </div>
      </div>
    </div>
  );
}