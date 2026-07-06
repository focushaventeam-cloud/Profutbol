'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Tipos ───────────────────────────────────────────
interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var_review';
  team: 'home' | 'away';
  player: string;
  minute: number;
  description?: string;
  relatedPlayer?: string;
}

interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
}

// ─── Datos Demo ──────────────────────────────────────
const homeTeam: Team = {
  id: 't1', name: 'Real Madrid', shortName: 'RMA', logo: '⚪',
  primaryColor: '#FFFFFF', secondaryColor: '#FEBE10',
};
const awayTeam: Team = {
  id: 't2', name: 'FC Barcelona', shortName: 'BAR', logo: '🔵',
  primaryColor: '#A50044', secondaryColor: '#004D98',
};

const demoEvents: MatchEvent[] = [
  { id: 'e1', type: 'goal', team: 'home', player: 'Vinícius Jr.', minute: 12, description: 'Gol' },
  { id: 'e2', type: 'yellow_card', team: 'away', player: 'Araújo', minute: 18, description: 'Falta' },
  { id: 'e3', type: 'goal', team: 'away', player: 'Lewandowski', minute: 23, description: 'Gol de cabeza' },
  { id: 'e4', type: 'yellow_card', team: 'home', player: 'Carvajal', minute: 31, description: 'Falta' },
  { id: 'e5', type: 'goal', team: 'home', player: 'Bellingham', minute: 38, description: 'Remate desde fuera del área' },
  { id: 'e6', type: 'var_review', team: 'away', player: 'Raphinha', minute: 44, description: 'Posible penalti' },
  { id: 'e7', type: 'goal', team: 'away', player: 'Lamine Yamal', minute: 52, description: 'Gol' },
  { id: 'e8', type: 'substitution', team: 'home', player: 'Rodrygo', minute: 60, description: 'Entra por Mbappé', relatedPlayer: 'Mbappé' },
  { id: 'e9', type: 'yellow_card', team: 'away', player: 'Gavi', minute: 67, description: 'Tactical foul' },
  { id: 'e10', type: 'goal', team: 'home', player: 'Valverde', minute: 74, description: 'Gol' },
  { id: 'e11', type: 'red_card', team: 'away', player: 'Cubarsí', minute: 82, description: 'Doble amarilla' },
];

const demoStats: MatchStats = {
  possession: { home: 48, away: 52 },
  shots: { home: 14, away: 11 },
};

// ─── Helpers ─────────────────────────────────────────
const getEventIcon = (type: string) => {
  switch (type) {
    case 'goal': return '⚽';
    case 'yellow_card': return '🟨';
    case 'red_card': return '🟥';
    case 'substitution': return '🔄';
    case 'var_review': return '📺';
    default: return '📋';
  }
};

