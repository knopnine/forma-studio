import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const baseSvgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const Flame: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 8.5 14.5 A 2.5 2.5 0 0 0 11 12 C 11 10.62 10.5 10 10 9 C 8.93 6.86 9.78 4.95 12 3 C 12.5 5.5 14 7.9 16 9.5 C 18 11.1 19 13 19 15 A 7 7 0 1 1 5 15 C 5 13.85 5.43 12.71 6 12 A 2.5 2.5 0 0 0 8.5 14.5 Z" />
  </svg>
);

export const Sparkles: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 12 3 L 9.91 8.81 A 2 2 0 0 1 8.64 10.09 L 2.83 12.17 A 0.2 0.2 0 0 0 2.83 12.55 L 8.64 14.64 A 2 2 0 0 1 9.91 15.91 L 12 21.72 A 0.2 0.2 0 0 0 12.38 21.72 L 14.46 15.91 A 2 2 0 0 1 15.74 14.64 L 21.54 12.55 A 0.2 0.2 0 0 0 21.54 12.17 L 15.74 10.09 A 2 2 0 0 1 14.46 8.81 L 12.38 3 A 0.2 0.2 0 0 0 12 3 Z" />
    <path d="M 5 3 L 5 7" />
    <path d="M 19 17 L 19 21" />
    <path d="M 3 5 L 7 5" />
    <path d="M 17 19 L 21 19" />
  </svg>
);

export const Layers: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 12.83 2.18 A 2 2 0 0 0 11.17 2.18 L 2.6 6.08 A 1 1 0 0 0 2.6 7.91 L 11.17 11.82 A 2 2 0 0 0 12.83 11.82 L 21.4 7.91 A 1 1 0 0 0 21.4 6.08 Z" />
    <path d="M 22 12.5 L 13.42 16.41 A 2 2 0 0 1 10.58 16.41 L 2 12.5" />
    <path d="M 22 17.5 L 13.42 21.41 A 2 2 0 0 1 10.58 21.41 L 2 17.5" />
  </svg>
);

export const Dumbbell: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 6.5 6.5 L 17.5 17.5" />
    <path d="M 21 21 L 20 20 A 2 2 0 0 0 17.17 20 L 14.67 22.5 A 2 2 0 0 1 11.84 22.5 L 11.67 22.33 A 2 2 0 0 1 11.67 19.5 L 14.17 17 A 2 2 0 0 0 14.17 14.17 L 13.17 13.17" />
    <path d="M 3 3 L 4 4 A 2 2 0 0 0 6.83 4 L 9.33 1.5 A 2 2 0 0 1 12.16 1.5 L 12.33 1.67 A 2 2 0 0 1 12.33 4.5 L 9.83 7 A 2 2 0 0 0 9.83 9.83 L 10.83 10.83" />
    <path d="M 18 15 L 21 18" />
    <path d="M 3 6 L 6 9" />
  </svg>
);

export const BookOpen: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 2 3 L 8 3 A 4 4 0 0 1 12 7 L 12 21 A 3 3 0 0 0 9 18 L 2 18 Z" />
    <path d="M 22 3 L 16 3 A 4 4 0 0 0 12 7 L 12 21 A 3 3 0 0 1 15 18 L 22 18 Z" />
  </svg>
);

export const BarChart3: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 3 3 L 3 21 L 21 21" />
    <path d="M 18 17 L 18 9" />
    <path d="M 13 17 L 13 5" />
    <path d="M 8 17 L 8 14" />
  </svg>
);

export const PlayCircle: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

export const Wrench: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 14.7 6.3 A 1 1 0 0 0 14.7 7.7 L 16.3 9.3 A 1 1 0 0 0 17.7 9.3 L 21.47 5.53 A 6 6 0 0 1 13.53 13.47 L 6.62 20.38 A 2.12 2.12 0 0 1 3.62 17.38 L 10.53 10.47 A 6 6 0 0 1 18.47 2.53 L 14.71 6.29 Z" />
  </svg>
);

export const X: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 18 6 L 6 18" />
    <path d="M 6 6 L 18 18" />
  </svg>
);

