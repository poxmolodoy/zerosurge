import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, ShieldCheck } from 'lucide-react';

export const UrgeTimer: React.FC = () => {
  const TOTAL_SECONDS = 600; // 10 minutes
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-surge-amber shrink-0" />
          <span>Таймер откладывания тяги</span>
        </div>
        <span className="text-[11px] font-mono text-surge-amber bg-surge-amber/10 border border-surge-amber/20 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 text-center">
          Техника Urge Surfing
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
              {formatTime}
            </span>
            <span className="text-xs font-medium text-slate-400">(10 минут)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
            Пик нейронного импульса тяги длится всего 7-10 минут. Переждите эту волну.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isRunning
                ? 'bg-amber-500/20 text-surge-amber border border-surge-amber'
                : 'bg-surge-amber hover:bg-amber-400 text-slate-950 shadow-glow-amber'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Пауза
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Старт
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Сбросить на 10:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-surge-amber to-surge-emerald rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {secondsLeft === 0 && (
        <div className="bg-surge-emerald/10 border border-surge-emerald/30 rounded-xl p-3 flex items-center gap-2 text-xs text-surge-emerald font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Волна преодолена! Острая тяга угасла. Вы сохранили свою свободу.
        </div>
      )}
    </div>
  );
};
