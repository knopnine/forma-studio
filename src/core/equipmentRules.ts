import type { EquipmentConfig, EnrichedExercise, ImprovisedTool, StandardEquipmentType, RawExercise } from './types';

// Default improvised gear presets for at-home training
export const DEFAULT_IMPROVISED_TOOLS: ImprovisedTool[] = [
  {
    id: 'chair-pair',
    name: '2 Sturdy Dining Chairs / Bed Edge',
    category: 'chair',
    description: 'Used for chair dips, elevated push-ups, bulgarian split squats, and step-ups.',
    mapsToStandard: ['body_weight', 'dip_station', 'bench', 'box_chair'],
    isEnabled: true,
    notes: 'Place against a wall for maximum stability during dips.',
  },
  {
    id: 'heavy-backpack',
    name: 'Heavy Backpack (Books / Water Bottles)',
    category: 'backpack',
    description: 'Improvised weighted resistance for loaded squats, push-ups, rows, and overhead presses.',
    mapsToStandard: ['dumbbell'],
    customWeightKg: 8,
    isEnabled: true,
    notes: 'Fill with books or water bottles for progressive loading.',
  },
  {
    id: 'towel-smooth-floor',
    name: 'Towel & Smooth Floor (Tile/Wood)',
    category: 'towel_floor',
    description: 'Slider mechanics for bodyweight hamstring curls, ab rollouts, and sliding lunges.',
    mapsToStandard: ['body_weight', 'ab_wheel'],
    isEnabled: true,
    notes: 'Great for high-tension posterior chain and core isolation.',
  },
  {
    id: 'door-frame-anchor',
    name: 'Door Frame & Under-Door Anchor',
    category: 'door_anchor',
    description: 'Firm anchoring for doorway rows, resistance band attachments, and isometric holds.',
    mapsToStandard: ['resistance_band', 'pull_up_bar'],
    isEnabled: true,
    notes: 'Secure resistance bands over top or bottom of a closed sturdy door.',
  },
  {
    id: 'sturdy-wall',
    name: 'Clear Wall Space',
    category: 'wall',
    description: 'Used for wall sits, wall handstands, handstand push-up progressions, and calf raises.',
    mapsToStandard: ['body_weight'],
    isEnabled: true,
  },
];

export const DEFAULT_EQUIPMENT_CONFIG: EquipmentConfig = {
  // Free weights & Calisthenics
  hasBodyweight: true,
  hasDumbbells: true,
  hasBarbell: false,
  hasKettlebell: false,
  hasPullUpBar: true,
  hasDipStation: false,
  hasResistanceBands: true,

  // Benches, Elevation & Balls / Core
  hasBench: false,
  hasBoxOrChair: true,
  hasStabilityBall: false,
  hasBosuBall: false,
  hasMedicineBall: false,
  hasAbWheel: false,
  hasFoamRoller: false,
  hasJumpRope: false,

  // Machines & Cables
  hasCableMachine: false,
  hasSmithMachine: false,
  hasLeverageMachine: false,

  dumbbellWeightsKg: [5, 10, 15, 20],
  improvisedTools: DEFAULT_IMPROVISED_TOOLS,
};

/**
 * Extracts all primary and secondary/auxiliary equipment required by an exercise
 */
export function getExerciseRequiredEquipment(exercise: RawExercise | EnrichedExercise): StandardEquipmentType[] {
  const name = (exercise.name || '').toLowerCase().trim();
  const eq = (exercise.equipment || '').toLowerCase().trim();
  const required = new Set<StandardEquipmentType>();

  // 1. Primary equipment mapping
  if (eq === 'body weight' || eq === 'bodyweight') required.add('body_weight');
  else if (eq === 'dumbbell') required.add('dumbbell');
  else if (eq === 'barbell' || eq === 'ez barbell' || eq === 'olympic barbell' || eq === 'trap bar') required.add('barbell');
  else if (eq === 'band' || eq === 'resistance band') required.add('resistance_band');
  else if (eq === 'kettlebell') required.add('kettlebell');
  else if (eq === 'cable') required.add('cable_machine');
  else if (eq === 'stability ball') required.add('stability_ball');
  else if (eq === 'bosu ball') required.add('bosu_ball');
  else if (eq === 'medicine ball') required.add('medicine_ball');
  else if (eq === 'smith machine') required.add('smith_machine');
  else if (
    eq === 'leverage machine' || 
    eq === 'sled machine' || 
    eq === 'skierg machine' || 
    eq === 'upper body ergometer' || 
    eq === 'stationary bike' || 
    eq === 'elliptical machine' || 
    eq === 'stepmill machine' ||
    eq === 'hammer' ||
    eq === 'tire'
  ) {
    required.add('leverage_machine');
  }
  else if (eq === 'roller') required.add('foam_roller');
  else if (eq === 'wheel roller') required.add('ab_wheel');
  else if (eq === 'rope') required.add('jump_rope');
  else if (eq === 'assisted' || eq === 'weighted') required.add('body_weight');

  // 2. Auxiliary Equipment parsed from Name & Instructions
  // Stability / Swiss / Exercise Ball
  if (
    name.includes('stability ball') || 
    name.includes('exercise ball') || 
    name.includes('swiss ball') || 
    (name.includes(' ball') && !name.includes('medicine') && !name.includes('bosu') && !name.includes('biceps') && !name.includes('ballistic'))
  ) {
    required.add('stability_ball');
  }

  // Bosu Ball
  if (name.includes('bosu')) {
    required.add('bosu_ball');
  }

  // Medicine Ball
  if (name.includes('medicine ball')) {
    required.add('medicine_ball');
  }

  // Bench (Flat, Incline, Decline, Preacher)
  if (name.includes('bench') || name.includes('incline') || name.includes('decline') || name.includes('preacher')) {
    required.add('bench');
  }

  // Pull-up Bar
  if (name.includes('pull-up') || name.includes('pullup') || name.includes('chin-up') || name.includes('chinup')) {
    required.add('pull_up_bar');
  }

  // Dip Station / Parallel Bars
  if (
    name.includes('parallel bar') || 
    name.includes('chest dip') || 
    name.includes('dip station') || 
    (name.includes('dip') && !name.includes('dumbbell') && !name.includes('band'))
  ) {
    required.add('dip_station');
  }

  // Ab Wheel
  if (name.includes('wheel roller') || name.includes('ab wheel') || name.includes('rollerout')) {
    required.add('ab_wheel');
  }

  // Foam Roller
  if (name.includes('foam roll') || (name.includes('roller') && !name.includes('wheel'))) {
    required.add('foam_roller');
  }

  // Box / Step / Chair
  if (name.includes('box jump') || name.includes('box step') || name.includes('chair') || name.includes('step-up')) {
    required.add('box_chair');
  }

  // Barbell mentions
  if (name.includes('barbell')) {
    required.add('barbell');
  }

  // Kettlebell mentions
  if (name.includes('kettlebell')) {
    required.add('kettlebell');
  }

  // Band mentions
  if (name.includes('band')) {
    required.add('resistance_band');
  }

  // Cable mentions
  if (name.includes('cable')) {
    required.add('cable_machine');
  }

  return Array.from(required);
}

