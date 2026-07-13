'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Goal,
  Circle,
  CircleOff,
  ArrowLeftRight,
  Eye,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Match, MatchEvent, EventType } from '@/types';

// ---------- commentary entry type ----------
interface CommentaryEntry {
  id: string;
  minute: number;
  type: 'goal' | 'own_goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty_goal' | 'var_review' | 'injury' | 'ambient';
  text: string;
  half: 'first_half' | 'second_half' | 'extra_time' | 'penalties';
  isGoalEvent: boolean;
}

// ---------- icon + color config ----------
const commentaryStyle: Record<
  string,
  { Icon: typeof Circle; colorClass: string; borderClass: string; bgClass: string }
> = {
  goal: { Icon: Goal, colorClass: 'text-blue-400', borderClass: 'border-l-blue-400', bgClass: 'bg-blue-400/15' },
  own_goal: { Icon: Goal, colorClass: 'text-blue-400', borderClass: 'border-l-blue-400', bgClass: 'bg-blue-400/15' },
  penalty_goal: { Icon: Goal, colorClass: 'text-blue-400', borderClass: 'border-l-blue-400', bgClass: 'bg-blue-400/15' },
  yellow_card: { Icon: Circle, colorClass: 'text-amber-400', borderClass: 'border-l-amber-400', bgClass: 'bg-amber-400/15' },
  red_card: { Icon: CircleOff, colorClass: 'text-red-400', borderClass: 'border-l-red-400', bgClass: 'bg-red-400/15' },
  substitution: { Icon: ArrowLeftRight, colorClass: 'text-blue-400', borderClass: 'border-l-blue-400', bgClass: 'bg-blue-400/15' },
  var_review: { Icon: Eye, colorClass: 'text-blue-400', borderClass: 'border-l-blue-400', bgClass: 'bg-blue-400/15' },
  injury: { Icon: Circle, colorClass: 'text-orange-400', borderClass: 'border-l-orange-400', bgClass: 'bg-orange-400/15' },
  ambient: { Icon: MessageSquare, colorClass: 'text-white/50', borderClass: 'border-l-white/10', bgClass: 'bg-white/[0.03]' },
};

// ---------- rich commentary generators ----------

