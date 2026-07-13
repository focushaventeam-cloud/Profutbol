'use client';

import { Separator } from '@/components/ui/separator';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto sticky bottom-0 z-40 w-full">
      <div className="glass-frosted absolute inset-0 opacity-90" />
      {/* Top glow divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      <div className="relative flex h-12 items-center justify-between px-4 text-xs sm:px-6">
        {/* Left — Copyright */}
        <span className="font-medium text-white/40 flex items-center gap-1.5">
          © 2025 Profutbol
          <Heart className="size-3 text-red-400/60 fill-red-400/40" />
        </span>

        <Separator orientation="vertical" className="mx-3 hidden h-4 sm:block bg-white/5" />

        {/* Center — League */}
        <span className="hidden text-white/25 sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
          La Liga EA Sports
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
        </span>

        <Separator orientation="vertical" className="mx-3 hidden h-4 sm:block bg-white/5" />

        {/* Right — Powered by */}
        <span className="text-white/30">
          Powered by{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text font-bold text-transparent">
            Z.ai
          </span>
        </span>
      </div>
    </footer>
  );
}