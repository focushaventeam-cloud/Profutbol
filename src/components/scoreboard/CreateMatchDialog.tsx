'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  CalendarDays,
  Clock,
  MapPin,
  Trophy,
  Users,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useMatchStore } from '@/stores/matchStore';
import { useToast } from '@/components/layout/ToastProvider';
import { teams } from '@/data/mockData';
import { Match, MatchStats } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const emptyStats: MatchStats = {
  possession: 0,
  shots: 0,
  shotsOnTarget: 0,
  passes: 0,
  passAccuracy: 0,
  fouls: 0,
  corners: 0,
  offsides: 0,
  yellowCards: 0,
  redCards: 0,
  saves: 0,
};

export default function CreateMatchDialog() {
  const [open, setOpen] = useState(false);
  const createMatch = useMatchStore((s) => s.createMatch);
  const { addToast } = useToast();

  // Form state
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [league, setLeague] = useState('La Liga EA Sports');
  const [stadium, setStadium] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('21:00');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Derived
  const homeTeam = useMemo(() => teams.find((t) => t.id === homeTeamId), [homeTeamId]);
  const awayTeam = useMemo(() => teams.find((t) => t.id === awayTeamId), [awayTeamId]);

  const availableAwayTeams = useMemo(
    () => teams.filter((t) => t.id !== homeTeamId),
    [homeTeamId],
  );

  const canSubmit =
    homeTeamId !== '' &&
    awayTeamId !== '' &&
    homeTeamId !== awayTeamId &&
    league.trim() !== '' &&
    stadium.trim() !== '' &&
    date !== undefined &&
    time !== '';

  const resetForm = () => {
    setHomeTeamId('');
    setAwayTeamId('');
    setLeague('La Liga EA Sports');
    setStadium('');
    setDate(undefined);
    setTime('21:00');
  };

  const handleSubmit = () => {
    if (!canSubmit || !date || !homeTeam || !awayTeam) return;

    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    const newMatch: Match = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
      minute: 0,
      period: 'first_half',
      addedTime: 0,
      startTime: startTime.toISOString(),
      league: league.trim(),
      stadium: stadium.trim(),
      events: [],
      homeStats: { ...emptyStats },
      awayStats: { ...emptyStats },
      homeLineup: [],
      awayLineup: [],
      homeFormation: '4-3-3',
      awayFormation: '4-3-3',
    };

    createMatch(newMatch);
    addToast(
      `Partido creado: ${homeTeam.shortName} vs ${awayTeam.shortName}`,
      'success',
    );
    resetForm();
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button — glass style matching the app */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-blue-500/15 border border-blue-500/25
          text-blue-400 text-sm font-semibold
          hover:bg-blue-500/25 hover:border-blue-500/35
          hover:shadow-lg hover:shadow-blue-500/10
          transition-all duration-300 backdrop-blur-xl
        "
      >
        <Plus className="w-4 h-4" />
        Nuevo Partido
      </motion.button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent
          className="
            bg-[#0a1628]/95 backdrop-blur-2xl
            border border-white/[0.08] rounded-2xl
            text-white shadow-2xl shadow-black/40
            sm:max-w-[520px] p-0 overflow-hidden
          "
          showCloseButton={false}
        >
          {/* Header with gradient bar */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/60 via-blue-400/40 to-blue-500/60" />
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <DialogTitle className="text-white text-lg font-bold">
                    Crear Nuevo Partido
                  </DialogTitle>
                  <DialogDescription className="text-white/40 text-xs mt-0.5">
                    Configura los detalles del encuentro
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form body */}
          <div className="px-6 py-5 space-y-5">
            {/* Teams section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">
                  Equipos
                </span>
              </div>

              {/* Team selectors side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Home team */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium">
                    Equipo Local
                  </Label>
                  <Select
                    value={homeTeamId}
                    onValueChange={(v) => {
                      setHomeTeamId(v);
                      if (v === awayTeamId) setAwayTeamId('');
                    }}
                  >
                    <SelectTrigger
                      className="
                        w-full bg-white/[0.04] border-white/[0.08]
                        text-white hover:bg-white/[0.07]
                        focus:border-blue-500/40 focus:ring-blue-500/20
                        h-11 rounded-xl
                      "
                    >
                      <SelectValue placeholder="Seleccionar equipo..." />
                    </SelectTrigger>
                    <SelectContent
                      className="
                        bg-[#0a1628]/98 backdrop-blur-2xl
                        border border-white/[0.08] rounded-xl
                        text-white
                      "
                    >
                      {teams.map((team) => (
                        <SelectItem
                          key={team.id}
                          value={team.id}
                          className="rounded-lg py-2.5 px-3 text-sm focus:bg-white/[0.06] focus:text-blue-400 cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs border border-white/10"
                              style={{ backgroundColor: team.primaryColor }}
                            >
                              {team.logo}
                            </span>
                            {team.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Selected team preview */}
                  <AnimatePresence>
                    {homeTeam && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] border border-white/10"
                            style={{ backgroundColor: homeTeam.primaryColor }}
                          >
                            {homeTeam.logo}
                          </span>
                          <span className="text-xs text-white/50 font-medium">
                            {homeTeam.shortName}
                          </span>
                          <span className="text-[10px] text-blue-400/60 ml-auto">
                            LOCAL
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Away team */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium">
                    Equipo Visitante
                  </Label>
                  <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                    <SelectTrigger
                      className="
                        w-full bg-white/[0.04] border-white/[0.08]
                        text-white hover:bg-white/[0.07]
                        focus:border-blue-500/40 focus:ring-blue-500/20
                        h-11 rounded-xl
                      "
                    >
                      <SelectValue placeholder="Seleccionar equipo..." />
                    </SelectTrigger>
                    <SelectContent
                      className="
                        bg-[#0a1628]/98 backdrop-blur-2xl
                        border border-white/[0.08] rounded-xl
                        text-white
                      "
                    >
                      {(homeTeamId ? availableAwayTeams : teams).map((team) => (
                        <SelectItem
                          key={team.id}
                          value={team.id}
                          className="rounded-lg py-2.5 px-3 text-sm focus:bg-white/[0.06] focus:text-blue-400 cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-xs border border-white/10"
                              style={{ backgroundColor: team.primaryColor }}
                            >
                              {team.logo}
                            </span>
                            {team.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Selected team preview */}
                  <AnimatePresence>
                    {awayTeam && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] border border-white/10"
                            style={{ backgroundColor: awayTeam.primaryColor }}
                          >
                            {awayTeam.logo}
                          </span>
                          <span className="text-xs text-white/50 font-medium">
                            {awayTeam.shortName}
                          </span>
                          <span className="text-[10px] text-blue-400/60 ml-auto">
                            VISITANTE
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Same team warning */}
              <AnimatePresence>
                {homeTeamId !== '' && homeTeamId === awayTeamId && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-400/90">
                      Los equipos deben ser diferentes
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Match details section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">
                  Detalles del Partido
                </span>
              </div>

              {/* League */}
              <div className="space-y-2">
                <Label htmlFor="league" className="text-white/60 text-xs font-medium">
                  Competición
                </Label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <Input
                    id="league"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    placeholder="Ej: La Liga EA Sports"
                    className="
                      w-full h-11 pl-10 rounded-xl
                      bg-white/[0.04] border-white/[0.08]
                      text-white placeholder:text-white/20
                      hover:bg-white/[0.07]
                      focus-visible:border-blue-500/40 focus-visible:ring-blue-500/20
                    "
                  />
                </div>
              </div>

              {/* Stadium */}
              <div className="space-y-2">
                <Label htmlFor="stadium" className="text-white/60 text-xs font-medium">
                  Estadio
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <Input
                    id="stadium"
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    placeholder="Ej: Santiago Bernabéu"
                    className="
                      w-full h-11 pl-10 rounded-xl
                      bg-white/[0.04] border-white/[0.08]
                      text-white placeholder:text-white/20
                      hover:bg-white/[0.07]
                      focus-visible:border-blue-500/40 focus-visible:ring-blue-500/20
                    "
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-medium">
                    Fecha
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="
                          flex w-full items-center gap-2.5 h-11 px-3 rounded-xl
                          bg-white/[0.04] border border-white/[0.08]
                          text-white hover:bg-white/[0.07]
                          focus-visible:border-blue-500/40 focus-visible:ring-blue-500/20
                          focus-visible:outline-none focus-visible:ring-[3px]
                          transition-all text-sm
                        "
                      >
                        <CalendarDays className="w-4 h-4 text-white/25 shrink-0" />
                        <span className={date ? 'text-white/90' : 'text-white/20'}>
                          {date
                            ? format(date, "d 'de' MMMM, yyyy", { locale: es })
                            : 'Seleccionar fecha'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="
                        bg-[#0a1628]/98 backdrop-blur-2xl
                        border border-white/[0.08] rounded-xl
                        text-white w-auto p-0
                      "
                      align="start"
                      sideOffset={8}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setCalendarOpen(false);
                        }}
                        className="p-3"
                        classNames={{
                          months: 'flex flex-col',
                          month: 'space-y-4',
                          month_caption: 'flex justify-center pt-1 relative items-center w-full h-8',
                          caption_label: 'text-sm font-medium text-white/70',
                          nav: 'space-x-1 flex items-center w-full justify-between absolute top-1 inset-x-0 px-3',
                          button_previous:
                            'inline-flex items-center justify-center rounded-md h-7 w-7 bg-transparent text-white/50 hover:text-white hover:bg-white/10 transition-colors',
                          button_next:
                            'inline-flex items-center justify-center rounded-md h-7 w-7 bg-transparent text-white/50 hover:text-white hover:bg-white/10 transition-colors',
                          weekdays: 'flex',
                          weekday:
                            'text-white/30 rounded-md w-8 font-normal text-[0.75rem] text-center',
                          week: 'flex w-full mt-2',
                          day: 'h-8 w-8 text-center p-0 relative',
                          outside:
                            'day-outside text-white/15 aria-selected:text-white/15',
                          disabled: 'text-white/15 opacity-50',
                          range_start: 'bg-blue-500/20 text-blue-400 rounded-l-md',
                          range_end: 'bg-blue-500/20 text-blue-400 rounded-r-md',
                          range_middle: 'bg-blue-500/10 text-white/70',
                          today: 'bg-white/[0.06] text-white rounded-md font-semibold',
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white/60 text-xs font-medium">
                    Hora
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="
                        w-full h-11 pl-10 rounded-xl
                        bg-white/[0.04] border-white/[0.08]
                        text-white hover:bg-white/[0.07]
                        focus-visible:border-blue-500/40 focus-visible:ring-blue-500/20
                        [color-scheme:dark]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview card */}
            <AnimatePresence>
              {homeTeam && awayTeam && date && canSubmit && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.1 }}
                  className="
                    rounded-xl border border-blue-500/15 bg-blue-500/[0.04]
                    p-4 backdrop-blur-xl
                  "
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-blue-400/70">
                      Vista previa
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-white/10 shrink-0"
                        style={{ backgroundColor: homeTeam.primaryColor }}
                      >
                        {homeTeam.logo}
                      </span>
                      <span className="text-sm font-bold text-white/90 truncate">
                        {homeTeam.shortName}
                      </span>
                    </div>
                    <span className="text-xs text-white/20 font-bold px-1">VS</span>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                      <span className="text-sm font-bold text-white/90 truncate text-right">
                        {awayTeam.shortName}
                      </span>
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-white/10 shrink-0"
                        style={{ backgroundColor: awayTeam.primaryColor }}
                      >
                        {awayTeam.logo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-blue-500/10 text-[11px] text-white/35 font-medium">
                    <span>{league}</span>
                    <span className="text-white/10">|</span>
                    <span>{stadium}</span>
                    <span className="text-white/10">|</span>
                    <span>
                      {format(date, "d MMM", { locale: es })} · {time}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 pt-0 flex flex-row gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="
                flex-1 h-11 rounded-xl
                bg-white/[0.04] border border-white/[0.08]
                text-white/60 hover:text-white hover:bg-white/[0.08]
                font-medium text-sm
                transition-all
              "
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="
                flex-1 h-11 rounded-xl
                bg-blue-500/20 border border-blue-500/25
                text-blue-400 hover:bg-blue-500/30 hover:border-blue-500/35
                font-semibold text-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all shadow-lg shadow-blue-500/5
              "
            >
              <Plus className="w-4 h-4" />
              Crear Partido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}