function getGoalCommentary(event: MatchEvent, teamName: string): string {
  const playerName = event.player?.name ?? 'Jugador';
  const isPenalty = event.isPenalty;
  const isOwn = event.isOwnGoal;

  if (isPenalty) {
    const penalties = [
      `¡¡¡GOL DE PENALTI DE ${playerName.toUpperCase()}!!! Cae hacia la derecha del portero, el disparo es preciso y potente. No hay nada que hacer. ¡El público estalla de alegría!`,
      `¡¡¡GOL DE PENALTI MAGISTRAL DE ${playerName.toUpperCase()}!!! Espera al portero, lanza al centro y la pelota se cuela por debajo del cuerpo del cancerbero. ¡Frio como el hielo!`,
      `¡¡¡PENALTI CONVERTIDO POR ${playerName.toUpperCase()}!!! Tiro raso y colocado al rincón izquierdo. El portero se lanza al lado contrario. ¡Clínica pura desde los once metros!`,
    ];
    return penalties[Math.floor(Math.random() * penalties.length)];
  }

  if (isOwn) {
    const ownGoals = [
      `¡Gol en contra! Desafortunada intervención de ${playerName} que desvía el centro al fondo de su propia portería. El estadio queda en silencio, una jugada que nadie esperaba.`,
      `Autogol de ${playerName}. Intentó despejar un centro peligroso pero la pelota se le fue de los pies y terminó en su propia red. Mano de Dios... pero al revés.`,
    ];
    return ownGoals[Math.floor(Math.random() * ownGoals.length)];
  }

  // Regular goal — pick based on player position for variety
  const position = event.player?.position;
  const goalTexts: Record<string, string[]> = {
    FWD: [
      `¡¡¡GOLAZO DE ${playerName.toUpperCase()}!!! Recibe en velocidad por la banda izquierda, se despide del defensa con un regate y define cruzado al palo largo. ¡Qué jugada magnífica!`,
      `¡¡¡GOL DE ${playerName.toUpperCase()}!!! Remate seco y colocado desde dentro del área tras una gran jugada colectiva. ¡El delantero no perdona!`,
      `¡¡¡GOLAZO DE ${playerName.toUpperCase()}!!! Diagonal perfecta, deja dos marcas atrás y bate al portero con un tiro raso al palo corto. ¡Pura calidad!`,
    ],
    MID: [
      `¡¡¡GOL DE ${playerName.toUpperCase()}!!! Llegada desde segunda línea, recibe fuera del área y dispara con una rosca imposible para el portero. ¡Qué golazo desde lejos!`,
      `¡¡¡GOL MAGISTRAL DE ${playerName.toUpperCase()}!!! Volea desde fuera del área que se clava en la escuadra. ¡Momento para el replay eterno!`,
      `¡¡¡GOL DE ${playerName.toUpperCase()}!!! Arranca desde el mediocampo, supera a tres rivales con pases cortos y finaliza con un disparo ajustado al poste. ¡Jugada completa!`,
    ],
    DEF: [
      `¡¡¡GOL DE ${playerName.toUpperCase()}!!! Remate de cabeza tras un centro al área. El zaguero sube y conecta un testarazo imparable. ¡Poderío aéreo!`,
      `¡¡¡GOL INESPERADO DE ${playerName.toUpperCase()}!!! Se suma al ataque, recibe en el borde del área y dispara con la derecha. ¡El defensa se convierte en goleador!`,
    ],
    GK: [
      `¡¡¡GOL DE ${playerName.toUpperCase()}!!! El portero sube al área rival en los últimos minutos y conecta de cabeza. ¡Locura total en el estadio!`,
    ],
  };

  const texts = goalTexts[position ?? 'FWD'] ?? goalTexts.FWD;
  return texts[Math.floor(Math.random() * texts.length)];
}

function getYellowCardCommentary(event: MatchEvent, teamName: string): string {
  const playerName = event.player?.name ?? 'Jugador';
  const fouls = [
    `Tarjeta amarilla para ${playerName}. Entrada fuerte por detrás con las dos piernas en medio del campo. El árbitro no lo duda y saca la primera amonestación del partido.`,
    `Amonestación para ${playerName}. Tirona de camiseta en velocidad que detiene un contraataque prometedor del ${teamName}. El colegiado marca la falta y saca la amarilla.`,
    `Amarilla para ${playerName}. Falta táctica al detener la salida del balón rival. El mediocampo intentaba retrasar el ritmo del partido y el árbitro lo castiga.`,
    `Tarjeta amarilla para ${playerName}. Protestas excesivas tras una decisión arbitral. El jugador no estaba de acuerdo con la falta marcada y el árbitro le muestra la cartulina.`,
    `${playerName} ve la amarilla. Entrada con el codo levantado en un duelo aéreo. Juego peligroso que el árbitro sanciona de inmediato.`,
    `Amonestación para ${playerName}. Derribo por la espalda cuando el rival se escapaba solo hacia la portería. Falta táctica clara que merece la tarjeta.`,
  ];
  return fouls[Math.floor(Math.random() * fouls.length)];
}

function getRedCardCommentary(event: MatchEvent, teamName: string): string {
  const playerName = event.player?.name ?? 'Jugador';
  const reds = [
    `¡¡¡TARJETA ROJA PARA ${playerName.toUpperCase()}!!! Entrada con las dos piernas por encima de la altura del balón. El árbitro no duda ni un segundo y le muestra la roja directa. ¡${teamName} se queda con diez!`,
    `¡ROJA DIRECTA PARA ${playerName.toUpperCase()}! Mano clara dentro del área que impide un gol seguro. El árbitro señala el punto penal y expulsa al jugador. ¡Doble castigo para ${teamName}!`,
    `¡Expulsión de ${playerName.toUpperCase()}! Segunda amarilla por una falta de desesperación. El jugador ya tenía una amonestación previa y ahora ve la roja. Su equipo sufre con uno menos.`,
    `¡¡¡ROJA DE ${playerName.toUpperCase()}!!! Agresión verbal al árbitro tras una decisión polémica. El colegiado saca la tarjeta roja directa sin pestañear. ¡Escena lamentable en el terreno de juego!`,
  ];
  return reds[Math.floor(Math.random() * reds.length)];
}

