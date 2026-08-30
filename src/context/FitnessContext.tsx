import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AudioHaptics } from '../adapters/hapticAudioAdapter';
import { StorageService } from '../adapters/storageAdapter';
import { DEFAULT_EQUIPMENT_CONFIG } from '../core/equipmentRules';
import { swapPlannedExercise } from '../core/planGenerator';
import type {
  CompletedWorkoutLog,
  EquipmentConfig,
  ImprovisedTool,
  PersonalRecord,
  UserProfile,
  WorkoutPlan,
} from '../core/types';

export type AppTab = 'landing' | 'home' | 'wizard' | 'splits' | 'library' | 'equipment' | 'analytics' | 'active_workout';

export interface RestTimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  exerciseName?: string;
}

interface FitnessContextType {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateEquipment: (config: EquipmentConfig) => Promise<void>;
  addImprovisedTool: (tool: Omit<ImprovisedTool, 'id'>) => Promise<void>;
  toggleImprovisedTool: (toolId: string) => Promise<void>;
  deleteImprovisedTool: (toolId: string) => Promise<void>;
  
  history: CompletedWorkoutLog[];
  personalRecords: PersonalRecord[];
  
  activePlan: WorkoutPlan | null;
  workoutStartTime: string | null;
  startWorkout: (plan: WorkoutPlan) => void;
  cancelActiveWorkout: () => void;
  finishActiveWorkout: (notes?: string) => Promise<CompletedWorkoutLog | null>;
  toggleSetComplete: (exerciseIdx: number, setIdx: number, reps?: number, weightKg?: number) => void;
  updateSetValues: (exerciseIdx: number, setIdx: number, reps: number, weightKg: number) => void;
  swapExercise: (exerciseIdx: number, newExerciseId: string) => void;
  
  restTimer: RestTimerState | null;
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  addRestSeconds: (seconds: number) => void;
  dismissRestTimer: () => void;
  
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  selectedExerciseForDetail: string | null;
  setSelectedExerciseForDetail: (id: string | null) => void;
}

const FitnessContext = createContext<FitnessContextType | null>(null);

const DEFAULT_PROFILE: UserProfile = {
  name: 'Home Athlete',
  experienceLevel: 'intermediate',
  primaryGoal: 'hypertrophy',
  weeklyTargetSessions: 4,
  preferredDuration: 30,
  language: 'en',
  soundEnabled: true,
  hapticsEnabled: true,
  equipment: DEFAULT_EQUIPMENT_CONFIG,
};

