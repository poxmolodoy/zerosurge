import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  RotateCcw,
  Edit3,
  ShieldAlert,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { UserProfile, DailyCheckIn } from '../types';
import {
  serializeExportData,
  validateImportPayload,
  triggerFileDownload,
  BackupData,
} from '../utils/securityValidator';
import { TaperPlan, ConsumptionEntry } from '../utils/taper';

interface SettingsModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  checkIns: DailyCheckIn[];
  taperPlan?: TaperPlan;
  consumptionLog?: ConsumptionEntry[];
  onClose: () => void;
  onEditProfile: () => void;
  onResetAllData: () => void;
  onImportData: (data: BackupData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  checkIns,
  taperPlan,
  consumptionLog,
  onClose,
  onEditProfile,
  onResetAllData,
  onImportData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    data: BackupData;
    preview: {
      checkInsCount: number;
      quitDate: string;
      cansPerDay: number;
      exportedAt: string;
      hasTaperPlan?: boolean;
      consumptionEntriesCount?: number;
    };
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleConfirmReset = () => {
    onResetAllData();
    setShowConfirmReset(false);
    onClose();
  };

  const handleExport = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filename = `zerosurge-backup-${today}.json`;
      const json = serializeExportData(profile, checkIns, taperPlan, consumptionLog);
      triggerFileDownload(filename, json);
      setExportSuccess(true);
      setImportError(null);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch {
      setImportError('Не удалось выполнить экспорт данных.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setExportSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        setImportError('Не удалось прочитать содержимое файла.');
        return;
      }

      const result = validateImportPayload(text);
      if (!result.success) {
        setImportError(result.error);
        setImportPreview(null);
      } else {
        setImportPreview({
          data: result.data,
          preview: result.preview,
        });
      }
    };
    reader.onerror = () => {
      setImportError('Ошибка при чтении файла с диска.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    try {
      onImportData(importPreview.data);
      setImportPreview(null);
      setImportError(null);
      setExportSuccess(false);
      onClose();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Не удалось применить импорт.');
    }
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-md glass-card rounded-2xl p-5 sm:p-7 text-white shadow-2xl z-10 border border-white/10 my-auto max-h-[92vh] overflow-y-auto"
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

          {/* Backup & Restore Section */}
          <div className="pt-4 border-t border-white/10 space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Резервная копия данных</span>
              <span className="text-[10px] text-slate-500 font-mono">v1 JSON</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="py-2.5 px-3 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-surge-emerald" />
                Экспорт (JSON)
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-surge-cyan" />
                Импорт из файла
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,application/json"
                className="hidden"
                aria-label="Выбрать файл резервной копии"
              />
            </div>

            {exportSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Файл резервной копии успешно выгружен.</span>
              </div>
            )}

            {importError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{importError}</span>
                </div>
                <button
                  onClick={() => setImportError(null)}
                  className="text-red-400 hover:text-white"
                  aria-label="Закрыть ошибку"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {importPreview && (
              <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-100 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Предпросмотр данных для импорта</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-white/5 font-mono">
                  <div>• Дата старта: {formatDate(importPreview.preview.quitDate)}</div>
                  <div>• Чек-инов в архиве: {importPreview.preview.checkInsCount} шт.</div>
                  <div>• Банок в день: {importPreview.preview.cansPerDay} шт.</div>
                  <div>
                    • Создан:{' '}
                    {new Date(importPreview.preview.exportedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/90 font-sans">
                  Внимание: текущие данные будут заменены данными из файла.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImportPreview(null)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex-1 py-1.5 rounded-lg bg-surge-cyan text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
                  >
                    Подтвердить импорт
                  </button>
                </div>
              </div>
            )}
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
