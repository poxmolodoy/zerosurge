import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Activity,
  Brain,
  Flame,
  AlertCircle,
  Droplet,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { CaffeineHarmItem } from '../data/caffeineHarmData';

interface HarmDetailModalProps {
  item: CaffeineHarmItem | null;
  onClose: () => void;
}

export const HarmDetailModal: React.FC<HarmDetailModalProps> = ({ item, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const renderOrganIcon = (type: CaffeineHarmItem['iconType']) => {
    const className = 'w-6 h-6';
    switch (type) {
      case 'heart':
        return <Activity className={`${className} text-rose-400`} />;
      case 'brain':
        return <Brain className={`${className} text-surge-cyan`} />;
      case 'flame':
        return <Flame className={`${className} text-surge-amber`} />;
      case 'stomach':
        return <AlertCircle className={`${className} text-rose-400`} />;
      case 'kidney':
        return <Droplet className={`${className} text-surge-cyan`} />;
      case 'dental':
        return <Sparkles className={`${className} text-surge-emerald`} />;
      default:
        return <Activity className={`${className} text-white`} />;
    }
  };

  const getBadgeStyle = (color: CaffeineHarmItem['badgeColor']) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'amber':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'cyan':
        return 'bg-surge-cyan/15 border-surge-cyan/30 text-cyan-200';
      case 'emerald':
        return 'bg-surge-emerald/15 border-surge-emerald/30 text-emerald-200';
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop: translucent frosted blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="harm-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl p-5 sm:p-8 text-white shadow-2xl z-10 border border-white/10 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 mb-5 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 shadow-inner">
                {renderOrganIcon(item.iconType)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {item.systemName}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                      item.badgeColor
                    )}`}
                  >
                    {item.badgeLabel}
                  </span>
                </div>
                <h2 id="harm-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {item.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Закрыть справку"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 1. Biochemical Mechanism */}
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Activity className="w-4 h-4 text-surge-cyan" />
                Биохимический механизм поражения
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.clinicalMechanism}
              </p>
            </div>

            {/* 2. Symptoms List */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-surge-amber" />
                Клинические симптомы хронической интоксикации
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.symptoms.map((symptom, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300 leading-snug"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Reversibility & Timeline */}
            <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-slate-900/90 rounded-2xl p-5 border border-surge-emerald/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-surge-emerald" />
                Обратимость и сроки регенерации при отказе
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.reversibilityTimeline}
              </p>
            </div>

            {/* 4. Scientific Sources */}
            {item.sources && item.sources.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <BookOpen className="w-4 h-4 text-surge-cyan" />
                  Научные источники и доказательная база
                </div>
                <div className="space-y-2">
                  {item.sources.map((src, idx) => (
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

            {/* Medical Citation summary */}
            {item.medicalCitation && (
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Клинический источник:</strong> {item.medicalCitation}
                </span>
              </div>
            )}

            {/* Action Close */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-surge-emerald" />
                Понятно, закрыть справку
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
