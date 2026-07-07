'use client';

import { useState } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  MatchStatus, MatchPeriod, EventType, TeamSide, SkinData,
  EVENT_ICONS, EVENT_LABELS, PERIOD_LABELS, STATUS_LABELS,
} from '@/types';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ── Reusable Components ───────────────────────────────────────────────────────

function Section({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-panel rounded-xl p-4 mb-3 ${className}`}>
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-white/50 w-28 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Btn({ onClick, variant = 'default', size = 'sm', className = '', children, disabled }: {
  onClick?: () => void; variant?: string; size?: string; className?: string;
  children: React.ReactNode; disabled?: boolean;
}) {
  const base = 'rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5';
  const variants: Record<string, string> = {
    default: 'bg-white/10 hover:bg-white/20 border border-white/15',
    primary: 'bg-blue-500/25 hover:bg-blue-500/40 border border-blue-400/40 text-blue-300',
    danger: 'bg-red-500/25 hover:bg-red-500/40 border border-red-400/40 text-red-300',
    success: 'bg-green-500/25 hover:bg-green-500/40 border border-green-400/40 text-green-300',
    yellow: 'bg-yellow-500/25 hover:bg-yellow-500/40 border border-yellow-400/40 text-yellow-200',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-3 text-base' };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </button>
  );
}

function Inp({ value, onChange, placeholder = '', type = 'text', className = '' }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`glass-input rounded-lg px-3 py-1.5 text-sm text-white w-full ${className}`}
    />
  );
}

// ── Match Setup Tab ────────────────────────────────────────────────────────────

function MatchSetup() {
  const match = useScoreboardStore((s) => s.match);
  const setTeamName = useScoreboardStore((s) => s.setTeamName);
  const setTeamColor = useScoreboardStore((s) => s.setTeamColor);
  const setVenue = useScoreboardStore((s) => s.setVenue);
  const setCompetition = useScoreboardStore((s) => s.setCompetition);
  const addPlayer = useScoreboardStore((s) => s.addPlayer);
  const removePlayer = useScoreboardStore((s) => s.removePlayer);

  const [pName, setPName] = useState('');
  const [pNum, setPNum] = useState('');
  const [pSide, setPSide] = useState<TeamSide>('home');

  const addP = () => {
    if (pName.trim() && pNum.trim()) {
      addPlayer(pSide, { id: genId(), name: pName.trim(), number: parseInt(pNum) || 0 });
      setPName('');
      setPNum('');
    }
  };

  return (
    <div>
      <Section title="Competición">
        <Field label="Competición">
          <Inp value={match.competition} onChange={(v) => setCompetition(v)} placeholder="Nombre de la liga" />
        </Field>
        <Field label="Sede">
          <Inp value={match.venue} onChange={(v) => setVenue(v)} placeholder="Nombre del estadio" />
        </Field>
      </Section>

      {(['home', 'away'] as TeamSide[]).map((side) => {
        const team = side === 'home' ? match.homeTeam : match.awayTeam;
        const label = side === 'home' ? 'Local' : 'Visitante';
        const accentColor = side === 'home' ? 'text-blue-400' : 'text-red-400';
        return (
          <Section key={side} title={`Equipo ${label}`}>
            <Field label="Nombre">
              <Inp value={team.name} onChange={(v) => setTeamName(side, v, team.shortName)} placeholder="Nombre completo" />
            </Field>
            <Field label="Abreviatura">
              <Inp value={team.shortName} onChange={(v) => setTeamName(side, team.name, v)} placeholder="Ej: BAR, RMA" />
            </Field>
            <Field label="Color Prim.">
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={team.primaryColor}
                  onChange={(e) => setTeamColor(side, e.target.value, team.secondaryColor)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-white/40 font-mono">{team.primaryColor}</span>
              </div>
            </Field>
            <Field label="Color Sec.">
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={team.secondaryColor}
                  onChange={(e) => setTeamColor(side, team.primaryColor, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs text-white/40 font-mono">{team.secondaryColor}</span>
              </div>
            </Field>

            {/* Players */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-bold ${accentColor}`}>Jugadores ({team.players.length}):</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <select
                  value={pSide}
                  onChange={(e) => setPSide(e.target.value as TeamSide)}
                  className="glass-input rounded px-2 py-1.5 text-xs"
                >
                  <option value="home" className="bg-gray-900">Local</option>
                  <option value="away" className="bg-gray-900">Visitante</option>
                </select>
                {pSide === side && (
                  <>
                    <input
                      value={pNum}
                      onChange={(e) => setPNum(e.target.value)}
                      placeholder="#"
                      className="glass-input rounded px-2 py-1.5 text-xs w-14"
                      type="number"
                      min="0"
                    />
                    <input
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="Nombre del jugador"
                      className="glass-input rounded px-2 py-1.5 text-xs flex-1 min-w-0"
                      onKeyDown={(e) => { if (e.key === 'Enter') addP(); }}
                    />
                    <Btn onClick={addP} variant="success" size="sm">+ Agregar</Btn>
                  </>
                )}
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {team.players.length === 0 && (
                  <p className="text-xs text-white/20 text-center py-2">Sin jugadores agregados</p>
                )}
                {team.players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between glass-input rounded-lg px-3 py-1.5 text-xs group">
                    <span className="text-white/40 w-8 font-mono">#{p.number}</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => removePlayer(side, p.id)}
                      className="text-red-400/40 hover:text-red-400 ml-2 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        );
      })}
    </div>
  );
}

