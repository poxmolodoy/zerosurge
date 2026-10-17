import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Activity,
  Dna,
  Stethoscope,
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { BioMilestone } from '../types';

interface MilestoneModalProps {
  milestone: BioMilestone | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  if (!milestone) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop: translucent frosted blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg glass-card rounded-2xl p-6 sm:p-8 text-white shadow-2xl z-10 border border-white/10 my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl border ${
                  milestone.isCompleted
                    ? 'bg-surge-emerald/20 border-surge-emerald/40 text-surge-emerald'
                    : 'bg-surge-cyan/20 border-surge-cyan/40 text-surge-cyan'
                }`}
              >
                {milestone.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Activity className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {milestone.durationLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {milestone.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar in Modal */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 mb-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Статус восстановления</span>
              <span
                className={`font-mono text-sm font-bold ${
                  milestone.isCompleted ? 'text-surge-emerald' : 'text-surge-cyan'
                }`}
              >
                {milestone.progressPercent}%{' '}
                {milestone.isCompleted ? '• Завершено' : '• В процессе'}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${milestone.progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  milestone.isCompleted
                    ? 'bg-gradient-to-r from-surge-emerald to-emerald-400 shadow-glow-emerald'
                    : 'bg-gradient-to-r from-surge-cyan to-surge-emerald shadow-glow-cyan'
                }`}
              />
            </div>
          </div>

          {/* Clinical Details */}
          <div className="space-y-4 text-xs sm:text-sm">
            {/* 1. Medical explanation */}
            <div className="space-y-1.5 bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Stethoscope className="w-4 h-4 text-surge-emerald" />
                Что происходит в теле
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {milestone.fullMedicalDescription}
              </p>
            </div>

            {/* 2. Biochemical effect */}
            <div className="space-y-1.5 bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Dna className="w-4 h-4 text-surge-cyan" />
                Биохимический механизм
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {milestone.biochemicalEffect}
              </p>
            </div>

            {/* 3. Symptoms */}
            <div className="space-y-1.5 bg-slate-900/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Sparkles className="w-4 h-4 text-surge-amber" />
                Что вы можете чувствовать
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">{milestone.currentSymptoms}</p>
            </div>

            {/* 4. Scientific Sources */}
            {milestone.sources && milestone.sources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <BookOpen className="w-3.5 h-3.5 text-surge-cyan" />
                  Научные источники
                </div>
                <div className="space-y-1.5">
                  {milestone.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-surge-cyan/40 text-xs text-slate-300 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-white group-hover:text-cyan-200 transition-colors">
                          {src.title} {src.year ? `(${src.year})` : ''}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-surge-cyan shrink-0 mt-0.5" />
                      </div>
                      {src.authors && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{src.authors}</div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Close CTA */}
          <div className="mt-6 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
            >
              Понятно
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
