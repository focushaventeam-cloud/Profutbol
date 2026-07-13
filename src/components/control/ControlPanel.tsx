'use client';

import { useState } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  MatchStatus, MatchPeriod, EventType, TeamSide, MatchFormat,
  EVENT_ICONS, EVENT_LABELS, PERIOD_LABELS, STATUS_LABELS,
  FORMAT_OPTIONS, HALF_DURATION_OPTIONS,
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
  Trophy, Settings, List,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function formatTimerDisplay(s: number, halfDuration: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const totalSec = halfDuration * 60;
  const mm = String(Math.min(m, Math.ceil(totalSec / 60))).padStart(2, '0');
  return `${mm}:${String(sec).padStart(2, '0')}`;
}

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Color picker wrapper ───────────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border-2 border-white/10 cursor-pointer bg-transparent p-0.5"
        />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// ── Team Card ──────────────────────────────────────────────────────────────────

function TeamSetupCard({ side, label }: { side: TeamSide; label: string }) {
  const team = useScoreboardStore((s) => s.match[side === 'home' ? 'homeTeam' : 'awayTeam']);
  const setTeamName = useScoreboardStore((s) => s.setTeamName);
  const setTeamColor = useScoreboardStore((s) => s.setTeamColor);

  const shortName = team.shortName.length > 10 ? team.shortName.slice(0, 10).toUpperCase() : team.shortName.toUpperCase();

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Nombre del equipo</Label>
          <Input
            value={team.name}
            onChange={(e) => setTeamName(side, e.target.value, e.target.value.slice(0, 10).toUpperCase())}
            placeholder="Nombre"
            className="bg-background/50"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Abreviatura (display)</Label>
          <Input
            value={shortName}
            onChange={(e) => setTeamName(side, team.name, e.target.value.toUpperCase())}
            placeholder="ABREV"
            maxLength={10}
            className="bg-background/50 font-bold text-center text-lg"
          />
        </div>
        <div className="flex gap-3">
          <ColorPicker label="Principal" value={team.color} onChange={(c) => setTeamColor(side, c, team.colorSecondary)} />
          <ColorPicker label="Secundario" value={team.colorSecondary} onChange={(c) => setTeamColor(side, team.color, c)} />
        </div>
      </CardContent>
    </Card>
  );
}

// ── TAB: Partido (Setup) ───────────────────────────────────────────────────────

function SetupTab() {
  const match = useScoreboardStore((s) => s.match);
  const setField = useScoreboardStore((s) => s.setField);
  const setFormat = useScoreboardStore((s) => s.setFormat);
  const setHalfDuration = useScoreboardStore((s) => s.setHalfDuration);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración del Partido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Tipo de partido</Label>
              <Select value={match.format} onValueChange={(v) => setFormat(v as MatchFormat)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label} <span className="text-muted-foreground text-xs ml-1">({f.players})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Duración por tiempo</Label>
              <Select value={String(match.halfDuration)} onValueChange={(v) => setHalfDuration(Number(v))}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HALF_DURATION_OPTIONS.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Nombre de la cancha</Label>
            <Input
              value={match.field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Cancha 1"
              className="bg-background/50"
            />
          </div>
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
            Duración total: <strong>{match.halfDuration * 2} minutos</strong> (2 tiempos de {match.halfDuration} min)
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamSetupCard side="home" label="Equipo Local" />
        <TeamSetupCard side="away" label="Equipo Visitante" />
      </div>
    </div>
  );
}

// ── TAB: Marcador (Scoreboard) ─────────────────────────────────────────────────