export const Globe: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M 12 2 A 14.5 14.5 0 0 0 12 22 A 14.5 14.5 0 0 0 12 2 Z" />
    <path d="M 2 12 L 22 12" />
  </svg>
);

export const Target: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const CheckCircle2: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M 9 12 L 11 14 L 15 10" />
  </svg>
);

export const Play: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
  </svg>
);

export const Pause: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
  </svg>
);

export const Plus: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 5 12 L 19 12" />
    <path d="M 12 5 L 12 19" />
  </svg>
);

export const Timer: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="15" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

export const RotateCcw: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 3 12 A 9 9 0 1 0 9 3.25 L 3 8" />
    <path d="M 3 3 L 3 8 L 8 8" />
  </svg>
);

export const Check: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const RefreshCw: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 3 12 A 9 9 0 0 1 9 3.25 L 12 6" />
    <path d="M 21 12 A 9 9 0 0 1 15 20.75 L 12 18" />
    <path d="M 21 3 L 21 8 L 16 8" />
    <path d="M 3 21 L 3 16 L 8 16" />
  </svg>
);

export const Info: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const Trash2: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 3 6 L 21 6" />
    <path d="M 19 6 L 19 20 A 2 2 0 0 1 17 22 L 7 22 A 2 2 0 0 1 5 20 L 5 6" />
    <path d="M 8 6 L 8 4 A 2 2 0 0 1 10 2 L 14 2 A 2 2 0 0 1 16 4 L 16 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const Zap: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
  </svg>
);

export const BatteryCharging: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 15 7 L 16 7 A 2 2 0 0 1 18 9 L 18 15 A 2 2 0 0 1 16 17 L 14 17" />
    <path d="M 6 7 L 4 7 A 2 2 0 0 0 2 9 L 2 15 A 2 2 0 0 0 4 17 L 6 17" />
    <line x1="22" y1="11" x2="22" y2="13" />
    <polyline points="11 7 8 12 12 12 9 17" />
  </svg>
);

export const HeartPulse: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 19 14 C 20.49 12.54 22 10.79 22 8.5 A 5.5 5.5 0 0 0 16.5 3 C 14.74 3 13.5 3.5 12 5 C 10.5 3.5 9.26 3 7.5 3 A 5.5 5.5 0 0 0 2 8.5 C 2 10.8 3.5 12.55 5 14 L 12 21 Z" />
    <polyline points="3.22 12 8.5 12 10 9 12 15 14 7 15.5 12 20.78 12" />
  </svg>
);

export const Clock: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 5 12 L 19 12" />
    <path d="M 12 5 L 19 12 L 12 19" />
  </svg>
);

export const TrendingUp: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const Trophy: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 6 9 L 4.5 9 A 2.5 2.5 0 0 1 2 6.5 A 2.5 2.5 0 0 1 4.5 4 L 6 4" />
    <path d="M 18 9 L 19.5 9 A 2.5 2.5 0 0 0 22 6.5 A 2.5 2.5 0 0 0 19.5 4 L 18 4" />
    <path d="M 4 22 L 20 22" />
    <path d="M 10 14.66 L 10 17 A 1 1 0 0 1 9 18 C 7.85 18.75 7 20.24 7 22" />
    <path d="M 14 14.66 L 14 17 A 1 1 0 0 0 15 18 C 16.15 18.75 17 20.24 17 22" />
    <path d="M 18 2 L 6 2 L 6 9 A 6 6 0 0 0 18 9 Z" />
  </svg>
);

export const Download: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 21 15 L 21 19 A 2 2 0 0 1 19 21 L 5 21 A 2 2 0 0 1 3 19 L 3 15" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Upload: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <path d="M 21 15 L 21 19 A 2 2 0 0 1 19 21 L 5 21 A 2 2 0 0 1 3 19 L 3 15" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const Calendar: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Search: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Activity: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const LayoutDashboard: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const Sliders: React.FC<IconProps> = ({ size = 20, className = 'w-5 h-5 shrink-0', ...props }) => (
  <svg width={size} height={size} {...baseSvgProps} className={className} {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
