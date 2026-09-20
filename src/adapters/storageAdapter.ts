import type { CompletedWorkoutLog, PersonalRecord, UserProfile } from '../core/types';
import { DEFAULT_EQUIPMENT_CONFIG } from '../core/equipmentRules';
import { supabase, getOrInitAnonymousUser } from './supabaseClient';

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

/**
 * Hybrid Storage Adapter (Phase 1):
 * - Guarantees 100% offline-first local persistence via localStorage.
 * - When Supabase credentials are configured, seamlessly syncs to cloud tables
 *   using anonymous authentication with zero login prompt friction.
 */
export class HybridStorageAdapter implements IStorageAdapter {
  private local: LocalStorageAdapter;

  constructor(localAdapter?: LocalStorageAdapter) {
    this.local = localAdapter || new LocalStorageAdapter();
  }

  async getUserProfile(): Promise<UserProfile> {
    const localProfile = await this.local.getUserProfile();
    if (!supabase) return localProfile;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return localProfile;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        const merged: UserProfile = {
          ...localProfile,
          name: data.name || localProfile.name,
          experienceLevel: data.experience_level || localProfile.experienceLevel,
          primaryGoal: data.primary_goal || localProfile.primaryGoal,
          weeklyTargetSessions: data.weekly_target_sessions ?? localProfile.weeklyTargetSessions,
          preferredDuration: data.preferred_duration ?? localProfile.preferredDuration,
          language: data.language || localProfile.language,
          soundEnabled: data.sound_enabled ?? localProfile.soundEnabled,
          hapticsEnabled: data.haptics_enabled ?? localProfile.hapticsEnabled,
          equipment:
            data.equipment && typeof data.equipment === 'object'
              ? { ...localProfile.equipment, ...data.equipment }
              : localProfile.equipment,
        };
        await this.local.saveUserProfile(merged);
        return merged;
      }
    } catch (e) {
      console.warn('HybridStorageAdapter: remote profile sync skipped', e);
    }
    return localProfile;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.local.saveUserProfile(profile);
    if (!supabase) return;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return;

      await supabase.from('user_profiles').upsert({
        id: user.id,
        name: profile.name,
        experience_level: profile.experienceLevel,
        primary_goal: profile.primaryGoal,
        weekly_target_sessions: profile.weeklyTargetSessions,
        preferred_duration: profile.preferredDuration,
        language: profile.language,
        sound_enabled: profile.soundEnabled,
        haptics_enabled: profile.hapticsEnabled,
        equipment: profile.equipment,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('HybridStorageAdapter: background profile sync skipped', e);
    }
  }

  async getWorkoutHistory(): Promise<CompletedWorkoutLog[]> {
    const localLogs = await this.local.getWorkoutHistory();
    if (!supabase) return localLogs;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return localLogs;

      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        const cloudMap = new Map<string, CompletedWorkoutLog>();
        data.forEach((row: any) => {
          cloudMap.set(row.id, {
            id: row.id,
            planId: row.plan_id || '',
            title: row.title,
            date: row.date,
            startedAt: row.started_at,
            completedAt: row.completed_at,
            durationSeconds: row.duration_seconds,
            totalVolumeKg: Number(row.total_volume_kg),
            totalReps: Number(row.total_reps),
            exercisesCompletedCount: Number(row.exercises_completed_count),
            exercises: Array.isArray(row.exercises) ? row.exercises : [],
            notes: row.notes || undefined,
          });
        });

        // Add and push local-only logs
        localLogs.forEach((log) => {
          if (!cloudMap.has(log.id)) {
            cloudMap.set(log.id, log);
            this.saveWorkoutLog(log);
          }
        });

        const mergedHistory = Array.from(cloudMap.values()).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(mergedHistory));
        return mergedHistory;
      }
    } catch (e) {
      console.warn('HybridStorageAdapter: remote workout history sync skipped', e);
    }
    return localLogs;
  }

  async saveWorkoutLog(log: CompletedWorkoutLog): Promise<void> {
    await this.local.saveWorkoutLog(log);
    if (!supabase) return;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return;

      await supabase.from('workout_logs').upsert({
        id: log.id,
        user_id: user.id,
        plan_id: log.planId,
        title: log.title,
        date: log.date,
        started_at: log.startedAt,
        completed_at: log.completedAt,
        duration_seconds: log.durationSeconds,
        total_volume_kg: log.totalVolumeKg,
        total_reps: log.totalReps,
        exercises_completed_count: log.exercisesCompletedCount,
        exercises: log.exercises,
        notes: log.notes || null,
      });
    } catch (e) {
      console.warn('HybridStorageAdapter: background workout log sync skipped', e);
    }
  }

  async getPersonalRecords(): Promise<PersonalRecord[]> {
    const localPRs = await this.local.getPersonalRecords();
    if (!supabase) return localPRs;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return localPRs;

      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data && Array.isArray(data)) {
        const prMap = new Map<string, PersonalRecord>();
        data.forEach((row: any) => {
          const key = `${row.exercise_id}_${row.metric_type}`;
          prMap.set(key, {
            id: row.id,
            exerciseId: row.exercise_id,
            exerciseName: row.exercise_name,
            metricType: row.metric_type,
            recordValue: Number(row.record_value),
            achievedAt: row.achieved_at,
          });
        });

        localPRs.forEach((pr) => {
          const key = `${pr.exerciseId}_${pr.metricType}`;
          const existing = prMap.get(key);
          if (!existing || pr.recordValue > existing.recordValue) {
            prMap.set(key, pr);
            this.savePersonalRecord(pr);
          }
        });

        const mergedPRs = Array.from(prMap.values());
        localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(mergedPRs));
        return mergedPRs;
      }
    } catch (e) {
      console.warn('HybridStorageAdapter: remote PR sync skipped', e);
    }
    return localPRs;
  }

  async savePersonalRecord(pr: PersonalRecord): Promise<void> {
    await this.local.savePersonalRecord(pr);
    if (!supabase) return;

    try {
      const user = await getOrInitAnonymousUser();
      if (!user) return;

      await supabase.from('personal_records').upsert({
        id: pr.id,
        user_id: user.id,
        exercise_id: pr.exerciseId,
        exercise_name: pr.exerciseName,
        metric_type: pr.metricType,
        record_value: pr.recordValue,
        achieved_at: pr.achievedAt,
      });
    } catch (e) {
      console.warn('HybridStorageAdapter: background PR sync skipped', e);
    }
  }

  async exportBackupJSON(): Promise<string> {
    return this.local.exportBackupJSON();
  }

  async importBackupJSON(jsonData: string): Promise<boolean> {
    const success = await this.local.importBackupJSON(jsonData);
    if (success && supabase) {
      this.getUserProfile();
      this.getWorkoutHistory();
      this.getPersonalRecords();
    }
    return success;
  }

  async exportAllData(): Promise<string> {
    return this.local.exportAllData();
  }

  async importAllData(jsonData: string): Promise<boolean> {
    return this.importBackupJSON(jsonData);
  }
}

export const StorageService = new HybridStorageAdapter();

