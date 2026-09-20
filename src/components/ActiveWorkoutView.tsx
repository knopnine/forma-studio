import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  RotateCcw,
  Info,
  Timer,
  PlayCircle,
  Sparkles,
  Search,
  X,
  Trophy,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Flame,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { ExerciseDataset } from '../core/datasetService';
import { isExerciseCompatibleWithEquipment } from '../core/equipmentRules';
import { getTranslation } from '../core/i18n';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import type { CompletedWorkoutLog } from '../core/types';

export const ActiveWorkoutView: React.FC = () => {
  const {
    activePlan,
    workoutStartTime,
    profile,
    personalRecords,
    toggleSetComplete,
    updateSetValues,
    swapExercise,
    finishActiveWorkout,
    cancelActiveWorkout,
    startRestTimer,
    setSelectedExerciseForDetail,
    setCurrentTab,
  } = useFitness();

  const t = getTranslation(profile.language);

  const [notes, setNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [swapSearchQuery, setSwapSearchQuery] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stepper' | 'all'>('stepper');
  const [summaryLog, setSummaryLog] = useState<CompletedWorkoutLog | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live session elapsed timer stopwatch (wall-clock based)
  useEffect(() => {
    if (!workoutStartTime) return;
    const calculateElapsed = () => {
      const startMs = new Date(workoutStartTime).getTime();
      const diff = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setElapsedSeconds(diff);
    };
    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [workoutStartTime]);

  const elapsedMins = Math.floor(elapsedSeconds / 60);
  const elapsedSecs = elapsedSeconds % 60;
  const formattedElapsed = `${elapsedMins}:${elapsedSecs < 10 ? '0' : ''}${elapsedSecs}`;

  const handleFinish = async () => {
    setIsFinishing(true);
    const log = await finishActiveWorkout(notes);
    setIsFinishing(false);
    if (log) {
      setSummaryLog(log);
    }
  };

  // If workout summary is ready, display celebratory workout summary screen
  if (summaryLog) {
    const summaryMins = Math.floor(summaryLog.durationSeconds / 60);
    const summarySecs = summaryLog.durationSeconds % 60;
    const totalSetsCompleted = summaryLog.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.isCompleted).length,
      0
    );
    const totalSetsPlanned = summaryLog.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const newPRs = personalRecords.filter((pr) => pr.achievedAt >= summaryLog.startedAt);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
        {/* Celebration Header */}
        <div className="clinical-card p-6 md:p-8 text-center space-y-4 rounded-[24px]">
          <div className="w-14 h-14 rounded-[18px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-7 h-7 text-[#fafafa]" />
          </div>
          <div className="space-y-1">
            <span className="badge-solid text-[10px] uppercase font-bold">
              {t.summary_modal_title}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0a0a0a] pt-1">
              {summaryLog.title}
            </h1>
            <p className="text-xs md:text-sm text-[#6f6f6f] max-w-md mx-auto">
              {t.summary_modal_subtitle}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#e5e5e5]">
            <div className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-center">
              <span className="text-[11px] font-semibold text-[#6f6f6f] block uppercase tracking-wider">
                {t.summary_total_duration}
              </span>
              <span className="text-xl font-bold text-[#0a0a0a] block mt-0.5">
                {summaryMins}m {summarySecs}s
              </span>
            </div>
            <div className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-center">
              <span className="text-[11px] font-semibold text-[#6f6f6f] block uppercase tracking-wider">
                {t.summary_total_volume}
              </span>
              <span className="text-xl font-bold text-[#0a0a0a] block mt-0.5">
                {summaryLog.totalVolumeKg > 1000
                  ? (summaryLog.totalVolumeKg / 1000).toFixed(1) + ' t'
                  : summaryLog.totalVolumeKg + ' kg'}
              </span>
            </div>
            <div className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-center">
              <span className="text-[11px] font-semibold text-[#6f6f6f] block uppercase tracking-wider">
                {t.summary_total_reps}
              </span>
              <span className="text-xl font-bold text-[#0a0a0a] block mt-0.5">
                {summaryLog.totalReps}
              </span>
            </div>
            <div className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] text-center">
              <span className="text-[11px] font-semibold text-[#6f6f6f] block uppercase tracking-wider">
                {t.summary_sets_completed}
              </span>
              <span className="text-xl font-bold text-[#0a0a0a] block mt-0.5">
                {totalSetsCompleted} / {totalSetsPlanned}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone PRs Banner (if any unlocked) */}
        {newPRs.length > 0 && (
          <div className="clinical-card p-5 border-[#0a0a0a] space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#0a0a0a]" />
              <h3 className="font-semibold text-sm text-[#0a0a0a]">
                {t.summary_prs_unlocked} ({newPRs.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {newPRs.map((pr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-[14px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#0a0a0a] capitalize">
                    {pr.exerciseName}
                  </span>
                  <span className="badge-solid text-[10px]">
                    {pr.metricType === 'max_weight' ? pr.recordValue + ' kg' : pr.recordValue + ' reps'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Movements Breakdown */}
        <div className="clinical-card p-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#6f6f6f]">
            Completed Exercise Logbook ({summaryLog.exercises.length})
          </h3>
          <div className="space-y-2.5">
            {summaryLog.exercises.map((ex, idx) => {
              const setsDone = ex.sets.filter((s) => s.isCompleted);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize">
                      {ex.exerciseName}
                    </h4>
                    <span className="text-xs text-[#6f6f6f] capitalize">
                      {ex.targetMuscle} • {setsDone.length} sets logged
                    </span>
                  </div>
                  <div className="text-right text-xs font-semibold text-[#0a0a0a]">
                    {setsDone.map((s) => `${s.completedReps}r`).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>

          {summaryLog.notes && (
            <div className="pt-2 border-t border-[#e5e5e5]">
              <span className="text-[11px] font-semibold text-[#6f6f6f] uppercase block mb-1">
                Notes
              </span>
              <p className="text-xs text-[#0a0a0a] italic bg-[#fafafa] p-3 rounded-[14px] border border-[#e5e5e5]">
                &quot;{summaryLog.notes}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setCurrentTab('analytics')}
            className="btn-outline w-full sm:w-1/2 py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.summary_view_analytics}</span>
          </button>
          <button
            onClick={() => setCurrentTab('home')}
            className="btn-primary w-full sm:w-1/2 py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.summary_close}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!activePlan) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center mx-auto">
          <PlayCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-[#0a0a0a]">No Active Session</h3>
        <p className="text-xs text-[#6f6f6f]">
          Pick a routine from the Daily Wizard or choose a pre-built Weekly Split to begin.
        </p>
        <button
          onClick={() => setCurrentTab('wizard')}
          className="btn-primary text-xs py-2.5 px-5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.btn_generate_daily}</span>
        </button>
      </div>
    );
  }

  const totalSets = activePlan.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = activePlan.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const handleSwap = (newExId: string) => {
    if (swapTargetIndex !== null) {
      swapExercise(swapTargetIndex, newExId);
      setSwapTargetIndex(null);
      setSwapSearchQuery('');
    }
  };

  const targetExForSwap = swapTargetIndex !== null ? activePlan.exercises[swapTargetIndex] : null;

  // Compute recommended alternatives compatible with user equipment
  const recommendedAlternatives = targetExForSwap
    ? ExerciseDataset.getAlternatives(targetExForSwap.exercise.id).filter((ex) =>
        isExerciseCompatibleWithEquipment(ex, profile.equipment)
      )
    : [];

  // Compute search results if searching
  const searchResults = swapSearchQuery.trim()
    ? ExerciseDataset.getAll().filter(
        (ex) =>
          isExerciseCompatibleWithEquipment(ex, profile.equipment) &&
          (ex.name.toLowerCase().includes(swapSearchQuery.toLowerCase()) ||
            ex.target.toLowerCase().includes(swapSearchQuery.toLowerCase())) &&
          ex.id !== targetExForSwap?.exercise.id
      ).slice(0, 15)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Active Workout Header with Live Elapsed Timer Stopwatch */}
      <div className="clinical-card space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e5e5e5] pb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-solid text-[10px] uppercase">
                {activePlan.energyLevel} Intensity
              </span>
              <span className="badge-soft text-[10px]">
                {completedSets} / {totalSets} Sets Done ({progressPercent}%)
              </span>
              {/* Persistent Live Elapsed Stopwatch */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[18px] bg-[#0a0a0a] text-[#fafafa] text-[11px] font-mono font-semibold shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e7000b] animate-ping" />
                <Timer className="w-3.5 h-3.5 text-[#fafafa]" />
                <span>{formattedElapsed}</span>
              </div>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-1">
              {activePlan.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelActiveWorkout}
              className="btn-outline text-xs py-1.5 px-3 cursor-pointer"
            >
              {t.btn_cancel_workout}
            </button>
            <button
              onClick={handleFinish}
              disabled={isFinishing}
              className="btn-primary text-xs py-1.5 px-4 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>{isFinishing ? 'Logging...' : t.btn_finish_workout}</span>
            </button>
          </div>
        </div>

        {/* Minimalist Progress Track */}
        <div className="w-full bg-[#f5f5f5] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0a0a0a] h-full transition-all duration-300"
            style={{ width: progressPercent + '%' }}
          />
        </div>
      </div>

      {/* Exercise Stepper Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-[20px] border border-[#e5e5e5] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6f6f6f]">
            {t.exercise_stepper_counter} {currentExerciseIndex + 1} {t.of_stepper} {activePlan.exercises.length}
          </span>
        </div>

        {/* Scrollable Movement Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {activePlan.exercises.map((pEx, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            const isAllDone = pEx.sets.every((s) => s.isCompleted);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentExerciseIndex(idx);
                  setViewMode('stepper');
                }}
                className={'px-3 py-1.5 rounded-[18px] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ' +
                  (isCurrent
                    ? 'bg-[#0a0a0a] text-[#fafafa] shadow-xs'
                    : isAllDone
                    ? 'bg-[#fafafa] text-[#0a0a0a] border border-[#0a0a0a]'
                    : 'bg-[#f5f5f5] text-[#6f6f6f] hover:text-[#0a0a0a] border border-transparent')}
              >
                <span>{idx + 1}. {pEx.exercise.name}</span>
                {isAllDone && <Check className="w-3.5 h-3.5 shrink-0 text-[#0a0a0a]" />}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'stepper' ? 'all' : 'stepper')}
          className="text-xs font-semibold text-[#6f6f6f] hover:text-[#0a0a0a] underline shrink-0 cursor-pointer hidden md:block"
        >
          {viewMode === 'stepper' ? 'Show All Movements' : 'Focused Stepper Mode'}
        </button>
      </div>

      {/* Main Workout Content: Stepper Mode or All Exercises Mode */}
      {viewMode === 'stepper' ? (
        /* Focused Current Exercise Card */
        (() => {
          const pEx = activePlan.exercises[currentExerciseIndex] || activePlan.exercises[0];
          const exIdx = currentExerciseIndex;
          const currentExAllDone = pEx.sets.every((s) => s.isCompleted);
          const isLastEx = currentExerciseIndex === activePlan.exercises.length - 1;

          return (
            <div className="space-y-4 animate-fadeIn">
              <div className="clinical-card space-y-4">
                {/* Exercise Info & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e5e5]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-[10px] bg-[#0a0a0a] text-[#fafafa] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs select-none"
                    >
                      {exIdx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-[#0a0a0a] capitalize">
                          {pEx.exercise.name}
                        </h3>
                        <span className="badge-soft text-[9px] font-medium uppercase">
                          {pEx.exercise.difficulty}
                        </span>
                      </div>
                      <span className="text-xs text-[#6f6f6f] capitalize">
                        {pEx.exercise.target} • {pEx.exercise.equipment}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => startRestTimer(pEx.restBetweenSetsSeconds, pEx.exercise.name)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                      title="Start Rest Timer"
                    >
                      <Timer className="w-4 h-4" />
                      <span>{pEx.restBetweenSetsSeconds}s Rest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSwapTargetIndex(exIdx)}
                      className="p-2 rounded-[18px] hover:bg-[#f5f5f5] text-[#6f6f6f] hover:text-[#0a0a0a] transition-colors cursor-pointer border border-[#e5e5e5]"
                      title={t.btn_swap_exercise}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedExerciseForDetail(pEx.exercise.id)}
                      className="p-2 rounded-[18px] hover:bg-[#f5f5f5] text-[#6f6f6f] hover:text-[#0a0a0a] transition-colors cursor-pointer border border-[#e5e5e5]"
                      title="View Technique Guide"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Embedded Visualizer Preview for Proper Execution Mechanics */}
                <div className="w-full">
                  <ExerciseVisualizer
                    exercise={pEx.exercise}
                    className="w-full h-44 sm:h-56 max-h-60"
                  />
                </div>

                {/* Set Table */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6f6f6f] px-2">
                    <span className="col-span-2">{t.set_header}</span>
                    <span className="col-span-4">{t.actual_reps_header}</span>
                    <span className="col-span-4">{t.weight_header}</span>
                    <span className="col-span-2 text-right">{t.status_header}</span>
                  </div>

                  {pEx.sets.map((set, setIdx) => {
                    const isDone = set.isCompleted;
                    return (
                      <div
                        key={setIdx}
                        className={'grid grid-cols-12 gap-2 items-center p-2.5 rounded-[18px] transition-colors ' +
                          (isDone ? 'bg-[#fafafa] border border-[#e5e5e5]' : 'bg-[#f5f5f5]')}
                      >
                        <span className="col-span-2 text-xs font-bold text-[#0a0a0a] px-2">
                          #{set.setNumber}
                        </span>

                        <div className="col-span-4">
                          <input
                            type="number"
                            min="1"
                            value={set.completedReps !== undefined ? set.completedReps : set.targetReps}
                            onChange={(e) =>
                              updateSetValues(
                                exIdx,
                                setIdx,
                                Number(e.target.value),
                                set.completedWeightKg !== undefined ? set.completedWeightKg : set.targetWeightKg || 0
                              )
                            }
                            className="input-field w-full py-1 text-center font-bold text-xs"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="number"
                            min="0"
                            value={set.completedWeightKg !== undefined ? set.completedWeightKg : set.targetWeightKg || 0}
                            onChange={(e) =>
                              updateSetValues(
                                exIdx,
                                setIdx,
                                set.completedReps !== undefined ? set.completedReps : set.targetReps,
                                Number(e.target.value)
                              )
                            }
                            className="input-field w-full py-1 text-center font-bold text-xs"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => toggleSetComplete(exIdx, setIdx)}
                            aria-label={isDone ? `Set ${set.setNumber} completed. Click to undo` : `Complete set ${set.setNumber}`}
                            className={'w-9 h-9 min-w-[36px] min-h-[36px] rounded-[10px] flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] ' +
                              (isDone
                                ? 'bg-[#0a0a0a] text-[#fafafa] shadow-xs'
                                : 'bg-[#ffffff] text-[#6f6f6f] border border-[#e5e5e5] hover:border-[#0a0a0a]')}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Auto-Advance / Next Exercise Action Banner when all sets of current movement are done */}
                {currentExAllDone && (
                  <div className="p-4 rounded-[18px] bg-[#0a0a0a] text-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn mt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-[#ffffff]/20 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-[#fafafa]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{t.all_sets_completed}</h4>
                        <span className="text-xs opacity-80">
                          {!isLastEx
                            ? `Next: ${activePlan.exercises[currentExerciseIndex + 1].exercise.name}`
                            : 'All movements in this routine are complete!'}
                        </span>
                      </div>
                    </div>

                    {!isLastEx ? (
                      <button
                        type="button"
                        onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
                        className="w-full sm:w-auto px-4 py-2 rounded-[18px] bg-[#ffffff] hover:bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <span>{t.proceed_next_exercise}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinish}
                        disabled={isFinishing}
                        className="w-full sm:w-auto px-4 py-2 rounded-[18px] bg-[#ffffff] hover:bg-[#f5f5f5] text-[#0a0a0a] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-[#0a0a0a]" />
                        <span>{t.btn_finish_workout}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[#e5e5e5]">
                  <button
                    type="button"
                    onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentExerciseIndex === 0}
                    className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.prev_exercise}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentExerciseIndex((prev) => Math.min(activePlan.exercises.length - 1, prev + 1))}
                    disabled={isLastEx}
                    className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{t.next_exercise}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* All Movements View (Scroll Mode) */
        <div className="space-y-4">
          {activePlan.exercises.map((pEx, exIdx) => (
            <div key={exIdx} className="clinical-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-[10px] bg-[#0a0a0a] text-[#fafafa] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs select-none"
                    title={`Exercise #${exIdx + 1}`}
                  >
                    {exIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[#0a0a0a] capitalize">
                      {pEx.exercise.name}
                    </h3>
                    <span className="text-xs text-[#6f6f6f] capitalize">
                      {pEx.exercise.target} • {pEx.exercise.equipment}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startRestTimer(pEx.restBetweenSetsSeconds, pEx.exercise.name)}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                    title="Start Rest Timer"
                  >
                    <Timer className="w-4 h-4" />
                    <span>{pEx.restBetweenSetsSeconds}s Rest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSwapTargetIndex(exIdx)}
                    className="p-1.5 rounded-[18px] hover:bg-[#f5f5f5] text-[#6f6f6f] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                    title={t.btn_swap_exercise}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedExerciseForDetail(pEx.exercise.id)}
                    className="p-1.5 rounded-[18px] hover:bg-[#f5f5f5] text-[#6f6f6f] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                    title="View Technique Guide"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Set Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6f6f6f] px-2">
                  <span className="col-span-2">{t.set_header}</span>
                  <span className="col-span-4">{t.actual_reps_header}</span>
                  <span className="col-span-4">{t.weight_header}</span>
                  <span className="col-span-2 text-right">{t.status_header}</span>
                </div>

                {pEx.sets.map((set, setIdx) => {
                  const isDone = set.isCompleted;
                  return (
                    <div
                      key={setIdx}
                      className={'grid grid-cols-12 gap-2 items-center p-2 rounded-[18px] transition-colors ' +
                        (isDone ? 'bg-[#fafafa] border border-[#e5e5e5]' : 'bg-[#f5f5f5]')}
                    >
                      <span className="col-span-2 text-xs font-bold text-[#0a0a0a] px-2">
                        #{set.setNumber}
                      </span>

                      <div className="col-span-4">
                        <input
                          type="number"
                          min="1"
                          value={set.completedReps !== undefined ? set.completedReps : set.targetReps}
                          onChange={(e) =>
                            updateSetValues(
                              exIdx,
                              setIdx,
                              Number(e.target.value),
                              set.completedWeightKg !== undefined ? set.completedWeightKg : set.targetWeightKg || 0
                            )
                          }
                          className="input-field w-full py-1 text-center font-bold text-xs"
                        />
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          min="0"
                          value={set.completedWeightKg !== undefined ? set.completedWeightKg : set.targetWeightKg || 0}
                          onChange={(e) =>
                            updateSetValues(
                              exIdx,
                              setIdx,
                              set.completedReps !== undefined ? set.completedReps : set.targetReps,
                              Number(e.target.value)
                            )
                          }
                          className="input-field w-full py-1 text-center font-bold text-xs"
                        />
                      </div>

                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleSetComplete(exIdx, setIdx)}
                          aria-label={isDone ? `Set ${set.setNumber} completed. Click to undo` : `Complete set ${set.setNumber}`}
                          className={'w-9 h-9 min-w-[36px] min-h-[36px] rounded-[10px] flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] ' +
                            (isDone
                              ? 'bg-[#0a0a0a] text-[#fafafa] shadow-xs'
                              : 'bg-[#ffffff] text-[#6f6f6f] border border-[#e5e5e5] hover:border-[#0a0a0a]')}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes & Completion */}
      <div className="clinical-card space-y-3">
        <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#6f6f6f] block">
          Session Reflection & Notes
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.workout_notes_placeholder}
          className="input-field w-full"
        />

        <div className="flex justify-end pt-2">
          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="btn-primary text-base py-3 px-8 w-full sm:w-auto cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isFinishing ? 'Saving Log...' : t.btn_finish_workout}</span>
          </button>
        </div>
      </div>


      {/* In-Session Exercise Replacement Modal */}
      {targetExForSwap && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[24px] max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative">
                {/* Modal Header */}
                <div className="sticky top-0 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge-solid text-[10px] uppercase">
                        {t.modal_swap_title}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0a0a0a] capitalize mt-1">
                      Replacing: {targetExForSwap.exercise.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSwapTargetIndex(null);
                      setSwapSearchQuery('');
                    }}
                    className="p-2 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#0a0a0a] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#6f6f6f] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={swapSearchQuery}
                      onChange={(e) => setSwapSearchQuery(e.target.value)}
                      placeholder={t.lib_search_placeholder}
                      className="input-field w-full pl-9 pr-3 py-2 text-xs"
                    />
                  </div>

                  {/* If Search Query Active: Show Search Results */}
                  {swapSearchQuery.trim() ? (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f6f6f] block">
                        {t.swap_all_compatible_title} ({searchResults.length})
                      </span>
                      {searchResults.length > 0 ? (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {searchResults.map((alt) => (
                            <div
                              key={alt.id}
                              className="bg-[#ffffff] p-3 rounded-[18px] border border-[#e5e5e5] hover:border-[#0a0a0a] flex items-center justify-between transition-all"
                            >
                              <div>
                                <h4 className="font-semibold text-xs text-[#0a0a0a] capitalize">
                                  {alt.name}
                                </h4>
                                <span className="text-[10px] text-[#6f6f6f] capitalize">
                                  {alt.target} • {alt.equipment}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedExerciseForDetail(alt.id)}
                                  className="p-1 rounded-[14px] hover:bg-[#f5f5f5] text-[#6f6f6f]"
                                  title="Preview Form"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSwap(alt.id)}
                                  className="btn-primary text-xs py-1 px-2.5 font-medium"
                                >
                                  <span>{t.btn_replace}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#6f6f6f] py-4 text-center">
                          No compatible movements matching &quot;{swapSearchQuery}&quot;
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Otherwise: Show Recommended Alternatives */
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6f6f6f] block">
                        {t.swap_recommended_title} ({recommendedAlternatives.length})
                      </span>
                      {recommendedAlternatives.length > 0 ? (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {recommendedAlternatives.map((alt) => (
                            <div
                              key={alt.id}
                              className="bg-[#ffffff] p-3 rounded-[18px] border border-[#e5e5e5] hover:border-[#0a0a0a] flex items-center justify-between transition-all"
                            >
                              <div>
                                <h4 className="font-semibold text-xs text-[#0a0a0a] capitalize">
                                  {alt.name}
                                </h4>
                                <span className="text-[10px] text-[#6f6f6f] capitalize">
                                  {alt.target} • {alt.equipment}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedExerciseForDetail(alt.id)}
                                  className="p-1 rounded-[14px] hover:bg-[#f5f5f5] text-[#6f6f6f]"
                                  title="Preview Form"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSwap(alt.id)}
                                  className="btn-primary text-xs py-1 px-2.5 font-medium"
                                >
                                  <span>{t.btn_replace}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#6f6f6f] py-4 text-center">
                          No direct alternatives found for this target muscle with current gear. Use the search bar above to pick any movement!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-[#ffffff]/95 border-t border-[#e5e5e5] p-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSwapTargetIndex(null);
                      setSwapSearchQuery('');
                    }}
                    className="btn-outline text-xs py-1.5 px-4"
                  >
                    {t.btn_cancel}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};
