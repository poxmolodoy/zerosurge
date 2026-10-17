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
          className="relative w-full max-w-2xl glass-card rounded-2xl p-5 sm:p-7 text-white shadow-2xl z-10 border border-white/10 my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-surge-cyan/20 text-surge-cyan border border-white/10">
                <TrendingDown className="w-5 h-5 text-surge-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Журнал кофеина и Tapering
                  <span className="text-[10px] font-normal uppercase tracking-wider bg-surge-cyan/20 text-surge-cyan px-2 py-0.5 rounded-full border border-surge-cyan/30">
                    Режим снижения
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Постепенное снижение суточной дозы вместо резкого стресса для нервной системы
                </p>
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

          {/* Section 1: Taper Plan Overview / Setup */}
          <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-white/10 mb-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs text-slate-400">Статус программы снижения:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      taperPlan.isActive ? 'bg-surge-emerald animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-sm font-bold text-white">
                    {taperPlan.isActive
                      ? `День ${progress.dayNumber} из ${progress.totalDays} (Лимит: ${progress.dailyLimitMg} мг/день)`
                      : 'Режим постепенного снижения выключен'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {taperPlan.isActive && (
                  <button
                    onClick={() => setIsEditingPlan(!isEditingPlan)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 transition-all"
                  >
                    {isEditingPlan ? 'Скрыть параметры' : 'Настроить'}
                  </button>
                )}
                <button
                  onClick={handleToggleTaper}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
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
                className="pt-3 border-t border-white/10 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Стартовая доза (мг в день):
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1500}
                      value={startMg}
                      onChange={(e) => setStartMg(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-surge-cyan focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      EFSA рекомендует до 400 мг/сутки для взрослых
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Длительность снижения (дней):
                    </label>
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-surge-cyan focus:outline-none"
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
                  className="w-full py-2 bg-surge-emerald text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  Сохранить параметры программы
                </button>
              </motion.div>
            )}

            {/* Daily Taper Meter */}
            {taperPlan.isActive && (
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">
                    Сегодня потреблено:{' '}
                    <strong className="font-mono text-white">{progress.consumedMg} мг</strong>
                  </span>
                  <span className="text-slate-300">
                    Лимит дня:{' '}
                    <strong className="font-mono text-surge-cyan">
                      {progress.dailyLimitMg} мг
                    </strong>
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
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
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-red-950/50 border border-red-500/40 text-[11px] text-red-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>
                      Лимит на сегодня превышен на {progress.consumedMg - progress.dailyLimitMg} мг.
                      Рекомендуется сделать паузу и перейти на воду или травяной чай.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Остаток на сегодня:{' '}
                      <strong className="text-surge-emerald font-mono">
                        {progress.remainingMg} мг
                      </strong>
                    </span>
                    <span>Цель: 0 мг к концу срока</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Quick Add Beverage Presets */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-surge-cyan" />
                Добавить выпитую порцию
              </h4>
              <button
                onClick={() => setShowCustomAdd(!showCustomAdd)}
                className="text-xs text-surge-cyan hover:underline font-medium"
              >
                {showCustomAdd ? 'Скрыть свою дозу' : '+ Ввести вручную'}
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_CAFFEINE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleAddPreset(preset)}
                  className="p-3 bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-surge-cyan/40 rounded-xl text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-surge-cyan transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {preset.defaultVolumeMl} мл
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-surge-emerald">
                      +{preset.defaultCaffeineMg} мг
                    </span>
                    <a
                      href={preset.source.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-slate-500 hover:text-slate-300 flex items-center gap-0.5"
                      title={preset.source.title}
                    >
                      EFSA 2015 <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Entry Form */}
            {showCustomAdd && (
              <form
                onSubmit={handleAddCustom}
                className="p-4 bg-slate-950/70 rounded-xl border border-surge-cyan/30 space-y-3"
              >
                <div className="text-xs font-bold text-slate-200">Пользовательский напиток</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Название (напр. Monster Zero)"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-surge-cyan"
                  />
                  <input
                    type="number"
                    min={10}
                    max={3000}
                    placeholder="Объем (мл)"
                    value={customMl}
                    onChange={(e) => setCustomMl(Number(e.target.value))}
                    className="bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-surge-cyan"
                  />
                  <input
                    type="number"
                    min={1}
                    max={1500}
                    placeholder="Кофеин (мг)"
                    value={customMg}
                    onChange={(e) => setCustomMg(Number(e.target.value))}
                    className="bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-surge-cyan"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-surge-cyan text-slate-950 text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  Зафиксировать порцию
                </button>
              </form>
            )}
          </div>

          {/* Section 3: Today's Consumption History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Журнал за сегодня ({todayEntries.length} записей)
            </h4>

            {todayEntries.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-900/40 rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-center text-surge-emerald mb-1">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-slate-300">За сегодня записей нет</div>
                <div className="text-[11px] text-slate-500">
                  Вы сохраняете чистоту рецепторов и нервной системы!
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {todayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-white/5 rounded-xl text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{entry.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {entry.volumeMl} мл •{' '}
                        {new Date(entry.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-surge-amber">
                        {entry.caffeineMg} мг
                      </span>
                      <button
                        onClick={() => onDeleteConsumption(entry.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        aria-label="Удалить запись"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scientific Disclaimer Footer */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-surge-emerald" />
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
