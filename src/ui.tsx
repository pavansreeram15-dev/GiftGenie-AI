import type { ReactNode } from 'react';

export function fireConfetti(count = 80) {
  const colors = ['#3380ff', '#10b981', '#f43f5e', '#f59e0b', '#a78bfa', '#34d399'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${10 + Math.random() * 10}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 5000);
}

export function MatchRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#3380ff' : '#f59e0b';
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {score}%
      </div>
    </div>
  );
}

export function Meter({ value, label, color = 'primary' }: { value: number; label: string; color?: 'primary' | 'accent' | 'warm' | 'rose' }) {
  const colors: Record<string, string> = {
    primary: 'gradient-primary', accent: 'gradient-accent', warm: 'gradient-warm', rose: 'gradient-rose',
  };
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-secondary-c font-medium">{label}</span>
        <span className="text-primary-c font-bold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-track overflow-hidden">
        <div
          className={`h-full rounded-full ${colors[color]}`}
          style={{ width: `${value}%`, transition: 'width 0.8s ease-out' }}
        />
      </div>
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? 'text-warm-500' : 'text-muted-c'} style={{ fontSize: 13 }}>
          {i <= Math.round(rating) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function Badge({ children, color = 'primary' }: { children: ReactNode; color?: 'primary' | 'accent' | 'warm' | 'rose' | 'neutral' }) {
  const map: Record<string, string> = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300',
    accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-400',
    warm: 'bg-warm-500/15 text-warm-500',
    rose: 'bg-rose-500/15 text-rose-500',
    neutral: 'bg-black/5 text-secondary-c dark:bg-white/10 dark:text-secondary-c',
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${map[color]}`}>{children}</span>;
}
