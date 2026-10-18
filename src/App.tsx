import { useState, useCallback } from 'react';
import { useZeroSurge } from './hooks/useZeroSurge';
import { usePerformanceMode } from './hooks/usePerformanceMode';
import { useModalBackHandler } from './hooks/useModalBackHandler';
import { Header } from './components/Header';
import { LiveTimer } from './components/LiveTimer';
import { StatCards } from './components/StatCards';
import { BioTimeline } from './components/BioTimeline';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import { SosModal } from './components/SosModal';
import { NeuralBackground } from './components/NeuralBackground';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';

// Statically imported modals for zero-latency, offline-safe opening without post-deploy 404 chunk errors
import SettingsModal from './components/SettingsModal';
import RelapseModal from './components/RelapseModal';
import AchievementsModal from './components/AchievementsModal';
import HealthJournalModal from './components/HealthJournalModal';
import CaffeineHarmAtlasModal from './components/CaffeineHarmAtlasModal';
import TaperModal from './components/TaperModal';

export type ActiveModal =
  | 'onboarding'
  | 'settings'
  | 'sos'
  | 'relapse'
  | 'achievements'
  | 'journal'
  | 'harmAtlas'
  | 'taper'
  | null;

export default function App() {
  const {
    profile,
    stats,
    elapsedTime,
    milestones,
    achievements,
    checkIns,
    taperPlan,
    consumptionLog,
    saveProfile,
    resetAllData,
    addCheckIn,
    recordRelapse,
    saveTaperPlan,
    addConsumption,
    deleteConsumption,
    importData,
  } = useZeroSurge();

  const { isPerformanceMode, togglePerformanceMode } = usePerformanceMode();

  const [activeModal, setActiveModal] = useState<ActiveModal>(() =>
    !profile?.isOnboarded ? 'onboarding' : null
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openModal = useCallback((modal: ActiveModal) => {
    setActiveModal(modal);
  }, []);

  // Hardware back button & history back navigation for active modal
  useModalBackHandler(
    Boolean(activeModal),
    closeModal,
    activeModal ? `${activeModal}-modal` : 'modal'
  );

  // Default fallback profile for initial visual demo if onboarding modal is closed
  const activeProfile = profile || {
    quitDate: new Date().toISOString(),
    cansPerDay: 2,
    coffeePerDay: 1,
    isSugarFree: false,
    costPerPortion: 130,
    isOnboarded: false,
  };

  const handleSaveProfile = (newProfile: typeof activeProfile) => {
    saveProfile(newProfile);
    closeModal();
  };

  const handleResetAllData = () => {
    resetAllData();
    openModal('onboarding');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-surge-emerald selection:text-slate-950 relative overflow-x-clip">
      {/* 60fps Futuristic Neural Network Particle Canvas at z-0 (disabled in performance mode) */}
      {!isPerformanceMode && <NeuralBackground />}

      {/* Background radial atmosphere (disabled in performance mode) */}
      {!isPerformanceMode && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-surge-emerald/15 via-surge-cyan/10 to-transparent blur-3xl pointer-events-none z-0" />
      )}

      {/* Navigation Header */}
      <Header
        onOpenSos={() => openModal('sos')}
        onOpenSettings={() => openModal('settings')}
        onOpenRelapse={() => openModal('relapse')}
        onOpenAchievements={() => openModal('achievements')}
        onOpenJournal={() => openModal('journal')}
        onOpenHarmAtlas={() => openModal('harmAtlas')}
        onOpenTaper={() => openModal('taper')}
        isPerformanceMode={isPerformanceMode}
        onTogglePerformanceMode={togglePerformanceMode}
      />

      {/* Main Container - Ultra Focused & Clean with rhythm-based spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-0 md:pb-0 space-y-8 relative z-10">
        {/* Section 1: Live Timer */}
        <section aria-label="Таймер свободы">
          <LiveTimer elapsedTime={elapsedTime} quitDate={activeProfile.quitDate} />
        </section>

        {/* Section 2: 4 Core Stat Cards */}
        <section aria-label="Статистика экономии и здоровья">
          <StatCards stats={stats} profile={activeProfile} />
        </section>

        {/* Section 3: Body Recovery Timeline (Bio-Progress) */}
        <section aria-label="Био-прогресс восстановления">
          <BioTimeline milestones={milestones} />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar (block md:hidden) */}
      <BottomNav
        activeTab={
          activeModal === 'journal' ||
          activeModal === 'sos' ||
          activeModal === 'harmAtlas' ||
          activeModal === 'taper'
            ? activeModal
            : null
        }
        onOpenJournal={() => openModal('journal')}
        onOpenSos={() => openModal('sos')}
        onOpenHarmAtlas={() => openModal('harmAtlas')}
        onOpenTaper={() => openModal('taper')}
      />

      {/* Synchronously loaded critical modals */}
      <OnboardingModal
        isOpen={activeModal === 'onboarding'}
        initialProfile={profile}
        onSave={handleSaveProfile}
        onClose={closeModal}
        title={profile?.isOnboarded ? 'Редактирование профиля' : 'Добро пожаловать в ZeroSurge'}
        submitButtonText={profile?.isOnboarded ? 'Сохранить изменения' : 'Начать путь к свободе'}
      />

      <SosModal
        isOpen={activeModal === 'sos'}
        daysElapsed={elapsedTime.days}
        onClose={closeModal}
      />

      {/* Modals wrapped in ErrorBoundary to guarantee graceful UI recovery */}
      <ErrorBoundary>
        {activeModal === 'settings' && (
          <SettingsModal
            isOpen={activeModal === 'settings'}
            profile={profile}
            checkIns={checkIns}
            taperPlan={taperPlan}
            consumptionLog={consumptionLog}
            onClose={closeModal}
            onEditProfile={() => openModal('onboarding')}
            onResetAllData={handleResetAllData}
            onImportData={importData}
          />
        )}

        {activeModal === 'relapse' && (
          <RelapseModal
            isOpen={activeModal === 'relapse'}
            onClose={closeModal}
            onConfirmRelapse={(count, itemType, isSugarFree) =>
              recordRelapse(count, itemType, isSugarFree)
            }
            currentCansAvoided={stats.cansAvoided}
            cansPerDay={activeProfile.cansPerDay}
            coffeePerDay={activeProfile.coffeePerDay}
            quitTimestamp={new Date(activeProfile.quitDate).getTime()}
          />
        )}

        {activeModal === 'achievements' && (
          <AchievementsModal
            isOpen={activeModal === 'achievements'}
            onClose={closeModal}
            achievements={achievements}
          />
        )}

        {activeModal === 'journal' && (
          <HealthJournalModal
            isOpen={activeModal === 'journal'}
            onClose={closeModal}
            checkIns={checkIns}
            onAddCheckIn={addCheckIn}
          />
        )}

        {activeModal === 'harmAtlas' && (
          <CaffeineHarmAtlasModal isOpen={activeModal === 'harmAtlas'} onClose={closeModal} />
        )}

        {activeModal === 'taper' && (
          <TaperModal
            isOpen={activeModal === 'taper'}
            onClose={closeModal}
            taperPlan={taperPlan}
            consumptionLog={consumptionLog}
            onSaveTaperPlan={saveTaperPlan}
            onAddConsumption={addConsumption}
            onDeleteConsumption={deleteConsumption}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
