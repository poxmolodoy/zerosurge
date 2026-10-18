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
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 pt-[max(env(safe-area-inset-top,0px),12px)] pb-3 sm:py-3.5 transition-all overflow-visible before:content-[''] before:absolute before:bottom-full before:left-0 before:right-0 before:h-[100vh] before:bg-zinc-950/95 before:pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 overflow-visible">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-surge-emerald via-emerald-400 to-surge-cyan flex items-center justify-center text-slate-950 shadow-glow-emerald">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 fill-current stroke-current" />
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

        {/* Desktop-only Navigation Buttons (hidden on mobile since they exist in Mobile BottomNav) */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-visible">
          {/* 1. Daily Health Journal & Chart Button (Calendar) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenJournal}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-surge-cyan hover:text-cyan-300 hover:border-surge-cyan/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              aria-label="Открыть дневник и график самочувствия"
            >
              <Calendar className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50">
              Дневник и график
            </div>
          </div>

          {/* 2. Taper & Caffeine Intake Log (TrendingDown) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenTaper}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              aria-label="Открыть журнал кофеина и программу постепенного снижения"
            >
              <TrendingDown className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50">
              Tapering и кофеин
            </div>
          </div>

          {/* 3. Clinical Harm Atlas Button (BookOpen) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenHarmAtlas}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-rose-400 hover:text-rose-300 hover:border-rose-400/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              aria-label="Открыть книгу знаний: клинический атлас вреда"
            >
              <BookOpen className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50">
              Книга знаний: Атлас вреда
            </div>
          </div>
        </div>

        {/* Global Actions Group (Visible on all devices, single streamlined row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-visible">
          {/* Achievements Button (Trophy) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenAchievements}
              className="p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-surge-amber hover:text-amber-300 hover:border-surge-amber/30 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              aria-label="Открыть достижения"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50 hidden sm:block">
              Достижения
            </div>
          </div>

          {/* Performance Mode / Eco Mode (⚡ Toggle heavy effects) */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onTogglePerformanceMode}
              className={`p-1.5 sm:p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                isPerformanceMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-surge-emerald hover:text-emerald-300 hover:border-surge-emerald/30'
              }`}
              aria-label={isPerformanceMode ? 'Включить эффекты' : 'Отключить эффекты'}
            >
              {isPerformanceMode ? (
                <ZapOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              )}
            </button>
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50 hidden sm:block">
              {isPerformanceMode ? 'Включить эффекты' : 'Отключить эффекты'}
            </div>
          </div>

          {/* Relapse Button */}
          <button
            onClick={onOpenRelapse}
            className="group py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm hover:shadow-glow-ruby active:scale-95 shrink-0"
            aria-label="Зафиксировать срыв"
          >
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Зафиксировать срыв</span>
            <span className="sm:hidden">Срыв</span>
          </button>

          {/* SOS Button: desktop only (on mobile, prominent SOS button is in BottomNav) */}
          <button
            onClick={onOpenSos}
            className="hidden sm:flex py-2 px-3.5 rounded-xl text-sm font-bold text-amber-950 bg-gradient-to-r from-surge-amber to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-glow-amber transition-all transform active:scale-95 items-center gap-1.5 shrink-0 animate-pulse"
            aria-label="Экстренная помощь SOS"
          >
            <AlertOctagon className="w-4 h-4 fill-current shrink-0" />
            <span>Хочу сорваться / SOS</span>
          </button>

          {/* Settings Button */}
          <div className="relative group/btn flex items-center justify-center">
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center shrink-0"
              aria-label="Настройки профиля"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute top-full mt-2.5 right-0 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl text-xs font-medium text-slate-200 whitespace-nowrap shadow-2xl pointer-events-none opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 translate-y-1 transition-all duration-150 z-50 hidden sm:block">
              Настройки
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
