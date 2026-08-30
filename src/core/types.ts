// Core universal domain models - 100% platform agnostic (React Native / Android / Web compatible)

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type PrimaryGoal = 
  | 'hypertrophy'       // Muscle building
  | 'strength_skills'   // Calisthenics strength & skill progression
  | 'fat_loss_hiit'     // Conditioning, burn & HIIT
  | 'mobility_core';    // Joint health, posture & core stability

export type EnergyLevel = 'low' | 'moderate' | 'high';

export type SessionDurationMinutes = 15 | 30 | 45 | 60;

export type TargetMuscleFocus = 
  | 'full_body'
  | 'upper_body'
  | 'lower_body'
  | 'push'
  | 'pull'
  | 'legs'
  | 'core'
  | 'cardio_hiit';

export type StandardEquipmentType = 
  | 'body_weight'
  | 'dumbbell'
  | 'barbell'
  | 'pull_up_bar'
  | 'bench'
  | 'stability_ball'
  | 'bosu_ball'
  | 'medicine_ball'
  | 'resistance_band'
  | 'kettlebell'
  | 'dip_station'
  | 'ab_wheel'
  | 'foam_roller'
  | 'jump_rope'
  | 'box_chair'
  | 'cable_machine'
  | 'smith_machine'
  | 'leverage_machine';

export interface ImprovisedTool {
  id: string;
  name: string;
  category: 'chair' | 'backpack' | 'towel_floor' | 'door_anchor' | 'wall' | 'table_desk' | 'water_jugs' | 'custom';
  description: string;
  mapsToStandard: StandardEquipmentType[];
  customWeightKg?: number;
  isEnabled: boolean;
  notes?: string;
}

export interface EquipmentConfig {
  // Free Weights & Calisthenics
  hasBodyweight: boolean;
  hasDumbbells: boolean;
  hasBarbell: boolean;
  hasKettlebell: boolean;
  hasPullUpBar: boolean;
  hasDipStation: boolean;
  hasResistanceBands: boolean;

  // Benches, Elevation & Balls / Core
  hasBench: boolean;
  hasBoxOrChair: boolean;
  hasStabilityBall: boolean;
  hasBosuBall: boolean;
  hasMedicineBall: boolean;
  hasAbWheel: boolean;
  hasFoamRoller: boolean;
  hasJumpRope: boolean;

  // Machines & Cables
  hasCableMachine: boolean;
  hasSmithMachine: boolean;
  hasLeverageMachine: boolean;

  dumbbellWeightsKg: number[];
  improvisedTools: ImprovisedTool[];
}

export interface RawExercise {
  id: string;
  name: string;
  category: string;
  target: string;
  muscle_group?: string;
  secondary_muscles?: string[];
  equipment: string;
  instructions?: Record<string, string>;
  instruction_steps?: Record<string, string[]>;
  image?: string;
  gif_url?: string;
  media_id?: string;
  attribution?: string;
}

export interface EnrichedExercise extends RawExercise {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCalisthenicSkill?: boolean;
  progressionRank?: number; // 1 to 5 for progressive overload hierarchy
  equipmentCategory: StandardEquipmentType | 'other_machine';
  estimatedSecondsPerSet: number;
}

export interface WorkoutExerciseSet {
  setNumber: number;
  targetReps: number;
  completedReps?: number;
  targetWeightKg?: number;
  completedWeightKg?: number;
  isCompleted: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface PlannedExercise {
  exercise: EnrichedExercise;
  role: 'warmup' | 'compound_primary' | 'accessory' | 'burnout_finisher' | 'cooldown';
  targetSets: number;
  targetReps: number;
  targetDurationSeconds?: number;
  restBetweenSetsSeconds: number;
  sets: WorkoutExerciseSet[];
  notes?: string;
  suggestedAlternatives?: string[]; // Exercise IDs that can substitute
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  focus: TargetMuscleFocus;
  estimatedMinutes: number;
  energyLevel: EnergyLevel;
  requiredEquipment: string[];
  exercises: PlannedExercise[];
  createdAt: string;
}

export interface CompletedWorkoutLog {
  id: string;
  planId?: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalReps: number;
  exercisesCompletedCount: number;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    targetMuscle: string;
    sets: WorkoutExerciseSet[];
  }[];
  rpeAverage: number;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  metricType: 'max_weight' | 'max_reps' | 'max_duration';
  recordValue: number;
  achievedAt: string; // ISO date
}

export interface UserProfile {
  name: string;
  experienceLevel: ExperienceLevel;
  primaryGoal: PrimaryGoal;
  weeklyTargetSessions: number;
  preferredDuration: SessionDurationMinutes;
  language: 'en' | 'id';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  equipment: EquipmentConfig;
}
