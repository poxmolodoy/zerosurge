import { useState } from 'react';
import { Zap, Moon, Flame, CheckCircle2, Calendar } from 'lucide-react';
import { DailyCheckIn } from '../types';

interface DailyCheckInCardProps {
  checkIns: DailyCheckIn[];
  onAddCheckIn: (energy: number, sleep: number, craving: number) => void;
}

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({ checkIns, onAddCheckIn }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = checkIns.find((c) => c.date === today);

  const [energy, setEnergy] = useState<number>(todayEntry?.energy ?? 3);
  const [sleep, setSleep] = useState<number>(todayEntry?.sleep ?? 3);
  const [craving, setCraving] = useState<number>(todayEntry?.craving ?? 2);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCheckIn(energy, sleep, craving);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const renderRatingButtons = (
    value: number,
    onChange: (val: number) => void,
    activeColorClass: string,
    activeBorderClass: string
  ) => {
    return (
      <div className="flex gap-2 w-full">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              value === score
                ? `${activeColorClass} ${activeBorderClass} shadow-md`
                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/15 hover:text-white'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-surge-cyan" />
            Как вы чувствуете себя сегодня?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ежедневный чек-ин для построения графика вашей адаптации
          </p>
        </div>

        {todayEntry && (
          <span className="text-xs text-surge-emerald bg-surge-emerald/10 border border-surge-emerald/20 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Зафиксировано за сегодня
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Metric 1: Energy */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold gap-2">
            <span className="text-slate-200 flex items-center gap-1.5 font-semibold">
              <Zap className="w-4 h-4 text-surge-cyan shrink-0" />
              <span>Уровень энергии</span>
            </span>
            <span className="shrink-0 whitespace-nowrap font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-surge-cyan/15 border border-surge-cyan/30 text-surge-cyan">
              {energy} из 5
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-normal pl-[22px] leading-snug">
            (1 = упадок сил, 5 = естественный драйв)
          </p>
          {renderRatingButtons(
            energy,
            setEnergy,
            'bg-surge-cyan/20 text-surge-cyan',
            'border-surge-cyan'
          )}
        </div>

        {/* Metric 2: Sleep */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold gap-2">
            <span className="text-slate-200 flex items-center gap-1.5 font-semibold">
              <Moon className="w-4 h-4 text-surge-emerald shrink-0" />
              <span>Качество сна</span>
            </span>
            <span className="shrink-0 whitespace-nowrap font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-surge-emerald/15 border border-surge-emerald/30 text-surge-emerald">
              {sleep} из 5
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-normal pl-[22px] leading-snug">
            (1 = бессонница/кошмары, 5 = глубокий непрерывный сон)
          </p>
          {renderRatingButtons(
            sleep,
            setSleep,
            'bg-surge-emerald/20 text-surge-emerald',
            'border-surge-emerald'
          )}
        </div>

        {/* Metric 3: Craving */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold gap-2">
            <span className="text-slate-200 flex items-center gap-1.5 font-semibold">
              <Flame className="w-4 h-4 text-surge-amber shrink-0" />
              <span>Тяга к энергетику / кофеину</span>
            </span>
            <span className="shrink-0 whitespace-nowrap font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-surge-amber/15 border border-surge-amber/30 text-surge-amber">
              {craving} из 5
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-normal pl-[22px] leading-snug">
            (1 = нет тяги, 5 = очень сильная)
          </p>
          {renderRatingButtons(
            craving,
            setCraving,
            'bg-surge-amber/20 text-surge-amber',
            'border-surge-amber'
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-surge-cyan via-emerald-400 to-surge-emerald hover:opacity-90 shadow-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                Сохранено в дневнике!
              </>
            ) : todayEntry ? (
              'Обновить показатели за сегодня'
            ) : (
              'Зафиксировать за сегодня'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