function getSubstitutionCommentary(event: MatchEvent, teamName: string): string {
  const playerIn = event.player?.name ?? 'Jugador';
  const playerOut = event.playerOut?.name ?? 'Jugador';
  const subs = [
    `Cambio en ${teamName}: entra ${playerIn} y sale ${playerOut}. El técnico busca darle frescura al equipo en esta fase del partido. ${playerIn} aporta velocidad por las bandas.`,
    `Doble cambio planeado por ${teamName}. ${playerOut} deja su lugar a ${playerIn}, que recibirá instrucciones en la banda antes de entrar al terreno. El público aplaude la salida del-canterano.`,
    `${teamName} realiza un cambio táctico: ${playerOut} es sustituido por ${playerIn}. El equipo necesita más presencia ofensiva y el entrenador hace movimiento en el banquillo.`,
    `Rotación en ${teamName}: sale ${playerOut}, que dejó todo en la cancha, y entra ${playerIn} para los últimos minutos. Un reconocimiento para el que sale y mucha responsabilidad para el que entra.`,
  ];
  return subs[Math.floor(Math.random() * subs.length)];
}

function getVarCommentary(event: MatchEvent, teamName: string): string {
  const vars = [
    `El árbitro se detiene y señala al VAR. Revisión en curso desde la sala de LaVídeo. Se analiza una jugada anterior de ${teamName} que podría cambiar el marcador. El estadio contiene la respiración...`,
    `¡El VAR interviene! El árbitro asistente recomienda revisar una jugada en el monitor lateral. ${teamName} espera nervioso la decisión. Los aficionados corean mientras el colegiado revisa las imágenes.`,
    `Revisión del VAR por posible fuera de juego en la jugada anterior de ${teamName}. Las líneas tecnológicas se superponen en la pantalla. La tensión se palpa en todo el recinto.`,
  ];
  return vars[Math.floor(Math.random() * vars.length)];
}

function getInjuryCommentary(event: MatchEvent, teamName: string): string {
  const playerName = event.player?.name ?? 'Jugador';
  const injuries = [
    `${playerName} se queda en el suelo tras un choque fortuito. Los médicos de ${teamName} ingresan al campo para atenderlo. Parece que podrá continuar tras unos minutos de recuperación.`,
    `Atención médica para ${playerName} de ${teamName}. Se toca la rodilla derecha tras un salto. El entrenador ya prepara el tercer cambio preventivo por si no puede continuar.`,
    `${playerName} solicita atención después de recibir un golpe en el tobillo. El estadio guarda silencio mientras los fisioterapeutas trabajan. El jugador hace gestos de que puede seguir.`,
  ];
  return injuries[Math.floor(Math.random() * injuries.length)];
}

