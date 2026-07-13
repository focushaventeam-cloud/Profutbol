'use client';

import { useState, useRef } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  MatchStatus, MatchPeriod, EventType, TeamSide, MatchFormat,
  EVENT_ICONS, EVENT_LABELS, PERIOD_LABELS, STATUS_LABELS,
  FORMAT_OPTIONS, HALF_DURATION_OPTIONS, SkinData, AdData,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Play, Pause, RotateCcw, Plus, Minus, Trash2, Monitor,
  Trophy, Settings, List, Palette, Upload, X, Check, ImagePlus, Megaphone,
} from 'lucide-react';

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
        <Button variant="ghost" size="sm" onClick={() => window.open('/marcador', '_blank')} className="gap-1.5 text-xs text-white/50 hover:text-white">
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
        {isLive && match.period === 'second_half' && <Button variant="ghost" className="h-11 text-sm font-bold text-blue-400 hover:bg-blue-500/10 gap-1.5" onClick={() => { pauseTimer(); setPeriod('extra_time_first'); setStatus('halftime'); }}>Prórroga</Button>}
        {isLive && <Button variant="ghost" className="h-11 text-sm font-bold text-red-400 hover:bg-red-500/10 gap-1.5" onClick={handleFinish}><Trophy className="w-4 h-4" />Finalizar</Button>}
        {match.status === 'halftime' && match.period === 'second_half' && (
          <Button variant="ghost" className="h-11 text-sm font-bold text-blue-400 hover:bg-blue-500/10 gap-1.5" onClick={() => { pauseTimer(); setPeriod('extra_time_first'); }}>
            <Play className="w-4 h-4" />Prórroga
          </Button>
        )}
        <AlertDialog open={showReset} onOpenChange={setShowReset}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="h-11 text-sm font-bold text-red-400 hover:bg-red-500/10 gap-1.5"><RotateCcw className="w-4 h-4" />Nuevo</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1a1a2e] border-white/10">
            <AlertDialogHeader><AlertDialogTitle className="text-white">¿Reiniciar partido?</AlertDialogTitle><AlertDialogDescription className="text-white/60">Se perderán todos los datos.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel className="bg-white/10 text-white border-white/10 hover:bg-white/20">Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleReset} className="bg-red-600 text-white hover:bg-red-700">Reiniciar</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
  const [desc, setDesc] = useState('');
  const [subIn, setSubIn] = useState('');
  const [subOut, setSubOut] = useState('');
  const isFinished = match.status === 'finished';
  const minute = Math.floor(match.currentTime / 60) + 1;

  const add = (type: EventType, team: TeamSide) => {
    addEvent({ id: genId(), type, team, playerName: playerName.trim() || undefined, minute, description: desc.trim() || undefined, playerInName: type === 'substitution' ? subIn.trim() || undefined : undefined, playerOutName: type === 'substitution' ? subOut.trim() || undefined : undefined });
    if (type !== 'substitution') { setPlayerName(''); setDesc(''); }
    else { setSubIn(''); setSubOut(''); setPlayerName(''); setDesc(''); }
  };

  const goalBtn = (type: EventType, team: TeamSide, label: string) => (
    <Button key={`${type}-${team}`} variant="ghost" className="h-10 text-sm font-bold" style={{ backgroundColor: `${match[team === 'home' ? 'homeTeam' : 'awayTeam'].color}15`, color: match[team === 'home' ? 'homeTeam' : 'awayTeam'].color, border: `1px solid ${match[team === 'home' ? 'homeTeam' : 'awayTeam'].color}25` }}
      onClick={() => add(type, team)} disabled={isFinished}>⚽ {label}</Button>
  );

  const cardBtn = (type: EventType, team: TeamSide) => {
    const isYellow = type === 'yellow_card';
    return (
      <Button key={`${type}-${team}`} variant="ghost"
        className={`h-10 text-sm font-bold ${isYellow ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}
        onClick={() => add(type, team)} disabled={isFinished}>
        {isYellow ? '🟨' : '🟥'} {match[team === 'home' ? 'homeTeam' : 'awayTeam'].shortName.slice(0, 5)}
      </Button>
    );
  };

  return (
    <div className="space-y-3">
      <Card className="glass-panel rounded-xl">
        <CardContent className="py-3 px-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Jugador</Label>
              <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nombre..." className="glass-input h-9" />
            </div>
            <div>
              <Label className="text-xs text-white/50 mb-1 block">Descripción</Label>
              <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Opcional..." className="glass-input h-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs text-white/50 mb-1 block">Entra (cambio)</Label><Input value={subIn} onChange={(e) => setSubIn(e.target.value)} placeholder="Jugador que entra" className="glass-input h-9" /></div>
            <div><Label className="text-xs text-white/50 mb-1 block">Sale (cambio)</Label><Input value={subOut} onChange={(e) => setSubOut(e.target.value)} placeholder="Jugador que sale" className="glass-input h-9" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Registrar Evento</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Goles</p>
          <div className="grid grid-cols-2 gap-2">
            {goalBtn('goal', 'home', `Gol ${match.homeTeam.shortName}`)}
            {goalBtn('goal', 'away', `Gol ${match.awayTeam.shortName}`)}
            {goalBtn('penalty_goal', 'home', `Penal ${match.homeTeam.shortName}`)}
            {goalBtn('penalty_goal', 'away', `Penal ${match.awayTeam.shortName}`)}
            {goalBtn('own_goal', 'home', `Autogol ${match.homeTeam.shortName}`)}
            {goalBtn('own_goal', 'away', `Autogol ${match.awayTeam.shortName}`)}
          </div>
          <Separator className="bg-white/5" />
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Tarjetas</p>
          <div className="grid grid-cols-4 gap-2">
            {cardBtn('yellow_card', 'home')}{cardBtn('red_card', 'home')}
            {cardBtn('yellow_card', 'away')}{cardBtn('red_card', 'away')}
          </div>
          <Separator className="bg-white/5" />
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Otros</p>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" className="h-10 text-sm font-bold bg-white/5 text-white/60 border-white/10 hover:bg-white/10" onClick={() => add('substitution', 'home')} disabled={isFinished}>🔄 {match.homeTeam.shortName.slice(0, 5)}</Button>
            <Button variant="ghost" className="h-10 text-sm font-bold bg-white/5 text-white/60 border-white/10 hover:bg-white/10" onClick={() => add('substitution', 'away')} disabled={isFinished}>🔄 {match.awayTeam.shortName.slice(0, 5)}</Button>
            <Button variant="ghost" className="h-10 text-sm font-bold bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20" onClick={() => add('var_review', 'home')} disabled={isFinished}>📺 VAR</Button>
            <Button variant="ghost" className="h-10 text-sm font-bold bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20" onClick={() => add('injury', 'home')} disabled={isFinished}>🩹 Lesión</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Eventos ({match.events.length})</CardTitle></CardHeader>
        <CardContent>
          {match.events.length === 0 ? <p className="text-sm text-white/30 text-center py-4">Sin eventos</p> : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {match.events.map((ev) => {
                const team = ev.team === 'home' ? match.homeTeam : match.awayTeam;
                return (
                  <div key={ev.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group">
                    <span className="text-base">{EVENT_ICONS[ev.type]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold" style={{ color: team.color }}>{team.shortName}</span>
                      <span className="text-sm text-white/50 ml-1.5">{EVENT_LABELS[ev.type]}</span>
                      {ev.playerName && <span className="text-sm text-white/40 ml-1">• {ev.playerName}</span>}
                      {ev.playerInName && <span className="text-sm text-green-400/60 ml-1">↑{ev.playerInName}</span>}
                      {ev.playerOutName && <span className="text-sm text-red-400/60 ml-1">↓{ev.playerOutName}</span>}
                    </div>
                    <span className="text-xs font-mono text-white/25">{ev.minute}&apos;</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400" onClick={() => removeEvent(ev.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                );
              })}
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
  const updateAd = useScoreboardStore((s) => s.updateAd);
  const cycleAd = useScoreboardStore((s) => s.cycleAd);
  const [text, setText] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [dur, setDur] = useState('15');

  const handleAdd = () => {
    if (!text.trim()) return;
    addAd({ id: genId(), text: text.trim(), imageUrl: imgUrl.trim(), duration: parseInt(dur) || 15, active: true });
    setText(''); setImgUrl(''); setDur('15');
  };

  return (
    <div className="space-y-3">
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2"><Megaphone className="w-4 h-4" />Nueva Publicidad</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div><Label className="text-xs text-white/50 mb-1 block">Texto</Label><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Texto del patrocinador..." className="glass-input" /></div>
          <div><Label className="text-xs text-white/50 mb-1 block">URL de imagen (opcional)</Label><Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." className="glass-input" /></div>
          <div className="flex gap-2">
            <div className="flex-1"><Label className="text-xs text-white/50 mb-1 block">Duración (seg)</Label><Input type="number" min={5} max={120} value={dur} onChange={(e) => setDur(e.target.value)} className="glass-input h-9" /></div>
            <div className="flex items-end"><Button className="h-9 gap-1.5 text-sm" onClick={handleAdd}><Plus className="w-4 h-4" />Agregar</Button></div>
          </div>
        </CardContent>
      </Card>

      {ads.length > 0 && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white" onClick={cycleAd}>⏭ Siguiente</Button>
          <span className="text-xs text-white/30 self-center">Mostrando: {ads.length > 0 ? ads[activeAdIndex % ads.length]?.text : '—'}</span>
        </div>
      )}

      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Publicidades ({ads.length})</CardTitle></CardHeader>
        <CardContent>
          {ads.length === 0 ? <p className="text-sm text-white/30 text-center py-4">Sin publicidades</p> : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ads.map((ad, i) => (
                <div key={ad.id} className={`flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.03] group ${i === activeAdIndex % ads.length ? 'ring-1 ring-blue-500/30' : ''}`}>
                  {ad.imageUrl && <img src={ad.imageUrl} alt="" className="w-10 h-10 object-contain rounded" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/80 truncate">{ad.text}</p>
                    <p className="text-[10px] text-white/30">{ad.duration}s</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400" onClick={() => removeAd(ad.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
    const skin: SkinData = { id: genId(), name: newName.trim() || 'Nuevo Skin', backgroundColor: '#0c1220', textColor: '#ffffff', scoreColor: '#ffffff', timerColor: '#ffffff', accentColor: '#10b981', panelBackground: 'rgba(255,255,255,0.03)', panelBorder: 'rgba(255,255,255,0.06)' };
    addSkin(skin); setNewName(''); setCreating(false); setEditingId(skin.id); setEditData(skin);
  };

  return (
    <div className="space-y-3">
      <Card className="glass-panel rounded-xl">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2"><Palette className="w-4 h-4" />Skin Activo</CardTitle></CardHeader>
        <CardContent>
          {activeSkin && (
            <div className="rounded-xl p-4 border" style={{ background: activeSkin.backgroundColor, borderColor: activeSkin.panelBorder }}>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>3</span>
                <span className="text-xl text-white/20">-</span>
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>1</span>
              </div>
              <p className="text-center mt-1 text-sm font-mono" style={{ color: activeSkin.timerColor }}>12:00</p>
              <p className="text-center mt-1 text-xs" style={{ color: `${activeSkin.textColor}50` }}>{activeSkin.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!creating ? (
        <Button variant="ghost" className="w-full h-10 border-dashed border-white/10 gap-2 text-white/40 hover:text-white/60 hover:border-white/20" onClick={() => setCreating(true)}><Plus className="w-4 h-4" />Crear skin</Button>
      ) : (
        <Card className="glass-panel rounded-xl border-blue-500/30">
          <CardContent className="py-3 px-4 flex gap-2 items-end">
            <div className="flex-1"><Label className="text-xs text-white/50 mb-1 block">Nombre</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Mi Skin" className="glass-input" autoFocus /></div>
            <Button size="sm" className="h-9" onClick={handleCreate}>Crear</Button>
            <Button size="sm" variant="ghost" className="h-9 text-white/40" onClick={() => { setCreating(false); setNewName(''); }}>X</Button>
          </CardContent>
        </Card>
      )}

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
                        <Button size="sm" className="h-10 flex-1 gap-1" onClick={() => { updateSkin(skin.id, editData); setEditingId(null); }}><Check className="w-3.5 h-3.5" />Guardar</Button>
                        <Button size="sm" variant="ghost" className="h-10 text-white/40" onClick={() => { setEditingId(null); }}>X</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: skin.backgroundColor, color: skin.accentColor }}>Aa</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 truncate">{skin.name}</p>
                      <div className="flex gap-1 mt-1">{[skin.backgroundColor, skin.scoreColor, skin.timerColor, skin.accentColor].map((c, i) => <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />)}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive && <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-white/50 hover:text-white" onClick={() => setActiveSkin(skin.id)}><Check className="w-3 h-3" />Activar</Button>}
                      {isActive && <span className="text-xs font-black tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">✓ ACTIVO</span>}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/30 hover:text-white" onClick={() => { setEditingId(skin.id); setEditData({ ...skin }); }}><Settings className="w-3.5 h-3.5" /></Button>
                      {skin.id !== 'default' && <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/20 hover:text-red-400" onClick={() => removeSkin(skin.id)}><Trash2 className="w-3.5 h-3.5" /></Button>}
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

// ── Main ──────────────────────────────────────────────────────────────────────

export function ControlPanel() {
  return (
    <div className="control-mode min-h-screen">
      <div className="parallax-bg" />
      <div className="stadium-bokeh" />
      <header className="sticky top-0 z-50 bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center"><span className="text-white font-black text-sm">PF</span></div>
            <div><h1 className="text-base font-bold tracking-tight text-white">Profutbol</h1><p className="text-[10px] text-white/30 uppercase tracking-wider">Marcador para Canchas</p></div>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-white/40 hover:text-white" onClick={() => window.open('/marcador', '_blank')}><Monitor className="w-3.5 h-3.5" /><span className="hidden sm:inline">Abrir Marcador</span></Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <Tabs defaultValue="marcador" className="w-full">
          <TabsList className="w-full mb-4 bg-white/[0.05] p-1 h-auto border border-white/[0.06] rounded-xl">
            <TabsTrigger value="equipos" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Settings className="w-3.5 h-3.5" />Equipos</TabsTrigger>
            <TabsTrigger value="marcador" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Trophy className="w-3.5 h-3.5" />Marcador</TabsTrigger>
            <TabsTrigger value="eventos" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><List className="w-3.5 h-3.5" />Eventos</TabsTrigger>
            <TabsTrigger value="publicidad" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Megaphone className="w-3.5 h-3.5" />Ads</TabsTrigger>
            <TabsTrigger value="skins" className="flex-1 gap-1.5 py-2.5 text-xs text-white/40 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white rounded-lg"><Palette className="w-3.5 h-3.5" />Skins</TabsTrigger>
          </TabsList>
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
    </div>
  );
}