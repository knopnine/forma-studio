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
});
