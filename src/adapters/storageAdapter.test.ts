import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from './storageAdapter';
import type { UserProfile, CompletedWorkoutLog } from '../core/types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    adapter = new LocalStorageAdapter();
  });

  it('returns default user profile when storage is empty', async () => {
    const profile = await adapter.getUserProfile();
    expect(profile.name).toBe('Athlete');
    expect(profile.experienceLevel).toBe('intermediate');
    expect(profile.equipment).toBeDefined();
  });

  it('persists and loads updated user profile', async () => {
    const customProfile: UserProfile = {
      name: 'Forma Champion',
      experienceLevel: 'advanced',
      primaryGoal: 'strength',
      weeklyTargetSessions: 5,
      preferredDuration: 45,
      language: 'id',
      soundEnabled: true,
      hapticsEnabled: true,
      equipment: {
        hasBodyweight: true,
        hasDumbbells: true,
        hasBarbell: false,
        hasKettlebell: false,
        hasPullUpBar: true,
        hasDipStation: false,
        hasResistanceBands: true,
        hasBench: true,
        hasBoxOrChair: true,
        hasStabilityBall: false,
        hasBosuBall: false,
        hasMedicineBall: false,
        hasAbWheel: false,
        hasFoamRoller: false,
        hasJumpRope: false,
        hasCableMachine: false,
        hasSmithMachine: false,
        hasLeverageMachine: false,
        dumbbellWeightsKg: [10, 15],
        improvisedTools: [],
      },
    };

    await adapter.saveUserProfile(customProfile);
    const loaded = await adapter.getUserProfile();
    expect(loaded.name).toBe('Forma Champion');
    expect(loaded.language).toBe('id');
    expect(loaded.experienceLevel).toBe('advanced');
  });

  it('saves and retrieves workout logs', async () => {
    const log: CompletedWorkoutLog = {
      id: 'log-123',
      planId: 'plan-123',
      title: 'Push Power Test',
      date: '2026-09-20',
      startedAt: '2026-09-20T10:00:00Z',
      completedAt: '2026-09-20T10:45:00Z',
      durationSeconds: 2700,
      totalVolumeKg: 3500,
      totalReps: 120,
      exercisesCompletedCount: 4,
      exercises: [],
    };

    await adapter.saveWorkoutLog(log);
    const history = await adapter.getWorkoutHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe('log-123');
    expect(history[0].totalVolumeKg).toBe(3500);
  });

  it('exports and imports backup JSON correctly', async () => {
    const log: CompletedWorkoutLog = {
      id: 'log-backup',
      planId: 'plan-b',
      title: 'Full Body Test',
      date: '2026-09-20',
      startedAt: '2026-09-20T11:00:00Z',
      completedAt: '2026-09-20T11:30:00Z',
      durationSeconds: 1800,
      totalVolumeKg: 2000,
      totalReps: 80,
      exercisesCompletedCount: 3,
      exercises: [],
    };

    await adapter.saveWorkoutLog(log);
    const exportedJson = await adapter.exportBackupJSON();
    expect(exportedJson).toContain('log-backup');

    // Clear and import
    mockStore = {};
    const success = await adapter.importBackupJSON(exportedJson);
    expect(success).toBe(true);

    const restoredHistory = await adapter.getWorkoutHistory();
    expect(restoredHistory.length).toBe(1);
    expect(restoredHistory[0].id).toBe('log-backup');
  });
});
