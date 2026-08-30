import { ExerciseDataset } from './datasetService';
import { isExerciseCompatibleWithEquipment } from './equipmentRules';
import { getRecommendedSetsAndReps } from './progressionRules';
import type {
  EnergyLevel,
  EquipmentConfig,
  PlannedExercise,
  SessionDurationMinutes,
  TargetMuscleFocus,
  UserProfile,
  WorkoutPlan,
} from './types';

const FOCUS_TARGET_MAPPING: Record<TargetMuscleFocus, { categories: string[]; targets: string[] }> = {
  full_body: {
    categories: ['chest', 'back', 'upper legs', 'shoulders', 'waist'],
    targets: ['pectorals', 'lats', 'quads', 'glutes', 'delts', 'abs', 'hamstrings'],
  },
  upper_body: {
    categories: ['chest', 'back', 'shoulders', 'upper arms', 'lower arms'],
    targets: ['pectorals', 'lats', 'delts', 'biceps', 'triceps', 'upper back'],
  },
  lower_body: {
    categories: ['upper legs', 'lower legs', 'waist'],
    targets: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
  },
  push: {
    categories: ['chest', 'shoulders', 'upper arms'],
    targets: ['pectorals', 'delts', 'triceps', 'serratus anterior'],
  },
  pull: {
    categories: ['back', 'upper arms', 'lower arms'],
    targets: ['lats', 'biceps', 'upper back', 'traps', 'forearms'],
  },
  legs: {
    categories: ['upper legs', 'lower legs'],
    targets: ['quads', 'hamstrings', 'glutes', 'calves'],
  },
  core: {
    categories: ['waist'],
    targets: ['abs', 'obliques', 'spine'],
  },
  cardio_hiit: {
    categories: ['cardio', 'waist', 'upper legs'],
    targets: ['cardiovascular system', 'quads', 'abs'],
  },
};

