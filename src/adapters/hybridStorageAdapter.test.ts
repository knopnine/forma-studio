import { describe, it, expect, beforeEach } from 'vitest';
import { HybridStorageAdapter, LocalStorageAdapter } from './storageAdapter';
import type { UserProfile, CompletedWorkoutLog, PersonalRecord } from '../core/types';

describe('HybridStorageAdapter', () => {
  let adapter: HybridStorageAdapter;
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
    adapter = new HybridStorageAdapter(new LocalStorageAdapter());
  });

  it('guarantees offline-first profile reads and writes without cloud config', async () => {
    const profile = await adapter.getUserProfile();
    expect(profile.name).toBe('Athlete');

    const updatedProfile: UserProfile = {
      ...profile,
      name: 'Mobile Athlete',
      experienceLevel: 'advanced',
    };
    await adapter.saveUserProfile(updatedProfile);

    const reloaded = await adapter.getUserProfile();
    expect(reloaded.name).toBe('Mobile Athlete');
    expect(reloaded.experienceLevel).toBe('advanced');
  });

  it('guarantees offline-first workout logging and history sorting', async () => {
    const log1: CompletedWorkoutLog = {
      id: 'log-1',
      planId: 'plan-1',
      title: 'Session 1',
      date: '2026-09-19',
      startedAt: '2026-09-19T10:00:00Z',
      completedAt: '2026-09-19T10:30:00Z',
      durationSeconds: 1800,
      totalVolumeKg: 1500,
      totalReps: 60,
      exercisesCompletedCount: 3,
      exercises: [],
    };

    const log2: CompletedWorkoutLog = {
      id: 'log-2',
      planId: 'plan-2',
      title: 'Session 2',
      date: '2026-09-20',
      startedAt: '2026-09-20T10:00:00Z',
      completedAt: '2026-09-20T10:45:00Z',
      durationSeconds: 2700,
      totalVolumeKg: 2500,
      totalReps: 90,
      exercisesCompletedCount: 4,
      exercises: [],
    };

    await adapter.saveWorkoutLog(log1);
    await adapter.saveWorkoutLog(log2);

    const history = await adapter.getWorkoutHistory();
    expect(history.length).toBe(2);
    expect(history[0].id).toBe('log-2');
  });

  it('tracks and updates personal records offline', async () => {
    const pr: PersonalRecord = {
      id: 'pr-pushup',
      exerciseId: 'push-up',
      exerciseName: 'Push-Up',
      metricType: 'max_reps',
      recordValue: 40,
      achievedAt: '2026-09-20T11:00:00Z',
    };

    await adapter.savePersonalRecord(pr);
    const prs = await adapter.getPersonalRecords();
    expect(prs.length).toBe(1);
    expect(prs[0].recordValue).toBe(40);
  });
});
