import type { EnrichedExercise, ExperienceLevel, PrimaryGoal } from './types';

export interface ProgressionChain {
  muscleFocus: string;
  name: string;
  levels: {
    level: number;
    title: string;
    exerciseKeywords: string[];
    repRange: [number, number];
    cues: string;
  }[];
}

export const CALISTHENICS_PROGRESSIONS: ProgressionChain[] = [
  {
    muscleFocus: 'push_horizontal',
    name: 'Push-Up Mastery Tree',
    levels: [
      {
        level: 1,
        title: 'Incline / Wall Push-Up',
        exerciseKeywords: ['incline push-up', 'wall push-up'],
        repRange: [10, 15],
        cues: 'Focus on shoulder blade depression and strict core bracing.',
      },
      {
        level: 2,
        title: 'Standard Push-Up',
        exerciseKeywords: ['push-up', 'pushup'],
        repRange: [8, 15],
        cues: 'Chest touches floor, elbows at 45 degrees, full lockout.',
      },
      {
        level: 3,
        title: 'Diamond / Close-Grip Push-Up',
        exerciseKeywords: ['diamond push-up', 'close-grip push-up', 'triceps pushdown'],
        repRange: [8, 12],
        cues: 'High triceps and inner chest tension, slow 3-second descent.',
      },
      {
        level: 4,
        title: 'Decline / Archer Push-Up',
        exerciseKeywords: ['decline push-up', 'archer push-up', 'wide-arm push-up'],
        repRange: [6, 10],
        cues: 'Shift weight laterally or elevate feet on a chair.',
      },
      {
        level: 5,
        title: 'One-Arm / Plyometric Push-Up',
        exerciseKeywords: ['one arm push-up', 'clap push-up', 'explosive push-up'],
        repRange: [4, 8],
        cues: 'Peak upper body power and unilateral chest control.',
      },
    ],
  },
  {
    muscleFocus: 'push_vertical',
    name: 'Handstand & Shoulder Tree',
    levels: [
      {
        level: 1,
        title: 'Pike Push-Up on Floor',
        exerciseKeywords: ['pike push-up', 'pike'],
        repRange: [8, 12],
        cues: 'Hips high in V-shape, lower head forward of hands.',
      },
      {
        level: 2,
        title: 'Elevated Feet Pike Push-Up (Chair)',
        exerciseKeywords: ['feet elevated pike push-up', 'incline pike'],
        repRange: [6, 10],
        cues: 'Feet on chair/bed, increases vertical load onto anterior deltoids.',
      },
      {
        level: 3,
        title: 'Wall Handstand Hold',
        exerciseKeywords: ['handstand', 'wall hold'],
        repRange: [20, 45], // seconds
        cues: 'Push ground away, hollow body posture, breath steady.',
      },
      {
        level: 4,
        title: 'Wall Handstand Push-Up',
        exerciseKeywords: ['handstand push-up', 'hspu'],
        repRange: [4, 8],
        cues: 'Full range of motion, control eccentric phase.',
      },
    ],
  },
  {
    muscleFocus: 'pull_vertical',
    name: 'Pull-Up & Back Tree',
    levels: [
      {
        level: 1,
        title: 'Doorframe / Inverted Towel Rows',
        exerciseKeywords: ['door row', 'inverted row', 'australian pull-up'],
        repRange: [10, 15],
        cues: 'Retract scaps before pulling with arms, squeeze lats.',
      },
      {
        level: 2,
        title: 'Negative / Eccentric Pull-Up',
        exerciseKeywords: ['negative pull-up', 'jump pull-up'],
        repRange: [5, 8],
        cues: 'Jump to top of bar, lower down for 4 to 5 seconds slowly.',
      },
      {
        level: 3,
        title: 'Standard Pull-Up & Chin-Up',
        exerciseKeywords: ['pull-up', 'chin-up', 'pullup'],
        repRange: [5, 10],
        cues: 'Dead hang at bottom, chin clears the bar at the top.',
      },
      {
        level: 4,
        title: 'L-Sit Pull-Up / Chest-to-Bar',
        exerciseKeywords: ['l-sit pull-up', 'chest to bar', 'archer pull-up'],
        repRange: [4, 8],
        cues: 'Engage core in 90-degree leg lift or pull with wide chest contact.',
      },
    ],
  },
  {
    muscleFocus: 'lower_body',
    name: 'Unilateral Leg & Squat Tree',
    levels: [
      {
        level: 1,
        title: 'Bodyweight Air Squat',
        exerciseKeywords: ['bodyweight squat', 'air squat', 'squat'],
        repRange: [15, 25],
        cues: 'Knees track over toes, hips break parallel.',
      },
      {
        level: 2,
        title: 'Bulgarian Split Squat (Rear Foot Elevated on Chair)',
        exerciseKeywords: ['bulgarian split squat', 'split squat', 'lunges'],
        repRange: [8, 12],
        cues: '90% of weight on front foot, torso slightly angled forward.',
      },
      {
        level: 3,
        title: 'Assisted Pistol Squat (Holding Door Frame/Chair)',
        exerciseKeywords: ['assisted pistol squat', 'single leg squat box'],
        repRange: [6, 10],
        cues: 'Single leg balance, descend with heel firmly planted.',
      },
      {
        level: 4,
        title: 'Full Free Pistol Squat / Shrimp Squat',
        exerciseKeywords: ['pistol squat', 'shrimp squat'],
        repRange: [4, 8],
        cues: 'Full unilateral knee flexion with non-working leg extended.',
      },
    ],
  },
  {
    muscleFocus: 'core',
    name: 'Core & Abdominal Stability Tree',
    levels: [
      {
        level: 1,
        title: 'Plank & Deadbug Holds',
        exerciseKeywords: ['plank', 'dead bug', 'bird dog'],
        repRange: [30, 60], // seconds
        cues: 'Tuck pelvis, pull belly button inward, anti-extension.',
      },
      {
        level: 2,
        title: 'Hanging / Lying Knee Raises',
        exerciseKeywords: ['knee raise', 'hanging knee raise', 'reverse crunch'],
        repRange: [10, 15],
        cues: 'Flex pelvis up towards ribcage without swinging.',
      },
      {
        level: 3,
        title: 'Hanging Straight Leg Raise / L-Sit',
        exerciseKeywords: ['hanging leg raise', 'l-sit', 'toes to bar'],
        repRange: [6, 12],
        cues: 'Straight legs, touch toes to bar or hold 90-degree angle.',
      },
    ],
  },
];

