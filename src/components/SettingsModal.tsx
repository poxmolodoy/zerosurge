import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, RotateCcw, Edit3, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  onClose: () => void;
  onEditProfile: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onEditProfile,
  onResetAllData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    onResetAllData();
    setShowConfirmReset(false);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не задано';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md glass-card rounded-2xl p-6 sm:p-7 text-white shadow-2xl z-10 border border-white/10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-white/10">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Параметры и профиль</h3>
                <p className="text-xs text-slate-400">Управление данными ZeroSurge</p>
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

          {/* Current profile summary */}
          <div className="space-y-4 mb-6">
            <div className="bg-slate-900/70 rounded-xl p-4 border border-white/5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Старт чистоты:</span>
                <span className="font-mono font-medium text-slate-200">
                  {formatDate(profile?.quitDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Обычная норма банок:</span>
                <span className="font-mono font-medium text-surge-amber">
                  {profile?.cansPerDay ?? 0} шт/день
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Чашек кофе в день:</span>
                <span className="font-mono font-medium text-surge-cyan">
                  {profile?.coffeePerDay ?? 0} шт/день
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Категория напитков:</span>
                <span className="font-medium text-slate-200">
                  {profile?.isSugarFree ? 'Без сахара (Zero)' : 'С сахаром (~55 г)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Стоимость порции:</span>
                <span className="font-mono font-medium text-surge-emerald">
                  {profile?.costPerPortion ?? 0} ₽
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-slate-800/60 hover:bg-slate-800 text-sm font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-surge-cyan" />
              Изменить стартовые параметры
            </button>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-4 border-t border-white/10">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Сбросить весь прогресс и начать заново
              </button>
            ) : (
              <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  Вы уверены?
                </div>
                <p className="text-xs text-red-200/80">
                  Все таймеры, чек-ины и достижения будут безвозвратно удалены из браузера.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-900/50"
                  >
                    Да, сбросить всё
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