const ambientCommentaryFirstHalf: Record<number, string[]> = {
  5: [
    'El partido arranca con intensidad. Ambos equipos presionan alto desde el primer silbato, buscando dominar la posesión en el centro del campo.',
    'Comienza el encuentro con buen ritmo. Los locales intentan imponer su estilo de juego desde los primeros compases.',
  ],
  10: [
    'Posesión dominante del equipo local en estos primeros minutos. El visitante se repliega y espera su oportunidad al contraataque.',
    'Los primeros diez minutos muestran un partido igualado. Ambos equipos se estudian sin arriesgar demasiado.',
  ],
  15: [
    'El ritmo del partido baja ligeramente. Los equipos prefieren conservar el balón y construir desde atrás con paciencia.',
    'Buenos despliegues por las bandas del equipo visitante. El lateral derecho genera peligro con sus incorporaciones al ataque.',
  ],
  20: [
    'Ambiente electrizante en el estadio. La afición empuja a su equipo con cada avance ofensivo. Se siente la presión del momento.',
    'El partido se abre y ambas porterías empiezan a temblar. Llega la primera oportunidad clara del encuentro.',
  ],
  25: [
    'Gran intensidad en el mediocampo. Los interiores de ambos equipos libran una batalla física por cada balón suelto.',
    'El equipo visitante encuentra espacios entre líneas y genera peligro con pases filtrados al delantero centro.',
  ],
  30: [
    'Los centros al área se suceden sin éxito. Las defensas dominan en el juego aéreo hasta el momento.',
    'El partido entra en su fase más equilibrada. Ni un equipo ni otro logra tomar el control absoluto del encuentro.',
  ],
  35: [
    'Se avecina un final de primera mitad trepidante. Los locales aumentan la presión y los visitante sufren en sus salidas desde atrás.',
    'El árbitro marca varias faltas seguidas. El partido se vuelve cortado con muchas interrupciones.',
  ],
  40: [
    'Últimos minutos del primer tiempo y el partido se juega de tú a tú. Cualquier error puede ser decisivo.',
    'Aumentan las protestas de ambos banquillos. El árbitro tiene que mediar entre los capitales de ambos equipos.',
  ],
  44: [
    'Se acerca el descanso con un partido vibrante. Los aficionados no paran de animar a su equipo.',
    'Los cuadrantes del marcador avisan: se acerca el final de la primera mitad. ¿Habrá gol antes del silbato?',
  ],
};

const ambientCommentarySecondHalf: Record<number, string[]> = {
  50: [
    'Comienza la segunda mitad con cambios en ambos banquillos. Los técnicos buscan dar una vuelta de tuerca al partido.',
    'Reanudación del encuentro. Los locales salen con más intensidad buscando adelantarse pronto en el marcador.',
  ],
  55: [
    'El partido se vive con mucha intensidad en el centro del campo. Doble marcaje constante y poco espacio para la creación.',
    'Buen tramo de juego del equipo visitante. Logran dominar la posesión en los primeros minutos de la segunda mitad.',
  ],
  60: [
    'Los entrenadores ya dan instrucciones desde la banda. Se avecinan cambios que pueden alterar la dinámica del partido.',
    'El ritmo del encuentro sigue siendo alto pese al desgaste físico. Ambos equipos corren sin ahorrar esfuerzo.',
  ],
  65: [
    'La fatiga empieza a notarse en ambas plantillas. Los cambios serán claves en la recta final del partido.',
    'El estadio ruge con cada avance ofensivo. La afición sabe que el partido se decide en estos minutos.',
  ],
  70: [
    'Entrada decisiva del partido. Los locales aprietan con todo y el visitante sufre para salir jugado desde atrás.',
    'Gran cantidad de balones divididos en el mediocampo. El partido se vuelve más físico conforme pasan los minutos.',
  ],
  75: [
    'Últimos quince minutos de un partido apasionante. Todo puede pasar todavía. Los nervios se apoderan del terreno de juego.',
    'Los contraataques del equipo visitante generan peligro. El partido está abierto y cualquiera puede llevarse la victoria.',
  ],
  80: [
    'Se avecinan los minutos finales y el partido se juega con la tensión al máximo. Cada balón es oro.',
    'Las banderas de los asistentes se levantan con frecuencia. Los defensas suben la línea y los delanteros buscan el fuera de juego.',
  ],
  85: [
    'El reloj corre y los nervios se multiplican. Los jugadores miran al marcador mientras el partido se vuelve frenético.',
    'Los últimos minutos del partido prometen emoción. Ambos equipos se lanzan al ataque buscando el resultado favorable.',
  ],
};

