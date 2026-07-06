import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  text?: string;
  link?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  text = 'Espacio Publicitario — Contáctanos para tu marca',
  link = '#',
  className = '',
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        block relative overflow-hidden rounded-2xl border border-white/10
        bg-gradient-to-r from-white/5 via-white/8 to-white/5
        hover:from-white/10 hover:via-white/12 hover:to-white/10
        transition-all duration-500 group
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center justify-center gap-2 px-6 py-4">
        <Megaphone size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
        <span className="text-xs text-white/25 group-hover:text-white/40 font-medium transition-colors">
          {text}
        </span>
      </div>
    </a>
  );
};

export default AdBanner;