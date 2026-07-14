'use client';

import { useState, useRef, useCallback } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  MatchStatus, MatchPeriod, EventType, TeamSide, MatchFormat,
  EVENT_ICONS, EVENT_LABELS, PERIOD_LABELS, STATUS_LABELS,
  FORMAT_OPTIONS, HALF_DURATION_OPTIONS, SkinData,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Play, Pause, RotateCcw, Plus, Minus, Trash2, Monitor,
  Trophy, Settings, List, Palette, Upload, X, Check, ImagePlus, Megaphone,
  Eye, Maximize2, Film, MonitorSmartphone,
} from 'lucide-react';
import { StadiumDisplay } from '@/components/scoreboard/StadiumDisplay';
import { ScreensTab } from '@/components/control/ScreensTab';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Color picker ───────────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border-2 border-white/10 cursor-pointer bg-transparent p-0.5" />
      <div className="flex-1">
        <span className="text-xs text-white/50">{label}</span>
        <p className="text-[10px] font-mono text-white/30">{value}</p>
      </div>
    </div>
  );
}

// ── Logo uploader ──────────────────────────────────────────────────────────────

function LogoUploader({ logo, onUpload, onRemove }: { logo: string; onUpload: (b64: string) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') onUpload(reader.result); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-3">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {logo ? (
        <div className="relative group">
          <img src={logo} alt="Logo" className="w-14 h-14 rounded-xl object-contain border border-white/10 bg-white/5" />
          <button onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()}
          className="w-14 h-14 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-0.5 hover:border-white/30 hover:bg-white/5 transition-colors">
          <Upload className="w-4 h-4 text-white/30" />
          <span className="text-[8px] text-white/30">Logo</span>
        </button>
      )}
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-white/50 hover:text-white hover:bg-white/10" onClick={() => fileRef.current?.click()}>
        <ImagePlus className="w-3 h-3" />{logo ? 'Cambiar' : 'Subir'}
      </Button>
    </div>
  );
}

// ── Team card ──────────────────────────────────────────────────────────────────

