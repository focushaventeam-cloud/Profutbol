import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdSidebarProps {
  position?: 'left' | 'right';
  className?: string;
}

const adItems = [
  {
    title: 'Tu Marca Aquí',
    desc: 'Publicidad premium en marcador en vivo',
    gradient: 'from-blue-600/20 to-purple-600/20',
    border: 'border-blue-500/20',
  },
  {
    title: 'Patrocinio Oficial',
    desc: 'Asociate con el fútbol profesional',
    gradient: 'from-emerald-600/20 to-cyan-600/20',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Espacio Disponible',
    desc: 'Reserva tu espacio publicitario',
    gradient: 'from-amber-600/20 to-orange-600/20',
    border: 'border-amber-500/20',
  },
];

export const AdSidebar: React.FC<AdSidebarProps> = ({
  position = 'right',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {adItems.map((ad, idx) => (
        <div
          key={idx}
          className={`
            group relative overflow-hidden rounded-2xl border ${ad.border}
            bg-gradient-to-br ${ad.gradient}
            hover:brightness-125 transition-all duration-300 cursor-pointer
          `}
        >
          <div className="p-4 text-center">
            <Megaphone
              size={20}
              className="mx-auto mb-2 text-white/20 group-hover:text-white/40 transition-colors"
            />
            <p className="text-sm font-bold text-white/40 group-hover:text-white/60 transition-colors">
              {ad.title}
            </p>
            <p className="text-[11px] text-white/20 group-hover:text-white/35 mt-1 transition-colors">
              {ad.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdSidebar;