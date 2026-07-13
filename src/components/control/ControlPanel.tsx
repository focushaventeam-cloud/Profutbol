'use client';

import { useState, useRef } from 'react';
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Play, Pause, RotateCcw, Plus, Minus, ChevronRight, Trash2, Monitor,
  Trophy, Settings, List, Palette, Upload, X, Check, ImagePlus,
} from 'lucide-react';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Color picker ───────────────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border-2 border-border/50 cursor-pointer bg-transparent p-0.5"
      />
      <div className="flex-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="text-xs font-mono text-muted-foreground/60">{value}</p>
      </div>
    </div>
  );
}

// ── Logo uploader ──────────────────────────────────────────────────────────────

function LogoUploader({ logo, onUpload, onRemove }: { logo: string; onUpload: (b64: string) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB max
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {logo ? (
        <div className="relative group">
          <img src={logo} alt="Logo" className="w-14 h-14 rounded-xl object-contain border border-border/30 bg-background/50" />
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-14 h-14 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-0.5 hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-4 h-4 text-muted-foreground" />
          <span className="text-[8px] text-muted-foreground">Logo</span>
        </button>
      )}
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => fileRef.current?.click()}>
        <ImagePlus className="w-3 h-3" />
        {logo ? 'Cambiar' : 'Subir logo'}
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
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Logo */}
        <LogoUploader
          logo={team.logo}
          onUpload={(b64) => setTeamLogo(side, b64)}
          onRemove={() => setTeamLogo(side, '')}
        />
        {/* Nombre */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Nombre</Label>
          <Input
            value={team.name}
            onChange={(e) => setTeamName(side, e.target.value, e.target.value.slice(0, 10).toUpperCase())}
            placeholder="Nombre del equipo"
            className="bg-background/50"
          />
        </div>
        {/* Abreviatura */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Abreviatura (pantalla)</Label>
          <Input
            value={team.shortName}
            onChange={(e) => setTeamName(side, team.name, e.target.value.toUpperCase())}
            placeholder="ABREV"
            maxLength={10}
            className="bg-background/50 font-bold text-center text-lg"
          />
        </div>
        {/* Colores */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Colores</Label>
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

  const [showReset, setShowReset] = useState(false);

  const canStart = match.status === 'waiting' || match.status === 'halftime';
  const canPause = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isHalftime = match.status === 'halftime';

  const handleStart = () => startTimer();
  const handlePause = () => pauseTimer();
  const handleHalfTime = () => { pauseTimer(); setPeriod('second_half'); setStatus('halftime'); };
  const handleFinish = () => { pauseTimer(); setStatus('finished'); };
  const handleReset = () => { resetMatch(); setShowReset(false); };

  return (
    <div className="space-y-4">
      {/* Config rápida */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Cancha</Label>
              <Input value={match.field} onChange={(e) => setField(e.target.value)} className="bg-background/50 h-9" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Tipo</Label>
              <Select value={match.format} onValueChange={(v) => setFormat(v as MatchFormat)}>
                <SelectTrigger className="bg-background/50 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Duración</Label>
              <Select value={String(match.halfDuration)} onValueChange={(v) => setHalfDuration(Number(v))}>
                <SelectTrigger className="bg-background/50 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HALF_DURATION_OPTIONS.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.label} c/tiempo</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 text-center w-full">
                Total: <strong>{match.halfDuration * 2} min</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status + abrir marcador */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: match.status === 'live' ? '#22c55e20' : isFinished ? '#ef444420' : '#f59e0b20',
              color: match.status === 'live' ? '#22c55e' : isFinished ? '#ef4444' : '#f59e0b',
            }}
          >
            {STATUS_LABELS[match.status]}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open('/marcador', '_blank')} className="gap-1.5 text-xs">
          <Monitor className="w-3.5 h-3.5" />
          Abrir Marcador
        </Button>
      </div>

      {/* Score Display */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Home */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              {match.homeTeam.logo ? (
                <img src={match.homeTeam.logo} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl" />
              ) : (
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: match.homeTeam.color }}
                >
                  {match.homeTeam.shortName.slice(0, 3)}
                </div>
              )}
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.homeTeam.color }}>
                {match.homeTeam.name}
              </span>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm" variant="outline"
                  className="h-10 w-10 rounded-full p-0 border-green-500/30 text-green-500 hover:bg-green-500/10"
                  onClick={() => updateScore('home', 1)} disabled={isFinished}
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-10 w-10 rounded-full p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => updateScore('home', -1)} disabled={isFinished || match.homeScore <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Center */}
            <div className="px-4 md:px-8 py-6 md:py-8 flex flex-col items-center justify-center border-x border-border/30 min-w-[160px] md:min-w-[220px]">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-7xl font-black tabular-nums leading-none" style={{ color: match.homeTeam.color }}>
                  {match.homeScore}
                </span>
                <span className="text-2xl md:text-3xl font-extralight text-muted-foreground">-</span>
                <span className="text-5xl md:text-7xl font-black tabular-nums leading-none" style={{ color: match.awayTeam.color }}>
                  {match.awayScore}
                </span>
              </div>
              <div className="mt-3 text-center">
                <span className={`text-2xl md:text-3xl font-mono font-bold tabular-nums ${match.status === 'live' ? '' : 'text-muted-foreground/50'}`}>
                  {String(Math.floor(match.currentTime / 60)).padStart(2, '0')}:{String(match.currentTime % 60).padStart(2, '0')}
                </span>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                  {PERIOD_LABELS[match.period]}
                </p>
              </div>
            </div>

            {/* Away */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              {match.awayTeam.logo ? (
                <img src={match.awayTeam.logo} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl" />
              ) : (
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: match.awayTeam.color }}
                >
                  {match.awayTeam.shortName.slice(0, 3)}
                </div>
              )}
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.awayTeam.color }}>
                {match.awayTeam.name}
              </span>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm" variant="outline"
                  className="h-10 w-10 rounded-full p-0 border-green-500/30 text-green-500 hover:bg-green-500/10"
                  onClick={() => updateScore('away', 1)} disabled={isFinished}
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-10 w-10 rounded-full p-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={() => updateScore('away', -1)} disabled={isFinished || match.awayScore <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {canStart && (
          <Button className="h-12 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2 col-span-2 md:col-span-1" onClick={handleStart}>
            <Play className="w-4 h-4" />
            {match.status === 'waiting' ? 'Iniciar' : '2do Tiempo'}
          </Button>
        )}
        {canPause && (
          <Button variant="outline" className="h-12 text-sm font-bold border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 gap-2 col-span-2 md:col-span-1" onClick={handlePause}>
            <Pause className="w-4 h-4" />Pausar
          </Button>
        )}
        {match.status === 'live' && match.period === 'first_half' && (
          <Button variant="outline" className="h-12 text-sm font-bold border-orange-500/30 text-orange-600 hover:bg-orange-500/10 gap-2 col-span-2 md:col-span-1" onClick={handleHalfTime}>
            <ChevronRight className="w-4 h-4" />Medio Tiempo
          </Button>
        )}
        {match.status === 'live' && (
          <Button variant="outline" className="h-12 text-sm font-bold border-red-500/30 text-red-600 hover:bg-red-500/10 gap-2 col-span-2 md:col-span-1" onClick={handleFinish}>
            <Trophy className="w-4 h-4" />Finalizar
          </Button>
        )}
        {isHalftime && (
          <Button className="h-12 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2 col-span-2 md:col-span-1" onClick={handleStart}>
            <Play className="w-4 h-4" />2do Tiempo
          </Button>
        )}
        <AlertDialog open={showReset} onOpenChange={setShowReset}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10 gap-2 col-span-2 md:col-span-1">
              <RotateCcw className="w-4 h-4" />Nuevo Partido
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar partido?</AlertDialogTitle>
              <AlertDialogDescription>Se perderán todos los datos actuales.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Reiniciar</AlertDialogAction>
            </AlertDialogFooter>
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
  const isFinished = match.status === 'finished';
  const currentMinute = Math.floor(match.currentTime / 60) + 1;

  const handleAddEvent = (type: EventType, team: TeamSide) => {
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
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="py-3 px-4">
          <Label className="text-xs text-muted-foreground mb-1 block">Jugador (opcional)</Label>
          <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nombre del jugador..." className="bg-background/50" />
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Registrar Evento</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Goles</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11 text-sm font-bold" style={{ backgroundColor: `${match.homeTeam.color}20`, color: match.homeTeam.color, border: `1px solid ${match.homeTeam.color}30` }} onClick={() => handleAddEvent('goal', 'home')} disabled={isFinished}>
                ⚽ Gol {match.homeTeam.shortName}
              </Button>
              <Button variant="outline" className="h-11 text-sm font-bold" style={{ backgroundColor: `${match.awayTeam.color}20`, color: match.awayTeam.color, border: `1px solid ${match.awayTeam.color}30` }} onClick={() => handleAddEvent('goal', 'away')} disabled={isFinished}>
                ⚽ Gol {match.awayTeam.shortName}
              </Button>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Tarjetas</p>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" className="h-11 text-sm font-bold bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" onClick={() => handleAddEvent('yellow_card', 'home')} disabled={isFinished}>🟨 {match.homeTeam.shortName.slice(0, 5)}</Button>
              <Button variant="outline" className="h-11 text-sm font-bold bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" onClick={() => handleAddEvent('red_card', 'home')} disabled={isFinished}>🟥 {match.homeTeam.shortName.slice(0, 5)}</Button>
              <Button variant="outline" className="h-11 text-sm font-bold bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20" onClick={() => handleAddEvent('yellow_card', 'away')} disabled={isFinished}>🟨 {match.awayTeam.shortName.slice(0, 5)}</Button>
              <Button variant="outline" className="h-11 text-sm font-bold bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" onClick={() => handleAddEvent('red_card', 'away')} disabled={isFinished}>🟥 {match.awayTeam.shortName.slice(0, 5)}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Eventos ({match.events.length})</CardTitle></CardHeader>
        <CardContent>
          {match.events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin eventos</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {match.events.map((ev) => {
                const team = ev.team === 'home' ? match.homeTeam : match.awayTeam;
                return (
                  <div key={ev.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                    <span className="text-lg">{EVENT_ICONS[ev.type]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold" style={{ color: team.color }}>{team.shortName}</span>
                      <span className="text-sm text-muted-foreground ml-2">{EVENT_LABELS[ev.type]}</span>
                      {ev.playerName && <span className="text-sm text-muted-foreground ml-1">- {ev.playerName}</span>}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">{ev.minute}&apos;</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" onClick={() => removeEvent(ev.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
      id: genId(),
      name: newName.trim() || 'Nuevo Skin',
      backgroundColor: '#0c1220',
      textColor: '#ffffff',
      scoreColor: '#ffffff',
      timerColor: '#ffffff',
      accentColor: '#10b981',
      panelBackground: 'rgba(255,255,255,0.03)',
      panelBorder: 'rgba(255,255,255,0.06)',
    };
    addSkin(skin);
    setNewName('');
    setCreating(false);
    setEditingId(skin.id);
    setEditData(skin);
  };

  const handleStartEdit = (skin: SkinData) => {
    setEditingId(skin.id);
    setEditData({ ...skin });
  };

  const handleSaveEdit = () => {
    if (editingId && editData) {
      updateSkin(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  return (
    <div className="space-y-4">
      {/* Skin activo */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Skin Activo: <span style={{ color: activeSkin?.accentColor || '#10b981' }}>{activeSkin?.name || 'Predeterminado'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSkin && (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: activeSkin.backgroundColor,
                borderColor: activeSkin.panelBorder,
              }}
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>3</span>
                <span className="text-xl text-white/20">-</span>
                <span className="text-3xl font-black" style={{ color: activeSkin.scoreColor }}>1</span>
              </div>
              <p className="text-center mt-1 text-sm font-mono" style={{ color: activeSkin.timerColor }}>12:00</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crear nuevo */}
      {!creating ? (
        <Button variant="outline" className="w-full h-11 border-dashed gap-2" onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />Crear nuevo skin
        </Button>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 border-primary/30">
          <CardContent className="py-3 px-4 flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Nombre del skin</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Mi Skin" className="bg-background/50" autoFocus />
            </div>
            <Button size="sm" className="h-9" onClick={handleCreate}>Crear</Button>
            <Button size="sm" variant="ghost" className="h-9" onClick={() => { setCreating(false); setNewName(''); }}>Cancelar</Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de skins */}
      <div className="space-y-3">
        {skins.map((skin) => {
          const isActive = skin.id === activeSkinId;
          const isEditing = editingId === skin.id;

          return (
            <Card key={skin.id} className={`bg-card/80 backdrop-blur-sm transition-all ${isActive ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'}`}>
              <CardContent className="py-3 px-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold">Editando: {skin.name}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <ColorPicker label="Fondo" value={editData.backgroundColor || skin.backgroundColor} onChange={(v) => setEditData({ ...editData, backgroundColor: v })} />
                      <ColorPicker label="Texto" value={editData.textColor || skin.textColor} onChange={(v) => setEditData({ ...editData, textColor: v })} />
                      <ColorPicker label="Marcador" value={editData.scoreColor || skin.scoreColor} onChange={(v) => setEditData({ ...editData, scoreColor: v })} />
                      <ColorPicker label="Timer" value={editData.timerColor || skin.timerColor} onChange={(v) => setEditData({ ...editData, timerColor: v })} />
                      <ColorPicker label="Acento" value={editData.accentColor || skin.accentColor} onChange={(v) => setEditData({ ...editData, accentColor: v })} />
                      <div className="flex items-end gap-1">
                        <Button size="sm" className="h-10 flex-1 gap-1" onClick={handleSaveEdit}><Check className="w-3.5 h-3.5" />Guardar</Button>
                        <Button size="sm" variant="ghost" className="h-10" onClick={() => { setEditingId(null); setEditData({}); }}>X</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Preview swatch */}
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: skin.backgroundColor, color: skin.accentColor }}
                    >
                      Aa
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{skin.name}</p>
                      <div className="flex gap-1 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skin.backgroundColor }} title="Fondo" />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skin.scoreColor }} title="Marcador" />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skin.timerColor }} title="Timer" />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skin.accentColor }} title="Acento" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive && (
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setActiveSkin(skin.id)}>
                          <Check className="w-3 h-3" />Activar
                        </Button>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">ACTIVO</span>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => handleStartEdit(skin)}>
                        <Settings className="w-3.5 h-3.5" />
                      </Button>
                      {skin.id !== 'default' && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeSkin(skin.id)}>
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

// ── Main ──────────────────────────────────────────────────────────────────────

export function ControlPanel() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <span className="text-white font-black text-sm">PF</span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Profutbol</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Marcador para Canchas</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.open('/marcador', '_blank')}>
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abrir Marcador</span>
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="marcador" className="w-full">
          <TabsList className="w-full mb-4 bg-muted/50 p-1 h-auto">
            <TabsTrigger value="equipos" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <Settings className="w-3.5 h-3.5" />Equipos
            </TabsTrigger>
            <TabsTrigger value="marcador" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <Trophy className="w-3.5 h-3.5" />Marcador
            </TabsTrigger>
            <TabsTrigger value="eventos" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <List className="w-3.5 h-3.5" />Eventos
            </TabsTrigger>
            <TabsTrigger value="skins" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <Palette className="w-3.5 h-3.5" />Skins
            </TabsTrigger>
          </TabsList>
          <TabsContent value="equipos"><EquiposTab /></TabsContent>
          <TabsContent value="marcador"><ScoreTab /></TabsContent>
          <TabsContent value="eventos"><EventsTab /></TabsContent>
          <TabsContent value="skins"><SkinsTab /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">Profutbol v1.0 — Marcador para Canchas</p>
          <p className="text-[10px] text-muted-foreground">Fútbol 5 / 7 / 8 / 11</p>
        </div>
      </footer>
    </div>
  );
}