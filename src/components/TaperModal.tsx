import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingDown,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import {
  TaperPlan,
  ConsumptionEntry,
  DEFAULT_CAFFEINE_PRESETS,
  calculateTaperProgress,
  CaffeineItemPreset,
} from '../utils/taper';

interface TaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  taperPlan: TaperPlan;
  consumptionLog: ConsumptionEntry[];
  onSaveTaperPlan: (plan: TaperPlan) => void;
  onAddConsumption: (entry: {
    type: 'energy' | 'coffee' | 'tea' | 'other';
    title: string;
    volumeMl: number;
    caffeineMg: number;
    date?: string;
  }) => void;
  onDeleteConsumption: (id: string) => void;
}

export const TaperModal: React.FC<TaperModalProps> = ({
  isOpen,
  onClose,
  taperPlan,
  consumptionLog,
  onSaveTaperPlan,
  onAddConsumption,
  onDeleteConsumption,
}) => {
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [startMg, setStartMg] = useState(taperPlan.startDailyMg || 350);
  const [durationDays, setDurationDays] = useState(taperPlan.durationDays || 21);
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMg, setCustomMg] = useState(100);
  const [customMl, setCustomMl] = useState(250);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const progress = calculateTaperProgress(taperPlan, consumptionLog, today);
  const todayEntries = consumptionLog.filter((entry) => entry.date === today);

  const handleToggleTaper = () => {
    const updated: TaperPlan = {
      ...taperPlan,
      isActive: !taperPlan.isActive,
      startDate: !taperPlan.isActive ? new Date().toISOString() : taperPlan.startDate,
      startDailyMg: startMg,
      durationDays: durationDays,
      targetDailyMg: 0,
    };
    onSaveTaperPlan(updated);
    setIsEditingPlan(false);
  };

  const handleSavePlanParams = () => {
    const updated: TaperPlan = {
      ...taperPlan,
      isActive: true,
      startDate: taperPlan.isActive ? taperPlan.startDate : new Date().toISOString(),
      startDailyMg: Math.max(50, Math.min(2000, Number(startMg) || 300)),
      durationDays: Math.max(7, Math.min(90, Number(durationDays) || 14)),
      targetDailyMg: 0,
    };
    onSaveTaperPlan(updated);
    setIsEditingPlan(false);
  };

  const handleAddPreset = (preset: CaffeineItemPreset) => {
    onAddConsumption({
      type: preset.category,
      title: preset.name,
      volumeMl: preset.defaultVolumeMl,
      caffeineMg: preset.defaultCaffeineMg,
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddConsumption({
      type: 'other',
      title: customTitle.trim(),
      volumeMl: Math.max(10, Math.min(3000, Number(customMl) || 250)),
      caffeineMg: Math.max(5, Math.min(1500, Number(customMg) || 80)),
    });
    setCustomTitle('');
    setShowCustomAdd(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl glass-card rounded-3xl p-4 sm:p-8 text-white shadow-2xl z-10 border border-white/10 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6 gap-3">
            <div className="flex items-start gap-3 sm:gap-3.5 min-w-0 flex-1">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-surge-cyan/20 text-surge-cyan border border-white/10 shadow-md shrink-0 mt-0.5">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-surge-cyan" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    Журнал кофеина и Tapering
                  </h3>
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-surge-cyan/20 text-surge-cyan px-2.5 py-0.5 rounded-full border border-surge-cyan/30 shrink-0">
                    Режим снижения
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-snug">
                  Постепенное снижение суточной дозы вместо резкого стресса для нервной системы
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-colors shadow-md shrink-0 active:scale-95"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Taper Plan Overview / Setup */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 space-y-4 shadow-inner">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-sm font-medium text-slate-400">
                  Статус программы снижения:
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      taperPlan.isActive ? 'bg-surge-emerald animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-x-1.5 leading-snug">
                    {taperPlan.isActive ? (
                      <>
                        <span>
                          День {progress.dayNumber} из {progress.totalDays}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                          (Лимит: {progress.dailyLimitMg}&nbsp;мг/день)
                        </span>
                      </>
                    ) : (
                      'Режим постепенного снижения выключен'
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {taperPlan.isActive && (
                  <button
                    onClick={() => setIsEditingPlan(!isEditingPlan)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 border border-white/10 transition-all shadow-sm"
                  >
                    {isEditingPlan ? 'Скрыть параметры' : 'Настроить'}
                  </button>
                )}
                <button
                  onClick={handleToggleTaper}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${
                    taperPlan.isActive
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-surge-cyan text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  {taperPlan.isActive ? 'Остановить Taper' : 'Включить Tapering'}
                </button>
              </div>
            </div>

            {/* Plan Configuration Form (When editing or configuring) */}
            {isEditingPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-white/10 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-200 block mb-1.5">
                      Стартовая доза (мг в день):
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1500}
                      value={startMg}
                      onChange={(e) => setStartMg(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-base text-white font-mono focus:border-surge-cyan focus:outline-none"
                    />
                    <span className="text-xs text-slate-400 mt-1 block">
                      EFSA рекомендует до 400 мг/сутки для взрослых
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-200 block mb-1.5">
                      Длительность снижения (дней):
                    </label>
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-base text-white focus:border-surge-cyan focus:outline-none"
                    >
                      <option value={14}>2 недели (14 дней) — умеренный темп</option>
                      <option value={21}>3 недели (21 день) — плавный темп</option>
                      <option value={28}>4 недели (28 дней) — мягкий темп</option>
                      <option value={42}>6 недель (42 дня) — при высоких дозах</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSavePlanParams}
                  className="w-full py-2.5 bg-surge-emerald text-slate-950 text-sm font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  Сохранить параметры программы
                </button>
              </motion.div>
            )}

            {/* Daily Taper Meter */}
            {taperPlan.isActive && (
              <div className="pt-2 space-y-2.5">
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-slate-200">
                    Сегодня потреблено:{' '}
                    <strong className="font-mono text-white text-xs sm:text-base whitespace-nowrap">
                      {progress.consumedMg}&nbsp;мг
                    </strong>
                  </span>
                  <span className="text-slate-200 text-right">
                    Лимит дня:{' '}
                    <strong className="font-mono text-surge-cyan text-xs sm:text-base whitespace-nowrap">
                      {progress.dailyLimitMg}&nbsp;мг
                    </strong>
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress.isExceeded
                        ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : 'bg-gradient-to-r from-surge-cyan to-surge-emerald'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        progress.dailyLimitMg > 0
                          ? (progress.consumedMg / progress.dailyLimitMg) * 100
                          : progress.consumedMg > 0
                            ? 100
                            : 0
                      )}%`,
                    }}
                  />
                </div>

                {progress.isExceeded ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs sm:text-sm text-red-200">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>
                      Лимит на сегодня превышен на{' '}
                      <span className="font-bold whitespace-nowrap">
                        {progress.consumedMg - progress.dailyLimitMg}&nbsp;мг
                      </span>
                      . Рекомендуется сделать паузу и перейти на воду или травяной чай.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-slate-300 gap-1 sm:gap-2">
                    <span className="whitespace-nowrap">
                      Остаток на сегодня:{' '}
                      <strong className="text-surge-emerald font-mono font-bold whitespace-nowrap">
                        {progress.remainingMg}&nbsp;мг
                      </strong>
                    </span>
                    <span className="text-slate-400 whitespace-nowrap">
                      Цель: 0&nbsp;мг к концу срока
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Quick Add Beverage Presets */}
          <div className="space-y-3.5 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-surge-cyan" />
                Добавить выпитую порцию
              </h4>
              <button
                onClick={() => setShowCustomAdd(!showCustomAdd)}
                className="text-sm text-surge-cyan hover:underline font-semibold"
              >
                {showCustomAdd ? 'Скрыть свою дозу' : '+ Ввести вручную'}
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEFAULT_CAFFEINE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleAddPreset(preset)}
                  className="p-3.5 sm:p-4 bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 hover:border-surge-cyan/50 rounded-2xl text-left transition-all group flex flex-col justify-between shadow-md active:scale-95"
                >
                  <div>
                    <div className="text-xs sm:text-base font-bold text-white group-hover:text-surge-cyan transition-colors leading-snug">
                      {preset.name}
                    </div>
                    <div className="text-[11px] sm:text-sm font-medium text-slate-400 mt-1">
                      {preset.defaultVolumeMl} мл
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs sm:text-base font-bold text-surge-emerald whitespace-nowrap shrink-0">
                      +{preset.defaultCaffeineMg}&nbsp;мг
                    </span>
                    <a
                      href={preset.source.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] sm:text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ml-auto"
                      title={preset.source.title}
                    >
                      EFSA <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                    </a>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Entry Form */}
            {showCustomAdd && (
              <form
                onSubmit={handleAddCustom}
                className="p-4 sm:p-5 bg-slate-950/80 rounded-2xl border border-surge-cyan/40 space-y-3.5 shadow-lg"
              >
                <div className="text-sm font-bold text-slate-100">Пользовательский напиток</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Название (напр. Monster Zero)"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-surge-cyan"
                  />
                  <input
                    type="number"
                    min={10}
                    max={3000}
                    placeholder="Объем (мл)"
                    value={customMl}
                    onChange={(e) => setCustomMl(Number(e.target.value))}
                    className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-surge-cyan"
                  />
                  <input
                    type="number"
                    min={1}
                    max={1500}
                    placeholder="Кофеин (мг)"
                    value={customMg}
                    onChange={(e) => setCustomMg(Number(e.target.value))}
                    className="bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-surge-cyan"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-surge-cyan text-slate-950 text-sm font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-md"
                >
                  Зафиксировать порцию
                </button>
              </form>
            )}
          </div>

          {/* Section 3: Today's Consumption History */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Журнал за сегодня ({todayEntries.length} записей)
            </h4>

            {todayEntries.length === 0 ? (
              <div className="text-center py-7 px-4 bg-slate-900/50 rounded-2xl border border-white/5 space-y-1.5">
                <div className="flex justify-center text-surge-emerald mb-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-base font-semibold text-slate-200">За сегодня записей нет</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Вы сохраняете чистоту рецепторов и нервной системы!
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-white/10 rounded-2xl text-sm hover:border-white/20 transition-all shadow-sm"
                  >
                    <div>
                      <div className="font-semibold text-slate-100 text-sm sm:text-base">
                        {entry.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {entry.volumeMl} мл •{' '}
                        {new Date(entry.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono font-bold text-surge-amber text-sm sm:text-base whitespace-nowrap">
                        +{entry.caffeineMg}&nbsp;мг
                      </span>
                      <button
                        onClick={() => onDeleteConsumption(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Удалить запись"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scientific Disclaimer Footer */}
          <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-surge-emerald" />
              Все данные хранятся только локально
            </span>
            <span title="Европейское агентство по безопасности продуктов питания">
              Нормативы доз: EFSA 2015 Scientific Opinion
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaperModal;
