'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatchStore } from '@/stores/matchStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import DashboardView from '@/components/views/DashboardView';
import MatchDetailView from '@/components/views/MatchDetailView';
import StatsView from '@/components/views/StatsView';
import SettingsView from '@/components/views/SettingsView';
import { useAutoTimer } from '@/hooks/useAutoTimer';

/* ================================================================== */
/*  Star Field Component                                                */
/* ================================================================== */

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      size: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
    }));
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */

export default function Home() {
  const viewMode = useMatchStore((s) => s.viewMode);

  // Auto-advance live match minutes
  useAutoTimer();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] relative overflow-hidden">
      {/* Layer 1: Star field (deepest, slowest parallax) */}
      <StarField />

      {/* Layer 2: Aurora borealis effects */}
      <div className="aurora parallax-layer-1" />
      <div className="aurora-secondary parallax-layer-2" />

      {/* Layer 3: Dot pattern + noise */}
      <div className="noise-overlay bg-pattern fixed inset-0 z-0 pointer-events-none" />

      {/* Layer 4: Ambient floating orbs (mid parallax) */}
      <div className="pointer-events-none fixed inset-0 z-0 parallax-layer-2">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/[0.07] blur-[120px] animate-float breathe-glow" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-[100px] animate-float [animation-delay:2s] breathe-glow" />
        <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-purple-500/[0.04] blur-[100px] animate-float [animation-delay:4s] breathe-glow-slow" />
        <div className="absolute top-2/3 left-1/4 h-56 w-56 rounded-full bg-amber-500/[0.03] blur-[80px] animate-float [animation-delay:6s] breathe-glow-slow" />
      </div>

      {/* Layer 5: Grid pattern overlay (subtle) */}
      <div className="pointer-events-none fixed inset-0 z-0 grid-pattern opacity-50" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {viewMode === 'dashboard' && <DashboardView key="dashboard" />}
            {viewMode === 'match' && <MatchDetailView key="match" />}
            {viewMode === 'stats' && <StatsView key="stats" />}
            {viewMode === 'settings' && <SettingsView key="settings" />}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}