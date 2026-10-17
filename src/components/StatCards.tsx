import { motion } from 'framer-motion';
import { Coins, ZapOff, ShieldCheck, HeartPulse, Flame } from 'lucide-react';
import { AppStats, UserProfile } from '../types';

interface StatCardsProps {
  stats: AppStats;
  profile: UserProfile;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, profile }) => {
  // Format Russian currency with grouping
  const formattedMoney = Math.floor(stats.moneySaved).toLocaleString('ru-RU');

  // Format caffeine avoided in g or mg
  const formatCaffeine = (mg: number) => {
    if (mg >= 1000) {
      const grams = (mg / 1000).toFixed(1);
      return { main: `${grams} г`, sub: `${Math.round(mg)} мг кофеина` };
    }
    return { main: `${Math.round(mg)} мг`, sub: 'чистого алкалоида' };
  };

  const caffeineData = formatCaffeine(stats.caffeineAvoidedMg);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Money Saved */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/10 hover:border-surge-emerald/40 hover:shadow-glow-emerald transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Сэкономлено денег
          </span>
          <div className="p-2 rounded-xl bg-surge-emerald/10 text-surge-emerald border border-surge-emerald/20">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formattedMoney} <span className="text-surge-emerald text-xl font-bold">₽</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Расчет по {profile.costPerPortion} ₽ за порцию
        </p>
      </motion.div>

      {/* 2. Portions Avoided */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/10 hover:border-surge-amber/40 hover:shadow-glow-amber transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Не выпито порций
          </span>
          <div className="p-2 rounded-xl bg-surge-amber/10 text-surge-amber border border-surge-amber/20">
            <ZapOff className="w-5 h-5" />
          </div>
        </div>
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {stats.cansAvoided.toFixed(1)}{' '}
          <span className="text-surge-amber text-lg font-bold">банок</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {profile.coffeePerDay > 0
            ? `+ ${stats.cupsAvoided.toFixed(1)} чашек кофе избежано`
            : 'Токсических доз стимулятора'}
        </p>
      </motion.div>

      {/* 3. Caffeine Avoided */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/10 hover:border-surge-cyan/40 hover:shadow-glow-cyan transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Избежано кофеина
          </span>
          <div className="p-2 rounded-xl bg-surge-cyan/10 text-surge-cyan border border-surge-cyan/20">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {caffeineData.main}
        </div>
        <p className="text-xs text-slate-400 mt-1">{caffeineData.sub} (норма 160 мг/банка)</p>
      </motion.div>

      {/* 4. Sugar & Calories OR Dental/Vessel Protection */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/10 hover:border-emerald-400/40 hover:shadow-glow-emerald transition-all relative overflow-hidden"
      >
        {profile.isSugarFree ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Защита эмали и сосудов
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              Режим Zero <span className="text-xs text-emerald-400 font-normal">активен</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Слизистая желудка и почки защищены от ортофосфорной кислоты и подсластителей
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Не съедено сахара
              </span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {Math.round(stats.sugarAvoidedGrams)}{' '}
              <span className="text-red-400 text-lg font-bold">г</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Минус {Math.round(stats.caloriesAvoidedKcal)} пустых ккал (~55г в банке)
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};
