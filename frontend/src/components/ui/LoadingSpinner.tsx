import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-white/20 border-t-blue-400 animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeMap[size]} rounded-full border-2 border-transparent border-b-purple-400/50 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {text && (
        <p className="text-sm text-white/50 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;