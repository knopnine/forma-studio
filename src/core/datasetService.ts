import rawExercisesData from '../data/exercises.json';
import type { EnrichedExercise, RawExercise, StandardEquipmentType } from './types';

// Map raw exercise to its primary standard equipment category
function mapEquipmentCategory(raw: RawExercise): StandardEquipmentType | 'other_machine' {
  const name = (raw.name || '').toLowerCase().trim();
  const eq = (raw.equipment || '').toLowerCase().trim();

  // 1. Pull-up bar movements (even if raw dataset tagged them as body weight)
  if (
    name.includes('pull-up') || 
    name.includes('pull up') || 
    name.includes('pullup') || 
    name.includes('chin-up') || 
    name.includes('chin up') || 
    name.includes('chinup') || 
    name.includes('muscle up') || 
    name.includes('muscle-up') || 
    name.includes('hanging')
  ) {
    return 'pull_up_bar';
  }

  // 2. Dip station / Parallel bar movements
  if (
    name.includes('parallel bar') || 
    name.includes('chest dip') || 
    name.includes('dip station') || 
    (name.includes('dip') && !name.includes('dumbbell') && !name.includes('band'))
  ) {
    return 'dip_station';
  }

  // 3. Stability Ball / Exercise Ball
  if (
    eq === 'stability ball' || 
    name.includes('stability ball') || 
    name.includes('exercise ball') || 
    name.includes('swiss ball')
  ) {
    return 'stability_ball';
  }

  // 4. Barbell
  if (eq === 'barbell' || eq === 'ez barbell' || eq === 'olympic barbell' || eq === 'trap bar' || name.includes('barbell')) {
    return 'barbell';
  }

  // 5. Dumbbell
  if (eq === 'dumbbell' || name.includes('dumbbell')) {
    return 'dumbbell';
  }

  // 6. Resistance Bands
  if (eq === 'band' || eq === 'resistance band' || name.includes('band')) {
    return 'resistance_band';
  }

  // 7. Kettlebell
  if (eq === 'kettlebell' || name.includes('kettlebell')) {
    return 'kettlebell';
  }

  // 8. Cable Machine
  if (eq === 'cable' || name.includes('cable')) {
    return 'cable_machine';
  }

  // 9. Pure Bodyweight
  if (eq === 'body weight' || eq === 'bodyweight' || eq === 'assisted' || eq === 'weighted') {
    return 'body_weight';
  }

  return 'other_machine';
}

// Estimate difficulty from exercise name and category
function estimateDifficulty(exercise: RawExercise): 'beginner' | 'intermediate' | 'advanced' {
  const name = exercise.name.toLowerCase();
  const eq = (exercise.equipment || '').toLowerCase();

  if (
    name.includes('one arm') ||
    name.includes('single arm') ||
    name.includes('handstand') ||
    name.includes('muscle-up') ||
    name.includes('dragon flag') ||
    name.includes('pistol squat') ||
    name.includes('planche') ||
    name.includes('front lever') ||
    name.includes('back lever') ||
    name.includes('human flag')
  ) {
    return 'advanced';
  }

  if (
    name.includes('pull-up') ||
    name.includes('chin-up') ||
    name.includes('dip') ||
    name.includes('diamond') ||
    name.includes('decline') ||
    name.includes('bulgarian') ||
    name.includes('hanging') ||
    name.includes('pike') ||
    eq === 'dumbbell'
  ) {
    return 'intermediate';
  }

  return 'beginner';
}

// Pre-enrich all exercises once on load
const ALL_ENRICHED_EXERCISES: EnrichedExercise[] = (rawExercisesData as RawExercise[]).map((raw) => {
  const diff = estimateDifficulty(raw);
  const eqCat = mapEquipmentCategory(raw);
  const isSkill = raw.category === 'chest' || raw.category === 'back' || raw.category === 'shoulders' || raw.category === 'waist';

  return {
    ...raw,
    difficulty: diff,
    isCalisthenicSkill: isSkill && (eqCat === 'body_weight' || eqCat === 'pull_up_bar' || eqCat === 'dip_station'),
    equipmentCategory: eqCat,
    estimatedSecondsPerSet: 45,
  };
});

export const ExerciseDataset = {
  getAll(): EnrichedExercise[] {
    return ALL_ENRICHED_EXERCISES;
  },

  getById(id: string): EnrichedExercise | undefined {
    return ALL_ENRICHED_EXERCISES.find((e) => e.id === id);
  },

  search(params: {
    query?: string;
    category?: string;
    target?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    equipmentCategory?: StandardEquipmentType | 'all';
    limit?: number;
  }): EnrichedExercise[] {
    let result = ALL_ENRICHED_EXERCISES;

    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      result = result.filter((e) => (e.category || '').toLowerCase() === cat);
    }

    if (params.target && params.target !== 'all') {
      const tgt = params.target.toLowerCase();
      result = result.filter((e) => (e.target || '').toLowerCase() === tgt);
    }

    if (params.difficulty) {
      result = result.filter((e) => e.difficulty === params.difficulty);
    }

    if (params.equipmentCategory && params.equipmentCategory !== 'all') {
      result = result.filter((e) => e.equipmentCategory === params.equipmentCategory);
    }

    if (params.query && params.query.trim().length > 0) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.target || '').toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q) ||
          (e.equipment || '').toLowerCase().includes(q)
      );
    }

    if (params.limit && params.limit > 0) {
      return result.slice(0, params.limit);
    }

    return result;
  },

  getMediaUrl(pathSnippet?: string): string | null {
    if (!pathSnippet) return null;
    if (pathSnippet.startsWith('http://') || pathSnippet.startsWith('https://')) {
      return pathSnippet;
    }
    return 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/' + pathSnippet;
  },

  getCategories(): string[] {
    return Array.from(new Set(ALL_ENRICHED_EXERCISES.map((e) => e.category).filter(Boolean))).sort();
  },

  getTargets(): string[] {
    return Array.from(new Set(ALL_ENRICHED_EXERCISES.map((e) => e.target).filter(Boolean))).sort();
  },

  getAlternatives(exerciseId: string, limit = 5): EnrichedExercise[] {
    const targetExercise = this.getById(exerciseId);
    if (!targetExercise) return [];

    return ALL_ENRICHED_EXERCISES.filter(
      (e) =>
        e.id !== targetExercise.id &&
        (e.target === targetExercise.target || e.category === targetExercise.category)
    ).slice(0, limit);
  },
};
