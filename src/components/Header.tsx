import {
  Zap,
  ZapOff,
  AlertOctagon,
  Settings,
  AlertTriangle,
  Trophy,
  Calendar,
  BookOpen,
  TrendingDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenSos: () => void;
  onOpenSettings: () => void;
  onOpenRelapse: () => void;
  onOpenAchievements?: () => void;
  onOpenJournal?: () => void;
  onOpenHarmAtlas?: () => void;
  onOpenTaper?: () => void;
  isPerformanceMode?: boolean;
  onTogglePerformanceMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSos,
  onOpenSettings,
  onOpenRelapse,
  onOpenAchievements,
  onOpenJournal,
  onOpenHarmAtlas,
  onOpenTaper,
  isPerformanceMode = false,
  onTogglePerformanceMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-2.5 gap-x-2 sm:gap-x-4">
        {/* Brand Logo (order-1) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-surge-emerald via-emerald-400 to-surge-cyan flex items-center justify-center text-slate-950 shadow-glow-emerald">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current stroke-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white">
                Zero<span className="text-surge-emerald">Surge</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-surge-emerald/10 border border-surge-emerald/20 text-surge-emerald font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Трекер свободы от энергетиков и кофеина
            </p>
          </div>
        </div>

        {/* Feature & Modal Buttons (order-3 full-width ribbon on mobile, order-2 inline flex on desktop) */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-around sm:justify-start gap-1 sm:gap-1.5 pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
          {/* 1. Daily Health Journal & Chart Button (Calendar) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenJournal}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-surge-cyan hover:text-cyan-300 hover:border-surge-cyan/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              title="Дневник и график самочувствия"
              aria-label="Открыть дневник и график самочувствия"
            >
              <Calendar className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              Дневник и график
            </div>
          </div>

          {/* 2. Taper & Caffeine Intake Log (TrendingDown) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenTaper}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              title="Журнал кофеина и программа Tapering"
              aria-label="Открыть журнал кофеина и программу постепенного снижения"
            >
              <TrendingDown className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              Tapering и кофеин
            </div>
          </div>

          {/* 3. Clinical Harm Atlas Button (BookOpen) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenHarmAtlas}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-rose-400 hover:text-rose-300 hover:border-rose-400/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              title="Книга знаний: Клинический атлас вреда"
              aria-label="Открыть книгу знаний: клинический атлас вреда"
            >
              <BookOpen className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              Книга знаний: Атлас вреда
            </div>
          </div>

          {/* 4. Achievements Button (Trophy) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenAchievements}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-surge-amber hover:text-amber-300 hover:border-surge-amber/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              title="Достижения"
              aria-label="Открыть достижения"
            >
              <Trophy className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              Достижения
            </div>
          </div>

          {/* 5. Performance Mode / Eco Mode (⚡ Toggle heavy effects) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onTogglePerformanceMode}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                isPerformanceMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-surge-emerald hover:text-emerald-300 hover:border-surge-emerald/30'
              }`}
              title={isPerformanceMode ? 'Включить эффекты' : 'Отключить эффекты'}
              aria-label={isPerformanceMode ? 'Включить эффекты' : 'Отключить эффекты'}
            >
              {isPerformanceMode ? (
                <ZapOff className="w-5 h-5" />
              ) : (
                <Zap className="w-5 h-5 fill-current" />
              )}
            </button>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              {isPerformanceMode ? 'Включить эффекты' : 'Отключить эффекты'}
            </div>
          </div>
        </div>

        {/* 3. Crisis & Settings Group (order-2 on mobile top-right, order-3 on desktop right) */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Relapse Button */}
          <button
            onClick={onOpenRelapse}
            className="group py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm hover:shadow-glow-ruby active:scale-95 shrink-0"
            aria-label="Зафиксировать срыв"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Зафиксировать срыв</span>
            <span className="sm:hidden">Срыв</span>
          </button>

          {/* Prominent SOS Button */}
          <button
            onClick={onOpenSos}
            className="py-1.5 px-2.5 sm:py-2 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold text-amber-950 bg-gradient-to-r from-surge-amber to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-glow-amber transition-all transform active:scale-95 flex items-center gap-1.5 shrink-0 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4 fill-current shrink-0" />
            <span className="hidden sm:inline">Хочу сорваться /</span> SOS
          </button>

          {/* Settings Button */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center shrink-0"
              title="Настройки"
              aria-label="Настройки профиля"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute top-full mt-2 right-0 px-2.5 py-1 bg-slate-900/95 border border-white/10 rounded-lg text-[11px] font-medium text-slate-200 whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 hidden sm:block">
              Настройки
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
