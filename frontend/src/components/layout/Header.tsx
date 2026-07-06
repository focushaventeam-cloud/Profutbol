import React from 'react';
import { Menu, Wifi, WifiOff, Trophy } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isConnected?: boolean;
  matchTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isConnected = false,
  matchTitle = 'Scoreboard Fútbol',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-panel-strong border-b border-white/10 rounded-none px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Trophy size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-white leading-tight">{matchTitle}</h1>
                <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
                  Sistema de Marcación
                </p>
              </div>
            </div>
          </div>

          {/* Center: Connection Status */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
                isConnected
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  : 'bg-red-500/15 text-red-300 border border-red-500/20'
              }`}
            >
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isConnected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>

          {/* Right: Live indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/40">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;