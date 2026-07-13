'use client';

import { useState } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import {
  POSITION_LABELS,
  FORMATIONS,
  type TeamSide,
  type PlayerPosition,
  type Formation,
} from '@/types';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const FORMATION_POSITIONS: Record<string, PlayerPosition[]> = {
  '4-4-2': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'EI', 'MC', 'MC', 'ED', 'DC', 'DC'],
  '4-3-3': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MC', 'MC', 'MC', 'EI', 'DC', 'ED'],
  '4-2-3-1': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MCD', 'MCD', 'EI', 'MCO', 'ED', 'DC'],
  '3-5-2': ['POR', 'DFC', 'DFC', 'DFC', 'EI', 'MC', 'MCD', 'MC', 'ED', 'DC', 'DC'],
  '3-4-3': ['POR', 'DFC', 'DFC', 'DFC', 'MI', 'MC', 'MC', 'MD', 'EI', 'DC', 'ED'],
  '5-3-2': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'LD', 'MC', 'MC', 'ED', 'DC', 'DC'],
  '4-5-1': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'EI', 'MC', 'MCD', 'MC', 'ED', 'DC'],
  '4-1-4-1': ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MCD', 'EI', 'MC', 'MC', 'ED', 'DC'],
};

// Visual positions on a normalized field (0-100 x, 0-100 y)
const FIELD_COORDS: Record<string, [number, number][]> = {
  '4-4-2': [[50,90],[15,70],[37,70],[63,70],[85,70],[15,45],[37,45],[63,45],[85,45],[37,18],[63,18]],
  '4-3-3': [[50,90],[15,70],[37,70],[63,70],[85,70],[30,45],[50,45],[70,45],[15,18],[50,15],[85,18]],
  '4-2-3-1': [[50,90],[15,70],[37,70],[63,70],[85,70],[37,52],[63,52],[15,32],[50,35],[85,32],[50,15]],
  '3-5-2': [[50,90],[30,70],[50,70],[70,70],[15,45],[37,45],[50,50],[63,45],[85,45],[37,18],[63,18]],
  '3-4-3': [[50,90],[30,70],[50,70],[70,70],[20,45],[40,45],[60,45],[80,45],[15,18],[50,15],[85,18]],
  '5-3-2': [[50,90],[10,70],[30,70],[50,70],[70,70],[90,70],[35,45],[50,45],[65,45],[37,18],[63,18]],
  '4-5-1': [[50,90],[15,70],[37,70],[63,70],[85,70],[15,45],[37,48],[63,48],[85,45],[50,15]],
  '4-1-4-1': [[50,90],[15,70],[37,70],[63,70],[85,70],[50,52],[15,32],[37,35],[63,35],[85,32],[50,15]],
};

