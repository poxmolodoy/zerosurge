import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Achievement } from '../types';
import { AchievementsGrid } from './AchievementsGrid';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
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
        aria-label="Система достижений"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl p-4 sm:p-6 my-auto custom-scrollbar"
        >
          {/* Close button in top-right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <button
              onClick={onClose}
              aria-label="Закрыть достижения"
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Inner Grid */}
          <AchievementsGrid achievements={achievements} />
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default AchievementsModal;
