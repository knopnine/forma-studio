import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Clock,
  Dumbbell,
  BatteryCharging,
  Zap,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { generateDailyPlan } from '../core/planGenerator';
import type {
  EnergyLevel,
  SessionDurationMinutes,
  TargetMuscleFocus,
  WorkoutPlan,
} from '../core/types';
import { getTranslation } from '../core/i18n';

export const DailyWizardModal: React.FC = () => {
  const { profile, startWorkout, setSelectedExerciseForDetail } = useFitness();
  const t = getTranslation(profile.language);

  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('moderate');
  const [duration, setDuration] = useState<SessionDurationMinutes>(profile.preferredDuration || 30);
  const [focus, setFocus] = useState<TargetMuscleFocus>('full_body');
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  const energyOptions: { id: EnergyLevel; label: string; desc: string; icon: string }[] = [
    { id: 'high', label: t.energy_high, desc: t.energy_high_desc, icon: '⚡' },
    { id: 'moderate', label: t.energy_mod, desc: t.energy_mod_desc, icon: '🔥' },
    { id: 'low', label: t.energy_low, desc: t.energy_low_desc, icon: '🌱' },
  ];

  const durations: SessionDurationMinutes[] = [15, 30, 45, 60];

  const muscleFocuses: { id: TargetMuscleFocus; label: string }[] = [
    { id: 'full_body', label: t.focus_full_body },
    { id: 'upper_body', label: t.focus_upper_body },
    { id: 'lower_body', label: t.focus_lower_body },
    { id: 'push', label: t.focus_push },
    { id: 'pull', label: t.focus_pull },
    { id: 'legs', label: t.focus_legs },
    { id: 'core', label: t.focus_core },
    { id: 'cardio_hiit', label: t.focus_cardio },
  ];

  const handleGenerate = () => {
    const plan = generateDailyPlan({
      focus,
      durationMinutes: duration,
      energyLevel,
      profile,
    });
    setGeneratedPlan(plan);
  };

  const handleStart = () => {
    if (!generatedPlan) return;
    startWorkout(generatedPlan);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Wizard Header */}
      <div className="border-b border-[#e5e5e5] pb-4">
        <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
          {t.card_smart_daily_badge}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
          {t.wizard_title}
        </h2>
        <p className="text-xs text-[#737373] mt-1">
          {t.wizard_subtitle}
        </p>
      </div>

      {!generatedPlan ? (
        <div className="space-y-6">
          {/* Energy Level Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] block">
              {t.step_energy}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {energyOptions.map((opt) => {
                const isSelected = energyLevel === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setEnergyLevel(opt.id)}
                    className={'clinical-card p-4 flex flex-col justify-between cursor-pointer transition-all ' +
                      (isSelected
                        ? 'border-[#0a0a0a] shadow-xs'
                        : 'hover:border-[#a3a3a3]')}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{opt.icon}</span>
                        <div
                          className={'w-4 h-4 rounded-full border flex items-center justify-center ' +
                            (isSelected
                              ? 'border-[#0a0a0a] bg-[#0a0a0a]'
                              : 'border-[#d4d4d4]')}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#fafafa]" />}
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-[#0a0a0a] pt-1">{opt.label}</h4>
                      <p className="text-xs text-[#737373]">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] block">
              {t.step_duration}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durations.map((d) => {
                const isSelected = duration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={'p-4 rounded-[18px] text-center transition-all cursor-pointer border ' +
                      (isSelected
                        ? 'bg-[#0a0a0a] text-[#fafafa] border-[#0a0a0a] shadow-xs'
                        : 'bg-[#ffffff] text-[#0a0a0a] border-[#e5e5e5] hover:border-[#0a0a0a]')}
                  >
                    <span className="text-2xl font-bold block">{d}</span>
                    <span className="text-[11px] font-medium opacity-80">{t.mins}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Muscle Target Focus */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] block">
              {t.step_focus}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {muscleFocuses.map((f) => {
                const isSelected = focus === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFocus(f.id)}
                    className={'py-2.5 px-3 rounded-[18px] text-xs font-semibold transition-all cursor-pointer text-center border ' +
                      (isSelected
                        ? 'bg-[#0a0a0a] text-[#fafafa] border-[#0a0a0a]'
                        : 'bg-[#ffffff] text-[#737373] border-[#e5e5e5] hover:text-[#0a0a0a] hover:border-[#a3a3a3]')}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              className="btn-primary w-full py-3.5 text-sm"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.btn_generate}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Generated Plan Review Card */
        <div className="space-y-6 animate-fadeIn">
          <div className="clinical-card p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e5]">
              <div>
                <span className="badge-solid text-[10px]">
                  {generatedPlan.estimatedMinutes} {t.mins} • {generatedPlan.energyLevel.toUpperCase()}
                </span>
                <h3 className="text-xl font-semibold text-[#0a0a0a] mt-1">{generatedPlan.title}</h3>
                <p className="text-xs text-[#737373] mt-0.5">{generatedPlan.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  className="btn-secondary text-xs py-2 px-3"
                  title={t.btn_reroll}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.btn_reroll}</span>
                </button>
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="btn-outline text-xs py-2 px-3"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t.btn_adjust}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block">
                {t.plan_prescribed_movements} ({generatedPlan.exercises.length})
              </span>

              <div className="space-y-2">
                {generatedPlan.exercises.map((pEx, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedExerciseForDetail(pEx.exercise.id)}
                    className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-between hover:border-[#0a0a0a] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-[8px] bg-[#0a0a0a] text-[#fafafa] text-xs font-bold flex items-center justify-center shrink-0 shadow-xs select-none">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize group-hover:text-[#171717]">
                          {pEx.exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#737373] capitalize">
                            {pEx.exercise.target} • {pEx.exercise.equipment}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#0a0a0a]">
                        {pEx.targetSets} × {pEx.targetReps} reps
                      </span>
                      <span className="text-[10px] text-[#737373] block">
                        {pEx.restBetweenSetsSeconds}s rest
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleStart}
                className="btn-primary w-full py-3.5 text-sm font-semibold"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t.btn_start_active}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
