import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  HeartPulse,
  Moon,
  Brain,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { BioMilestone } from '../types';
import { MilestoneModal } from './MilestoneModal';

interface BioTimelineProps {
  milestones: BioMilestone[];
}

export const BioTimeline: React.FC<BioTimelineProps> = ({ milestones }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<BioMilestone | null>(null);

  const getCategoryIcon = (category: BioMilestone['category'], isCompleted: boolean) => {
    const className = `w-5 h-5 ${isCompleted ? 'text-surge-emerald' : 'text-surge-cyan'}`;
    switch (category) {
      case 'detox':
        return <Droplets className={className} />;
      case 'cardio':
        return <HeartPulse className={className} />;
      case 'sleep':
        return <Moon className={className} />;
      case 'neuro':
        return <Brain className={className} />;
      case 'metabolic':
        return <Sparkles className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-surge-emerald" />
            Био-прогресс восстановления организма
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Физиологическая регенерация органов и нейромедиаторных систем
          </p>
        </div>
        <span className="text-xs text-slate-400 italic">
          Нажмите на карточку для медицинского пояснения
        </span>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((m, index) => {
          return (
            <motion.button
              key={m.id}
              onClick={() => setSelectedMilestone(m)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-white/15 transition-all group flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Row 1: Header */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      m.isCompleted
                        ? 'bg-surge-emerald/10 border-surge-emerald/30'
                        : 'bg-slate-800/80 border-white/10 group-hover:border-surge-cyan/30'
                    }`}
                  >
                    {m.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-surge-emerald" />
                    ) : (
                      getCategoryIcon(m.category, m.isCompleted)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                        {m.durationLabel}
                      </span>
                      {m.isCompleted && (
                        <span className="text-[11px] font-semibold text-surge-emerald bg-surge-emerald/10 border border-surge-emerald/20 px-2 py-0.5 rounded-full">
                          Завершено
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-white mt-1 group-hover:text-surge-cyan transition-colors">
                      {m.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-white">
                    {m.progressPercent}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Row 2: Short description */}
              <p className="text-xs text-slate-400 pl-1">{m.shortDescription}</p>

              {/* Row 3: Progress Bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.progressPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full transition-all ${
                    m.isCompleted
                      ? 'bg-gradient-to-r from-surge-emerald to-emerald-400 shadow-glow-emerald'
                      : m.progressPercent > 0
                        ? 'bg-gradient-to-r from-surge-amber via-surge-cyan to-surge-emerald shadow-glow-cyan'
                        : 'bg-slate-700'
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Modal with detailed medical info */}
      <MilestoneModal milestone={selectedMilestone} onClose={() => setSelectedMilestone(null)} />
    </div>
  );
};
