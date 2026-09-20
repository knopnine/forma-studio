import { describe, it, expect } from 'vitest';
import {
  getExerciseRequiredEquipment,
  isExerciseCompatibleWithEquipment,
  DEFAULT_EQUIPMENT_CONFIG,
} from './equipmentRules';
import type { EnrichedExercise, EquipmentConfig } from './types';

function createMockExercise(overrides: Partial<EnrichedExercise> = {}): EnrichedExercise {
  return {
    id: 'test-1',
    name: 'Push-Up',
    category: 'chest',
    body_part: 'chest',
    equipment: 'body weight',
    target: 'pectorals',
    equipmentCategory: 'body_weight',
    difficulty: 'beginner',
    isCalisthenicSkill: false,
    ...overrides,
  };
}

describe('equipmentRules', () => {
  describe('getExerciseRequiredEquipment', () => {
    it('detects primary bodyweight movement', () => {
      const ex = createMockExercise({ name: 'Standard Push-Up', equipment: 'body weight' });
      const required = getExerciseRequiredEquipment(ex);
      expect(required).toContain('body_weight');
    });

    it('detects pull-up bar from exercise title even if equipment tag is body weight', () => {
      const ex = createMockExercise({
        name: 'Wide Grip Pull-Up',
        equipment: 'body weight',
        equipmentCategory: 'pull_up_bar',
      });
      const required = getExerciseRequiredEquipment(ex);
      expect(required).toContain('pull_up_bar');
    });

    it('detects stability ball mentioned in compound movement title', () => {
      const ex = createMockExercise({
        name: 'Dumbbell Chest Press On Exercise Ball',
        equipment: 'dumbbell',
        equipmentCategory: 'dumbbell',
      });
      const required = getExerciseRequiredEquipment(ex);
      expect(required).toContain('dumbbell');
      expect(required).toContain('stability_ball');
    });

    it('detects bench required for incline dumbbell press', () => {
      const ex = createMockExercise({
        name: 'Incline Dumbbell Flyes',
        equipment: 'dumbbell',
        equipmentCategory: 'dumbbell',
      });
      const required = getExerciseRequiredEquipment(ex);
      expect(required).toContain('dumbbell');
      expect(required).toContain('bench');
    });

    it('detects dip station for parallel bar dips', () => {
      const ex = createMockExercise({
        name: 'Chest Dip On Parallel Bars',
        equipment: 'body weight',
        equipmentCategory: 'dip_station',
      });
      const required = getExerciseRequiredEquipment(ex);
      expect(required).toContain('dip_station');
    });
  });

  describe('isExerciseCompatibleWithEquipment', () => {
    it('allows bodyweight exercises with default equipment', () => {
      const ex = createMockExercise({ name: 'Air Squat', equipment: 'body weight' });
      const compatible = isExerciseCompatibleWithEquipment(ex, DEFAULT_EQUIPMENT_CONFIG);
      expect(compatible).toBe(true);
    });

    it('blocks pull-up bar exercise if user does not own pull-up bar or improvised anchor', () => {
      const noPullUpConfig: EquipmentConfig = {
        ...DEFAULT_EQUIPMENT_CONFIG,
        hasPullUpBar: false,
        improvisedTools: [],
      };
      const ex = createMockExercise({
        name: 'Pull-Up',
        equipment: 'body weight',
        equipmentCategory: 'pull_up_bar',
      });
      expect(isExerciseCompatibleWithEquipment(ex, noPullUpConfig)).toBe(false);
    });

    it('blocks compound dumbbell exercise requiring bench if user has dumbbells but no bench or box/chair', () => {
      const dumbbellsNoBench: EquipmentConfig = {
        ...DEFAULT_EQUIPMENT_CONFIG,
        hasDumbbells: true,
        hasBench: false,
        hasBoxOrChair: false,
        improvisedTools: [],
      };
      const ex = createMockExercise({
        name: 'Incline Dumbbell Bench Press',
        equipment: 'dumbbell',
        equipmentCategory: 'dumbbell',
      });
      expect(isExerciseCompatibleWithEquipment(ex, dumbbellsNoBench)).toBe(false);
    });

    it('permits dumbbell bench press if user has both dumbbells and bench', () => {
      const dumbbellsAndBench: EquipmentConfig = {
        ...DEFAULT_EQUIPMENT_CONFIG,
        hasDumbbells: true,
        hasBench: true,
      };
      const ex = createMockExercise({
        name: 'Incline Dumbbell Bench Press',
        equipment: 'dumbbell',
        equipmentCategory: 'dumbbell',
      });
      expect(isExerciseCompatibleWithEquipment(ex, dumbbellsAndBench)).toBe(true);
    });

    it('allows exercises satisfied by enabled improvised household tools', () => {
      const improvisedConfig: EquipmentConfig = {
        ...DEFAULT_EQUIPMENT_CONFIG,
        hasDumbbells: false,
        improvisedTools: [
          {
            id: 'tool-jug',
            name: 'Heavy Water Jug',
            category: 'custom',
            description: '5L water bottle',
            mapsToStandard: ['dumbbell'],
            isEnabled: true,
          },
        ],
      };
      const ex = createMockExercise({
        name: 'Dumbbell Bicep Curl',
        equipment: 'dumbbell',
        equipmentCategory: 'dumbbell',
      });
      expect(isExerciseCompatibleWithEquipment(ex, improvisedConfig)).toBe(true);
    });
  });
});
