import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  Minus,
  Plus,
  RefreshCw,
  Clock,
  Zap,
  Coffee,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

export interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRelapse: (count: number, itemType: 'energy' | 'coffee', isSugarFree: boolean) => void;
  currentCansAvoided: number;
  cansPerDay: number;
  coffeePerDay?: number;
  quitTimestamp: number;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  onClose,
  onConfirmRelapse,
  currentCansAvoided,
  cansPerDay,
  coffeePerDay = 1,
}) => {
  const [itemType, setItemType] = useState<'energy' | 'coffee'>('energy');
  const [isSugarFree, setIsSugarFree] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCount(1);
      setItemType('energy');
      setIsSugarFree(false);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validCansPerDay = Math.max(0.1, cansPerDay || 2);
  const validCoffeePerDay = Math.max(0, coffeePerDay ?? 1);

  // Calculate penalties based on selected item
  let penaltyHours: number;
  let equivalentCansDeduction: number;
  let caffeineDeductionMg: number;
  let sugarDeductionGrams: number;

  if (itemType === 'energy') {
    penaltyHours = (count * 24) / validCansPerDay;
    equivalentCansDeduction = count;
    caffeineDeductionMg = count * 160;
    sugarDeductionGrams = isSugarFree ? 0 : count * 55;
  } else {
    // Coffee
    if (validCoffeePerDay > 0) {
      penaltyHours = (count * 24) / validCoffeePerDay;
      equivalentCansDeduction = count * (validCansPerDay / validCoffeePerDay);
    } else {
      // 120mg coffee vs 160mg can (0.75 ratio)
      penaltyHours = ((count * 120) / 160) * (24 / validCansPerDay);
      equivalentCansDeduction = count * (120 / 160);
    }
    caffeineDeductionMg = count * 120;
    sugarDeductionGrams = 0;
  }

  const isTotalReset = equivalentCansDeduction >= currentCansAvoided;
  const remainingCans = isTotalReset
    ? 0
    : Math.max(0, currentCansAvoided - equivalentCansDeduction);

  const handleDecrement = () => {
    setCount((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleConfirm = () => {
    onConfirmRelapse(count, itemType, isSugarFree);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="relapse-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl glass-card rounded-3xl p-5 sm:p-8 text-white shadow-2xl z-10 border border-amber-500/30 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Ambient Header Glow */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-glow-ruby">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2
                  id="relapse-modal-title"
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                >
                  Фиксация срыва
                </h2>
                <p className="text-xs text-slate-400">
                  Честный учет: вычитаем выпитое из чистого прогресса
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-5 relative z-10">
            {/* 1. Item Type Selector: Energy Drink vs Coffee */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Что именно вы выпили?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setItemType('energy')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                    itemType === 'energy'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-amber'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-850'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Энергетик
                </button>

                <button
                  type="button"
                  onClick={() => setItemType('coffee')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                    itemType === 'coffee'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-amber'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-850'
                  }`}
                >
                  <Coffee className="w-4 h-4 text-amber-400" />
                  Кофе
                </button>
              </div>
            </div>

            {/* 2. Sugar Choice (Only for Energy Drink) */}
            {itemType === 'energy' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Вид энергетика:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSugarFree(false)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      !isSugarFree
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    🍬 С сахаром (~55г сахара)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSugarFree(true)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      isSugarFree
                        ? 'bg-surge-cyan/20 border-surge-cyan text-cyan-200 shadow-glow-cyan'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    🍃 Без сахара (Zero)
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
                {itemType === 'energy' ? 'Количество банок:' : 'Количество чашек:'}
              </label>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCount(preset)}
                    className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      count === preset
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-amber'
                        : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {preset}{' '}
                    {itemType === 'energy'
                      ? preset === 1
                        ? 'банка'
                        : 'банки'
                      : preset === 1
                        ? 'чашка'
                        : 'чашки'}
                  </button>
                ))}
              </div>

              {/* Stepper Input */}
              <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-2xl p-2 sm:p-2.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={count <= 1}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-white transition-colors"
                  aria-label="Уменьшить количество"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex items-baseline gap-1.5 text-center">
                  <span className="font-mono text-3xl font-extrabold text-white tabular-nums">
                    {count}
                  </span>
                  <span className="text-xs text-slate-400">
                    {itemType === 'energy'
                      ? count === 1
                        ? 'банка'
                        : count < 5
                          ? 'банки'
                          : 'банок'
                      : count === 1
                        ? 'чашка'
                        : count < 5
                          ? 'чашки'
                          : 'чашек'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                  aria-label="Увеличить количество"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. Live Impact Preview Card */}
            <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-surge-cyan" />
                  Расчет последствий для прогресса
                </span>
                {isTotalReset ? (
                  <span
                    data-testid="reset-warning-badge"
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  >
                    Полный сброс таймера
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Мягкий штраф
                  </span>
                )}
              </div>

              {/* Progress delta visual */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 pb-1">
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 mb-1">Было чистоты</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-slate-200">
                    {currentCansAvoided.toFixed(1)} <span className="text-xs">б.</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  <div className="text-[10px] text-amber-300 mb-1">Штраф</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-surge-amber">
                    -{equivalentCansDeduction.toFixed(1)} <span className="text-xs">б.</span>
                  </div>
                  <div className="text-[10px] text-amber-400/80 font-mono">
                    -{Math.round(penaltyHours)}ч
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-xl border ${
                    isTotalReset
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                      : 'bg-surge-emerald/10 border-surge-emerald/20 text-emerald-300'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 mb-1">Останется</div>
                  <div
                    data-testid="remaining-cans-preview"
                    className="font-mono text-base sm:text-lg font-bold"
                  >
                    {remainingCans.toFixed(1)} <span className="text-xs">б.</span>
                  </div>
                </div>
              </div>

              {/* Breakdown details */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>
                  Кофеин: <strong className="text-amber-300">+{caffeineDeductionMg} мг</strong>
                </span>
                {itemType === 'energy' && (
                  <span>
                    Сахар:{' '}
                    <strong
                      className={sugarDeductionGrams > 0 ? 'text-rose-300' : 'text-emerald-300'}
                    >
                      {sugarDeductionGrams > 0 ? `+${sugarDeductionGrams} г` : '0 г (Zero)'}
                    </strong>
                  </span>
                )}
              </div>

              {/* Contextual message */}
              <div className="text-xs text-slate-300 flex items-start gap-2">
                {isTotalReset ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      Штраф превышает или равен накопленному результату. Таймер чистоты начнется
                      заново с текущего момента.
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Откат на {Math.round(penaltyHours)} ч чистоты. Основная серия сохраняется!
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Supportive Note */}
            <div className="bg-surge-cyan/5 border border-surge-cyan/20 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <HeartHandshake className="w-4 h-4 text-surge-cyan shrink-0 mt-0.5" />
              <span>
                <strong>Помните:</strong> Срыв — это обратная связь, а не конец пути. Каждый час
                трезвости восстанавливает рецепторы. Продолжайте путь!
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-300 font-semibold text-sm transition-colors order-2 sm:order-1"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-glow-amber transition-all transform active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Подтвердить срыв
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