/**
 * Checks if a specific exercise from the dataset can be performed with the user's current equipment.
 * Returns true ONLY if all required primary AND auxiliary gear items are available.
 */
export function isExerciseCompatibleWithEquipment(
  exercise: EnrichedExercise | RawExercise,
  config: EquipmentConfig
): boolean {
  const reqs = getExerciseRequiredEquipment(exercise);

  for (const r of reqs) {
    if (r === 'body_weight') {
      if (!config.hasBodyweight) return false;
    } else if (r === 'dumbbell') {
      const hasDirect = config.hasDumbbells;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && t.mapsToStandard.includes('dumbbell')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'barbell') {
      if (!config.hasBarbell) return false;
    } else if (r === 'kettlebell') {
      const hasDirect = config.hasKettlebell;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && t.mapsToStandard.includes('kettlebell')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'pull_up_bar') {
      const hasDirect = config.hasPullUpBar;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && t.mapsToStandard.includes('pull_up_bar')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'dip_station') {
      const hasDirect = config.hasDipStation || config.hasBoxOrChair;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && (t.mapsToStandard.includes('dip_station') || t.category === 'chair')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'resistance_band') {
      const hasDirect = config.hasResistanceBands;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && t.mapsToStandard.includes('resistance_band')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'bench') {
      // A bench can be substituted by a sturdy box/chair or chair improvised tool
      const hasDirect = config.hasBench || config.hasBoxOrChair;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && (t.mapsToStandard.includes('bench') || t.category === 'chair' || t.category === 'table_desk')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'box_chair') {
      const hasDirect = config.hasBoxOrChair || config.hasBench;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && (t.mapsToStandard.includes('box_chair') || t.category === 'chair')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'stability_ball') {
      if (!config.hasStabilityBall) return false;
    } else if (r === 'bosu_ball') {
      if (!config.hasBosuBall) return false;
    } else if (r === 'medicine_ball') {
      const hasDirect = config.hasMedicineBall;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && t.mapsToStandard.includes('medicine_ball')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'ab_wheel') {
      const hasDirect = config.hasAbWheel;
      const hasImprovised = config.improvisedTools.some(
        (t) => t.isEnabled && (t.mapsToStandard.includes('ab_wheel') || t.category === 'towel_floor')
      );
      if (!hasDirect && !hasImprovised) return false;
    } else if (r === 'foam_roller') {
      if (!config.hasFoamRoller) return false;
    } else if (r === 'jump_rope') {
      if (!config.hasJumpRope && !config.hasBodyweight) return false;
    } else if (r === 'cable_machine') {
      if (!config.hasCableMachine) return false;
    } else if (r === 'smith_machine') {
      if (!config.hasSmithMachine) return false;
    } else if (r === 'leverage_machine') {
      if (!config.hasLeverageMachine) return false;
    }
  }

  return true;
}

/**
 * Returns human-friendly equipment guidance & home improvisation suggestion
 */
export function getEquipmentSetupTip(exercise: EnrichedExercise | RawExercise, config: EquipmentConfig): string | null {
  const reqs = getExerciseRequiredEquipment(exercise);

  if (reqs.includes('stability_ball') && !config.hasStabilityBall) {
    return '💡 Requires an Exercise / Stability Ball. Toggle it in the Gear tab if available.';
  }
  if (reqs.includes('bench') && !config.hasBench) {
    return '💡 No workout bench? Use 2 sturdy chairs, a solid ottoman, or perform from the floor.';
  }
  if (reqs.includes('dumbbell') && !config.hasDumbbells) {
    return '💡 No dumbbells? Use your loaded Backpack or two heavy water bottles for resistance.';
  }
  if (reqs.includes('dip_station') && !config.hasDipStation) {
    return '💡 Use the edge of a sturdy chair or couch bed for dip support.';
  }
  if (reqs.includes('pull_up_bar') && !config.hasPullUpBar) {
    return '💡 Perform Doorframe Rows or Towel Bed-Sheet Lat Rows as an improvised back builder.';
  }
  if (reqs.includes('resistance_band') && !config.hasResistanceBands) {
    return '💡 Substitute with slow isometric contractions or a loaded backpack.';
  }
  return null;
}
