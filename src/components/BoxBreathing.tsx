import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASE_DETAILS: Record<BreathingPhase, { label: string; instruction: string; color: string }> =
  {
    inhale: {
      label: 'Вдох',
      instruction: 'Медленный глубокий вдох через нос (4 сек)',
      color: 'text-surge-cyan',
    },
    hold1: {
      label: 'Задержка',
      instruction: 'Задержите воздух в легких (4 сек)',
      color: 'text-surge-emerald',
    },
    exhale: {
      label: 'Выдох',
      instruction: 'Плавный полный выдох через рот (4 сек)',
      color: 'text-surge-amber',
    },
    hold2: {
      label: 'Пауза',
      instruction: 'Спокойная задержка на выдохе (4 сек)',
      color: 'text-slate-300',
    },
  };

const PHASE_SEQUENCE: BreathingPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];

export const BoxBreathing: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const currentPhase = PHASE_SEQUENCE[phaseIndex];
  const { label, instruction, color } = PHASE_DETAILS[currentPhase];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            setPhaseIndex((curIdx) => {
              const nextIdx = (curIdx + 1) % PHASE_SEQUENCE.length;
              if (nextIdx === 0) {
                setCyclesCompleted((c) => c + 1);
              }
              return nextIdx;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
        <Wind className="w-4 h-4 text-surge-cyan" />
        Дыхание по квадрату 4–4–4 (Box Breathing)
      </div>

      {/* Visual Animated Breathing Box */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        {/* Outer Frame with glow */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-2xl" />

        {/* Dynamic expanding/contracting square */}
        <motion.div
          animate={{
            scale:
              currentPhase === 'inhale'
                ? 1.25
                : currentPhase === 'hold1'
                  ? 1.25
                  : currentPhase === 'exhale'
                    ? 0.75
                    : 0.75,
            opacity:
              currentPhase === 'inhale'
                ? 1
                : currentPhase === 'hold1'
                  ? 0.9
                  : currentPhase === 'exhale'
                    ? 0.6
                    : 0.5,
            borderColor:
              currentPhase === 'inhale'
                ? '#06B6D4'
                : currentPhase === 'hold1'
                  ? '#10B981'
                  : currentPhase === 'exhale'
                    ? '#F59E0B'
                    : 'rgba(255, 255, 255, 0.2)',
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-2xl border-2 bg-gradient-to-br from-white/5 to-white/0 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm"
        >
          <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
          <span className="font-mono text-3xl font-extrabold text-white mt-1">{secondsLeft}</span>
        </motion.div>
      </div>

      <p className="text-xs text-slate-300 max-w-xs h-8 flex items-center justify-center">
        {instruction}
      </p>

      {/* Controls & Cycle Counter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`py-2 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
            isActive
              ? 'bg-amber-500/20 text-surge-amber border border-surge-amber'
              : 'bg-surge-emerald hover:bg-emerald-400 text-slate-950 shadow-glow-emerald'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" /> Пауза
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Начать дыхание
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
          title="Сброс"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {cyclesCompleted > 0 && (
          <span className="text-xs font-mono text-slate-400 pl-2">
            Циклов: <span className="text-surge-emerald font-bold">{cyclesCompleted}</span>
          </span>
        )}
      </div>
    </div>
  );
};