export function generateDailyPlan(params: {
  focus: TargetMuscleFocus;
  durationMinutes: SessionDurationMinutes;
  energyLevel: EnergyLevel;
  profile: UserProfile;
  customEquipment?: EquipmentConfig;
}): WorkoutPlan {
  const equipment = params.customEquipment || params.profile.equipment;
  const goal = params.profile.primaryGoal;
  const level = params.profile.experienceLevel;

  const mapping = FOCUS_TARGET_MAPPING[params.focus] || FOCUS_TARGET_MAPPING.full_body;
  const allExercises = ExerciseDataset.getAll();

  const compatiblePool = allExercises.filter((ex) => {
    if (!isExerciseCompatibleWithEquipment(ex, equipment)) return false;
    if (level === 'beginner' && ex.difficulty === 'advanced') return false;
    return true;
  });

  const focusPool = compatiblePool.filter((ex) => {
    const catMatch = mapping.categories.includes(ex.category.toLowerCase());
    const tgtMatch = mapping.targets.includes(ex.target.toLowerCase());
    return catMatch || tgtMatch;
  });

  const finalPool = focusPool.length >= 6 ? focusPool : compatiblePool;

  let exerciseCount = 4;
  if (params.durationMinutes === 15) exerciseCount = params.energyLevel === 'low' ? 3 : 4;
  else if (params.durationMinutes === 30) exerciseCount = params.energyLevel === 'low' ? 4 : 5;
  else if (params.durationMinutes === 45) exerciseCount = params.energyLevel === 'high' ? 7 : 6;
  else if (params.durationMinutes === 60) exerciseCount = params.energyLevel === 'high' ? 8 : 7;

  const shuffled = [...finalPool].sort(() => Math.random() - 0.5);

  const selectedExercises: PlannedExercise[] = [];
  const usedTargets = new Set<string>();

  for (const ex of shuffled) {
    if (selectedExercises.length >= exerciseCount) break;

    const targetKey = ex.target.toLowerCase();
    if (usedTargets.has(targetKey) && shuffled.length > exerciseCount * 2) {
      continue;
    }

    usedTargets.add(targetKey);

    let role: PlannedExercise['role'] = 'accessory';
    if (selectedExercises.length === 0) {
      role = 'warmup';
    } else if (selectedExercises.length === 1 || selectedExercises.length === 2) {
      role = 'compound_primary';
    } else if (selectedExercises.length === exerciseCount - 1 && params.energyLevel !== 'low') {
      role = 'burnout_finisher';
    }

    const { sets, reps, restSeconds } = getRecommendedSetsAndReps(ex, goal, level, role);
    const actualSets = params.energyLevel === 'low' ? Math.max(2, sets - 1) : sets;

    const setList = Array.from({ length: actualSets }, (_, idx) => ({
      setNumber: idx + 1,
      targetReps: reps,
      targetWeightKg: ex.equipmentCategory === 'dumbbell' ? (equipment.dumbbellWeightsKg[0] || 5) : 0,
      isCompleted: false,
    }));

    const alternatives = compatiblePool
      .filter((alt) => alt.id !== ex.id && (alt.target === ex.target || alt.category === ex.category))
      .slice(0, 3)
      .map((alt) => alt.id);

    selectedExercises.push({
      exercise: ex,
      role,
      targetSets: actualSets,
      targetReps: reps,
      restBetweenSetsSeconds: restSeconds,
      sets: setList,
      suggestedAlternatives: alternatives,
      notes: role === 'warmup' ? 'Perform with fluid rhythm to prime joint mobility.' : undefined,
    });
  }

  const focusLabels: Record<TargetMuscleFocus, string> = {
    full_body: 'Full-Body Power & Tone',
    upper_body: 'Upper Body Armor',
    lower_body: 'Leg & Glute Foundation',
    push: 'Chest, Shoulders & Triceps Push',
    pull: 'Back, Lats & Biceps Pull',
    legs: 'Lower Body Strength & Power',
    core: 'Core & Abdominal Fortification',
    cardio_hiit: 'Metabolic Cardio & Calorie Burn',
  };

  const energySuffix =
    params.energyLevel === 'high' ? '⚡ High Intensity' : params.energyLevel === 'low' ? '🌱 Active Recovery' : '🔥 Standard';

  return {
    id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    title: focusLabels[params.focus] + ' (' + energySuffix + ')',
    description: 'A customized ' + params.durationMinutes + '-minute home session targeting ' + params.focus.replace('_', ' ') + ' with your available gear.',
    focus: params.focus,
    estimatedMinutes: params.durationMinutes,
    energyLevel: params.energyLevel,
    requiredEquipment: Array.from(new Set(selectedExercises.map((e) => e.exercise.equipment))),
    exercises: selectedExercises,
    createdAt: new Date().toISOString(),
  };
}

export function swapPlannedExercise(
  currentPlan: WorkoutPlan,
  exerciseIndex: number,
  newExerciseId: string,
  profile: UserProfile
): WorkoutPlan {
  const newExercise = ExerciseDataset.getById(newExerciseId);
  if (!newExercise || !currentPlan.exercises[exerciseIndex]) return currentPlan;

  const targetPlan = { ...currentPlan };
  const prevPlanned = targetPlan.exercises[exerciseIndex];

  const { sets, reps, restSeconds } = getRecommendedSetsAndReps(
    newExercise,
    profile.primaryGoal,
    profile.experienceLevel,
    prevPlanned.role
  );

  const updatedSets = Array.from({ length: sets }, (_, i) => ({
    setNumber: i + 1,
    targetReps: reps,
    targetWeightKg: newExercise.equipmentCategory === 'dumbbell' ? (profile.equipment.dumbbellWeightsKg[0] || 5) : 0,
    isCompleted: false,
  }));

  const updatedExercises = [...targetPlan.exercises];
  updatedExercises[exerciseIndex] = {
    ...prevPlanned,
    exercise: newExercise,
    targetSets: sets,
    targetReps: reps,
    restBetweenSetsSeconds: restSeconds,
    sets: updatedSets,
  };

  return {
    ...targetPlan,
    exercises: updatedExercises,
  };
}