function ScoreTab() {
  const match = useScoreboardStore((s) => s.match);
  const isTimerRunning = useScoreboardStore((s) => s.isTimerRunning);
  const startTimer = useScoreboardStore((s) => s.startTimer);
  const pauseTimer = useScoreboardStore((s) => s.pauseTimer);
  const resetTimer = useScoreboardStore((s) => s.resetTimer);
  const updateScore = useScoreboardStore((s) => s.updateScore);
  const setStatus = useScoreboardStore((s) => s.setStatus);
  const setPeriod = useScoreboardStore((s) => s.setPeriod);
  const resetMatch = useScoreboardStore((s) => s.resetMatch);

  const [showReset, setShowReset] = useState(false);

  const canStart = match.status === 'waiting' || match.status === 'halftime';
  const canPause = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isHalftime = match.status === 'halftime';

  const handleStart = () => {
    startTimer();
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleHalfTime = () => {
    pauseTimer();
    setPeriod('second_half');
    setStatus('halftime');
  };

  const handleFinish = () => {
    pauseTimer();
    setStatus('finished');
  };

  const handleReset = () => {
    resetMatch();
    setShowReset(false);
  };

  const handleOpenDisplay = () => {
    window.open('/marcador', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">{match.field}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">
                {FORMAT_OPTIONS.find((f) => f.value === match.format)?.label}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: match.status === 'live' ? '#22c55e20' : isFinished ? '#ef444420' : '#f59e0b20',
                  color: match.status === 'live' ? '#22c55e' : isFinished ? '#ef4444' : '#f59e0b',
                }}
              >
                {STATUS_LABELS[match.status]}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenDisplay} className="gap-1.5 text-xs">
              <Monitor className="w-3.5 h-3.5" />
              Abrir Marcador
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score Display */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Home */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: match.homeTeam.color }}
              >
                {match.homeTeam.shortName.slice(0, 3)}
              </div>
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.homeTeam.color }}>
                {match.homeTeam.name}
              </span>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0 text-lg font-bold border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                  onClick={() => updateScore('home', 1)}
                  disabled={isFinished}
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0 text-lg font-bold border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => updateScore('home', -1)}
                  disabled={isFinished || match.homeScore <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Score */}
            <div className="px-4 md:px-8 py-6 md:py-8 flex flex-col items-center justify-center border-x border-border/30 min-w-[160px] md:min-w-[220px]">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-5xl md:text-7xl font-black tabular-nums leading-none"
                  style={{ color: match.homeTeam.color }}
                >
                  {match.homeScore}
                </span>
                <span className="text-2xl md:text-3xl font-light text-muted-foreground">-</span>
                <span
                  className="text-5xl md:text-7xl font-black tabular-nums leading-none"
                  style={{ color: match.awayTeam.color }}
                >
                  {match.awayScore}
                </span>
              </div>
              <div className="mt-3 text-center">
                <span
                  className={`text-2xl md:text-3xl font-mono font-bold tabular-nums ${match.status === 'live' ? '' : 'text-muted-foreground/50'}`}
                >
                  {formatTimer(match.currentTime)}
                </span>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                  {PERIOD_LABELS[match.period]}
                </p>
              </div>
            </div>

            {/* Away */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: match.awayTeam.color }}
              >
                {match.awayTeam.shortName.slice(0, 3)}
              </div>
              <span className="text-sm md:text-base font-bold truncate max-w-full" style={{ color: match.awayTeam.color }}>
                {match.awayTeam.name}
              </span>
              <div className="flex gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0 text-lg font-bold border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                  onClick={() => updateScore('away', 1)}
                  disabled={isFinished}
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 w-10 rounded-full p-0 text-lg font-bold border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => updateScore('away', -1)}
                  disabled={isFinished || match.awayScore <= 0}
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
          <Button
            className="h-12 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2 col-span-2 md:col-span-1"
            onClick={handleStart}
          >
            <Play className="w-4 h-4" />
            {match.status === 'waiting' ? 'Iniciar Partido' : 'Iniciar 2do Tiempo'}
          </Button>
        )}
        {canPause && (
          <Button
            variant="outline"
            className="h-12 text-sm font-bold border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 gap-2 col-span-2 md:col-span-1"
            onClick={handlePause}
          >
            <Pause className="w-4 h-4" />
            Pausar
          </Button>
        )}
        {match.status === 'live' && match.period === 'first_half' && (
          <Button
            variant="outline"
            className="h-12 text-sm font-bold border-orange-500/30 text-orange-600 hover:bg-orange-500/10 gap-2 col-span-2 md:col-span-1"
            onClick={handleHalfTime}
          >
            <ChevronRight className="w-4 h-4" />
            Medio Tiempo
          </Button>
        )}
        {match.status === 'live' && (
          <Button
            variant="outline"
            className="h-12 text-sm font-bold border-red-500/30 text-red-600 hover:bg-red-500/10 gap-2 col-span-2 md:col-span-1"
            onClick={handleFinish}
          >
            <Trophy className="w-4 h-4" />
            Finalizar
          </Button>
        )}
        {isHalftime && (
          <Button
            className="h-12 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2 col-span-2 md:col-span-1"
            onClick={handleStart}
          >
            <Play className="w-4 h-4" />
            Iniciar 2do Tiempo
          </Button>
        )}
        <AlertDialog open={showReset} onOpenChange={setShowReset}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="h-12 text-sm font-bold border-destructive/30 text-destructive hover:bg-destructive/10 gap-2 col-span-2 md:col-span-1"
            >
              <RotateCcw className="w-4 h-4" />
              Nuevo Partido
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar partido?</AlertDialogTitle>
              <AlertDialogDescription>
                Se perderán todos los datos del partido actual (marcador, eventos, tiempo).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reiniciar
              </AlertDialogAction>
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
    const event = {
      id: genId(),
      type,
      team,
      playerName: playerName.trim() || undefined,
      minute: currentMinute,
    };
    addEvent(event);
    setPlayerName('');
  };

  return (
    <div className="space-y-4">
      {/* Player Name */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="py-3 px-4">
          <Label className="text-xs text-muted-foreground mb-1 block">Nombre del jugador (opcional)</Label>
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Escribir nombre..."
            className="bg-background/50"
          />
        </CardContent>
      </Card>

      {/* Quick Events */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Registrar Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Goals */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Goles</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="h-11 text-sm font-bold gap-2"
                style={{ backgroundColor: `${match.homeTeam.color}20`, color: match.homeTeam.color, border: `1px solid ${match.homeTeam.color}30` }}
                variant="outline"
                onClick={() => handleAddEvent('goal', 'home')}
                disabled={isFinished}
              >
                ⚽ Gol {match.homeTeam.shortName}
              </Button>
              <Button
                className="h-11 text-sm font-bold gap-2"
                style={{ backgroundColor: `${match.awayTeam.color}20`, color: match.awayTeam.color, border: `1px solid ${match.awayTeam.color}30` }}
                variant="outline"
                onClick={() => handleAddEvent('goal', 'away')}
                disabled={isFinished}
              >
                ⚽ Gol {match.awayTeam.shortName}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Cards */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Tarjetas</p>
            <div className="grid grid-cols-4 gap-2">
              <Button
                className="h-11 text-sm font-bold gap-1.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20"
                variant="outline"
                onClick={() => handleAddEvent('yellow_card', 'home')}
                disabled={isFinished}
              >
                🟨 {match.homeTeam.shortName.slice(0, 5)}
              </Button>
              <Button
                className="h-11 text-sm font-bold gap-1.5 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
                variant="outline"
                onClick={() => handleAddEvent('red_card', 'home')}
                disabled={isFinished}
              >
                🟥 {match.homeTeam.shortName.slice(0, 5)}
              </Button>
              <Button
                className="h-11 text-sm font-bold gap-1.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20"
                variant="outline"
                onClick={() => handleAddEvent('yellow_card', 'away')}
                disabled={isFinished}
              >
                🟨 {match.awayTeam.shortName.slice(0, 5)}
              </Button>
              <Button
                className="h-11 text-sm font-bold gap-1.5 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
                variant="outline"
                onClick={() => handleAddEvent('red_card', 'away')}
                disabled={isFinished}
              >
                🟥 {match.awayTeam.shortName.slice(0, 5)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event List */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Eventos ({match.events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {match.events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay eventos registrados
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {match.events.map((ev) => {
                const team = ev.team === 'home' ? match.homeTeam : match.awayTeam;
                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <span className="text-lg">{EVENT_ICONS[ev.type]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold" style={{ color: team.color }}>
                        {team.shortName}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {EVENT_LABELS[ev.type]}
                      </span>
                      {ev.playerName && (
                        <span className="text-sm text-muted-foreground ml-1">
                          - {ev.playerName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {ev.minute}&apos;
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => removeEvent(ev.id)}
                    >
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

// ── Main ControlPanel ──────────────────────────────────────────────────────────

export function ControlPanel() {
  return (
    <div className="min-h-screen bg-background">
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
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => window.open('/marcador', '_blank')}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abrir Marcador</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="marcador" className="w-full">
          <TabsList className="w-full mb-4 bg-muted/50 p-1 h-auto">
            <TabsTrigger value="partido" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <Settings className="w-3.5 h-3.5" />
              Partido
            </TabsTrigger>
            <TabsTrigger value="marcador" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <Trophy className="w-3.5 h-3.5" />
              Marcador
            </TabsTrigger>
            <TabsTrigger value="eventos" className="flex-1 gap-1.5 py-2.5 text-xs data-[state=active]:bg-background">
              <List className="w-3.5 h-3.5" />
              Eventos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partido">
            <SetupTab />
          </TabsContent>
          <TabsContent value="marcador">
            <ScoreTab />
          </TabsContent>
          <TabsContent value="eventos">
            <EventsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">Profutbol v1.0 — Marcador para Canchas de Alquiler</p>
          <p className="text-[10px] text-muted-foreground">Fútbol 5 / 7 / 8 / 11</p>
        </div>
      </footer>
    </div>
  );
}