// ── Scoreboard Control Tab ─────────────────────────────────────────────────────

function ScoreControl() {
  const match = useScoreboardStore((s) => s.match);
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const startTimer = useScoreboardStore((s) => s.startTimer);
  const pauseTimer = useScoreboardStore((s) => s.pauseTimer);
  const resetTimer = useScoreboardStore((s) => s.resetTimer);
  const updateScore = useScoreboardStore((s) => s.updateScore);
  const setPeriod = useScoreboardStore((s) => s.setPeriod);
  const setStatus = useScoreboardStore((s) => s.setStatus);
  const setAddedTime = useScoreboardStore((s) => s.setAddedTime);
  const setExtraTimeAdded = useScoreboardStore((s) => s.setExtraTimeAdded);
  const resetMatch = useScoreboardStore((s) => s.resetMatch);

  const openDisplayWindow = () => {
    const base = window.location.origin + (window.location.pathname.includes('/Profutbol') ? '/Profutbol' : '');
    window.open(`${base}/marcador`, 'profutbol-display', 'width=1920,height=1080');
  };

  return (
    <div>
      {/* Open Second Screen Button */}
      <div className="glass-panel rounded-xl p-4 mb-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/20">
        <button
          type="button"
          onClick={openDisplayWindow}
          className="w-full py-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/35 border-2 border-blue-400/30 hover:border-blue-400/50 text-blue-200 font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div className="text-left">
            <div>Abrir Marcador en Segunda Pantalla</div>
            <div className="text-xs font-normal text-blue-300/50 mt-0.5">Se abre en una nueva ventana para el monitor del estadio</div>
          </div>
        </button>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Tambi&eacute;n puedes abrir manualmente: <span className="text-white/30 font-mono">/marcador</span> en la misma pesta&ntilde;a del navegador o en otro monitor
        </p>
      </div>

      {/* Score */}
      <Section title="Marcador">
        <div className="grid grid-cols-2 gap-3">
          {(['home', 'away'] as TeamSide[]).map((side) => {
            const score = side === 'home' ? match.homeScore : match.awayScore;
            const team = side === 'home' ? match.homeTeam : match.awayTeam;
            const label = side === 'home' ? 'LOCAL' : 'VISITA';
            return (
              <div key={side} className="glass-input rounded-xl p-4 text-center">
                <div className="text-xs font-bold mb-1" style={{ color: team.primaryColor }}>{label}</div>
                <div className="text-5xl font-black mb-3 tabular-nums" style={{ color: team.primaryColor }}>{score}</div>
                <div className="flex gap-2 justify-center">
                  <Btn onClick={() => updateScore(side, 1)} variant="success" size="sm">+ Gol</Btn>
                  <Btn onClick={() => updateScore(side, -1)} variant="danger" size="sm">- Gol</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Timer */}
      <Section title="Cronómetro">
        <div className="text-center mb-4">
          <div className={`text-5xl font-mono font-bold tracking-wider ${isTimerRunning ? 'text-green-400' : 'text-white/60'}`}>
            {formatTimer(match.currentTime)}
          </div>
          <div className="text-xs text-white/40 mt-2 flex items-center justify-center gap-2">
            <span>{PERIOD_LABELS[match.period]}</span>
            <span className="text-white/20">·</span>
            <span className={match.status === 'live' ? 'text-green-400/80' : ''}>{STATUS_LABELS[match.status]}</span>
          </div>
        </div>
        <div className="flex gap-2 justify-center mb-4">
          <Btn
            onClick={isTimerRunning ? pauseTimer : startTimer}
            variant={isTimerRunning ? 'danger' : 'success'}
            size="lg"
          >
            {isTimerRunning ? '⏸ Pausar' : '▶ Iniciar'}
          </Btn>
          <Btn onClick={resetTimer} variant="default" size="lg">↺ Reset</Btn>
        </div>
        <Field label="Período">
          <select
            value={match.period}
            onChange={(e) => setPeriod(e.target.value as MatchPeriod)}
            className="glass-input rounded-lg px-3 py-2 text-sm w-full"
          >
            {Object.entries(PERIOD_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select
            value={match.status}
            onChange={(e) => setStatus(e.target.value as MatchStatus)}
            className="glass-input rounded-lg px-3 py-2 text-sm w-full"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Field label="Tiempo Añadido">
            <Inp type="number" value={match.addedTime} onChange={(v) => setAddedTime(parseInt(v) || 0)} placeholder="0" />
          </Field>
          <Field label="Extra Tiempo +">
            <Inp type="number" value={match.extraTimeAdded} onChange={(v) => setExtraTimeAdded(parseInt(v) || 0)} placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* Reset Match */}
      <div className="glass-panel rounded-xl p-4">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Estás seguro de reiniciar todo el partido? Se perderán todos los datos.')) {
              resetMatch();
            }
          }}
          className="w-full py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300/80 font-bold text-sm transition-all active:scale-[0.98]"
        >
          🔄 Reiniciar Partido Completo
        </button>
      </div>
    </div>
  );
}

// ── Events Tab ─────────────────────────────────────────────────────────────────

function EventsControl() {
  const match = useScoreboardStore((s) => s.match);
  const addEvent = useScoreboardStore((s) => s.addEvent);
  const removeEvent = useScoreboardStore((s) => s.removeEvent);
  const clearEvents = useScoreboardStore((s) => s.clearEvents);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<EventType>('goal');
  const [dialogSide, setDialogSide] = useState<TeamSide>('home');
  const [dialogPlayer, setDialogPlayer] = useState('');
  const [dialogDesc, setDialogDesc] = useState('');
  const [subOut, setSubOut] = useState('');
  const [subIn, setSubIn] = useState('');
  const [playerNum, setPlayerNum] = useState('');

  const openDialog = (type: EventType, side: TeamSide) => {
    setDialogType(type);
    setDialogSide(side);
    setDialogPlayer('');
    setDialogDesc('');
    setSubOut('');
    setSubIn('');
    setPlayerNum('');
    setDialogOpen(true);
  };

  const submitEvent = () => {
    const minute = Math.max(1, Math.floor(match.currentTime / 60) + 1);
    const player = dialogPlayer.trim()
      ? { id: genId(), name: dialogPlayer.trim(), number: parseInt(playerNum) || 0 }
      : undefined;

    const event: any = {
      id: genId(),
      type: dialogType,
      team: dialogSide,
      player,
      minute,
      description: dialogDesc.trim() || undefined,
    };

    if (dialogType === 'substitution') {
      if (subOut.trim()) event.playerOut = { id: genId(), name: subOut.trim(), number: 0 };
      if (subIn.trim()) event.playerIn = { id: genId(), name: subIn.trim(), number: 0 };
    }

    addEvent(event);
    setDialogOpen(false);
  };

  const eventBtns: { type: EventType; label: string; variant: string }[] = [
    { type: 'goal', label: '⚽ Gol', variant: 'success' },
    { type: 'penalty_goal', label: '⚽ Penal', variant: 'success' },
    { type: 'own_goal', label: '⚽ Autogol', variant: 'yellow' },
    { type: 'yellow_card', label: '🟨 Amarilla', variant: 'yellow' },
    { type: 'red_card', label: '🟥 Roja', variant: 'danger' },
    { type: 'substitution', label: '🔄 Cambio', variant: 'default' },
    { type: 'var_review', label: '📺 VAR', variant: 'primary' },
    { type: 'injury', label: '🏥 Lesión', variant: 'default' },
  ];

  return (
    <div>
      {/* Quick Actions Grid */}
      <Section title="Agregar Evento Rápido">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-1.5 items-center mb-2">
          <div />
          <div className="text-center text-xs font-bold text-blue-400/80 py-1">LOCAL</div>
          <div className="text-center text-xs font-bold text-red-400/80 py-1">VISITA</div>
          {eventBtns.map(({ type, label, variant }) => (
            <div key={type} className="contents">
              <span className="text-xs text-white/30 text-right pr-2">{label.split(' ').slice(1).join(' ')}</span>
              <Btn onClick={() => openDialog(type, 'home')} variant={variant} size="sm" className="w-full">{label}</Btn>
              <Btn onClick={() => openDialog(type, 'away')} variant={variant} size="sm" className="w-full">{label}</Btn>
            </div>
          ))}
        </div>
      </Section>

      {/* Event Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDialogOpen(false)}>
          <div className="glass-panel-strong rounded-2xl p-6 w-full max-w-sm animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{EVENT_ICONS[dialogType]}</span>
              <h3 className="text-lg font-bold">{EVENT_LABELS[dialogType]}</h3>
            </div>
            <p className="text-xs text-white/40 mb-4">
              {dialogSide === 'home' ? 'Equipo Local' : 'Equipo Visitante'} · Minuto {Math.max(1, Math.floor(match.currentTime / 60) + 1)}&apos;
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-xs text-white/50">Jugador</span>
                <div className="flex gap-2">
                  <input
                    value={playerNum}
                    onChange={(e) => setPlayerNum(e.target.value)}
                    placeholder="#"
                    className="glass-input rounded px-2 py-1.5 text-xs w-14"
                    type="number"
                    min="0"
                  />
                  <input
                    value={dialogPlayer}
                    onChange={(e) => setDialogPlayer(e.target.value)}
                    placeholder="Nombre del jugador"
                    className="glass-input rounded px-2 py-1.5 text-xs flex-1"
                    onKeyDown={(e) => { if (e.key === 'Enter') submitEvent(); }}
                    autoFocus
                  />
                </div>
              </div>

              {dialogType === 'substitution' && (
                <>
                  <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                    <span className="text-xs text-white/50">Sale</span>
                    <input
                      value={subOut}
                      onChange={(e) => setSubOut(e.target.value)}
                      placeholder="Jugador que sale"
                      className="glass-input rounded px-2 py-1.5 text-xs w-full"
                    />
                  </div>
                  <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                    <span className="text-xs text-white/50">Entra</span>
                    <input
                      value={subIn}
                      onChange={(e) => setSubIn(e.target.value)}
                      placeholder="Jugador que entra"
                      className="glass-input rounded px-2 py-1.5 text-xs w-full"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-xs text-white/50">Notas</span>
                <input
                  value={dialogDesc}
                  onChange={(e) => setDialogDesc(e.target.value)}
                  placeholder="Descripción opcional"
                  className="glass-input rounded px-2 py-1.5 text-xs w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Btn onClick={submitEvent} variant="success" size="md" className="flex-1">✓ Agregar</Btn>
              <Btn onClick={() => setDialogOpen(false)} variant="default" size="md">Cancelar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <Section title={`Eventos Registrados (${match.events.length})`}>
        <div className="max-h-72 overflow-y-auto space-y-1.5">
          {match.events.length === 0 && (
            <p className="text-xs text-white/20 text-center py-6">Sin eventos registrados aún</p>
          )}
          {match.events.map((ev) => (
            <div key={ev.id} className="flex items-center gap-2 glass-input rounded-lg px-3 py-2 text-xs group">
              <span className="text-base w-6 text-center">{EVENT_ICONS[ev.type]}</span>
              <span className="font-mono font-bold text-white/50 w-9">{ev.minute}&apos;</span>
              <span className="flex-1 truncate">{ev.player?.name || EVENT_LABELS[ev.type]}</span>
              {ev.type === 'substitution' && ev.playerOut && ev.playerIn && (
                <span className="text-white/30 text-[10px] hidden sm:inline">
                  {ev.playerOut.name} → {ev.playerIn.name}
                </span>
              )}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                ev.team === 'home'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {ev.team === 'home' ? 'L' : 'V'}
              </span>
              <button
                type="button"
                onClick={() => removeEvent(ev.id)}
                className="text-red-400/30 hover:text-red-400 ml-1 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {match.events.length > 0 && (
          <div className="mt-3 flex justify-end">
            <Btn variant="danger" size="sm" onClick={clearEvents}>Limpiar Todos</Btn>
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Advertising Tab ────────────────────────────────────────────────────────────

function AdsControl() {
  const ads = useScoreboardStore((s) => s.ads);
  const activeAdIndex = useScoreboardStore((s) => s.activeAdIndex);
  const addAd = useScoreboardStore((s) => s.addAd);
  const removeAd = useScoreboardStore((s) => s.removeAd);
  const cycleAd = useScoreboardStore((s) => s.cycleAd);
  const setActiveAd = useScoreboardStore((s) => s.setActiveAd);

  const [text, setText] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [dur, setDur] = useState('10');

  const addNew = () => {
    if (text.trim()) {
      addAd({
        id: genId(),
        text: text.trim(),
        imageUrl: imgUrl.trim(),
        duration: parseInt(dur) || 10,
        active: true,
      });
      setText('');
      setImgUrl('');
      setDur('10');
    }
  };

  const currentAd = ads.length > 0 ? ads[activeAdIndex % ads.length] : null;

  return (
    <div>
      <Section title="Nueva Publicidad">
        <Field label="Texto">
          <Inp value={text} onChange={setText} placeholder="Texto del patrocinador" />
        </Field>
        <Field label="URL Imagen">
          <Inp value={imgUrl} onChange={setImgUrl} placeholder="https://ejemplo.com/logo.png" />
        </Field>
        <Field label="Duración (s)">
          <Inp type="number" value={dur} onChange={setDur} placeholder="10" />
        </Field>
        <Btn onClick={addNew} variant="primary" size="md" className="w-full mt-1">+ Agregar Publicidad</Btn>
      </Section>

      {/* Preview */}
      {currentAd && (
        <Section title="Vista Previa Actual">
          <div className="glass-input rounded-lg p-4 text-center">
            {currentAd.imageUrl && (
              <img src={currentAd.imageUrl} alt="" className="h-12 mx-auto mb-2 object-contain" />
            )}
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider">{currentAd.text}</p>
            <p className="text-[10px] text-white/20 mt-1">{currentAd.duration} segundos</p>
          </div>
          <div className="flex gap-2 justify-center mt-3">
            <Btn onClick={() => setActiveAd((activeAdIndex - 1 + ads.length) % ads.length)} size="sm">◀ Anterior</Btn>
            <span className="text-xs text-white/30 flex items-center">{activeAdIndex + 1} / {ads.length}</span>
            <Btn onClick={cycleAd} size="sm">Siguiente ▶</Btn>
          </div>
        </Section>
      )}

      {/* Ads List */}
      {ads.length > 0 && (
        <Section title={`Publicidades (${ads.length})`}>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {ads.map((ad, i) => (
              <div
                key={ad.id}
                className={`flex items-center gap-2 glass-input rounded-lg px-3 py-2 text-xs transition-all ${
                  i === activeAdIndex % ads.length ? 'ring-1 ring-blue-400/40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveAd(i)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    i === activeAdIndex % ads.length
                      ? 'border-blue-400 bg-blue-400/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {i === activeAdIndex % ads.length && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                </button>
                {ad.imageUrl && (
                  <img src={ad.imageUrl} alt="" className="h-5 w-5 object-contain flex-shrink-0 rounded" />
                )}
                <span className="flex-1 truncate">{ad.text}</span>
                <span className="text-white/20 w-8 text-right">{ad.duration}s</span>
                <button
                  type="button"
                  onClick={() => removeAd(ad.id)}
                  className="text-red-400/30 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ── Skins Tab ──────────────────────────────────────────────────────────────────

function SkinsControl() {
  const skins = useScoreboardStore((s) => s.skins);
  const activeSkinId = useScoreboardStore((s) => s.activeSkinId);
  const sponsorSkinId = useScoreboardStore((s) => s.sponsorSkinId);
  const addSkin = useScoreboardStore((s) => s.addSkin);
  const removeSkin = useScoreboardStore((s) => s.removeSkin);
  const setActiveSkin = useScoreboardStore((s) => s.setActiveSkin);
  const setSponsorSkin = useScoreboardStore((s) => s.setSponsorSkin);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'team' | 'sponsor'>('team');

  const colorFields = [
    { key: 'primaryColor', label: 'Primario' },
    { key: 'secondaryColor', label: 'Secundario' },
    { key: 'accentColor', label: 'Acento' },
    { key: 'backgroundColor', label: 'Fondo' },
    { key: 'textColor', label: 'Texto' },
    { key: 'scoreColor', label: 'Marcador' },
    { key: 'timerColor', label: 'Timer' },
  ] as const;

  const [colors, setColors] = useState<Record<string, string>>({
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#60a5fa',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
    scoreColor: '#ffffff',
    timerColor: '#60a5fa',
  });

  const createSkin = () => {
    if (name.trim()) {
      addSkin({
        id: genId(),
        name: name.trim(),
        teamId: '',
        type,
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        accentColor: colors.accentColor,
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
        scoreColor: colors.scoreColor,
        timerColor: colors.timerColor,
        logoUrl: '',
        sponsorLogoUrl: '',
        sponsorText: '',
      });
      setName('');
      setShowCreate(false);
    }
  };

  return (
    <div>
      <Section title="Skins Disponibles">
        <div className="space-y-2">
          {skins.map((skin) => (
            <div
              key={skin.id}
              className={`glass-input rounded-lg p-3 transition-all ${
                activeSkinId === skin.id ? 'ring-1 ring-blue-400/40' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold truncate">{skin.name}</span>
                  <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded shrink-0">{skin.type}</span>
                  {sponsorSkinId === skin.id && (
                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded shrink-0">⭐ Patrocinio</span>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Btn
                    onClick={() => setActiveSkin(skin.id)}
                    variant={activeSkinId === skin.id ? 'primary' : 'default'}
                    size="sm"
                  >
                    {activeSkinId === skin.id ? '✓' : 'Activar'}
                  </Btn>
                  <Btn
                    onClick={() => setSponsorSkin(sponsorSkinId === skin.id ? null : skin.id)}
                    variant={sponsorSkinId === skin.id ? 'yellow' : 'default'}
                    size="sm"
                  >
                    🏢
                  </Btn>
                  {skin.id !== 'default' && (
                    <Btn onClick={() => removeSkin(skin.id)} variant="danger" size="sm">✕</Btn>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {colorFields.map(({ key, label }) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded-full border border-white/15"
                    style={{ backgroundColor: (skin as Record<string, string>)[key] }}
                    title={label}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {!showCreate ? (
          <Btn onClick={() => setShowCreate(true)} variant="primary" size="md" className="w-full mt-3">
            + Crear Nuevo Skin
          </Btn>
        ) : (
          <div className="glass-input rounded-lg p-4 mt-3 animate-slide-in-up">
            <Field label="Nombre del Skin">
              <Inp value={name} onChange={setName} placeholder="Ej: Skin Final Copa" />
            </Field>
            <Field label="Tipo">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'team' | 'sponsor')}
                className="glass-input rounded px-2 py-1.5 text-xs w-full"
              >
                <option value="team" className="bg-gray-900">Equipo</option>
                <option value="sponsor" className="bg-gray-900">Patrocinador</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {colorFields.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <span className="text-xs text-white/40">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Btn onClick={createSkin} variant="success" size="md" className="flex-1">✓ Crear Skin</Btn>
              <Btn onClick={() => setShowCreate(false)} variant="default" size="md">Cancelar</Btn>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Main ControlPanel ─────────────────────────────────────────────────────────

export function ControlPanel() {
  const [tab, setTab] = useState('score');

  const tabs = [
    { id: 'score', label: '⚽ Marcador', icon: '⚽' },
    { id: 'match', label: '📋 Partido', icon: '📋' },
    { id: 'events', label: '🎯 Eventos', icon: '🎯' },
    { id: 'ads', label: '📢 Publicidad', icon: '📢' },
    { id: 'skins', label: '🎨 Skins', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white relative z-10">
      <div className="mx-auto max-w-2xl px-3 py-4">
        {/* Header */}
        <div className="glass-panel rounded-xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/20 flex items-center justify-center text-lg">
              ⚽
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">PROFUTBOL</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Panel de Control</p>
            </div>
          </div>
          <div className="text-xs text-white/15 font-mono">v1.0</div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                tab === t.id
                  ? 'tab-active'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
              }`}
            >
              <span className="text-sm">{t.icon}</span>
              <span className="hidden sm:inline">{t.label.split(' ').slice(1).join(' ')}</span>
              <span className="sm:hidden">{t.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {tab === 'match' && <MatchSetup />}
          {tab === 'score' && <ScoreControl />}
          {tab === 'events' && <EventsControl />}
          {tab === 'ads' && <AdsControl />}
          {tab === 'skins' && <SkinsControl />}
        </div>
      </div>
    </div>
  );
}