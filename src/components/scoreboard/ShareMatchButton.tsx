'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Match } from '@/types';

interface ShareMatchButtonProps {
  match: Match;
}

function getStatusText(status: Match['status']): string {
  switch (status) {
    case 'live': return 'EN VIVO';
    case 'halftime': return 'MEDIO TIEMPO';
    case 'finished': return 'FINAL';
    case 'scheduled': return 'PROGRAMADO';
  }
}

function getMatchSummary(match: Match): string {
  const status = getStatusText(match.status);
  const score = `${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`;
  const minute = match.status === 'scheduled' ? match.startTime : `${match.minute}'`;
  const scorers = match.events
    .filter(e => e.type === 'goal' || e.type === 'penalty_goal' || e.type === 'own_goal')
    .map(e => `⚽ ${e.player?.name ?? '???'} ${e.minute}'`)
    .join(' | ');

  return `⚽ ${match.league}\n${status} ${minute}\n${score}\n${scorers ? `Goles: ${scorers}` : ''}\n📊 Profutbol`;
}

export default function ShareMatchButton({ match }: ShareMatchButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const summary = getMatchSummary(match);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS contexts
      const textarea = document.createElement('textarea');
      textarea.value = summary;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} — Profutbol`,
          text: summary,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white/50 hover:text-white/80 hover:bg-white/5 h-8 px-2 ripple"
      >
        <Share2 className="size-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-1 z-50 w-64 glass-frosted rounded-xl border border-white/10 p-2 shadow-2xl"
            >
              {/* Preview */}
              <div className="px-3 py-2 mb-2 rounded-lg bg-white/[0.03] border border-white/5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Vista previa</p>
                <pre className="text-xs text-white/60 whitespace-pre-wrap font-mono leading-relaxed">
                  {summary}
                </pre>
              </div>

              <div className="space-y-1">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-400" />
                  ) : (
                    <Copy className="size-4 text-white/50 group-hover:text-white/80 transition-colors" />
                  )}
                  <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    {copied ? '¡Copiado!' : 'Copiar resumen'}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
                >
                  <Share2 className="size-4 text-white/50 group-hover:text-white/80 transition-colors" />
                  <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    Compartir...
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}