import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { generateDailyPlan } from '../core/planGenerator';
import type { TargetMuscleFocus } from '../core/types';

interface SplitRoutine {
  id: string;
  title: string;
  focus: TargetMuscleFocus;
  subtitle: string;
  description: string;
  frequency: string;
  durationMinutes: 30 | 45 | 60;
  highlights: string[];
}

const SPLIT_PROGRAMS: SplitRoutine[] = [
  {
    id: 'ppl_push',
    title: 'Push Day (Chest / Shoulders / Triceps)',
    focus: 'push',
    subtitle: 'Pushing Power & Upper Definition',
    description: 'Focuses on horizontal and vertical pressing variations with pushups, dips, and overhead presses.',
    frequency: '2x per week',
    durationMinutes: 45,
    highlights: ['Pectorals', 'Anterior Delts', 'Triceps'],
  },
  {
    id: 'ppl_pull',
    title: 'Pull Day (Back / Lats / Biceps)',
    focus: 'pull',
    subtitle: 'V-Taper & Pulling Strength',
    description: 'Emphasizes pull-ups, chin-ups, inverted rows, and dumbbell bicep contractions.',
    frequency: '2x per week',
    durationMinutes: 45,
    highlights: ['Lats', 'Rhomboids', 'Biceps'],
  },
  {
    id: 'ppl_legs',
    title: 'Legs & Core Foundation',
    focus: 'legs',
    subtitle: 'Lower Body Strength & Balance',
    description: 'Pistol squat progressions, bulgarian split squats, romanian deadlifts, and calf work.',
    frequency: '2x per week',
    durationMinutes: 45,
    highlights: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    id: 'full_body_calisthenics',
    title: 'Full Body Calisthenics Mastery',
    focus: 'full_body',
    subtitle: 'Bodyweight Mastery & Skills',
    description: 'Comprehensive whole-body compound training targeting strength, balance, and athletic power.',
    frequency: '3x per week',
    durationMinutes: 45,
    highlights: ['Skill Progressions', 'Compound Mechanics', 'Endurance'],
  },
  {
    id: 'hiit_burn',
    title: 'Metabolic HIIT & Core Burner',
    focus: 'cardio_hiit',
    subtitle: 'Fat Loss & Conditioning',
    description: 'High tempo circuits designed to elevate heart rate, build core resilience, and maximize calorie expenditure.',
    frequency: '2-3x per week',
    durationMinutes: 30,
    highlights: ['Conditioning', 'Core Stability', 'Metabolic Rate'],
  },
];

export const WeeklySplitsView: React.FC = () => {
  const { profile, startWorkout } = useFitness();

  const handleStartSplit = (split: SplitRoutine) => {
    const plan = generateDailyPlan({
      focus: split.focus,
      durationMinutes: split.durationMinutes,
      energyLevel: 'moderate',
      profile,
    });
    startWorkout(plan);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
        <div>
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
            Structured Periodization
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
            Weekly Split Routines
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPLIT_PROGRAMS.map((split) => (
          <div
            key={split.id}
            className="clinical-card flex flex-col justify-between space-y-4 hover:border-[#0a0a0a] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge-solid text-[10px]">{split.frequency}</span>
                <span className="text-xs text-[#737373]">{split.durationMinutes} Mins</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a]">{split.title}</h3>
              <p className="text-xs text-[#737373]">{split.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {split.highlights.map((h, i) => (
                  <span key={i} className="badge-soft text-[11px]">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartSplit(split)}
              className="btn-primary text-xs py-2.5 px-4 w-full justify-between"
            >
              <span>Launch Session</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