export function LineupControl() {
  const match = useScoreboardStore((s) => s.match);
  const addPlayer = useScoreboardStore((s) => s.addPlayer);
  const removePlayer = useScoreboardStore((s) => s.removePlayer);
  const updatePlayer = useScoreboardStore((s) => s.updatePlayer);
  const setFormation = useScoreboardStore((s) => s.setFormation);
  const setLineup = useScoreboardStore((s) => s.setLineup);
  const setCoach = useScoreboardStore((s) => s.setCoach);

  const [activeSide, setActiveSide] = useState<TeamSide>('home');
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [newPos, setNewPos] = useState<string>('');
  const [showField, setShowField] = useState(false);

  const team = activeSide === 'home' ? match.homeTeam : match.awayTeam;
  const otherTeam = activeSide === 'home' ? match.awayTeam : match.homeTeam;
  const formation = team.formation || '4-4-2';
  const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-4-2'];
  const coords = FIELD_COORDS[formation] || FIELD_COORDS['4-4-2'];

  const addNewPlayer = () => {
    if (newName.trim() && newNum.trim()) {
      const player: any = {
        id: genId(),
        name: newName.trim(),
        number: parseInt(newNum) || 0,
      };
      if (newPos) player.position = newPos;
      player.role = 'titular';
      addPlayer(activeSide, player);
      // Auto-add to lineup
      if (team.lineup.length < 11) {
        setLineup(activeSide, [...team.lineup, player.id]);
      }
      setNewName('');
      setNewNum('');
      setNewPos('');
    }
  };

  const toggleLineupPlayer = (playerId: string) => {
    let newLineup: string[];
    if (team.lineup.includes(playerId)) {
      newLineup = team.lineup.filter((id) => id !== playerId);
    } else if (team.lineup.length < 11) {
      newLineup = [...team.lineup, playerId];
    } else {
      return;
    }
    setLineup(activeSide, newLineup);
  };

  const setCaptain = (playerId: string) => {
    team.players.forEach((p) => {
      if (p.id === playerId) {
        updatePlayer(activeSide, p.id, { isCaptain: !p.isCaptain });
      } else if (p.isCaptain) {
        updatePlayer(activeSide, p.id, { isCaptain: false });
      }
    });
  };

  const lineupPlayers = team.lineup
    .map((id) => team.players.find((p) => p.id === id))
    .filter(Boolean);

  const substitutes = team.players.filter((p) => !team.lineup.includes(p.id));

  return (
    <div>
      {/* Side Toggle */}
      <div className="glass-panel rounded-xl p-3 mb-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveSide('home')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeSide === 'home'
                ? 'bg-blue-500/20 border-blue-400/40 text-blue-300'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {match.homeTeam.shortName}
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('away')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeSide === 'away'
                ? 'bg-red-500/20 border-red-400/40 text-red-300'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {match.awayTeam.shortName}
          </button>
        </div>

        {/* Coach + Formation */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <span className="text-[10px] text-white/30 block mb-1">DT</span>
            <input
              value={team.coach || ''}
              onChange={(e) => setCoach(activeSide, e.target.value)}
              placeholder="Nombre del DT"
              className="glass-input rounded-lg px-2 py-1.5 text-xs text-white w-full"
            />
          </div>
          <div className="w-28">
            <span className="text-[10px] text-white/30 block mb-1">Formación</span>
            <select
              value={formation}
              onChange={(e) => setFormation(activeSide, e.target.value)}
              className="glass-input rounded-lg px-2 py-1.5 text-xs text-white w-full"
            >
              {(Object.keys(FORMATION_POSITIONS) as Formation[]).map((f) => (
                <option key={f} value={f} className="bg-gray-900">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setShowField(!showField)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showField ? 'bg-green-500/20 border-green-400/40 text-green-300' : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              🏟 Campo
            </button>
          </div>
        </div>
      </div>

      {/* Field View */}
      {showField && (
        <div className="glass-panel rounded-xl p-3 mb-3">
          <div className="relative w-full" style={{ paddingBottom: '65%' }}>
            <div
              className="absolute inset-0 rounded-xl border-2 border-white/15 overflow-hidden"
              style={{
                background: `linear-gradient(180deg, 
                  #1a6b30 0%, #1a7a34 10%, 
                  #1a7a34 10%, #1e8c3a 90%, 
                  #1a6b30 90%, #1a6b30 100%)`,
              }}
            >
              {/* Center line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/15" />
              {/* Penalty areas */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 border-t border-l border-r border-white/15" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 border-b border-l border-r border-white/15" />

              {/* Team label */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/20 font-bold tracking-wider">
                {team.shortName} ({formation})
              </div>

              {/* Players on field */}
              {coords.map((pos, i) => {
                const playerId = team.lineup[i];
                const player = playerId ? team.players.find((p) => p.id === playerId) : null;
                const posLabel = positions[i] || '';
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-lg"
                      style={{
                        borderColor: team.primaryColor,
                        background: player ? `${team.primaryColor}cc` : 'rgba(255,255,255,0.1)',
                        color: player ? '#fff' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {player ? player.number : posLabel}
                    </div>
                    {player && (
                      <span className="text-[7px] text-white/70 font-bold mt-0.5 truncate max-w-[50px] text-center leading-tight">
                        {player.name.split(' ').pop()}
                        {player.isCaptain && ' (C)'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Player */}
      <div className="glass-panel rounded-xl p-3 mb-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Agregar Jugador</h3>
        <div className="flex gap-2 items-end flex-wrap">
          <div className="w-12">
            <span className="text-[10px] text-white/30 block mb-0.5">#</span>
            <input
              value={newNum}
              onChange={(e) => setNewNum(e.target.value)}
              placeholder="#"
              className="glass-input rounded px-2 py-1.5 text-xs text-white w-full"
              type="number"
              min="1"
              max="99"
            />
          </div>
          <div className="flex-1 min-w-[100px]">
            <span className="text-[10px] text-white/30 block mb-0.5">Nombre</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del jugador"
              className="glass-input rounded px-2 py-1.5 text-xs text-white w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewPlayer();
              }}
            />
          </div>
          <div className="w-20">
            <span className="text-[10px] text-white/30 block mb-0.5">Posición</span>
            <select
              value={newPos}
              onChange={(e) => setNewPos(e.target.value)}
              className="glass-input rounded px-1 py-1.5 text-xs text-white w-full"
            >
              <option value="" className="bg-gray-900">—</option>
              {Object.entries(POSITION_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-gray-900">
                  {k} - {v}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addNewPlayer}
            className="px-3 py-1.5 rounded-lg bg-green-500/25 hover:bg-green-500/40 border border-green-400/40 text-green-300 text-xs font-bold transition-all active:scale-95"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Starting XI */}
      <div className="glass-panel rounded-xl p-3 mb-3">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
          Alineación Titular ({lineupPlayers.length}/11)
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {lineupPlayers.length === 0 && (
            <p className="text-[10px] text-white/15 text-center py-3">Sin jugadores titulares</p>
          )}
          {lineupPlayers.map((player, i) => {
            const pos = positions[i] || '';
            return (
              <div
                key={player.id}
                className="flex items-center gap-2 glass-input rounded-lg px-2.5 py-1.5 text-xs group"
              >
                <span className="text-white/20 w-4 text-center font-mono text-[10px]">{i + 1}</span>
                <span className="w-6 text-center font-bold font-mono" style={{ color: team.primaryColor }}>
                  {player.number}
                </span>
                <span className="flex-1 truncate">{player.name}</span>
                {player.position && (
                  <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                    {player.position}
                  </span>
                )}
                {player.isCaptain && (
                  <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded font-bold">
                    C
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setCaptain(player.id)}
                  className="text-[10px] text-white/15 hover:text-yellow-400 transition-colors"
                  title="Capitán"
                >
                  👑
                </button>
                <button
                  type="button"
                  onClick={() => toggleLineupPlayer(player.id)}
                  className="text-red-400/20 hover:text-red-400 transition-colors"
                  title="Quitar de alineación"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Substitutes */}
      {substitutes.length > 0 && (
        <div className="glass-panel rounded-xl p-3">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
            Suplentes ({substitutes.length})
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {substitutes.map((player) => (
              <div key={player.id} className="flex items-center gap-2 glass-input rounded-lg px-2.5 py-1.5 text-xs group">
                <span className="w-6 text-center font-bold font-mono text-white/30">{player.number}</span>
                <span className="flex-1 truncate text-white/50">{player.name}</span>
                {player.position && (
                  <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                    {player.position}
                  </span>
                )}
                {team.lineup.length < 11 && (
                  <button
                    type="button"
                    onClick={() => toggleLineupPlayer(player.id)}
                    className="text-green-400/30 hover:text-green-400 text-[10px] transition-colors"
                    title="Agregar a titular"
                  >
                    ▲ Titular
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePlayer(activeSide, player.id)}
                  className="text-red-400/20 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}