/**
 * Calculates optimal target reps and rest based on user level and goal
 */
export function getRecommendedSetsAndReps(
  exercise: EnrichedExercise,
  goal: PrimaryGoal,
  level: ExperienceLevel,
  role: 'warmup' | 'compound_primary' | 'accessory' | 'burnout_finisher' | 'cooldown'
): { sets: number; reps: number; restSeconds: number } {
  if (role === 'warmup') {
    return { sets: 2, reps: 10, restSeconds: 30 };
  }
  if (role === 'cooldown') {
    return { sets: 1, reps: 1, restSeconds: 15 };
  }
  if (role === 'burnout_finisher') {
    return { sets: 3, reps: 15, restSeconds: 45 };
  }

  // Base rep targets by goal
  switch (goal) {
    case 'strength_skills':
      return role === 'compound_primary'
        ? { sets: level === 'beginner' ? 3 : 4, reps: 5, restSeconds: 120 }
        : { sets: 3, reps: 8, restSeconds: 90 };
    case 'hypertrophy':
      return role === 'compound_primary'
        ? { sets: level === 'beginner' ? 3 : 4, reps: 8, restSeconds: 90 }
        : { sets: 3, reps: 12, restSeconds: 60 };
    case 'fat_loss_hiit':
      return { sets: 3, reps: 15, restSeconds: 40 };
    case 'mobility_core':
      return { sets: 3, reps: 12, restSeconds: 45 };
    default:
      return { sets: 3, reps: 10, restSeconds: 60 };
  }
}
