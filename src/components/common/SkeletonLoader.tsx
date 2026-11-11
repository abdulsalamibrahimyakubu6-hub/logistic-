import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-zinc-900 rounded-xl w-full border border-zinc-800"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-zinc-900/60 rounded-xl w-full border border-zinc-800/80"></div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-zinc-800 animate-pulse space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
      <div className="h-8 bg-zinc-800 rounded w-1/2"></div>
      <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
    </div>
  );
};

export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
            <div className="h-3 bg-zinc-800/60 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
