import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'finished' | 'scheduled' | 'halftime' | 'postponed' | 'default';
  className?: string;
  pulse?: boolean;
}

const variantClasses: Record<string, string> = {
  live: 'bg-red-500/20 text-red-300 border-red-500/30',
  finished: 'bg-green-500/20 text-green-300 border-green-500/30',
  scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  halftime: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  postponed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  default: 'bg-white/10 text-white/70 border-white/20',
};

const variantLabels: Record<string, string> = {
  live: 'EN VIVO',
  finished: 'FINALIZADO',
  scheduled: 'PROGRAMADO',
  halftime: 'MEDIO TIEMPO',
  postponed: 'POSTERGADO',
  default: '',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  pulse = false,
}) => {
  const label = variantLabels[variant] || '';
  const displayChildren = label || children;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
        border uppercase tracking-wider
        ${variantClasses[variant]}
        ${pulse && variant === 'live' ? 'animate-pulse-slow' : ''}
        ${className}
      `}
    >
      {variant === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
      {displayChildren}
    </span>
  );
};

export default Badge;