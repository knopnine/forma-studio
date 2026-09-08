import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { DailyWizardModal } from './components/DailyWizardModal';
import { WeeklySplitsView } from './components/WeeklySplitsView';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { EquipmentManager } from './components/EquipmentManager';
import { AnalyticsView } from './components/AnalyticsView';
import { ActiveWorkoutView } from './components/ActiveWorkoutView';
import { LandingPage } from './components/LandingPage';
import { RestTimerFloating } from './components/RestTimerFloating';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';

const AppContent: React.FC = () => {
  const { currentTab } = useFitness();

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a] flex flex-col selection:bg-[#0a0a0a] selection:text-[#fafafa]">
      <Navigation />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-12">
        {currentTab === 'landing' && <LandingPage />}
        {currentTab === 'home' && <HomeDashboard />}
        {currentTab === 'wizard' && <DailyWizardModal />}
        {currentTab === 'splits' && <WeeklySplitsView />}
        {currentTab === 'library' && <ExerciseLibrary />}
        {currentTab === 'equipment' && <EquipmentManager />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'active_workout' && <ActiveWorkoutView />}
      </main>

      <RestTimerFloating />
      <ExerciseDetailModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FitnessProvider>
      <AppContent />
      <Analytics />
    </FitnessProvider>
  );
};

export default App;
