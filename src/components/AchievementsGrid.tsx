import { motion } from 'framer-motion';
import {
  Trophy,
  Clock,
  ShieldCheck,
  Moon,
  Brain,
  ZapOff,
  HeartPulse,
  Coins,
  Lock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement } from '../types';

interface AchievementsGridProps {
  achievements: Achievement[];
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({ achievements }) => {
  const getIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? 'text-surge-emerald' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Clock':
        return <Clock className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'ZapOff':
        return <ZapOff className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      default:
        return <Trophy className={className} />;
    }
  };

  const handleCardClick = (ach: Achievement) => {
    if (ach.unlocked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#06B6D4', '#F59E0B'],
      });
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-surge-amber" />
            Система достижений
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ваши победы над кофеиновой зависимостью и стимуляторами
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono font-bold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-surge-amber" />
          <span className="text-surge-emerald">{unlockedCount}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300">{achievements.length} разблокировано</span>
        </div>
      </div>

      {/* Grid of 8 badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          return (
            <motion.div
              key={ach.id}
              onClick={() => handleCardClick(ach)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 border-surge-emerald/40 shadow-glow-emerald'
                  : 'bg-slate-900/40 border-white/5 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Top Row: Icon + Badge status */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-3 rounded-xl border ${
                    ach.unlocked
                      ? 'bg-surge-emerald/20 border-surge-emerald/40'
                      : 'bg-slate-800/80 border-white/10'
                  }`}
                >
                  {getIcon(ach.iconName, ach.unlocked)}
                </div>

                {ach.unlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-surge-emerald bg-surge-emerald/10 border border-surge-emerald/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Открыто
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Закрыто
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-3">
                <h4 className="font-bold text-sm sm:text-base text-white">{ach.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
              </div>

              {/* Bottom: Requirement or progress */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mb-1">
                  <span>{ach.requirementLabel}</span>
                  <span>{Math.round(ach.progressPercent)}%</span>
                </div>
                {!ach.unlocked && (
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-surge-cyan/60 rounded-full"
                      style={{ width: `${ach.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
