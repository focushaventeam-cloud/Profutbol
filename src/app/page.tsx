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
/*  Parallax Background Layer                                           */
/* ================================================================== */

function ParallaxBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: [
          'radial-gradient(ellipse at 20% 50%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)',
          'radial-gradient(ellipse at 80% 20%, rgba(30, 64, 175, 0.3) 0%, transparent 50%)',
          'radial-gradient(ellipse at 40% 80%, rgba(29, 78, 216, 0.15) 0%, transparent 50%)',
          'linear-gradient(135deg, #0a1628, #1e3a8a, #0a1628)',
        ].join(', '),
        animation: 'parallaxShift 20s ease-in-out infinite',
      }}
    />
  );
}

/* ================================================================== */
/*  Bokeh Effect Layer                                                  */
/* ================================================================== */

function BokehLayer() {
  const bokehs = useMemo(() => [
    { size: 300, top: '10%', left: '15%', opacity: 0.1, delay: '0s', duration: '15s' },
    { size: 200, top: '60%', left: '70%', opacity: 0.08, delay: '3s', duration: '18s' },
    { size: 250, top: '40%', left: '40%', opacity: 0.05, delay: '6s', duration: '15s' },
    { size: 180, top: '80%', left: '20%', opacity: 0.08, delay: '2s', duration: '16s' },
    { size: 220, top: '20%', left: '80%', opacity: 0.05, delay: '5s', duration: '17s' },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {bokehs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${b.opacity}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: `bokehFloat ${b.duration} ease-in-out infinite`,
            animationDelay: b.delay,
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
    <div className="min-h-screen flex flex-col bg-[#0a1628] relative overflow-hidden">
      {/* Layer 1: Parallax gradient background (deepest) */}
      <ParallaxBackground />

      {/* Layer 2: Bokeh floating lights */}
      <BokehLayer />

      {/* Layer 3: Subtle dot pattern + noise */}
      <div className="noise-overlay bg-pattern fixed inset-0 z-0 pointer-events-none" />

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