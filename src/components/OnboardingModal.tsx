import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, Coffee, ShieldCheck, Coins, Sparkles, Clock, X } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile?: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
  title?: string;
  submitButtonText?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onSave,
  onClose,
  title = 'Добро пожаловать в ZeroSurge',
  submitButtonText = 'Начать путь к свободе',
}) => {
  const getNowLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [quitDate, setQuitDate] = useState<string>(() => {
    if (initialProfile?.quitDate) {
      try {
        const d = new Date(initialProfile.quitDate);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
      } catch {
        return getNowLocalDateTime();
      }
    }
    return getNowLocalDateTime();
  });

  const [cansPerDay, setCansPerDay] = useState<number>(initialProfile?.cansPerDay ?? 2);
  const [coffeePerDay, setCoffeePerDay] = useState<number>(initialProfile?.coffeePerDay ?? 1);
  const [isSugarFree, setIsSugarFree] = useState<boolean>(initialProfile?.isSugarFree ?? false);
  const [costPerPortion, setCostPerPortion] = useState<number>(
    initialProfile?.costPerPortion ?? 130
  );

  if (!isOpen) return null;

  const handleSetNow = () => {
    setQuitDate(getNowLocalDateTime());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate = new Date(quitDate).toISOString();
    onSave({
      quitDate: finalDate,
      cansPerDay: Math.max(0, cansPerDay),
      coffeePerDay: Math.max(0, coffeePerDay),
      isSugarFree,
      costPerPortion: Math.max(1, costPerPortion),
      isOnboarded: true,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg glass-card rounded-2xl p-5 sm:p-8 text-white shadow-2xl z-10 border border-white/10 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-surge-emerald/20 to-surge-cyan/20 border border-surge-emerald/30 text-surge-emerald">
              <Sparkles className="w-6 h-6 text-surge-emerald" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Задайте параметры для расчета био-восстановления и экономии
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-auto shrink-0"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Date & Time */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-surge-cyan" />
                  Дата и время последней банки / кофе
                </span>
                <button
                  type="button"
                  onClick={handleSetNow}
                  className="text-xs text-surge-emerald hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-surge-emerald/10 border border-surge-emerald/20"
                >
                  <Clock className="w-3 h-3" />
                  Сейчас
                </button>
              </label>
              <input
                type="datetime-local"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white font-mono text-sm focus:border-surge-emerald focus:ring-1 focus:ring-surge-emerald transition-all"
              />
            </div>

            {/* 2 & 3. Consumption: Cans & Coffee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cans/day */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-surge-amber" />
                  Банок энергетика в день
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCansPerDay(num)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                        cansPerDay === num
                          ? 'bg-surge-amber/20 border-surge-amber text-surge-amber shadow-glow-amber'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={cansPerDay}
                    onChange={(e) => setCansPerDay(Number(e.target.value))}
                    className="w-14 py-2 px-2 text-center rounded-xl bg-slate-900/80 border border-white/10 text-white font-mono text-sm focus:border-surge-amber"
                    title="Своё количество"
                  />
                </div>
              </div>

              {/* Coffee/day */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-surge-cyan" />
                  Чашек кофе в день
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCoffeePerDay(num)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                        coffeePerDay === num
                          ? 'bg-surge-cyan/20 border-surge-cyan text-surge-cyan shadow-glow-cyan'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Type of energy drink (Sugar vs Zero) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Тип энергетиков
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsSugarFree(false)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    !isSugarFree
                      ? 'bg-gradient-to-br from-amber-500/20 to-red-500/10 border-surge-amber shadow-glow-amber text-white'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center justify-between">
                    С сахаром
                    <span className="text-xs text-surge-amber">~55 г/банка</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Расчет сэкономленного сахара и пустых калорий (220 ккал)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSugarFree(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSugarFree
                      ? 'bg-gradient-to-br from-surge-emerald/20 to-surge-cyan/10 border-surge-emerald shadow-glow-emerald text-white'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center justify-between">
                    Без сахара (Zero)
                    <ShieldCheck className="w-4 h-4 text-surge-emerald" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Фокус на защиту сосудов, почек, эмали зубов и ЖКТ
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Cost per portion */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Coins className="w-4 h-4 text-emerald-400" />
                Средняя стоимость банки / чашки (₽)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="5"
                  value={costPerPortion}
                  onChange={(e) => setCostPerPortion(Number(e.target.value))}
                  required
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white font-mono text-sm focus:border-surge-emerald focus:ring-1 focus:ring-surge-emerald transition-all"
                />
                <span className="absolute right-4 top-2.5 text-slate-400 font-mono text-sm">₽</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-surge-emerald via-emerald-400 to-surge-cyan hover:from-emerald-400 hover:to-cyan-400 shadow-glow-emerald transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                {submitButtonText}
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 flex items-center justify-center gap-1.5"
                >
                  Ознакомиться с демо-дашбордом
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
