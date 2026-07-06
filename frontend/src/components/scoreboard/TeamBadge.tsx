import React from 'react';

interface TeamBadgeProps {
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-8 h-8 text-xs', text: 'text-xs', logo: 'w-6 h-6' },
  md: { container: 'w-12 h-12 text-sm', text: 'text-sm', logo: 'w-9 h-9' },
  lg: { container: 'w-20 h-20 text-lg', text: 'text-lg', logo: 'w-14 h-14' },
};

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  name,
  shortName,
  logo,
  primaryColor,
  size = 'md',
  className = '',
}) => {
  const sizes = sizeMap[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${sizes.container} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}20)`,
          border: `2px solid ${primaryColor}50`,
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt={name}
            className={`${sizes.logo} object-contain p-1 rounded-lg`}
          />
        ) : (
          <span className={`${sizes.text} font-black text-white/90`}>
            {shortName.substring(0, 3)}
          </span>
        )}
      </div>
      <div className="text-center">
        <p className={`${sizes.text} font-bold text-white text-shadow-sm leading-tight`}>
          {shortName}
        </p>
        {size !== 'sm' && (
          <p className="text-[10px] text-white/40 font-medium mt-0.5">{name}</p>
        )}
      </div>
    </div>
  );
};

export default TeamBadge;