function TeamCard({ side, label }: { side: TeamSide; label: string }) {
  const team = useScoreboardStore((s) => s.match[side === 'home' ? 'homeTeam' : 'awayTeam']);
  const setTeamName = useScoreboardStore((s) => s.setTeamName);
  const setTeamColor = useScoreboardStore((s) => s.setTeamColor);
  const setTeamLogo = useScoreboardStore((s) => s.setTeamLogo);
  return (
    <Card className="glass-panel rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <LogoUploader logo={team.logo} onUpload={(b64) => setTeamLogo(side, b64)} onRemove={() => setTeamLogo(side, '')} />
        <div>
          <Label className="text-xs text-white/50 mb-1 block">Nombre</Label>
          <Input value={team.name} onChange={(e) => setTeamName(side, e.target.value, e.target.value.slice(0, 10).toUpperCase())}
            placeholder="Nombre del equipo" className="glass-input" />
        </div>
        <div>
          <Label className="text-xs text-white/50 mb-1 block">Abreviatura</Label>
          <Input value={team.shortName} onChange={(e) => setTeamName(side, team.name, e.target.value.toUpperCase())}
            placeholder="ABREV" maxLength={10} className="glass-input font-bold text-center text-lg" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-white/50">Colores</Label>
          <div className="flex gap-3">
            <ColorPicker label="Principal" value={team.color} onChange={(c) => setTeamColor(side, c, team.colorSecondary)} />
            <ColorPicker label="Secundario" value={team.colorSecondary} onChange={(c) => setTeamColor(side, team.color, c)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── TAB: Equipos ───────────────────────────────────────────────────────────────

function EquiposTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TeamCard side="home" label="Equipo Local" />
      <TeamCard side="away" label="Equipo Visitante" />
    </div>
  );
}

// ── TAB: Marcador ──────────────────────────────────────────────────────────────

function ScoreTab() {
  const match = useScoreboardStore((s) => s.match);
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const startTimer = useScoreboardStore((s) => s.startTimer);
  const pauseTimer = useScoreboardStore((s) => s.pauseTimer);
  const updateScore = useScoreboardStore((s) => s.updateScore);
  const setStatus = useScoreboardStore((s) => s.setStatus);
  const setPeriod = useScoreboardStore((s) => s.setPeriod);
  const resetMatch = useScoreboardStore((s) => s.resetMatch);
  const setField = useScoreboardStore((s) => s.setField);
  const setFormat = useScoreboardStore((s) => s.setFormat);
  const setHalfDuration = useScoreboardStore((s) => s.setHalfDuration);
  const setAddedTime = useScoreboardStore((s) => s.setAddedTime);
  const setExtraTimeAdded = useScoreboardStore((s) => s.setExtraTimeAdded);

  const [showReset, setShowReset] = useState(false);
  const canStart = match.status === 'waiting' || match.status === 'halftime';
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  const handleHalfTime = () => { pauseTimer(); setPeriod('second_half'); setStatus('halftime'); };
  const handleFinish = () => { pauseTimer(); setStatus('finished'); };
  const handleReset = () => { resetMatch(); setShowReset(false); };

  const getMarcadorPath = () => {
    const base = window.location.pathname.includes('/Profutbol') ? '/Profutbol' : '';
    return `${base}/marcador`;
  };

  const currentAdded = (match.period === 'extra_time_first' || match.period === 'extra_time_second') ? match.extraTimeAdded : match.addedTime;

  return (
    <div className="space-y-3">
      {/* Config */}
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4" />Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Cancha</Label>
              <Input value={match.field} onChange={(e) => setField(e.target.value)} className="glass-input h-9" />
            </div>
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Tipo</Label>
              <Select value={match.format} onValueChange={(v) => setFormat(v as MatchFormat)}>
                <SelectTrigger className="glass-input h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{FORMAT_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Duración</Label>
              <Select value={String(match.halfDuration)} onValueChange={(v) => setHalfDuration(Number(v))}>
                <SelectTrigger className="glass-input h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{HALF_DURATION_OPTIONS.map((d) => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Tiempo añ.</Label>
              <Input type="number" min={0} max={10} value={currentAdded || ''} onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                if (match.period === 'extra_time_first' || match.period === 'extra_time_second') setExtraTimeAdded(v);
                else setAddedTime(v);
              }} className="glass-input h-9" placeholder="min" />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-white/40 bg-white/5 rounded-lg p-2 text-center w-full">
                Total: <strong className="text-white/60">{match.halfDuration * 2} min</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status + Open */}
      <div className="flex items-center justify-between">
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
          style={{ backgroundColor: match.status === 'live' ? '#22c55e20' : isFinished ? '#ef444420' : '#f59e0b20',
            color: match.status === 'live' ? '#22c55e' : isFinished ? '#ef4444' : '#f59e0b' }}>
          {STATUS_LABELS[match.status]} • {PERIOD_LABELS[match.period]}
        </span>
        <Button variant="ghost" size="sm" onClick={() => window.open(getMarcadorPath(), '_blank')} className="gap-1.5 text-xs text-white/50 hover:text-white">
          <Monitor className="w-3.5 h-3.5" />Abrir Marcador
        </Button>
      </div>

      {/* Score */}
      <Card className="glass-panel-strong rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              {match.homeTeam.logo ? (
                <img src={match.homeTeam.logo} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl" />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: match.homeTeam.color }}>
                  {match.homeTeam.shortName.slice(0, 3)}
                </div>
              )}
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.homeTeam.color }}>{match.homeTeam.name}</span>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="ghost" className="h-10 w-10 rounded-full p-0 text-green-400 hover:bg-green-500/10" onClick={() => updateScore('home', 1)} disabled={isFinished}><Plus className="w-5 h-5" /></Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 rounded-full p-0 text-white/30 hover:bg-white/10 hover:text-white/60" onClick={() => updateScore('home', -1)} disabled={isFinished || match.homeScore <= 0}><Minus className="w-5 h-5" /></Button>
              </div>
            </div>
            <div className="px-4 md:px-8 py-6 md:py-8 flex flex-col items-center justify-center border-x border-white/5 min-w-[160px] md:min-w-[220px]">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-7xl font-black tabular-nums leading-none" style={{ color: match.homeTeam.color }}>{match.homeScore}</span>
                <span className="text-2xl md:text-3xl font-extralight text-white/15">-</span>
                <span className="text-5xl md:text-7xl font-black tabular-nums leading-none" style={{ color: match.awayTeam.color }}>{match.awayScore}</span>
              </div>
              <div className="mt-3 text-center">
                <span className={`text-2xl md:text-3xl font-mono font-bold tabular-nums ${isLive ? 'text-white' : 'text-white/30'}`}>
                  {String(Math.floor(match.currentTime / 60)).padStart(2, '0')}:{String(match.currentTime % 60).padStart(2, '0')}
                </span>
                {currentAdded > 0 && <span className="ml-1 text-lg font-mono font-bold text-blue-400">+{currentAdded}</span>}
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              {match.awayTeam.logo ? (
                <img src={match.awayTeam.logo} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl" />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: match.awayTeam.color }}>
                  {match.awayTeam.shortName.slice(0, 3)}
                </div>
              )}
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.awayTeam.color }}>{match.awayTeam.name}</span>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="ghost" className="h-10 w-10 rounded-full p-0 text-green-400 hover:bg-green-500/10" onClick={() => updateScore('away', 1)} disabled={isFinished}><Plus className="w-5 h-5" /></Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 rounded-full p-0 text-white/30 hover:bg-white/10 hover:text-white/60" onClick={() => updateScore('away', -1)} disabled={isFinished || match.awayScore <= 0}><Minus className="w-5 h-5" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {canStart && (
          <Button className="h-11 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-1.5" onClick={startTimer}>
            <Play className="w-4 h-4" />{match.status === 'waiting' ? 'Iniciar' : '2do Tiempo'}
          </Button>
        )}
        {isLive && <Button variant="ghost" className="h-11 text-sm font-bold text-yellow-400 hover:bg-yellow-500/10 gap-1.5" onClick={pauseTimer}><Pause className="w-4 h-4" />Pausar</Button>}
        {isLive && match.period === 'first_half' && <Button variant="ghost" className="h-11 text-sm font-bold text-orange-400 hover:bg-orange-500/10 gap-1.5" onClick={handleHalfTime}>Medio Tiempo</Button>}
        {isLive && match.period === 'second_half' && <Button variant="ghost" className="h-11 text-sm font-bold text-red-400 hover:bg-red-500/10 gap-1.5" onClick={handleFinish}>Finalizar</Button>}
        {!isLive && !isFinished && !canStart && <Button variant="ghost" className="h-11 text-sm font-bold text-yellow-400 hover:bg-yellow-500/10 gap-1.5" onClick={startTimer}><Play className="w-4 h-4" />Reanudar</Button>}
        <div className="col-span-2 md:col-span-1 flex justify-end">
          <AlertDialog open={showReset} onOpenChange={setShowReset}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-11 text-sm gap-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10">
                <RotateCcw className="w-4 h-4" />Reiniciar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a2332] border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>¿Reiniciar partido?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/50">Se perderán todos los datos del partido actual, goles, tarjetas y eventos.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleReset}>Reiniciar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Eventos ───────────────────────────────────────────────────────────────

