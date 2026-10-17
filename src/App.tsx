import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';
import { useZeroSurge } from './hooks/useZeroSurge';
import { usePerformanceMode } from './hooks/usePerformanceMode';
import { Header } from './components/Header';
import { LiveTimer } from './components/LiveTimer';
import { StatCards } from './components/StatCards';
import { BioTimeline } from './components/BioTimeline';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { SosModal } from './components/SosModal';
import { RelapseModal } from './components/RelapseModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HealthJournalModal } from './components/HealthJournalModal';
import { CaffeineHarmAtlasModal } from './components/CaffeineHarmAtlasModal';
import { NeuralBackground } from './components/NeuralBackground';

export default function App() {
  const {
    profile,
    stats,
    elapsedTime,
    milestones,
    achievements,
    checkIns,
    saveProfile,
    resetAllData,
    addCheckIn,
    recordRelapse,
    importData,
  } = useZeroSurge();

  const { isPerformanceMode, togglePerformanceMode } = usePerformanceMode();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !profile?.isOnboarded);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isRelapseOpen, setIsRelapseOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isHarmAtlasOpen, setIsHarmAtlasOpen] = useState(false);

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
    setIsOnboardingOpen(false);
  };

  const handleResetAllData = () => {
    resetAllData();
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-surge-emerald selection:text-slate-950 relative overflow-x-hidden">
      {/* 60fps Futuristic Neural Network Particle Canvas at z-0 (disabled in performance mode) */}
      {!isPerformanceMode && <NeuralBackground />}

      {/* Background radial atmosphere (disabled in performance mode) */}
      {!isPerformanceMode && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-surge-emerald/15 via-surge-cyan/10 to-transparent blur-3xl pointer-events-none z-0" />
      )}

      {/* Navigation Header */}
      <Header
        onOpenSos={() => setIsSosOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRelapse={() => setIsRelapseOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenHarmAtlas={() => setIsHarmAtlasOpen(true)}
        isPerformanceMode={isPerformanceMode}
        onTogglePerformanceMode={togglePerformanceMode}
      />

      {/* Main Container - Ultra Focused & Clean */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 relative z-10">
        {/* Section 1: Live Timer */}
        <section aria-label="Таймер свободы">
          <LiveTimer elapsedTime={elapsedTime} />
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

      {/* Mobile Floating Action Button for SOS */}
      <div className="sm:hidden fixed bottom-6 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSosOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-surge-amber to-amber-500 text-slate-950 font-bold shadow-glow-amber border border-amber-300 flex items-center justify-center animate-bounce"
          aria-label="Экстренная помощь SOS"
        >
          <AlertOctagon className="w-6 h-6 fill-current" />
        </motion.button>
      </div>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsOnboardingOpen(false)}
        title={profile?.isOnboarded ? 'Редактирование профиля' : 'Добро пожаловать в ZeroSurge'}
        submitButtonText={profile?.isOnboarded ? 'Сохранить изменения' : 'Начать путь к свободе'}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        checkIns={checkIns}
        onClose={() => setIsSettingsOpen(false)}
        onEditProfile={() => setIsOnboardingOpen(true)}
        onResetAllData={handleResetAllData}
        onImportData={importData}
      />

      <SosModal
        isOpen={isSosOpen}
        daysElapsed={elapsedTime.days}
        onClose={() => setIsSosOpen(false)}
      />

      <RelapseModal
        isOpen={isRelapseOpen}
        onClose={() => setIsRelapseOpen(false)}
        onConfirmRelapse={(count, itemType, isSugarFree) => recordRelapse(count, itemType, isSugarFree)}
        currentCansAvoided={stats.cansAvoided}
        cansPerDay={activeProfile.cansPerDay}
        coffeePerDay={activeProfile.coffeePerDay}
        quitTimestamp={new Date(activeProfile.quitDate).getTime()}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <HealthJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        checkIns={checkIns}
        onAddCheckIn={addCheckIn}
      />

      <CaffeineHarmAtlasModal
        isOpen={isHarmAtlasOpen}
        onClose={() => setIsHarmAtlasOpen(false)}
      />
    </div>
  );
}
