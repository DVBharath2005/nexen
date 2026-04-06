
import React from 'react';

const Logo: React.FC<{ className?: string; iconOnly?: boolean; textColor?: string }> = ({ className = "h-8", iconOnly = false, textColor }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.svg" alt="Nexen Logo" className="h-full w-auto object-contain" />
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`text-xl font-black tracking-tighter leading-none uppercase ${textColor || 'text-slate-900 dark:text-white'}`} style={{ letterSpacing: '0.1em' }}>
            NEXEN
          </span>
          <span className="text-[7px] font-bold tracking-[0.2em] text-blue-600 dark:text-cyan-400 uppercase leading-none mt-0.5">
            Connecting Founders
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