function getInitialTab(): AppTab {
  if (typeof window === 'undefined') return 'landing';

  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'app' || hash === 'home') return 'home';
  if (hash.startsWith('app/wizard') || hash === 'wizard') return 'wizard';
  if (hash.startsWith('app/splits') || hash === 'splits') return 'splits';
  if (hash.startsWith('app/library') || hash === 'library') return 'library';
  if (hash.startsWith('app/equipment') || hash === 'equipment') return 'equipment';
  if (hash.startsWith('app/analytics') || hash === 'analytics') return 'analytics';
  if (hash === 'landing' || hash === '') {
    // If running in Capacitor Android Native App or Standalone PWA, start directly in Studio
    const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
    const isStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
    if (isNative || isStandalone) {
      return 'home';
    }
    return 'landing';
  }

  return 'landing';
}

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [history, setHistory] = useState<CompletedWorkoutLog[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [currentTab, setCurrentTabState] = useState<AppTab>(getInitialTab);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<string | null>(null);

  const setCurrentTab = (tab: AppTab) => {
    setCurrentTabState(tab);
    if (typeof window !== 'undefined') {
      const targetHash = tab === 'landing' ? '#/' : (tab === 'home' ? '#/app' : `#/app/${tab}`);
      if (window.location.hash !== targetHash) {
        try {
          window.history.replaceState(null, '', targetHash);
        } catch {
          window.location.hash = targetHash;
        }
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getInitialTab();
      setCurrentTabState(newTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active workout state
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<string | null>(null);

  // Floating Rest timer state
  const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);

  // Load from Storage on mount
  useEffect(() => {
    async function initData() {
      const storedProfile = await StorageService.getUserProfile();
      const storedHistory = await StorageService.getWorkoutHistory();
      const storedPRs = await StorageService.getPersonalRecords();

      setProfile(storedProfile);
      setHistory(storedHistory);
      setPersonalRecords(storedPRs);
    }
    initData();
  }, []);

  // Countdown effect for Rest Timer
  useEffect(() => {
    if (!restTimer || !restTimer.isRunning || restTimer.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        const next = prev.remainingSeconds - 1;

        if (next === 3 || next === 2 || next === 1) {
          if (profile.soundEnabled) AudioHaptics.playCountdownTick();
        }

        if (next <= 0) {
          if (profile.soundEnabled) AudioHaptics.playTimerComplete();
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }

        return { ...prev, remainingSeconds: next };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer, profile.soundEnabled]);

  const updateProfile = async (partial: Partial<UserProfile>) => {
    const updated: UserProfile = { ...profile, ...partial };
    setProfile(updated);
    await StorageService.saveUserProfile(updated);
  };

  const updateEquipment = async (equipment: EquipmentConfig) => {
    const updated = { ...profile, equipment };
    setProfile(updated);
    await StorageService.saveUserProfile(updated);
  };

  const addImprovisedTool = async (tool: Omit<ImprovisedTool, 'id'>) => {
    const newTool: ImprovisedTool = {
      ...tool,
      id: 'custom-tool-' + Date.now(),
    };
    const updatedTools = [...profile.equipment.improvisedTools, newTool];
    await updateEquipment({ ...profile.equipment, improvisedTools: updatedTools });
  };

  const toggleImprovisedTool = async (toolId: string) => {
    const updatedTools = profile.equipment.improvisedTools.map((t) =>
      t.id === toolId ? { ...t, isEnabled: !t.isEnabled } : t
    );
    await updateEquipment({ ...profile.equipment, improvisedTools: updatedTools });
  };

  const deleteImprovisedTool = async (toolId: string) => {
    const updatedTools = profile.equipment.improvisedTools.filter((t) => t.id !== toolId);
    await updateEquipment({ ...profile.equipment, improvisedTools: updatedTools });
  };

  const startWorkout = (plan: WorkoutPlan) => {
    setActivePlan(plan);
    setWorkoutStartTime(new Date().toISOString());
    setCurrentTab('active_workout');
  };

  const cancelActiveWorkout = () => {
    setActivePlan(null);
    setWorkoutStartTime(null);
    setRestTimer(null);
    setCurrentTab('home');
  };

  const toggleSetComplete = (exerciseIdx: number, setIdx: number, customReps?: number, customWeight?: number) => {
    if (!activePlan) return;

    const updatedPlan = { ...activePlan };
    const targetEx = updatedPlan.exercises[exerciseIdx];
    const targetSet = targetEx.sets[setIdx];

    const isNowCompleted = !targetSet.isCompleted;
    targetSet.isCompleted = isNowCompleted;

    // Preserve custom reps/weight already typed by athlete before falling back to targets
    const finalReps = customReps !== undefined
      ? customReps
      : (targetSet.completedReps !== undefined ? targetSet.completedReps : targetSet.targetReps);
    const finalWeight = customWeight !== undefined
      ? customWeight
      : (targetSet.completedWeightKg !== undefined ? targetSet.completedWeightKg : (targetSet.targetWeightKg || 0));

    targetSet.completedReps = finalReps;
    targetSet.completedWeightKg = finalWeight;

    setActivePlan(updatedPlan);

    if (isNowCompleted) {
      if (profile.soundEnabled) AudioHaptics.playSetComplete();
      // Auto-trigger rest timer if there are remaining sets
      startRestTimer(targetEx.restBetweenSetsSeconds, targetEx.exercise.name);
    }
  };

  const updateSetValues = (exerciseIdx: number, setIdx: number, reps: number, weightKg: number) => {
    if (!activePlan) return;
    const updatedPlan = { ...activePlan };
    const targetSet = updatedPlan.exercises[exerciseIdx].sets[setIdx];
    targetSet.completedReps = reps;
    targetSet.completedWeightKg = weightKg;
    setActivePlan(updatedPlan);
  };

  const swapExercise = (exerciseIdx: number, newExerciseId: string) => {
    if (!activePlan) return;
    const updated = swapPlannedExercise(activePlan, exerciseIdx, newExerciseId, profile);
    setActivePlan(updated);
  };

  const finishActiveWorkout = async (notes?: string): Promise<CompletedWorkoutLog | null> => {
    if (!activePlan) return null;

    const endTime = new Date().toISOString();
    const startTime = workoutStartTime || endTime;
    const durationSeconds = Math.max(60, Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000));

    let totalVolume = 0;
    let totalReps = 0;
    let completedExCount = 0;

    const loggedExercises = activePlan.exercises.map((pEx) => {
      const completedSets = pEx.sets.filter((s) => s.isCompleted);
      if (completedSets.length > 0) completedExCount++;

      pEx.sets.forEach((s) => {
        if (s.isCompleted) {
          const reps = s.completedReps ?? s.targetReps ?? 0;
          const weight = s.completedWeightKg ?? s.targetWeightKg ?? 0;
          totalReps += reps;
          totalVolume += reps * (weight > 0 ? weight : 1);
        }
      });

      return {
        exerciseId: pEx.exercise.id,
        exerciseName: pEx.exercise.name,
        targetMuscle: pEx.exercise.target,
        sets: pEx.sets,
      };
    });

    const newLog: CompletedWorkoutLog = {
      id: 'log-' + Date.now(),
      planId: activePlan.id,
      title: activePlan.title,
      date: new Date().toISOString().split('T')[0],
      startedAt: startTime,
      completedAt: endTime,
      durationSeconds,
      totalVolumeKg: totalVolume,
      totalReps,
      exercisesCompletedCount: completedExCount,
      exercises: loggedExercises,
      rpeAverage: 8,
      notes,
    };

    // Save history
    await StorageService.saveWorkoutLog(newLog);
    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);

    // Check and save Personal Records sequentially to eliminate localStorage race conditions
    for (const pEx of activePlan.exercises) {
      for (const set of pEx.sets) {
        if (set.isCompleted && (set.completedReps ?? 0) > 0) {
          const reps = set.completedReps ?? 0;
          const weight = set.completedWeightKg ?? 0;

          if (weight > 0) {
            await StorageService.savePersonalRecord({
              exerciseId: pEx.exercise.id,
              exerciseName: pEx.exercise.name,
              metricType: 'max_weight',
              recordValue: weight,
              achievedAt: new Date().toISOString(),
            });
          } else {
            await StorageService.savePersonalRecord({
              exerciseId: pEx.exercise.id,
              exerciseName: pEx.exercise.name,
              metricType: 'max_reps',
              recordValue: reps,
              achievedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Refresh PRs
    const updatedPRs = await StorageService.getPersonalRecords();
    setPersonalRecords(updatedPRs);

    // Audio & Confetti celebration
    if (profile.soundEnabled) AudioHaptics.playVictoryFanfare();
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    setActivePlan(null);
    setWorkoutStartTime(null);
    setRestTimer(null);
    setCurrentTab('analytics');

    return newLog;
  };

  const startRestTimer = (seconds: number, exerciseName?: string) => {
    setRestTimer({
      totalSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
      exerciseName,
    });
  };

  const pauseRestTimer = () => {
    setRestTimer((prev) => (prev ? { ...prev, isRunning: false } : null));
  };

  const resumeRestTimer = () => {
    setRestTimer((prev) => (prev ? { ...prev, isRunning: true } : null));
  };

  const addRestSeconds = (seconds: number) => {
    setRestTimer((prev) =>
      prev
        ? {
            ...prev,
            totalSeconds: prev.totalSeconds + seconds,
            remainingSeconds: Math.max(0, prev.remainingSeconds + seconds),
          }
        : null
    );
  };

  const dismissRestTimer = () => {
    setRestTimer(null);
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        updateProfile,
        updateEquipment,
        addImprovisedTool,
        toggleImprovisedTool,
        deleteImprovisedTool,
        history,
        personalRecords,
        activePlan,
        workoutStartTime,
        startWorkout,
        cancelActiveWorkout,
        finishActiveWorkout,
        toggleSetComplete,
        updateSetValues,
        swapExercise,
        restTimer,
        startRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        addRestSeconds,
        dismissRestTimer,
        currentTab,
        setCurrentTab,
        selectedExerciseForDetail,
        setSelectedExerciseForDetail,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