function EventsTab() {
  const match = useScoreboardStore((s) => s.match);
  const addEvent = useScoreboardStore((s) => s.addEvent);
  const removeEvent = useScoreboardStore((s) => s.removeEvent);
  const [playerName, setPlayerName] = useState('');

  const isFinished = match.status === 'finished';

  const handleAdd = (type: EventType, team: TeamSide) => {
    const currentMinute = Math.floor(match.currentTime / 60) + 1;
    addEvent({
      id: genId(),
      type,
      team,
      playerName: playerName.trim() || undefined,
      minute: currentMinute,
    });
    setPlayerName('');
  };

  return (
    <div className="space-y-3">
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <List className="w-4 h-4" />Agregar Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-white/50 mb-1 block">Jugador (opcional)</Label>
            <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nombre del jugador..." className="glass-input" />
          </div>
          <div>
            <Label className="text-xs text-white/50 mb-2 block">Equipo Local</Label>
            <div className="flex flex-wrap gap-1.5">
              {(['goal', 'yellow_card', 'red_card', 'own_goal'] as EventType[]).map((type) => (
                <Button key={type} size="sm" variant="ghost" className="h-9 gap-1 text-xs text-white/60 hover:bg-white/10 hover:text-white" disabled={isFinished} onClick={() => handleAdd(type, 'home')}>
                  <span>{EVENT_ICONS[type]}</span>{EVENT_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-white/50 mb-2 block">Equipo Visitante</Label>
            <div className="flex flex-wrap gap-1.5">
              {(['goal', 'yellow_card', 'red_card', 'own_goal'] as EventType[]).map((type) => (
                <Button key={type} size="sm" variant="ghost" className="h-9 gap-1 text-xs text-white/60 hover:bg-white/10 hover:text-white" disabled={isFinished} onClick={() => handleAdd(type, 'away')}>
                  <span>{EVENT_ICONS[type]}</span>{EVENT_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Eventos ({match.events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {match.events.length === 0 ? <p className="text-sm text-white/30 text-center py-4">Sin eventos</p> : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {match.events.map((ev) => (
                <div key={ev.id} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/[0.03] group">
                  <span className="text-base">{EVENT_ICONS[ev.type]}</span>
                  <span className="text-xs font-bold text-white/60 w-8">{ev.minute}&apos;</span>
                  <span className="text-xs font-semibold text-white/70 flex-1 truncate">
                    {EVENT_LABELS[ev.type]} {ev.team === 'home' ? match.homeTeam.shortName : match.awayTeam.shortName}
                    {ev.playerName ? ` — ${ev.playerName}` : ''}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400" onClick={() => removeEvent(ev.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── TAB: Publicidad ────────────────────────────────────────────────────────────

function PublicidadTab() {
  const ads = useScoreboardStore((s) => s.ads);
  const activeAdIndex = useScoreboardStore((s) => s.activeAdIndex);
  const addAd = useScoreboardStore((s) => s.addAd);
  const removeAd = useScoreboardStore((s) => s.removeAd);
  const cycleAd = useScoreboardStore((s) => s.cycleAd);
  const [text, setText] = useState('');
  const [dur, setDur] = useState('15');
  const [mediaData, setMediaData] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limits: 5MB for images, 15MB for videos
    const maxSize = file.type.startsWith('video/') ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaData(reader.result);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    addAd({
      id: genId(),
      text: text.trim(),
      mediaData,
      mediaType,
      duration: parseInt(dur) || 15,
      active: true,
    });
    setText('');
    setDur('15');
    setMediaData('');
    setMediaType('none');
  };

  const handleRemoveMedia = () => {
    setMediaData('');
    setMediaType('none');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="w-4 h-4" />Nueva Publicidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* File upload area */}
          <div>
            <Label className="text-xs text-white/50 mb-1.5 block">Imagen o Video (máx 5MB imagen / 15MB video)</Label>
            <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileSelect} />
            {mediaData ? (
              <div className="relative group rounded-xl overflow-hidden border border-white/10">
                {mediaType === 'video' ? (
                  <video src={mediaData} className="w-full h-32 object-cover rounded-xl" muted />
                ) : (
                  <img src={mediaData} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="ghost" className="text-white gap-1.5" onClick={handleRemoveMedia}>
                    <X className="w-4 h-4" />Quitar
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                    {mediaType === 'video' ? <Film className="w-3 h-3" /> : <ImagePlus className="w-3 h-3" />}
                    {mediaType === 'video' ? 'Video' : 'Imagen'}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-24 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-1.5 hover:border-white/30 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-white/30" />
                <span className="text-xs text-white/40">Arrastra o haz clic para subir imagen/video</span>
                <span className="text-[10px] text-white/25">JPG, PNG, GIF, MP4, WebM</span>
              </button>
            )}
          </div>

          <div>
            <Label className="text-xs text-white/50 mb-1 block">Nombre del patrocinador</Label>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Texto del patrocinador..." className="glass-input" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-white/50 mb-1 block">Duración en pantalla (seg)</Label>
              <Input type="number" min={5} max={120} value={dur} onChange={(e) => setDur(e.target.value)} className="glass-input h-9" />
            </div>
            <div className="flex items-end">
              <Button className="h-9 gap-1.5 text-sm" onClick={handleAdd} disabled={!text.trim()}>
                <Plus className="w-4 h-4" />Agregar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad cycling controls */}
      {ads.length > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white gap-1.5" onClick={cycleAd}>
            ⏭ Siguiente
          </Button>
          <span className="text-xs text-white/30">
            Mostrando: {ads[activeAdIndex % ads.length]?.text} ({ads[activeAdIndex % ads.length]?.duration}s)
          </span>
          <span className="text-[10px] text-white/20 ml-auto">
            {ads.filter(a => a.mediaType !== 'none').length} con media • {ads.length} total
          </span>
        </div>
      )}

      {/* Ad list */}
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Publicidades ({ads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-6">Sin publicidades agregadas</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {ads.map((ad, i) => (
                <div
                  key={ad.id}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg bg-white/[0.03] group transition-all ${i === activeAdIndex % ads.length ? 'ring-1 ring-emerald-500/30 bg-emerald-500/5' : ''}`}
                >
                  {/* Thumbnail */}
                  {ad.mediaType !== 'none' && ad.mediaData ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 flex items-center justify-center bg-black/20">
                      {ad.mediaType === 'video' ? (
                        <video src={ad.mediaData} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={ad.mediaData} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg border border-dashed border-white/10 shrink-0 flex items-center justify-center bg-white/[0.02]">
                      <span className="text-[9px] text-white/20 text-center leading-tight px-1">Sin<br/>media</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white/80 truncate">{ad.text}</p>
                      {i === activeAdIndex % ads.length && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full shrink-0">EN PANTALLA</span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {ad.duration}s • {ad.mediaType === 'video' ? '📹 Video' : ad.mediaType === 'image' ? '🖼 Imagen' : '📝 Texto'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 shrink-0"
                    onClick={() => removeAd(ad.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── TAB: Skins ─────────────────────────────────────────────────────────────────

function SkinsTab() {
  const skins = useScoreboardStore((s) => s.skins);
  const activeSkinId = useScoreboardStore((s) => s.activeSkinId);
  const addSkin = useScoreboardStore((s) => s.addSkin);
  const removeSkin = useScoreboardStore((s) => s.removeSkin);
  const setActiveSkin = useScoreboardStore((s) => s.setActiveSkin);
  const updateSkin = useScoreboardStore((s) => s.updateSkin);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SkinData>>({});
  const activeSkin = skins.find((s) => s.id === activeSkinId);

  const handleCreate = () => {
    const skin: SkinData = {
      id: genId(), name: newName.trim() || 'Nuevo Skin',
      backgroundColor: '#0c1220', textColor: '#ffffff', scoreColor: '#ffffff',
      timerColor: '#ffffff', accentColor: '#10b981',
      panelBackground: 'rgba(255,255,255,0.03)', panelBorder: 'rgba(255,255,255,0.06)',
    };
    addSkin(skin);
    setNewName('');
    setCreating(false);
    setEditingId(skin.id);
    setEditData(skin);
  };

  return (
    <div className="space-y-3">
      {/* Active skin preview */}
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" />Skin Activo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSkin && (
            <div
              className="rounded-xl p-4 border transition-all duration-300"
              style={{ background: activeSkin.backgroundColor, borderColor: activeSkin.panelBorder }}
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>3</span>
                <span className="text-xl" style={{ color: `${activeSkin.textColor}20` }}>-</span>
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>1</span>
              </div>
              <p className="text-center mt-1 text-sm font-mono" style={{ color: activeSkin.timerColor }}>12:00</p>
              <p className="text-center mt-1 text-xs" style={{ color: `${activeSkin.textColor}50` }}>{activeSkin.name}</p>
              <div className="flex justify-center mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${activeSkin.accentColor}20`, color: activeSkin.accentColor }}>
                  EN VIVO
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create new skin */}
      {!creating ? (
        <Button variant="ghost" className="w-full h-10 border-dashed border-white/10 gap-2 text-white/40 hover:text-white/60 hover:border-white/20" onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />Crear skin
        </Button>
      ) : (
        <Card className="glass-panel rounded-xl border-blue-500/30">
          <CardContent className="py-3 px-4 flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs text-white/50 mb-1 block">Nombre</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Mi Skin" className="glass-input" autoFocus />
            </div>
            <Button size="sm" className="h-9" onClick={handleCreate}>Crear</Button>
            <Button size="sm" variant="ghost" className="h-9 text-white/40" onClick={() => { setCreating(false); setNewName(''); }}>X</Button>
          </CardContent>
        </Card>
      )}

      {/* Skin list */}
      <div className="space-y-2">
        {skins.map((skin) => {
          const isActive = skin.id === activeSkinId;
          const isEditing = editingId === skin.id;
          return (
            <Card key={skin.id} className={`glass-panel rounded-xl transition-all ${isActive ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : ''}`}>
              <CardContent className="py-3 px-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-white/70">Editando: {skin.name}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <ColorPicker label="Fondo" value={editData.backgroundColor || skin.backgroundColor} onChange={(v) => setEditData({ ...editData, backgroundColor: v })} />
                      <ColorPicker label="Texto" value={editData.textColor || skin.textColor} onChange={(v) => setEditData({ ...editData, textColor: v })} />
                      <ColorPicker label="Marcador" value={editData.scoreColor || skin.scoreColor} onChange={(v) => setEditData({ ...editData, scoreColor: v })} />
                      <ColorPicker label="Timer" value={editData.timerColor || skin.timerColor} onChange={(v) => setEditData({ ...editData, timerColor: v })} />
                      <ColorPicker label="Acento" value={editData.accentColor || skin.accentColor} onChange={(v) => setEditData({ ...editData, accentColor: v })} />
                      <div className="flex items-end gap-1">
                        <Button size="sm" className="h-10 flex-1 gap-1" onClick={() => { updateSkin(skin.id, editData); setEditingId(null); }}>
                          <Check className="w-3.5 h-3.5" />Guardar
                        </Button>
                        <Button size="sm" variant="ghost" className="h-10 text-white/40" onClick={() => { setEditingId(null); }}>X</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{ backgroundColor: skin.backgroundColor, color: skin.accentColor }}
                    >
                      Aa
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 truncate">{skin.name}</p>
                      <div className="flex gap-1 mt-1">
                        {[skin.backgroundColor, skin.scoreColor, skin.timerColor, skin.accentColor].map((c, i) => (
                          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive && (
                        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-white/50 hover:text-white" onClick={() => setActiveSkin(skin.id)}>
                          <Check className="w-3 h-3" />Activar
                        </Button>
                      )}
                      {isActive && (
                        <span className="text-xs font-black tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          ✓ ACTIVO
                        </span>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/30 hover:text-white" onClick={() => { setEditingId(skin.id); setEditData({ ...skin }); }}>
                        <Settings className="w-3.5 h-3.5" />
                      </Button>
                      {skin.id !== 'default' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/20 hover:text-red-400" onClick={() => removeSkin(skin.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Display Preview Modal ─────────────────────────────────────────────────────

function DisplayPreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white/70">Vista Previa del Marcador — Tiempo Real</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-white/50 hover:text-white gap-1.5"
            onClick={() => {
              const el = document.querySelector('.preview-container');
              if (el) {
                if (!document.fullscreenElement) {
                  el.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen();
                }
              }
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />Pantalla Completa
          </Button>
          <Button size="sm" variant="ghost" className="text-xs text-white/50 hover:text-white gap-1.5" onClick={onClose}>
            <X className="w-3.5 h-3.5" />Cerrar
          </Button>
        </div>
      </div>

      {/* Display content */}
      <div className="flex-1 preview-container overflow-hidden">
        <StadiumDisplay />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ControlPanel({ activeScreenId, onSelectScreen, wsConnected }: {
  activeScreenId: string | null;
  onSelectScreen: (id: string | null) => void;
  wsConnected: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="control-mode min-h-screen">
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />
      <header className="sticky top-0 z-50 bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <span className="text-white font-black text-sm">PF</span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">Profutbol</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Marcador para Canchas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista Previa</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-white/40 hover:text-white"
              onClick={() => {
                const base = window.location.pathname.includes('/Profutbol') ? '/Profutbol' : '';
                window.open(`${base}/marcador`, '_blank');
              }}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abrir Marcador</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Active screen indicator */}
      {activeScreenId && (
        <div className="max-w-4xl mx-auto px-4 pt-4 relative z-10">
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2">
            <MonitorSmartphone className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-300 font-medium">Controlando pantalla via servidor</span>
            {wsConnected && <span className="text-[10px] text-emerald-400 ml-auto">En linea</span>}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 pb-20 relative z-10">
        <Tabs defaultValue="pantallas" className="w-full">
          <TabsList className="w-full mb-4 bg-white/[0.05] p-1 h-auto border border-white/[0.06] rounded-xl">
            <TabsTrigger value="pantallas" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><MonitorSmartphone className="w-3.5 h-3.5" />Pantallas</TabsTrigger>
            <TabsTrigger value="equipos" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Settings className="w-3.5 h-3.5" />Equipos</TabsTrigger>
            <TabsTrigger value="marcador" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Trophy className="w-3.5 h-3.5" />Marcador</TabsTrigger>
            <TabsTrigger value="eventos" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><List className="w-3.5 h-3.5" />Eventos</TabsTrigger>
            <TabsTrigger value="publicidad" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Megaphone className="w-3.5 h-3.5" />Ads</TabsTrigger>
            <TabsTrigger value="skins" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Palette className="w-3.5 h-3.5" />Skins</TabsTrigger>
          </TabsList>
          <TabsContent value="pantallas"><ScreensTab activeScreenId={activeScreenId} onSelectScreen={onSelectScreen} /></TabsContent>
          <TabsContent value="equipos"><EquiposTab /></TabsContent>
          <TabsContent value="marcador"><ScoreTab /></TabsContent>
          <TabsContent value="eventos"><EventsTab /></TabsContent>
          <TabsContent value="publicidad"><PublicidadTab /></TabsContent>
          <TabsContent value="skins"><SkinsTab /></TabsContent>
        </Tabs>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#0a1628]/80 backdrop-blur-xl border-t border-white/[0.06] z-50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-white/20">Profutbol v1.0 — Marcador para Canchas</p>
          <p className="text-[10px] text-white/20">Fútbol 5 / 7 / 8 / 11</p>
        </div>
      </footer>

      {/* Live Preview Overlay */}
      <DisplayPreview open={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
}