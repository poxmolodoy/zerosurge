import React from 'react';
import { Home, Calendar, AlertOctagon, BookOpen, TrendingDown } from 'lucide-react';

export type BottomNavTab = 'journal' | 'sos' | 'harmAtlas' | 'taper' | null;

interface BottomNavProps {
  activeTab?: BottomNavTab;
  onOpenJournal: () => void;
  onOpenSos: () => void;
  onOpenHarmAtlas: () => void;
  onOpenTaper: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = null,
  onOpenJournal,
  onOpenSos,
  onOpenHarmAtlas,
  onOpenTaper,
}) => {
  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, action: () => void) => {
    e.currentTarget.blur();
    action();
  };

  return (
    <nav
      aria-label="Мобильная навигация"
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 pb-[max(env(safe-area-inset-bottom,0px),12px)] pt-2 px-3 shadow-2xl transition-all"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto w-full">
        {/* 1. Главная */}
        <button
          onClick={handleScrollToTop}
          className="flex flex-col items-center justify-center py-1 text-slate-400 md:hover:text-surge-emerald active:scale-95 transition-all focus:outline-none w-full"
          aria-label="Главная"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 leading-none">Главная</span>
        </button>

        {/* 2. Дневник */}
        <button
          onClick={(e) => handleTabClick(e, onOpenJournal)}
          className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-all focus:outline-none w-full ${
            activeTab === 'journal'
              ? 'text-surge-cyan font-semibold'
              : 'text-slate-400 md:hover:text-surge-cyan'
          }`}
          aria-label="Дневник самочувствия"
          aria-pressed={activeTab === 'journal'}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'journal' ? 'stroke-[2.4]' : ''}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Дневник</span>
        </button>

        {/* 3. SOS (Центральная акцентная кнопка) */}
        <div className="flex flex-col items-center justify-center w-full">
          <button
            onClick={(e) => handleTabClick(e, onOpenSos)}
            className={`w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/40 border-2 active:scale-95 transition-all flex flex-col items-center justify-center focus:outline-none ${
              activeTab === 'sos'
                ? 'border-white scale-105 shadow-amber-400/60 ring-2 ring-amber-400/50'
                : 'border-amber-200/80'
            }`}
            aria-label="Экстренная помощь SOS"
            aria-pressed={activeTab === 'sos'}
          >
            <AlertOctagon className="w-5 h-5 stroke-[2.4] text-slate-950" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-950 leading-none mt-0.5">
              SOS
            </span>
          </button>
        </div>

        {/* 4. Атлас */}
        <button
          onClick={(e) => handleTabClick(e, onOpenHarmAtlas)}
          className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-all focus:outline-none w-full ${
            activeTab === 'harmAtlas'
              ? 'text-rose-400 font-semibold'
              : 'text-slate-400 md:hover:text-rose-400'
          }`}
          aria-label="Атлас вреда кофеина"
          aria-pressed={activeTab === 'harmAtlas'}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'harmAtlas' ? 'stroke-[2.4]' : ''}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Атлас</span>
        </button>

        {/* 5. План снижения */}
        <button
          onClick={(e) => handleTabClick(e, onOpenTaper)}
          className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-all focus:outline-none w-full ${
            activeTab === 'taper'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 md:hover:text-emerald-400'
          }`}
          aria-label="Программа снижения"
          aria-pressed={activeTab === 'taper'}
        >
          <TrendingDown className={`w-5 h-5 ${activeTab === 'taper' ? 'stroke-[2.4]' : ''}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">План</span>
        </button>
      </div>
    </nav>
  );
};