function getAmbientCommentary(minute: number, half: 'first_half' | 'second_half', _homeTeam: string, _awayTeam: string): string | null {
  const pool = half === 'first_half' ? ambientCommentaryFirstHalf : ambientCommentarySecondHalf;
  const minutePool = pool[minute];
  if (!minutePool || minutePool.length === 0) return null;
  return minutePool[Math.floor(Math.random() * minutePool.length)];
}

// ---------- build commentary list ----------
function buildCommentary(match: Match): CommentaryEntry[] {
  const entries: CommentaryEntry[] = [];
  let counter = 0;

  const maxMinute = match.status === 'live' ? match.minute : match.minute;
  const eventMinutes = new Set<number>(match.events.map(e => e.minute));

  // Determine which minutes to generate ambient commentary for
  const ambientMinutes = [5, 10, 15, 20, 25, 30, 35, 40, 44];

  // Add ambient commentary for relevant minutes
  for (const min of ambientMinutes) {
    if (min <= maxMinute && !eventMinutes.has(min)) {
      const half: 'first_half' | 'second_half' = min <= 45 ? 'first_half' : 'second_half';
      const text = getAmbientCommentary(min, half, match.homeTeam.name, match.awayTeam.name);
      if (text) {
        entries.push({
          id: `amb-${counter++}`,
          minute: min,
          type: 'ambient',
          text,
          half,
          isGoalEvent: false,
        });
      }
    }
  }

  // Second half ambient
  const secondHalfAmbient = [50, 55, 60, 65, 70, 75, 80, 85];
  for (const min of secondHalfAmbient) {
    if (min <= maxMinute && !eventMinutes.has(min)) {
      const text = getAmbientCommentary(min, 'second_half', match.homeTeam.name, match.awayTeam.name);
      if (text) {
        entries.push({
          id: `amb-${counter++}`,
          minute: min,
          type: 'ambient',
          text,
          half: 'second_half',
          isGoalEvent: false,
        });
      }
    }
  }

  // Add event commentary
  for (const event of match.events) {
    const teamName = event.team === 'home' ? match.homeTeam.name : match.awayTeam.name;
    let text = '';
    let half: CommentaryEntry['half'] = 'first_half';

    if (event.minute <= 45) half = 'first_half';
    else if (event.minute <= 90) half = 'second_half';
    else if (event.minute <= 120) half = 'extra_time';
    else half = 'penalties';

    switch (event.type) {
      case 'goal':
      case 'penalty_goal':
      case 'own_goal':
        text = getGoalCommentary(event, teamName);
        break;
      case 'yellow_card':
        text = getYellowCardCommentary(event, teamName);
        break;
      case 'red_card':
        text = getRedCardCommentary(event, teamName);
        break;
      case 'substitution':
        text = getSubstitutionCommentary(event, teamName);
        break;
      case 'var_review':
        text = getVarCommentary(event, teamName);
        break;
      case 'injury':
        text = getInjuryCommentary(event, teamName);
        break;
    }

    entries.push({
      id: `evt-${counter++}`,
      minute: event.minute,
      type: event.type,
      text,
      half,
      isGoalEvent: event.type === 'goal' || event.type === 'penalty_goal' || event.type === 'own_goal',
    });
  }

  // Sort by minute, ambient before events at same minute
  entries.sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    return a.type === 'ambient' ? -1 : 1;
  });

  return entries;
}

// ---------- half labels ----------
function getHalfLabel(half: CommentaryEntry['half']): string {
  switch (half) {
    case 'first_half': return '1er Tiempo';
    case 'second_half': return '2do Tiempo';
    case 'extra_time': return 'Tiempo Extra';
    case 'penalties': return 'Penaltis';
  }
}

