import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ArrowRight,
  Info,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { CAFFEINE_HARM_DATA, CaffeineHarmItem } from '../data/caffeineHarmData';
import { HarmDetailModal } from './HarmDetailModal';

// Dedicated crisp SVG illustrations for each organ system
const OrganSvgIllustration: React.FC<{ type: CaffeineHarmItem['iconType']; className?: string }> = ({
  type,
  className = 'w-10 h-10',
}) => {
  switch (type) {
    case 'heart':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heartGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#BE123C" />
            </linearGradient>
            <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F43F5E" floodOpacity="0.4" />
            </filter>
          </defs>
          {/* Heart silhouette */}
          <path
            d="M24 41.5C24 41.5 7 29.5 7 18C7 12 11.5 7.5 17.5 7.5C21 7.5 23.5 9.5 24 10.5C24.5 9.5 27 7.5 30.5 7.5C36.5 7.5 41 12 41 18C41 29.5 24 41.5 24 41.5Z"
            fill="url(#heartGrad)"
            opacity="0.2"
            stroke="#F43F5E"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#heartGlow)"
          />
          {/* ECG Pulse Wave across heart */}
          <path
            d="M10 23H17L19.5 17L22.5 30L26 13L28.5 26L31 23H38"
            stroke="#FFE4E6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'brain':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="brainGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Stylized Brain Hemisphere contours */}
          <path
            d="M24 10C17 10 12 14 12 20C12 23 13 25 15 27C13 29 12 32 14 36C16 40 21 40 24 38C27 40 32 40 34 36C36 32 35 29 33 27C35 25 36 23 36 20C36 14 31 10 24 10Z"
            fill="url(#brainGrad)"
            opacity="0.2"
            stroke="#06B6D4"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M24 10V38M16 20C19 20 21 23 24 23M32 20C29 20 27 23 24 23M17 29C20 29 22 31 24 31M31 29C28 29 26 31 24 31"
            stroke="#67E8F9"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Synapse nodes */}
          <circle cx="16" cy="18" r="2" fill="#E0F2FE" />
          <circle cx="32" cy="18" r="2" fill="#E0F2FE" />
          <circle cx="20" cy="33" r="1.5" fill="#E0F2FE" />
          <circle cx="28" cy="33" r="1.5" fill="#E0F2FE" />
        </svg>
      );

    case 'flame':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flameGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Adrenals Cortisol Surge Flame */}
          <path
            d="M24 7C24 7 29 15 29 20C29 22 28 24 26 25C29 26 33 30 33 35C33 40.5 28.5 43 24 43C19.5 43 15 40.5 15 35C15 29 20 24 21 21C22 18 20 16 20 13C20 10 24 7 24 7Z"
            fill="url(#flameGrad)"
            opacity="0.25"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Inner core flame */}
          <path
            d="M24 26C26 26 27.5 28 27.5 30.5C27.5 33 26 35 24 35C22 35 20.5 33 20.5 30.5C20.5 28.5 22.5 27 24 26Z"
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="1.4"
          />
          {/* Energy spark radiating dots */}
          <circle cx="11" cy="22" r="1.5" fill="#FBBF24" />
          <circle cx="37" cy="22" r="1.5" fill="#FBBF24" />
          <circle cx="34" cy="13" r="1.2" fill="#FBBF24" />
        </svg>
      );

    case 'stomach':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="stomachGrad" x1="12" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#E11D48" />
            </linearGradient>
          </defs>
          {/* Stomach profile outline */}
          <path
            d="M21 9C21 9 22 14 20 17C17 21 12 25 12 32C12 38 18 41 24 41C31 41 36 36 36 30C36 24 32 19 32 15C32 11 31 9 31 9"
            fill="url(#stomachGrad)"
            opacity="0.2"
            stroke="#F43F5E"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Acid wave surge */}
          <path
            d="M16 32C18 30 20 34 23 32C26 30 28 34 31 32"
            stroke="#FB7185"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Acid bubbling vapor droplets */}
          <circle cx="21" cy="24" r="1.5" fill="#FECDD3" />
          <circle cx="27" cy="22" r="2" fill="#FECDD3" />
          <path
            d="M26 13L26 8M23 11L20 8"
            stroke="#FB7185"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'kidney':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="kidneyGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          {/* Kidney contour */}
          <path
            d="M22 10C15 10 11 16 11 24C11 32 15 38 22 38C30 38 35 32 35 24C35 20 32 18 29 18C26 18 25 21 23 21C21 21 22 17 25 15C27 13.5 26 10 22 10Z"
            fill="url(#kidneyGrad)"
            opacity="0.2"
            stroke="#06B6D4"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Filtration flux droplets */}
          <path
            d="M24 24C24 24 28 28 28 31C28 33 26.5 34.5 24.5 34.5C22.5 34.5 21 33 21 31C21 28 24 24 24 24Z"
            fill="#CFFAFE"
            stroke="#06B6D4"
            strokeWidth="1.4"
          />
          {/* Electrolyte ion markers */}
          <circle cx="34" cy="14" r="1.5" fill="#67E8F9" />
          <circle cx="15" cy="15" r="1.5" fill="#67E8F9" />
        </svg>
      );

    case 'dental':
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dentalGrad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Stylized Tooth contour */}
          <path
            d="M15 10C18 9 21 11 24 11C27 11 30 9 33 10C36 11 37 15 36 21C35 27 34 34 32 39C31 41 29 41 28 38C26.5 33 26 27 24 27C22 27 21.5 33 20 38C19 41 17 41 16 39C14 34 13 27 12 21C11 15 12 11 15 10Z"
            fill="url(#dentalGrad)"
            opacity="0.2"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Enamel shield spark */}
          <path
            d="M24 16L25 19L28 20L25 21L24 24L23 21L20 20L23 19L24 16Z"
            fill="#D1FAE5"
            stroke="#10B981"
            strokeWidth="1"
          />
          {/* Acid attack indicators */}
          <circle cx="10" cy="18" r="1.5" fill="#34D399" />
          <circle cx="38" cy="18" r="1.5" fill="#34D399" />
        </svg>
      );

    default:
      return null;
  }
};

