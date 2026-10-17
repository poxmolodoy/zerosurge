import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertOctagon, CheckSquare, Square, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { getWithdrawalPhase } from '../data/withdrawalPhases';
import { UrgeTimer } from './UrgeTimer';
import { BoxBreathing } from './BoxBreathing';

interface SosModalProps {
  isOpen: boolean;
  daysElapsed: number;
  onClose: () => void;
}

const DEFAULT_SUBSTITUTIONS = [
  { id: 'water', text: 'Выпить большой стакан (400–500 мл) ледяной воды залпом' },
  { id: 'face', text: 'Умыть лицо холодной водой или подержать запястья под струей 30 сек' },
  { id: 'snack', text: 'Съесть сочное яблоко, горсть орехов или кусочек белка (сыр/яйцо)' },
  { id: 'squats', text: 'Сделать 15-20 приседаний для выброса эндорфинов и разгона крови' },
];

export const SosModal: React.FC<SosModalProps> = ({ isOpen, daysElapsed, onClose }) => {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const phaseInfo = getWithdrawalPhase(daysElapsed);

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

  const toggleCheck = (id: string) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop with darker tint for SOS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl p-5 sm:p-8 text-white shadow-2xl z-10 border border-amber-500/30 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-surge-amber border border-surge-amber/40 shadow-glow-amber animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-surge-amber uppercase tracking-wider">
                    Экстренная поддержка
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                    {phaseInfo.dayRange}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Хочу сорваться / Острая тяга
                </h2>
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

          <div className="space-y-6">
            {/* 1. Day-Specific Symptom Analysis */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/80 rounded-2xl p-5 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-surge-amber">
                <Info className="w-4 h-4" />
                Что происходит прямо сейчас: {phaseInfo.title}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {phaseInfo.symptomExplanation}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-surge-cyan shrink-0 mt-0.5" />
                <span>
                  <strong>Научный факт:</strong> {phaseInfo.scientificFact}
                </span>
              </div>
            </div>

            {/* 2. Urge Surfing 10-Minute Timer */}
            <UrgeTimer />

            {/* 3. Interactive Box Breathing */}
            <BoxBreathing />

            {/* 4. Quick Substitution Checklist */}
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-surge-emerald" />
                Чек-лист быстрой физической замены (сделайте 2 любых действия)
              </h4>

              <div className="space-y-2">
                {DEFAULT_SUBSTITUTIONS.map((item) => {
                  const isChecked = completedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isChecked
                          ? 'bg-surge-emerald/10 border-surge-emerald/40 text-emerald-200'
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/15'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-surge-emerald shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm ${isChecked ? 'line-through opacity-80' : ''}`}
                      >
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold text-sm transition-all"
              >
                Я в порядке, тяга отпустила
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
