'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Radio, Target, AlertTriangle, Eye, ArrowRightLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMatchStore } from '@/stores/matchStore';
import type { Match, MatchEvent } from '@/types';

interface Notification {
  id: string;
  type: 'goal' | 'card' | 'var' | 'status' | 'sub';
  message: string;
  minute: number;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  timestamp: number;
  read: boolean;
}

function getEventIcon(type: MatchEvent['type']) {
  switch (type) {
    case 'goal':
    case 'penalty_goal':
      return <Target className="size-3.5 text-blue-400" />;
    case 'own_goal':
      return <Target className="size-3.5 text-amber-400" />;
    case 'yellow_card':
      return <AlertTriangle className="size-3.5 text-yellow-400" />;
    case 'red_card':
      return <AlertTriangle className="size-3.5 text-red-400" />;
    case 'var_review':
      return <Eye className="size-3.5 text-blue-400" />;
    case 'substitution':
      return <ArrowRightLeft className="size-3.5 text-blue-400" />;
    case 'injury':
      return <Clock className="size-3.5 text-orange-400" />;
  }
}

function getEventColor(type: MatchEvent['type']): string {
  switch (type) {
    case 'goal':
    case 'penalty_goal':
      return 'border-blue-500/20 bg-blue-500/5';
    case 'own_goal':
      return 'border-amber-500/20 bg-amber-500/5';
    case 'yellow_card':
      return 'border-yellow-500/20 bg-yellow-500/5';
    case 'red_card':
      return 'border-red-500/20 bg-red-500/5';
    case 'var_review':
      return 'border-blue-500/20 bg-blue-500/5';
    case 'substitution':
      return 'border-blue-500/20 bg-blue-500/5';
    case 'injury':
      return 'border-orange-500/20 bg-orange-500/5';
  }
}

export default function MatchNotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const matches = useMatchStore((s) => s.matches);

  // Generate notifications from live/halftime matches
  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'halftime');
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    // Mark all as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Simulate new notification from latest events
  const getRecentEvents = (): Notification[] => {
    const allEvents: Notification[] = [];
    for (const match of liveMatches) {
      const recentEvents = match.events.slice(-3);
      for (const event of recentEvents) {
        allEvents.push({
          id: `${match.id}-${event.id}`,
          type: event.type === 'goal' || event.type === 'penalty_goal' || event.type === 'own_goal' ? 'goal'
            : event.type === 'yellow_card' || event.type === 'red_card' ? 'card'
            : event.type === 'var_review' ? 'var'
            : 'sub',
          message: event.description,
          minute: event.minute,
          matchId: match.id,
          homeTeam: match.homeTeam.shortName,
          awayTeam: match.awayTeam.shortName,
          timestamp: Date.now() - (90 - event.minute) * 60000,
          read: true,
        });
      }
    }
    return allEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  };

  const displayNotifications = isOpen ? getRecentEvents() : [];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="relative text-white/50 hover:text-white/80 hover:bg-white/5 h-9 px-2 ripple"
      >
        {unreadCount > 0 ? (
          <Bell className="size-4 text-blue-400" />
        ) : (
          <BellOff className="size-4" />
        )}
        {liveMatches.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
          >
            {liveMatches.length}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 glass-frosted rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Radio className="size-4 text-red-400" />
                  <span className="text-sm font-semibold text-white/90">Actividad en Vivo</span>
                </div>
                <div className="flex items-center gap-2">
                  {liveMatches.length > 0 && (
                    <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400 text-[10px]">
                      {liveMatches.length} partido{liveMatches.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 text-white/30 hover:text-white/60"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
                {displayNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <BellOff className="size-8 text-white/15" />
                    <p className="text-xs text-white/30">
                      {liveMatches.length === 0
                        ? 'No hay partidos en vivo'
                        : 'Sin actividad reciente'}
                    </p>
                  </div>
                ) : (
                  displayNotifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${getEventColor(notif.type)} ${!notif.read ? 'ring-1 ring-blue-500/10' : ''}`}
                    >
                      {getEventIcon(notif.type as MatchEvent['type'])}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-white/30 tabular-nums">{notif.minute}&apos;</span>
                          <span className="text-[10px] text-white/20">·</span>
                          <span className="text-[10px] text-white/30 truncate">
                            {notif.homeTeam} vs {notif.awayTeam}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}