export const CaffeineHarmGrid: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CaffeineHarmItem | null>(null);

  const getCardBorderAndGlow = (color: CaffeineHarmItem['badgeColor']) => {
    switch (color) {
      case 'rose':
        return 'hover:border-rose-500/60 hover:shadow-[0_4px_20px_rgba(244,63,94,0.2)]';
      case 'amber':
        return 'hover:border-amber-500/60 hover:shadow-[0_4px_20px_rgba(245,158,11,0.2)]';
      case 'cyan':
        return 'hover:border-surge-cyan/60 hover:shadow-[0_4px_20px_rgba(6,182,212,0.2)]';
      case 'emerald':
        return 'hover:border-surge-emerald/60 hover:shadow-[0_4px_20px_rgba(16,185,129,0.2)]';
    }
  };

  const getBadgeStyle = (color: CaffeineHarmItem['badgeColor']) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'amber':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'cyan':
        return 'bg-surge-cyan/15 border-surge-cyan/30 text-cyan-200';
      case 'emerald':
        return 'bg-surge-emerald/15 border-surge-emerald/30 text-emerald-200';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Клинический атлас: Вред стимуляторов
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Книга знаний
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Медицинская карта патологического воздействия энергетиков и кофеина на ключевые системы органов
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono font-bold text-slate-300">
            <Stethoscope className="w-3.5 h-3.5 text-surge-cyan" />
            <span>6 систем органов</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-slate-400">
            <Info className="w-3 h-3 text-slate-400" />
            <span>Нажмите на плитку для мед. справки</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Organ Harm Tiles with 20px-24px clean gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {CAFFEINE_HARM_DATA.map((item) => {
          return (
            <motion.div
              key={item.id}
              id={`harm-card-${item.id}`}
              data-testid={`harm-card-${item.id}`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item);
                }
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 transition-colors duration-200 cursor-pointer relative z-0 hover:z-20 overflow-hidden flex flex-col justify-between ${getCardBorderAndGlow(
                item.badgeColor
              )}`}
            >
              {/* Background radial accent glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors" />

              <div>
                {/* Top Row: SVG illustration + Discipline badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                    <OrganSvgIllustration type={item.iconType} className="w-8 h-8" />
                  </div>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border ${getBadgeStyle(
                      item.badgeColor
                    )}`}
                  >
                    {item.badgeLabel}
                  </span>
                </div>

                {/* Subtitle / Organ System */}
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {item.systemName}
                </span>

                {/* Main Harm Title */}
                <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors mb-2 leading-snug">
                  {item.title}
                </h4>

                {/* Short clinical summary */}
                <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                  {item.shortDescription}
                </p>
              </div>

              {/* Action footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-surge-cyan transition-colors">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3 h-3 text-surge-cyan" />
                  Клинический протокол
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px] font-mono">
                  Справка
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Harm Detail Modal */}
      <HarmDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};
