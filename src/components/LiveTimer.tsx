import { motion } from 'framer-motion';
import { ShieldCheck, Activity } from 'lucide-react';
import { ElapsedTime } from '../types';

interface LiveTimerProps {
  elapsedTime: ElapsedTime;
}

export const LiveTimer: React.FC<LiveTimerProps> = ({ elapsedTime }) => {
  const format2Digits = (num: number) => num.toString().padStart(2, '0');

  // Dynamic status text based on elapsed days
  const getPhaseStatus = (days: number) => {
    if (days < 1)
      return {
        label: 'Фаза 1: Выведение кофеина из крови',
        color: 'text-surge-amber',
        border: 'border-amber-500/30',
      };
    if (days < 4)
      return {
        label: 'Фаза 2: Снятие спазма сосудов (Пик отмены)',
        color: 'text-amber-400',
        border: 'border-amber-500/40',
      };
    if (days < 7)
      return {
        label: 'Фаза 3: Восстановление глубокого сна',
        color: 'text-surge-cyan',
        border: 'border-cyan-500/30',
      };
    if (days < 14)
      return {
        label: 'Фаза 4: Перезагрузка аденозиновых рецепторов',
        color: 'text-surge-emerald',
        border: 'border-emerald-500/30',
      };
    return {
      label: 'Фаза 5: Метаболическая автономия и чистая энергия',
      color: 'text-emerald-300',
      border: 'border-emerald-400/40',
    };
  };

  const phase = getPhaseStatus(elapsedTime.days);

  return (
    <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-white/10 overflow-hidden shadow-2xl">
      {/* Background ambient radial gradients */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-surge-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-surge-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surge-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-surge-emerald"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Таймер свободы в реальном времени
          </span>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border bg-slate-900/60 flex items-center gap-1.5 ${phase.border} ${phase.color}`}
        >
          <Activity className="w-3.5 h-3.5" />
          {phase.label}
        </div>
      </div>

      {/* Main Counter Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center relative z-10">
        {/* Days */}
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-inner">
          <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight tabular-nums drop-shadow-md">
            {elapsedTime.days}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 sm:mt-2">
            Дней
          </div>
        </div>

        {/* Hours */}
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-inner">
          <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold text-surge-cyan tracking-tight tabular-nums drop-shadow-md">
            {format2Digits(elapsedTime.hours)}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 sm:mt-2">
            Часов
          </div>
        </div>

        {/* Minutes */}
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-inner">
          <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold text-surge-emerald tracking-tight tabular-nums drop-shadow-md">
            {format2Digits(elapsedTime.minutes)}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1 sm:mt-2">
            Минут
          </div>
        </div>

        {/* Seconds */}
        <div className="bg-slate-900/70 border border-surge-emerald/20 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-glow-emerald">
          <motion.div
            key={elapsedTime.seconds}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold text-surge-emerald tracking-tight tabular-nums"
          >
            {format2Digits(elapsedTime.seconds)}
          </motion.div>
          <div className="text-[10px] sm:text-xs font-semibold text-surge-emerald uppercase tracking-wider mt-1 sm:mt-2">
            Секунд
          </div>
        </div>
      </div>

      {/* Motivational Bottom Quote */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-surge-emerald shrink-0" />
        <span>Каждая прошедшая секунда восстанавливает чувствительность ваших рецепторов</span>
      </div>
    </div>
  );
};
