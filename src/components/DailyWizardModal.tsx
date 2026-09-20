import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Wrench,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { generateDailyPlan } from '../core/planGenerator';
import type {
  EnergyLevel,
  EquipmentConfig,
  ExperienceLevel,
  SessionDurationMinutes,
  TargetMuscleFocus,
  WorkoutPlan,
} from '../core/types';
import { getTranslation } from '../core/i18n';

export const DailyWizardModal: React.FC = () => {
  const { profile, updateEquipment, startWorkout, setSelectedExerciseForDetail, setCurrentTab } = useFitness();
  const t = getTranslation(profile.language);

  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('moderate');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel || 'intermediate');
  const [duration, setDuration] = useState<SessionDurationMinutes>(profile.preferredDuration || 30);
  const [focus, setFocus] = useState<TargetMuscleFocus>('full_body');
  const [equipment, setEquipment] = useState<EquipmentConfig>(() => ({ ...profile.equipment }));
  const [showAllEquipment, setShowAllEquipment] = useState<boolean>(false);
  const [saveAsDefaultGear, setSaveAsDefaultGear] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  const energyOptions: { id: EnergyLevel; label: string; desc: string; icon: string }[] = [
    { id: 'high', label: t.energy_high, desc: t.energy_high_desc, icon: '⚡' },
    { id: 'moderate', label: t.energy_mod, desc: t.energy_mod_desc, icon: '🔥' },
    { id: 'low', label: t.energy_low, desc: t.energy_low_desc, icon: '🌱' },
  ];

  const levelOptions: { id: ExperienceLevel; label: string; badge: string; desc: string }[] = [
    {
      id: 'beginner',
      label: t.level_beginner,
      badge: 'Foundations',
      desc: t.level_beginner_desc,
    },
    {
      id: 'intermediate',
      label: t.level_intermediate,
      badge: 'Progressive',
      desc: t.level_intermediate_desc,
    },
    {
      id: 'advanced',
      label: t.level_advanced,
      badge: 'Peak Skill',
      desc: t.level_advanced_desc,
    },
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

  const primaryGearKeys: { key: keyof Omit<EquipmentConfig, 'dumbbellWeightsKg' | 'improvisedTools'>; label: string }[] = [
    { key: 'hasBodyweight', label: 'Bodyweight' },
    { key: 'hasDumbbells', label: 'Dumbbells' },
    { key: 'hasPullUpBar', label: 'Pull-Up Bar' },
    { key: 'hasResistanceBands', label: 'Resistance Bands' },
    { key: 'hasBench', label: 'Workout Bench' },
    { key: 'hasDipStation', label: 'Dip Station' },
    { key: 'hasKettlebell', label: 'Kettlebells' },
    { key: 'hasBarbell', label: 'Barbell' },
    { key: 'hasJumpRope', label: 'Jump Rope' },
    { key: 'hasAbWheel', label: 'Ab Wheel' },
  ];

  const secondaryGearKeys: { key: keyof Omit<EquipmentConfig, 'dumbbellWeightsKg' | 'improvisedTools'>; label: string }[] = [
    { key: 'hasBoxOrChair', label: 'Box / Chair' },
    { key: 'hasStabilityBall', label: 'Stability Ball' },
    { key: 'hasBosuBall', label: 'Bosu Ball' },
    { key: 'hasMedicineBall', label: 'Medicine Ball' },
    { key: 'hasFoamRoller', label: 'Foam Roller' },
    { key: 'hasCableMachine', label: 'Cable Machine' },
    { key: 'hasSmithMachine', label: 'Smith Machine' },
    { key: 'hasLeverageMachine', label: 'Leverage Machine' },
  ];

  const applyPreset = (preset: 'bodyweight' | 'minimal' | 'saved') => {
    if (preset === 'bodyweight') {
      setEquipment({
        ...profile.equipment,
        hasBodyweight: true,
        hasDumbbells: false,
        hasBarbell: false,
        hasKettlebell: false,
        hasPullUpBar: false,
        hasDipStation: false,
        hasResistanceBands: false,
        hasBench: false,
        hasBoxOrChair: false,
        hasStabilityBall: false,
        hasBosuBall: false,
        hasMedicineBall: false,
        hasAbWheel: false,
        hasFoamRoller: false,
        hasJumpRope: false,
        hasCableMachine: false,
        hasSmithMachine: false,
        hasLeverageMachine: false,
        improvisedTools: [],
      });
    } else if (preset === 'minimal') {
      setEquipment({
        ...profile.equipment,
        hasBodyweight: true,
        hasDumbbells: true,
        hasPullUpBar: true,
        hasResistanceBands: true,
        hasBarbell: false,
        hasKettlebell: false,
        hasDipStation: false,
        hasBench: false,
        hasBoxOrChair: false,
        hasStabilityBall: false,
        hasBosuBall: false,
        hasMedicineBall: false,
        hasAbWheel: false,
        hasFoamRoller: false,
        hasJumpRope: false,
        hasCableMachine: false,
        hasSmithMachine: false,
        hasLeverageMachine: false,
      });
    } else if (preset === 'saved') {
      setEquipment({ ...profile.equipment });
    }
  };

  const toggleEquipmentKey = (key: keyof Omit<EquipmentConfig, 'dumbbellWeightsKg' | 'improvisedTools'>) => {
    setEquipment((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleImprovisedTool = (id: string) => {
    setEquipment((prev) => ({
      ...prev,
      improvisedTools: prev.improvisedTools.map((tool) =>
        tool.id === id ? { ...tool, isEnabled: !tool.isEnabled } : tool
      ),
    }));
  };

  const enabledGearCount =
    Object.entries(equipment).filter(([k, v]) => k.startsWith('has') && v === true).length +
    equipment.improvisedTools.filter((t) => t.isEnabled).length;

  const handleGenerate = () => {
    if (saveAsDefaultGear) {
      updateEquipment(equipment);
    }
    const plan = generateDailyPlan({
      focus,
      durationMinutes: duration,
      energyLevel,
      experienceLevel,
      customEquipment: equipment,
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
        <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#6f6f6f]">
          {t.card_smart_daily_badge}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
          {t.wizard_title}
        </h2>
        <p className="text-xs text-[#6f6f6f] mt-1">
          {t.wizard_subtitle}
        </p>
      </div>

      {!generatedPlan ? (
        <div className="space-y-6">
          {/* Energy Level Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
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
                      <p className="text-xs text-[#6f6f6f]">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Experience Level Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
              {t.step_level}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {levelOptions.map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={'clinical-card p-4 flex flex-col justify-between cursor-pointer transition-all ' +
                      (isSelected
                        ? 'border-[#0a0a0a] shadow-xs'
                        : 'hover:border-[#a3a3a3]')}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="badge-soft text-[10px] font-semibold">{lvl.badge}</span>
                        <div
                          className={'w-4 h-4 rounded-full border flex items-center justify-center ' +
                            (isSelected
                              ? 'border-[#0a0a0a] bg-[#0a0a0a]'
                              : 'border-[#d4d4d4]')}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#fafafa]" />}
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-[#0a0a0a]">{lvl.label}</h4>
                      <p className="text-xs text-[#6f6f6f] leading-relaxed">{lvl.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Duration Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
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

          {/* Step 4: Muscle Target Focus */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
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
                        : 'bg-[#ffffff] text-[#6f6f6f] border-[#e5e5e5] hover:text-[#0a0a0a] hover:border-[#a3a3a3]')}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Available Equipment Today */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
                {t.step_gear_today}
              </label>
              <div className="flex items-center gap-1.5 text-xs text-[#6f6f6f] font-medium">
                <Wrench className="w-3.5 h-3.5 text-[#0a0a0a]" />
                <span>{enabledGearCount} {t.gear_active_count}</span>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('bodyweight')}
                className="px-3 py-1.5 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-xs font-medium text-[#0a0a0a] border border-[#e5e5e5] transition-colors cursor-pointer"
              >
                {t.gear_preset_bodyweight}
              </button>
              <button
                type="button"
                onClick={() => applyPreset('minimal')}
                className="px-3 py-1.5 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-xs font-medium text-[#0a0a0a] border border-[#e5e5e5] transition-colors cursor-pointer"
              >
                {t.gear_preset_minimal}
              </button>
              <button
                type="button"
                onClick={() => applyPreset('saved')}
                className="px-3 py-1.5 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-xs font-medium text-[#0a0a0a] border border-[#e5e5e5] transition-colors cursor-pointer"
              >
                {t.gear_preset_saved}
              </button>
            </div>

            {/* Primary Equipment Grid Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
              {primaryGearKeys.map((item) => {
                const isEnabled = Boolean(equipment[item.key]);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleEquipmentKey(item.key)}
                    className={'p-3 rounded-[18px] flex items-center justify-between gap-2 border text-left transition-all cursor-pointer ' +
                      (isEnabled
                        ? 'bg-[#0a0a0a] text-[#fafafa] border-[#0a0a0a] shadow-xs'
                        : 'bg-[#ffffff] text-[#6f6f6f] border-[#e5e5e5] hover:border-[#0a0a0a] hover:text-[#0a0a0a]')}
                  >
                    <span className="text-xs font-semibold truncate">{item.label}</span>
                    <div
                      className={'w-4 h-4 rounded-[6px] border flex items-center justify-center shrink-0 ' +
                        (isEnabled
                          ? 'border-[#fafafa] bg-[#ffffff] text-[#0a0a0a]'
                          : 'border-[#d4d4d4] bg-[#fafafa]')}
                    >
                      {isEnabled && <Check className="w-3 h-3 text-[#0a0a0a]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Additional Gear & Custom Tools */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAllEquipment(!showAllEquipment)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a0a0a] hover:underline cursor-pointer"
              >
                {showAllEquipment ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>{t.gear_collapse}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>{t.gear_expand_all}</span>
                  </>
                )}
              </button>

              {showAllEquipment && (
                <div className="mt-3 p-4 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#6f6f6f] block mb-2">
                      Gym Apparatus & Secondary Surfaces
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {secondaryGearKeys.map((item) => {
                        const isEnabled = Boolean(equipment[item.key]);
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => toggleEquipmentKey(item.key)}
                            className={'p-2.5 rounded-[14px] flex items-center justify-between gap-1.5 border text-left transition-all cursor-pointer ' +
                              (isEnabled
                                ? 'bg-[#0a0a0a] text-[#fafafa] border-[#0a0a0a]'
                                : 'bg-[#ffffff] text-[#6f6f6f] border-[#e5e5e5] hover:border-[#a3a3a3]')}
                          >
                            <span className="text-[11px] font-semibold truncate">{item.label}</span>
                            {isEnabled && <Check className="w-3 h-3 text-[#fafafa] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {equipment.improvisedTools.length > 0 && (
                    <div>
                      <span className="text-[11px] uppercase font-bold tracking-wider text-[#6f6f6f] block mb-2">
                        Household Improvised Tools
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {equipment.improvisedTools.map((tool) => (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => toggleImprovisedTool(tool.id)}
                            className={'p-2.5 rounded-[14px] flex items-center justify-between gap-2 border text-left transition-all cursor-pointer ' +
                              (tool.isEnabled
                                ? 'bg-[#0a0a0a] text-[#fafafa] border-[#0a0a0a]'
                                : 'bg-[#ffffff] text-[#6f6f6f] border-[#e5e5e5] hover:border-[#a3a3a3]')}
                          >
                            <span className="text-[11px] font-semibold truncate">{tool.name}</span>
                            {tool.isEnabled && <Check className="w-3 h-3 text-[#fafafa] shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remember as Default Gear Setting Checkbox & Deep Config Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-xs text-[#6f6f6f] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveAsDefaultGear}
                  onChange={(e) => setSaveAsDefaultGear(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-[#d4d4d4] text-[#0a0a0a] focus:ring-0 cursor-pointer"
                />
                <span className="font-medium text-[#0a0a0a]">{t.gear_save_default}</span>
              </label>

              <button
                type="button"
                onClick={() => setCurrentTab('equipment')}
                className="text-xs text-[#6f6f6f] hover:text-[#0a0a0a] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{t.gear_manage_custom}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Action: Generate Workout Plan */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              className="btn-primary w-full py-3.5 text-sm font-semibold cursor-pointer shadow-sm hover:scale-[1.01] transition-transform"
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
                <div className="flex items-center gap-2">
                  <span className="badge-solid text-[10px]">
                    {generatedPlan.estimatedMinutes} {t.mins} • {generatedPlan.energyLevel.toUpperCase()}
                  </span>
                  <span className="badge-soft text-[10px] uppercase font-bold">
                    {experienceLevel}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#0a0a0a] mt-1.5">{generatedPlan.title}</h3>
                <p className="text-xs text-[#6f6f6f] mt-0.5">{generatedPlan.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  className="btn-secondary text-xs py-2 px-3 cursor-pointer"
                  title={t.btn_reroll}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.btn_reroll}</span>
                </button>
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="btn-outline text-xs py-2 px-3 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t.btn_adjust}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f] block">
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize group-hover:text-[#171717]">
                            {pEx.exercise.name}
                          </h4>
                          <span className="badge-soft text-[9px] font-medium uppercase">
                            {pEx.exercise.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#6f6f6f] capitalize">
                            {pEx.exercise.target} • {pEx.exercise.equipment}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#0a0a0a]">
                        {pEx.targetSets} × {pEx.targetReps} reps
                      </span>
                      <span className="text-[10px] text-[#6f6f6f] block">
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
                className="btn-primary w-full py-3.5 text-sm font-semibold cursor-pointer"
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
