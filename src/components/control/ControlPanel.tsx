'use client';

import { useState, useId } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  MatchStatus, MatchPeriod, EventType, TeamSide, SkinData,
  EVENT_ICONS, EVENT_LABELS, PERIOD_LABELS, STATUS_LABELS,
} from '@/types';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function formatTimer(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Mini Components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-4 mb-3">
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-white/50 w-24 shrink-0">{label}</span>
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
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
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
      setPName(''); setPNum('');
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
                <input type="color" value={team.primaryColor} onChange={(e) => setTeamColor(side, e.target.value, team.secondaryColor)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs text-white/40 font-mono">{team.primaryColor}</span>
              </div>
            </Field>
            <Field label="Color Sec.">
              <div className="flex gap-2 items-center">
                <input type="color" value={team.secondaryColor} onChange={(e) => setTeamColor(side, team.primaryColor, e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs text-white/40 font-mono">{team.secondaryColor}</span>
              </div>
            </Field>

            {/* Players */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40">Jugadores:</span>
                <select
                  value={pSide}
                  onChange={(e) => setPSide(e.target.value as TeamSide)}
                  className="glass-input rounded px-2 py-1 text-xs"
                >
                  <option value="home">Local</option>
                  <option value="away">Visitante</option>
                </select>
                {pSide === side && (
                  <>
                    <input value={pNum} onChange={(e) => setPNum(e.target.value)} placeholder="#" className="glass-input rounded px-2 py-1 text-xs w-12" />
                    <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Nombre" className="glass-input rounded px-2 py-1 text-xs flex-1" onKeyDown={(e) => e.key === 'Enter' && addP()} />
                    <Btn onClick={addP} variant="primary" size="sm">+</Btn>
                  </>
                )}
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {team.players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between glass-input rounded px-2 py-1 text-xs">
                    <span className="text-white/40 w-6">#{p.number}</span>
                    <span className="flex-1">{p.name}</span>
                    <button onClick={() => removePlayer(side, p.id)} className="text-red-400/60 hover:text-red-400 ml-2">✕</button>
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
  const setViewMode = useScoreboardStore((s) => s.setViewMode);

  return (
    <div>
      {/* Score */}
      <Section title="Marcador">
        <div className="grid grid-cols-2 gap-4">
          {(['home', 'away'] as TeamSide[]).map((side) => {
            const score = side === 'home' ? match.homeScore : match.awayScore;
            const team = side === 'home' ? match.homeTeam : match.awayTeam;
            return (
              <div key={side} className="glass-input rounded-xl p-4 text-center">
                <div className="text-xs text-white/50 mb-1">{side === 'home' ? 'LOCAL' : 'VISITA'}</div>
                <div className="text-5xl font-black mb-3" style={{ color: team.primaryColor }}>{score}</div>
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
        <div className="text-center mb-3">
          <div className={`text-4xl font-mono font-bold ${isTimerRunning ? 'text-green-400' : 'text-white/60'}`}>
            {formatTimer(match.currentTime)}
          </div>
          <div className="text-xs text-white/40 mt-1">{PERIOD_LABELS[match.period]} · {STATUS_LABELS[match.status]}</div>
        </div>
        <div className="flex gap-2 justify-center mb-3">
          <Btn onClick={isTimerRunning ? pauseTimer : startTimer} variant={isTimerRunning ? 'danger' : 'success'} size="md">
            {isTimerRunning ? '⏸ Pausar' : '▶ Iniciar'}
          </Btn>
          <Btn onClick={resetTimer} variant="default" size="md">↺ Reset</Btn>
        </div>
        <Field label="Período">
          <select value={match.period} onChange={(e) => setPeriod(e.target.value as MatchPeriod)} className="glass-input rounded-lg px-3 py-1.5 text-sm w-full">
            {Object.entries(PERIOD_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-gray-900">{v}</option>)}
          </select>
        </Field>
        <Field label="Estado">
          <select value={match.status} onChange={(e) => setStatus(e.target.value as MatchStatus)} className="glass-input rounded-lg px-3 py-1.5 text-sm w-full">
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-gray-900">{v}</option>)}
          </select>
        </Field>
        <Field label="Tiempo Añadido">
          <Inp type="number" value={match.addedTime} onChange={(v) => setAddedTime(parseInt(v) || 0)} />
        </Field>
        <Field label="Extra Tiempo">
          <Inp type="number" value={match.extraTimeAdded} onChange={(v) => setExtraTimeAdded(parseInt(v) || 0)} />
        </Field>
      </Section>

      {/* Open Display */}
      <div className="glass-panel rounded-xl p-4">
        <button
          onClick={() => setViewMode('display')}
          className="w-full py-4 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 text-blue-200 font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          📺 Abrir Marcador en Pantalla
        </button>
        <p className="text-center text-xs text-white/30 mt-2">Presiona ESC para volver</p>
      </div>
    </div>
  );
}

// ── Events Tab ─────────────────────────────────────────────────────────────────

function EventsControl() {
  const match = useScoreboardStore((s) => s.match);
  const addEvent = useScoreboardStore((s) => s.addEvent);
  const removeEvent = useScoreboardStore((s) => s.removeEvent);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<EventType>('goal');
  const [dialogSide, setDialogSide] = useState<TeamSide>('home');
  const [dialogPlayer, setDialogPlayer] = useState('');
  const [dialogDesc, setDialogDesc] = useState('');
  const [subOut, setSubOut] = useState('');
  const [subIn, setSubIn] = useState('');

  const openDialog = (type: EventType, side: TeamSide) => {
    setDialogType(type); setDialogSide(side); setDialogPlayer(''); setDialogDesc(''); setSubOut(''); setSubIn('');
    setDialogOpen(true);
  };

  const submitEvent = () => {
    const minute = Math.floor(match.currentTime / 60) + 1;
    const team = dialogSide === 'home' ? match.homeTeam : match.awayTeam;
    const player = dialogPlayer.trim() ? { id: genId(), name: dialogPlayer.trim(), number: 0 } : undefined;

    addEvent({
      id: genId(), type: dialogType, team: dialogSide, player, minute,
      description: dialogDesc.trim() || undefined,
      playerIn: dialogType === 'substitution' && subIn ? { id: genId(), name: subIn, number: 0 } : undefined,
      playerOut: dialogType === 'substitution' && subOut ? { id: genId(), name: subOut, number: 0 } : undefined,
    });
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
      {/* Quick Actions */}
      <Section title="Agregar Evento">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-center text-xs font-bold text-blue-400/70 mb-1">LOCAL</div>
          <div className="text-center text-xs font-bold text-red-400/70 mb-1">VISITA</div>
        </div>
        {eventBtns.map(({ type, label, variant }) => (
          <div key={type} className="grid grid-cols-2 gap-2 mb-2">
            <Btn onClick={() => openDialog(type, 'home')} variant={variant} size="sm">{label}</Btn>
            <Btn onClick={() => openDialog(type, 'away')} variant={variant} size="sm">{label}</Btn>
          </div>
        ))}
      </Section>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDialogOpen(false)}>
          <div className="glass-panel-strong rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1">{EVENT_ICONS[dialogType]} {EVENT_LABELS[dialogType]}</h3>
            <p className="text-xs text-white/40 mb-4">{dialogSide === 'home' ? 'Local' : 'Visitante'} · Min. {Math.floor(match.currentTime / 60) + 1}&apos;</p>

            <Field label="Jugador">
              <Inp value={dialogPlayer} onChange={setDialogPlayer} placeholder="Nombre del jugador" />
            </Field>

            {dialogType === 'substitution' && (
              <>
                <Field label="Sale">
                  <Inp value={subOut} onChange={setSubOut} placeholder="Jugador que sale" />
                </Field>
                <Field label="Entra">
                  <Inp value={subIn} onChange={setSubIn} placeholder="Jugador que entra" />
                </Field>
              </>
            )}

            <Field label="Descripción">
              <Inp value={dialogDesc} onChange={setDialogDesc} placeholder="Opcional" />
            </Field>

            <div className="flex gap-2 mt-4">
              <Btn onClick={submitEvent} variant="success" size="md" className="flex-1">Agregar</Btn>
              <Btn onClick={() => setDialogOpen(false)} variant="default" size="md">Cancelar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <Section title={`Eventos (${match.events.length})`}>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {match.events.length === 0 && <p className="text-xs text-white/30 text-center py-4">Sin eventos</p>}
          {match.events.map((ev) => (
            <div key={ev.id} className="flex items-center gap-2 glass-input rounded-lg px-3 py-2 text-xs">
              <span className="text-base">{EVENT_ICONS[ev.type]}</span>
              <span className="font-mono font-bold text-white/50 w-8">{ev.minute}&apos;</span>
              <span className="flex-1 truncate">{ev.player?.name || EVENT_LABELS[ev.type]}</span>
              {ev.playerOut && ev.playerIn && (
                <span className="text-white/30">{ev.playerOut.name} → {ev.playerIn.name}</span>
              )}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${ev.team === 'home' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                {ev.team === 'home' ? 'L' : 'V'}
              </span>
              <button onClick={() => removeEvent(ev.id)} className="text-red-400/50 hover:text-red-400 ml-1">✕</button>
            </div>
          ))}
        </div>
        {match.events.length > 0 && (
          <div className="mt-2 flex justify-end">
            <Btn variant="danger" size="sm" onClick={() => useScoreboardStore.getState().clearEvents()}>Limpiar Todo</Btn>
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
  const updateAd = useScoreboardStore((s) => s.updateAd);
  const cycleAd = useScoreboardStore((s) => s.cycleAd);
  const setActiveAd = useScoreboardStore((s) => s.setActiveAd);

  const [text, setText] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [dur, setDur] = useState('10');

  const addNew = () => {
    if (text.trim()) {
      addAd({ id: genId(), text: text.trim(), imageUrl: imgUrl.trim(), duration: parseInt(dur) || 10, active: true });
      setText(''); setImgUrl(''); setDur('10');
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
          <Inp value={imgUrl} onChange={setImgUrl} placeholder="https://..." />
        </Field>
        <Field label="Duración (s)">
          <Inp type="number" value={dur} onChange={setDur} />
        </Field>
        <Btn onClick={addNew} variant="primary" size="md" className="w-full mt-1">+ Agregar Publicidad</Btn>
      </Section>

      {/* Preview */}
      {currentAd && (
        <Section title="Vista Previa Actual">
          <div className="glass-input rounded-lg p-4 text-center">
            {currentAd.imageUrl && <img src={currentAd.imageUrl} alt="" className="h-10 mx-auto mb-2 object-contain" />}
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider">{currentAd.text}</p>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <Btn onClick={() => setActiveAd((activeAdIndex - 1 + ads.length) % ads.length)} size="sm">◀ Anterior</Btn>
            <Btn onClick={cycleAd} size="sm">Siguiente ▶</Btn>
          </div>
        </Section>
      )}

      {/* List */}
      {ads.length > 0 && (
        <Section title={`Publicidades (${ads.length})`}>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {ads.map((ad, i) => (
              <div key={ad.id} className={`flex items-center gap-2 glass-input rounded-lg px-3 py-2 text-xs ${i === activeAdIndex % ads.length ? 'border-blue-400/40' : ''}`}>
                <button onClick={() => setActiveAd(i)} className="text-blue-400/50 hover:text-blue-400">👁</button>
                <span className="flex-1 truncate">{ad.text}</span>
                <span className="text-white/30">{ad.duration}s</span>
                <button onClick={() => removeAd(ad.id)} className="text-red-400/50 hover:text-red-400">✕</button>
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
    primaryColor: '#3b82f6', secondaryColor: '#1e40af', accentColor: '#60a5fa',
    backgroundColor: '#0a1628', textColor: '#ffffff', scoreColor: '#ffffff', timerColor: '#60a5fa',
  });

  const createSkin = () => {
    if (name.trim()) {
      addSkin({
        id: genId(), name: name.trim(), teamId: '', type,
        ...colors as Omit<SkinData, 'id' | 'name' | 'teamId' | 'type' | keyof typeof colors>,
        logoUrl: '', sponsorLogoUrl: '', sponsorText: '',
      });
      setName(''); setShowCreate(false);
    }
  };

  return (
    <div>
      <Section title="Skins Disponibles">
        <div className="space-y-2">
          {skins.map((skin) => (
            <div key={skin.id} className={`glass-input rounded-lg p-3 ${activeSkinId === skin.id ? 'border-blue-400/50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-bold">{skin.name}</span>
                  <span className="text-xs text-white/30 ml-2">({skin.type})</span>
                  {sponsorSkinId === skin.id && <span className="text-xs text-yellow-400 ml-2">⭐ Patrocinio activo</span>}
                </div>
                <div className="flex gap-1">
                  <Btn onClick={() => setActiveSkin(skin.id)} variant={activeSkinId === skin.id ? 'primary' : 'default'} size="sm">Activar</Btn>
                  <Btn onClick={() => setSponsorSkin(sponsorSkinId === skin.id ? null : skin.id)} variant={sponsorSkinId === skin.id ? 'yellow' : 'default'} size="sm">Patrocinio</Btn>
                  {skin.id !== 'default' && <Btn onClick={() => removeSkin(skin.id)} variant="danger" size="sm">✕</Btn>}
                </div>
              </div>
              <div className="flex gap-1">
                {colorFields.map(({ key }) => (
                  <div key={key} className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: (skin as any)[key] }} title={key} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {!showCreate ? (
          <Btn onClick={() => setShowCreate(true)} variant="primary" size="md" className="w-full mt-3">+ Nuevo Skin</Btn>
        ) : (
          <div className="glass-input rounded-lg p-3 mt-3">
            <Field label="Nombre">
              <Inp value={name} onChange={setName} placeholder="Nombre del skin" />
            </Field>
            <Field label="Tipo">
              <select value={type} onChange={(e) => setType(e.target.value as 'team' | 'sponsor')} className="glass-input rounded px-2 py-1 text-xs w-full">
                <option value="team" className="bg-gray-900">Equipo</option>
                <option value="sponsor" className="bg-gray-900">Patrocinador</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {colorFields.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input type="color" value={colors[key]} onChange={(e) => setColors({ ...colors, [key]: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-xs text-white/40">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Btn onClick={createSkin} variant="success" size="sm" className="flex-1">Crear</Btn>
              <Btn onClick={() => setShowCreate(false)} variant="default" size="sm">Cancelar</Btn>
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
    { id: 'match', label: '📋 Partido' },
    { id: 'score', label: '⚽ Marcador' },
    { id: 'events', label: '🎯 Eventos' },
    { id: 'ads', label: '📢 Publicidad' },
    { id: 'skins', label: '🎨 Skins' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white relative z-10">
      <div className="mx-auto max-w-2xl px-3 py-4">
        {/* Header */}
        <div className="glass-panel rounded-xl p-3 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">PROFUTBOL</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Control de Marcador</p>
          </div>
          <div className="text-xs text-white/20 font-mono">v1.0</div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                tab === t.id ? 'tab-active' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              {t.label}
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