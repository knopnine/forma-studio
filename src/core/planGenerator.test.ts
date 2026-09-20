import { describe, it, expect } from 'vitest';
import { generateDailyPlan, swapPlannedExercise } from './planGenerator';
import { DEFAULT_EQUIPMENT_CONFIG } from './equipmentRules';
import type { UserProfile } from './types';

const mockProfile: UserProfile = {
  name: 'Test Athlete',
  experienceLevel: 'intermediate',
  primaryGoal: 'hypertrophy',
  weeklyTargetSessions: 4,
  preferredDuration: 30,
  language: 'en',
  soundEnabled: true,
  hapticsEnabled: true,
  equipment: {
    ...DEFAULT_EQUIPMENT_CONFIG,
    hasDumbbells: true,
    hasPullUpBar: true,
  },
};

describe('planGenerator', () => {
  it('generates a daily workout plan with valid structure', () => {
    const plan = generateDailyPlan({
      focus: 'full_body',
      durationMinutes: 30,
      energyLevel: 'moderate',
      profile: mockProfile,
    });

    expect(plan.id).toBeDefined();
    expect(plan.title).toContain('Full-Body');
    expect(plan.exercises.length).toBeGreaterThanOrEqual(3);
    expect(plan.estimatedMinutes).toBe(30);
    expect(plan.energyLevel).toBe('moderate');

    // First exercise should be warmup
    expect(plan.exercises[0].role).toBe('warmup');

    // Each planned exercise has sets
    plan.exercises.forEach((pEx) => {
      expect(pEx.sets.length).toBeGreaterThan(0);
      expect(pEx.targetSets).toBe(pEx.sets.length);
      expect(pEx.targetReps).toBeGreaterThan(0);
      expect(pEx.restBetweenSetsSeconds).toBeGreaterThan(0);
    });
  });

  it('adjusts volume based on energy level', () => {
    const highPlan = generateDailyPlan({
      focus: 'push',
      durationMinutes: 45,
      energyLevel: 'high',
      profile: mockProfile,
    });

    const lowPlan = generateDailyPlan({
      focus: 'push',
      durationMinutes: 45,
      energyLevel: 'low',
      profile: mockProfile,
    });

    expect(highPlan.energyLevel).toBe('high');
    expect(lowPlan.energyLevel).toBe('low');
    // High intensity should have more or equal exercises than low intensity
    expect(highPlan.exercises.length).toBeGreaterThanOrEqual(lowPlan.exercises.length);
  });

  it('allows swapping a planned exercise with an alternative', () => {
    const plan = generateDailyPlan({
      focus: 'pull',
      durationMinutes: 30,
      energyLevel: 'moderate',
      profile: mockProfile,
    });

    const originalFirstExercise = plan.exercises[0].exercise;
    const alternativeId = plan.exercises[0].suggestedAlternatives[0] || 'push-up';

    const updatedPlan = swapPlannedExercise(plan, 0, alternativeId, mockProfile);
    expect(updatedPlan.exercises[0].exercise.id).toBe(alternativeId);
    expect(updatedPlan.exercises[0].exercise.id).not.toBe(originalFirstExercise.id);
  });

  it('strictly filters only beginner exercises when experienceLevel is beginner', () => {
    const beginnerPlan = generateDailyPlan({
      focus: 'full_body',
      durationMinutes: 45,
      energyLevel: 'moderate',
      profile: mockProfile,
      experienceLevel: 'beginner',
    });

    expect(beginnerPlan.exercises.length).toBeGreaterThanOrEqual(3);
    beginnerPlan.exercises.forEach((pEx) => {
      expect(pEx.exercise.difficulty).toBe('beginner');
    });
  });

  it('strictly obeys customEquipment passed to generator over profile equipment', () => {
    // Bodyweight only override
    const bodyweightOnlyEquipment = {
      ...DEFAULT_EQUIPMENT_CONFIG,
      hasBodyweight: true,
      hasDumbbells: false,
      hasBarbell: false,
      hasPullUpBar: false,
      improvisedTools: [],
    };

    const plan = generateDailyPlan({
      focus: 'push',
      durationMinutes: 30,
      energyLevel: 'moderate',
      profile: mockProfile, // has dumbbells in profile
      customEquipment: bodyweightOnlyEquipment, // but overridden here
    });

    plan.exercises.forEach((pEx) => {
      expect(pEx.exercise.equipmentCategory).not.toBe('dumbbell');
      expect(pEx.exercise.equipmentCategory).not.toBe('barbell');
      expect(pEx.exercise.equipmentCategory).not.toBe('pull_up_bar');
    });
  });

  it('prioritizes advanced and intermediate movements when experienceLevel is advanced', () => {
    const advPlan = generateDailyPlan({
      focus: 'pull',
      durationMinutes: 45,
      energyLevel: 'high',
      profile: mockProfile,
      experienceLevel: 'advanced',
    });

    expect(advPlan.exercises.length).toBeGreaterThanOrEqual(3);
    const difficulties = advPlan.exercises.map((p) => p.exercise.difficulty);
    // Should include intermediate or advanced movements
    const hasIntermediateOrAdv = difficulties.some((d) => d === 'intermediate' || d === 'advanced');
    expect(hasIntermediateOrAdv).toBe(true);
  });
});
