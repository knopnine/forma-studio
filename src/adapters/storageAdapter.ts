import type { CompletedWorkoutLog, PersonalRecord, UserProfile } from '../core/types';
import { DEFAULT_EQUIPMENT_CONFIG } from '../core/equipmentRules';

export interface IStorageAdapter {
  getUserProfile(): Promise<UserProfile>;
  saveUserProfile(profile: UserProfile): Promise<void>;
  getWorkoutHistory(): Promise<CompletedWorkoutLog[]>;
  saveWorkoutLog(log: CompletedWorkoutLog): Promise<void>;
  getPersonalRecords(): Promise<PersonalRecord[]>;
  savePersonalRecord(pr: PersonalRecord): Promise<void>;
  exportBackupJSON(): Promise<string>;
  importBackupJSON(jsonData: string): Promise<boolean>;
  exportAllData(): Promise<string>;
  importAllData(jsonData: string): Promise<boolean>;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'forma_user_profile_v1',
  WORKOUT_HISTORY: 'forma_workout_history_v1',
  PERSONAL_RECORDS: 'forma_personal_records_v1',
  // Backward compatibility keys
  LEGACY_USER_PROFILE: 'homefit_user_profile_v1',
  LEGACY_WORKOUT_HISTORY: 'homefit_workout_history_v1',
  LEGACY_PERSONAL_RECORDS: 'homefit_personal_records_v1',
};

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Athlete',
  experienceLevel: 'intermediate',
  primaryGoal: 'hypertrophy',
  weeklyTargetSessions: 4,
  preferredDuration: 30,
  language: 'en',
  soundEnabled: true,
  hapticsEnabled: true,
  equipment: DEFAULT_EQUIPMENT_CONFIG,
};