const getEventLabel = (type: string) => {
  switch (type) {
    case 'goal': return 'GOL';
    case 'yellow_card': return 'AMARILLA';
    case 'red_card': return 'ROJA';
    case 'substitution': return 'CAMBIO';
    case 'var_review': return 'VAR';
    default: return 'EVENTO';
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getPeriodLabel = (minute: number): string => {
  if (minute <= 45) return '1er Tiempo';
  if (minute <= 90) return '2do Tiempo';
  if (minute <= 105) return 'Prórroga 1';
  if (minute <= 120) return 'Prórroga 2';
  return 'Penales';
};

// ─── Componente Principal ────────────────────────────
export default function StadiumDisplay() {
  const [homeScore, setHomeScore] = useState(3);
  const [awayScore, setAwayScore] = useState(2);
  const [time, setTime] = useState(5547); // 92:27 in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [events, setEvents] = useState<MatchEvent[]>(demoEvents);
  const [currentAd, setCurrentAd] = useState(0);

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto pause at 45:00 and 90:00
  useEffect(() => {
    const mins = Math.floor(time / 60);
    if (mins === 45 && time % 60 === 0) setIsRunning(false);
    if (mins === 90 && time % 60 === 0) setIsRunning(false);
  }, [time]);

  // Ad rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const displayMinute = Math.min(Math.floor(time / 60), 90);
  const addedTime = displayMinute >= 45 ? 3 : 0;

  // Simulate score from events
  useEffect(() => {
    const homeGoals = events.filter(e => e.type === 'goal' && e.team === 'home').length;
    const awayGoals = events.filter(e => e.type === 'goal' && e.team === 'away').length;
    setHomeScore(homeGoals);
    setAwayScore(awayGoals);
  }, [events]);

  return (
    <div className="h-screen w-screen relative overflow-hidden select-none">
      {/* ═══ Fondo Parallax ═══ */}
      <div
        className="parallax-bg"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(30, 58, 138, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(30, 58, 138, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #0a1628 100%)
          `,
          animation: 'parallaxShift 20s ease-in-out infinite',
        }}
      />

      {/* ═══ Bokeh de Estadio ═══ */}
      <div
        className="stadium-bokeh"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 85% 65%, rgba(255, 255, 255, 0.09) 0%, transparent 35%),
            radial-gradient(circle at 45% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 70% 15%, rgba(255, 255, 255, 0.07) 0%, transparent 30%),
            radial-gradient(circle at 30% 55%, rgba(255, 255, 255, 0.05) 0%, transparent 45%)
          `,
          filter: 'blur(60px)',
          animation: 'bokehFloat 15s ease-in-out infinite',
        }}
      />

      {/* ═══ Contenido ═══ */}
      <div className="relative z-10 h-full p-4 md:p-8 lg:p-12 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center gap-4 md:gap-6">

          {/* ─── Espacio Publicitario Superior ─── */}
          <AdSpace currentAd={currentAd} />

          {/* ─── Marcador Principal ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="glass-panel-main rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden"
          >
            {/* Efecto brillo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

            <div className="relative z-10">
              {/* Grid: Logo Local — Marcador — Logo Visitante */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">

                {/* Logo Equipo Local */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full flex items-center justify-center border-4 backdrop-blur-sm"
                    style={{
                      borderColor: `${homeTeam.primaryColor}60`,
                      background: `linear-gradient(135deg, ${homeTeam.primaryColor}20, ${homeTeam.secondaryColor}20)`,
                    }}
                  >
                    <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl">{homeTeam.logo}</span>
                  </motion.div>
                </div>

                {/* Centro: Marcador + Cronómetro */}
                <div className="text-center px-2 sm:px-4">
                  {/* Nombres de equipos */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-4">
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white/90 text-right max-w-[120px] sm:max-w-[180px] truncate">
                      {homeTeam.name}
                    </span>
                    <span className="text-white/30 text-xs sm:text-sm">VS</span>
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white/90 text-left max-w-[120px] sm:max-w-[180px] truncate">
                      {awayTeam.name}
                    </span>
                  </div>

                  {/* Marcador */}
                  <motion.div
                    key={`${homeScore}-${awayScore}`}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-2 sm:mb-4"
                    style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' }}
                  >
                    <span>{homeScore}</span>
                    <span className="text-white/30 mx-2 sm:mx-4">-</span>
                    <span>{awayScore}</span>
                  </motion.div>

                  {/* Cronómetro */}
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-blue-300 mb-1"
                    style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                  >
                    {formatTime(time)}
                    {addedTime > 0 && displayMinute >= 45 && (
                      <span className="text-lg sm:text-xl ml-2 text-yellow-400">+{addedTime}</span>
                    )}
                  </div>

                  {/* Período */}
                  <div className="text-xs sm:text-sm text-white/50 uppercase tracking-widest font-medium">
                    {getPeriodLabel(displayMinute)}
                  </div>

                  {/* Indicador EN VIVO */}
                  <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse"
                    />
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-red-400 font-bold">
                      En Vivo
                    </span>
                  </div>
                </div>

                {/* Logo Equipo Visitante */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full flex items-center justify-center border-4 backdrop-blur-sm"
                    style={{
                      borderColor: `${awayTeam.primaryColor}60`,
                      background: `linear-gradient(135deg, ${awayTeam.primaryColor}20, ${awayTeam.secondaryColor}20)`,
                    }}
                  >
                    <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl">{awayTeam.logo}</span>
                  </motion.div>
                </div>
              </div>

              {/* ─── Barras de Estadísticas ─── */}
              <div className="mt-8 sm:mt-10 md:mt-12 space-y-4 sm:space-y-5 max-w-2xl mx-auto">
                {/* Posesión */}
                <StatBar
                  label="Posesión"
                  value={demoStats.possession.home}
                  suffix="%"
                  homeValue={`${demoStats.possession.home}%`}
                  awayValue={`${demoStats.possession.away}%`}
                />
                {/* Tiros */}
                <StatBar
                  label="Tiros"
                  value={(demoStats.shots.home / (demoStats.shots.home + demoStats.shots.away)) * 100}
                  suffix=""
                  homeValue={`${demoStats.shots.home}`}
                  awayValue={`${demoStats.shots.away}`}
                />
              </div>
            </div>
          </motion.div>

          {/* ─── Timeline Horizontal de Eventos ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-panel-stats rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <div className="relative flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-custom">
              {/* Línea central */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />

              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.06 }}
                  className="relative z-10 flex flex-col items-center gap-1.5 min-w-[56px] sm:min-w-[72px] cursor-default group"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 glass-panel-event rounded-lg px-3 py-1.5 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="font-bold text-white">{getEventLabel(event.type)}</div>
                    <div className="text-white/60">{event.player}</div>
                    {event.description && (
                      <div className="text-white/40 text-[10px]">{event.description}</div>
                    )}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-white/10 border-r border-b border-white/15" />
                  </div>

                  {/* Icono */}
                  <div className="text-2xl sm:text-3xl md:text-4xl">{getEventIcon(event.type)}</div>

                  {/* Minuto */}
                  <div className="text-[10px] sm:text-xs font-bold text-white font-mono">
                    {event.minute}&apos;
                  </div>

                  {/* Indicador equipo */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      event.team === 'home' ? 'bg-blue-400' : 'bg-red-400'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Espacio Publicitario Inferior ─── */}
          <AdSpace currentAd={currentAd} />
        </div>
      </div>
    </div>
  );
}

// ─── Componentes Auxiliares ─────────────────────────

function StatBar({ label, value, suffix, homeValue, awayValue }: {
  label: string;
  value: number;
  suffix: string;
  homeValue: string;
  awayValue: string;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="text-xs sm:text-sm text-white/50 w-16 sm:w-20 text-right font-medium">{homeValue}</span>
      <div className="flex-1 relative">
        <div className="h-2 sm:h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            }}
          />
        </div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-white/30 font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-white/50 w-16 sm:w-20 font-medium">{awayValue}</span>
    </div>
  );
}

function AdSpace({ currentAd }: { currentAd: number }) {
  const ads = [
    { text: 'Patrocinador Oficial', color: 'from-blue-500/10 to-blue-600/5' },
    { text: 'Marca Oficial de la Liga', color: 'from-blue-500/10 to-slate-600/5' },
    { text: 'Partner Tecnológico', color: 'from-slate-500/10 to-blue-600/5' },
  ];

  return (
    <motion.div className="ad-space rounded-xl py-3 sm:py-4 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`bg-gradient-to-r ${ads[currentAd].color} rounded-lg py-3 sm:py-4 text-center`}
        >
          <p className="text-xs sm:text-sm md:text-base font-medium text-white/40 uppercase tracking-[0.2em]">
            {ads[currentAd].text}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}