// ---------- component ----------
export default function MatchCommentary({ match }: { match: Match }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevEntryCountRef = useRef(0);

  const entries = useMemo(() => buildCommentary(match), [match]);

  // Group by half preserving order
  const groupedEntries = useMemo(() => {
    const groups: { half: CommentaryEntry['half']; label: string; entries: CommentaryEntry[] }[] = [];
    let currentHalf: CommentaryEntry['half'] | null = null;

    for (const entry of entries) {
      if (entry.half !== currentHalf) {
        currentHalf = entry.half;
        groups.push({
          half: entry.half,
          label: getHalfLabel(entry.half),
          entries: [entry],
        });
      } else {
        groups[groups.length - 1].entries.push(entry);
      }
    }

    return groups;
  }, [entries]);

  // Auto-scroll to bottom when new entries appear
  useEffect(() => {
    if (entries.length > prevEntryCountRef.current && scrollRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const viewport = scrollRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
      });
    }
    prevEntryCountRef.current = entries.length;
  }, [entries.length]);

  const isLive = match.status === 'live';

  if (entries.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex flex-col items-center justify-center py-8 text-white/40 gap-3">
          <MessageSquare className="h-10 w-10 opacity-40" />
          <p className="text-sm font-medium">Sin comentarios aún</p>
          <p className="text-xs opacity-60">
            La narración del partido aparecerá aquí cuando comience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header with LIVE indicator */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-4 w-4 text-white/40" />
          <h3 className="text-sm font-semibold text-white/90">Narración en vivo</h3>
        </div>

        {isLive && (
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              EN VIVO
            </span>
          </div>
        )}

        {!isLive && match.status === 'finished' && (
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Finalizado
          </span>
        )}

        {!isLive && match.status === 'halftime' && (
          <span className="text-[11px] font-medium text-amber-400/70 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Descanso
          </span>
        )}
      </div>

      {/* Scrollable commentary list */}
      <ScrollArea className="max-h-[500px]" ref={scrollRef}>
        <div className="p-4 space-y-5">
          {groupedEntries.map((group) => (
            <div key={group.half}>
              {/* Half header */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30 px-2">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </motion.div>

              {/* Entries */}
              <div className="flex flex-col gap-2">
                {group.entries.map((entry, i) => {
                  const style = commentaryStyle[entry.type] ?? commentaryStyle.ambient;
                  const { Icon, colorClass, borderClass, bgClass } = style;
                  const isGoal = entry.isGoalEvent;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.04,
                        ease: 'easeOut',
                      }}
                      className={`
                        relative flex gap-3 p-3 rounded-lg
                        border-l-2 ${borderClass}
                        bg-white/[0.02] hover:bg-white/[0.04]
                        transition-colors duration-200
                        ${isGoal ? 'bg-blue-500/[0.06] hover:bg-blue-500/[0.08]' : ''}
                      `}
                    >
                      {/* Minute badge */}
                      <div className="flex flex-col items-center shrink-0 pt-0.5">
                        <div
                          className={`
                            flex items-center justify-center
                            min-w-[40px] h-7 px-1.5 rounded-md
                            ${isGoal ? 'bg-blue-500/20' : bgClass}
                          `}
                        >
                          <span
                            className={`
                              text-[11px] font-bold tabular-nums
                              ${isGoal ? 'text-blue-300' : colorClass}
                            `}
                          >
                            {entry.minute}&apos;
                          </span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`
                          shrink-0 flex items-center justify-center
                          w-7 h-7 rounded-lg mt-0.5
                          ${isGoal ? 'bg-blue-500/20' : bgClass}
                        `}
                      >
                        {entry.type === 'yellow_card' ? (
                          <div className="w-3.5 h-4.5 rounded-[3px] bg-amber-400" />
                        ) : entry.type === 'red_card' ? (
                          <div className="w-3.5 h-4.5 rounded-[3px] bg-red-500" />
                        ) : (
                          <Icon
                            className={`h-3.5 w-3.5 ${isGoal ? 'text-blue-300' : colorClass}`}
                            strokeWidth={isGoal ? 2.5 : 2}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`
                            text-[13px] leading-relaxed
                            ${isGoal
                              ? 'text-blue-200/90 font-semibold'
                              : entry.type === 'ambient'
                                ? 'text-white/45 italic text-[12px]'
                                : 'text-white/80'
                            }
                          `}
                        >
                          {entry.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}