export class LocalStorageAdapter implements IStorageAdapter {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || localStorage.getItem(STORAGE_KEYS.LEGACY_USER_PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_USER_PROFILE,
            ...parsed,
            equipment: {
              ...DEFAULT_EQUIPMENT_CONFIG,
              ...(parsed.equipment && typeof parsed.equipment === 'object' ? parsed.equipment : {}),
              improvisedTools: Array.isArray(parsed.equipment?.improvisedTools)
                ? parsed.equipment.improvisedTools.filter((t: any) => t && typeof t === 'object' && typeof t.id === 'string')
                : [],
              dumbbellWeightsKg: Array.isArray(parsed.equipment?.dumbbellWeightsKg)
                ? parsed.equipment.dumbbellWeightsKg.filter((w: any) => typeof w === 'number')
                : DEFAULT_EQUIPMENT_CONFIG.dumbbellWeightsKg,
            },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load profile from storage, using defaults', e);
    }
    return DEFAULT_USER_PROFILE;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to storage', e);
    }
  }

  async getWorkoutHistory(): Promise<CompletedWorkoutLog[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY) || localStorage.getItem(STORAGE_KEYS.LEGACY_WORKOUT_HISTORY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is CompletedWorkoutLog =>
              item !== null &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.totalVolumeKg === 'number' &&
              Array.isArray(item.exercises)
          );
        }
      }
    } catch (e) {
      console.warn('Failed to load workout history', e);
    }
    return [];
  }

  async saveWorkoutLog(log: CompletedWorkoutLog): Promise<void> {
    try {
      const history = await this.getWorkoutHistory();
      const updated = [log, ...history.filter((item) => item.id !== log.id)];
      localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save workout log', e);
    }
  }

  async getPersonalRecords(): Promise<PersonalRecord[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS) || localStorage.getItem(STORAGE_KEYS.LEGACY_PERSONAL_RECORDS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is PersonalRecord =>
              item !== null &&
              typeof item === 'object' &&
              typeof item.exerciseId === 'string' &&
              typeof item.metricType === 'string' &&
              typeof item.recordValue === 'number'
          );
        }
      }
    } catch (e) {
      console.warn('Failed to load PRs', e);
    }
    return [];
  }

  async savePersonalRecord(pr: PersonalRecord): Promise<void> {
    try {
      const current = await this.getPersonalRecords();
      const existingIdx = current.findIndex(
        (p) => p.exerciseId === pr.exerciseId && p.metricType === pr.metricType
      );

      let updated: PersonalRecord[];
      if (existingIdx >= 0) {
        if (pr.recordValue > current[existingIdx].recordValue) {
          updated = [...current];
          updated[existingIdx] = pr;
        } else {
          return; // Existing PR is higher
        }
      } else {
        updated = [...current, pr];
      }

      localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save PR', e);
    }
  }

  async exportBackupJSON(): Promise<string> {
    const profile = await this.getUserProfile();
    const history = await this.getWorkoutHistory();
    const records = await this.getPersonalRecords();

    return JSON.stringify(
      {
        appName: 'Forma Studio',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        profile,
        history,
        records,
      },
      null,
      2
    );
  }

  async exportAllData(): Promise<string> {
    return this.exportBackupJSON();
  }

  async importBackupJSON(jsonData: string): Promise<boolean> {
    try {
      if (!jsonData || typeof jsonData !== 'string') return false;
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') return false;

      // 1. Sanitize and save profile
      if (parsed.profile && typeof parsed.profile === 'object') {
        const safeProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          name: typeof parsed.profile.name === 'string' ? parsed.profile.name : DEFAULT_USER_PROFILE.name,
          experienceLevel: ['beginner', 'intermediate', 'advanced'].includes(parsed.profile.experienceLevel)
            ? parsed.profile.experienceLevel
            : 'intermediate',
          primaryGoal: ['hypertrophy', 'strength', 'endurance', 'mobility'].includes(parsed.profile.primaryGoal)
            ? parsed.profile.primaryGoal
            : 'hypertrophy',
          weeklyTargetSessions: typeof parsed.profile.weeklyTargetSessions === 'number' ? parsed.profile.weeklyTargetSessions : 4,
          preferredDuration: typeof parsed.profile.preferredDuration === 'number' ? parsed.profile.preferredDuration : 30,
          language: parsed.profile.language === 'id' ? 'id' : 'en',
          soundEnabled: typeof parsed.profile.soundEnabled === 'boolean' ? parsed.profile.soundEnabled : true,
          hapticsEnabled: typeof parsed.profile.hapticsEnabled === 'boolean' ? parsed.profile.hapticsEnabled : true,
          equipment: {
            ...DEFAULT_EQUIPMENT_CONFIG,
            ...(parsed.profile.equipment && typeof parsed.profile.equipment === 'object' ? parsed.profile.equipment : {}),
            improvisedTools: Array.isArray(parsed.profile.equipment?.improvisedTools)
              ? parsed.profile.equipment.improvisedTools.filter(
                  (t: any) => t && typeof t === 'object' && typeof t.id === 'string' && typeof t.name === 'string'
                )
              : [],
          },
        };
        await this.saveUserProfile(safeProfile);
      }

      // 2. Sanitize and save workout history
      if (parsed.history && Array.isArray(parsed.history)) {
        const validHistory: CompletedWorkoutLog[] = parsed.history.filter(
          (item: any): item is CompletedWorkoutLog =>
            item !== null &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            typeof item.title === 'string' &&
            typeof item.date === 'string' &&
            typeof item.totalVolumeKg === 'number' &&
            Array.isArray(item.exercises)
        );
        localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(validHistory));
      }

      // 3. Sanitize and save personal records
      if (parsed.records && Array.isArray(parsed.records)) {
        const validRecords: PersonalRecord[] = parsed.records.filter(
          (item: any): item is PersonalRecord =>
            item !== null &&
            typeof item === 'object' &&
            typeof item.exerciseId === 'string' &&
            typeof item.metricType === 'string' &&
            typeof item.recordValue === 'number'
        );
        localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(validRecords));
      }

      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return false;
    }
  }

  async importAllData(jsonData: string): Promise<boolean> {
    return this.importBackupJSON(jsonData);
  }
}

export const StorageService = new LocalStorageAdapter();

