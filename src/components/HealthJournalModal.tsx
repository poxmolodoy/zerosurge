import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { DailyCheckIn } from '../types';
import { DailyCheckInCard } from './DailyCheckInCard';
import { FeelingChart } from './FeelingChart';

interface HealthJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIns: DailyCheckIn[];
  onAddCheckIn: (energy: number, sleep: number, craving: number) => void;
}

export const HealthJournalModal: React.FC<HealthJournalModalProps> = ({
  isOpen,
  onClose,
  checkIns,
  onAddCheckIn,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xl"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Дневник самочувствия и динамика"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl p-4 sm:p-6 my-auto custom-scrollbar space-y-6"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-surge-cyan/10 border border-surge-cyan/20 text-surge-cyan">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Дневник самочувствия и динамика
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Фиксируйте самочувствие и отслеживайте графики восстановления рецепторов
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Закрыть дневник"
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2-Column Layout: Daily Check-In + Feeling Dynamic Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <DailyCheckInCard checkIns={checkIns} onAddCheckIn={onAddCheckIn} />
            <FeelingChart checkIns={checkIns} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default HealthJournalModal;
