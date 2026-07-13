'use client';

import { useState } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { LIGA_FUTVE_TEAMS, LIGA_FUTVE_INFO } from '@/data/liga-futve';
import { TEAM_LOGOS } from '@/data/team-logos';
import type { TeamSide } from '@/types';

function LigaTeamSelector({ side, onClose }: { side: TeamSide; onClose: () => void }) {
  const loadLigaTeam = useScoreboardStore((s) => s.loadLigaTeam);
  const setCompetition = useScoreboardStore((s) => s.setCompetition);
  const [filter, setFilter] = useState('');

  const filtered = LIGA_FUTVE_TEAMS.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.city.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (team: (typeof LIGA_FUTVE_TEAMS)[0]) => {
    loadLigaTeam(
      side,
      team.id,
      team.name,
      team.shortName,
      TEAM_LOGOS[team.id] || '',
      team.primaryColor,
      team.secondaryColor,
      team.stadium
    );
    if (side === 'home') setCompetition(LIGA_FUTVE_INFO.fullName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="glass-panel-strong rounded-2xl p-5 w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <h3 className="text-lg font-bold">Liga FUTVE 2025</h3>
            <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
              {LIGA_FUTVE_INFO.teams} equipos
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-white/30 hover:text-white text-xl transition-colors">
            ✕
          </button>
        </div>
        <p className="text-xs text-white/30 mb-3">{LIGA_FUTVE_INFO.format}</p>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar equipo o ciudad..."
          className="glass-input rounded-lg px-3 py-2 text-sm text-white w-full mb-3"
          autoFocus
        />
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filtered.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => handleSelect(team)}
              className="w-full flex items-center gap-3 glass-input rounded-lg px-3 py-2.5 text-left transition-all hover:bg-white/10 active:scale-[0.99]"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
                style={{
                  borderColor: `${team.primaryColor}60`,
                  background: `linear-gradient(135deg, ${team.primaryColor}30, ${team.secondaryColor}20)`,
                }}
              >
                {TEAM_LOGOS[team.id] ? (
                  <img src={TEAM_LOGOS[team.id]} alt="" className="w-6 h-6 object-contain rounded" />
                ) : (
                  <span className="text-xs font-bold" style={{ color: team.primaryColor }}>
                    {team.shortName.slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{team.name}</div>
                <div className="text-[10px] text-white/30 flex items-center gap-1.5">
                  <span>📍 {team.city}</span>
                  <span>·</span>
                  <span>{team.stadium.split(' ').slice(-1)}</span>
                  {team.titles > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-yellow-400/60">🏆 {team.titles}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: team.primaryColor }} />
                <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: team.secondaryColor }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { LigaTeamSelector };