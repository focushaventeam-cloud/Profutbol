'use client';

import { Trophy, LayoutDashboard, BarChart3, Settings, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMatchStore } from '@/stores/matchStore';
import type { ViewMode } from '@/stores/matchStore';
import MatchNotificationsPanel from '@/components/scoreboard/MatchNotificationsPanel';

const navItems: { label: string; mode: ViewMode; icon: React.ReactNode }[] = [
  { label: 'Partidos', mode: 'dashboard', icon: <LayoutDashboard className="size-4" /> },
  { label: 'Estadísticas', mode: 'stats', icon: <BarChart3 className="size-4" /> },
  { label: 'Ajustes', mode: 'settings', icon: <Settings className="size-4" /> },
];

export function Header() {
  const { viewMode, setViewMode, getLiveMatches } = useMatchStore();
  const liveCount = getLiveMatches().length;

  return (
    <header className="sticky top-0 z-50 h-16 w-full">
      <div className="glass-frosted absolute inset-0" />
      {/* Bottom glow divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <nav className="relative flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left — Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setViewMode('dashboard')}
        >
          <div className="relative">
            <Trophy className="size-5 text-blue-400" />
            <div className="absolute inset-0 blur-md bg-blue-400/20 rounded-full" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            Profutbol
          </span>
        </motion.div>

        {/* Center — Navigation Tabs */}
        <div className="relative flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              viewMode === item.mode ||
              (item.mode === 'dashboard' && viewMode === 'match');

            return (
              <Button
                key={item.mode}
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(item.mode)}
                className={`
                  relative h-9 rounded-xl px-3 text-sm font-medium transition-all duration-300 focus-glow
                  ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-muted-foreground hover:text-foreground/80'
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="header-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Button>
            );
          })}
        </div>

        {/* Right — Notifications + Live Badge */}
        <div className="flex items-center gap-1">
          <MatchNotificationsPanel />
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 border-red-500/30 bg-red-500/10 px-2.5 py-1 text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer ripple"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            <Radio className="size-3" />
            <span className="hidden text-xs font-semibold sm:inline">EN VIVO</span>
            {liveCount > 0 && (
              <motion.span
                key={liveCount}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="flex size-5 items-center justify-center rounded-full bg-red-500/90 text-[10px] font-bold text-white"
              >
                {liveCount}
              </motion.span>
            )}
          </Badge>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}