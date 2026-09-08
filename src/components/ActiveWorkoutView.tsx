import React, { useState } from 'react';
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
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { ExerciseDataset } from '../core/datasetService';
import { isExerciseCompatibleWithEquipment } from '../core/equipmentRules';
import { getTranslation } from '../core/i18n';

export const ActiveWorkoutView: React.FC = () => {
  const {
    activePlan,
    profile,
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

  if (!activePlan) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center mx-auto">
          <PlayCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-[#0a0a0a]">No Active Session</h3>
        <p className="text-xs text-[#737373]">
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

  const handleFinish = async () => {
    setIsFinishing(true);
    await finishActiveWorkout(notes);
    setIsFinishing(false);
  };

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
      {/* Active Workout Header */}
      <div className="clinical-card space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e5e5e5] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-solid text-[10px] uppercase">
                {activePlan.energyLevel} Intensity
              </span>
              <span className="badge-soft text-[10px]">
                {completedSets} / {totalSets} Sets Done ({progressPercent}%)
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-1">
              {activePlan.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelActiveWorkout}
              className="btn-outline text-xs py-1.5 px-3"
            >
              {t.btn_cancel_workout}
            </button>
            <button
              onClick={handleFinish}
              disabled={isFinishing}
              className="btn-primary text-xs py-1.5 px-4"
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

      {/* Exercise Set Tracker Cards */}
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
                  <span className="text-xs text-[#737373] capitalize">
                    {pEx.exercise.target} • {pEx.exercise.equipment}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => startRestTimer(pEx.restBetweenSetsSeconds, pEx.exercise.name)}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                  title="Start Rest Timer"
                >
                  <Timer className="w-4 h-4" />
                  <span>{pEx.restBetweenSetsSeconds}s Rest</span>
                </button>

                {/* In-Session Swap Exercise Trigger */}
                <button
                  onClick={() => setSwapTargetIndex(exIdx)}
                  className="p-1.5 rounded-[18px] hover:bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                  title={t.btn_swap_exercise}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedExerciseForDetail(pEx.exercise.id)}
                  className="p-1.5 rounded-[18px] hover:bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                  title="View Technique Guide"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Set Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#737373] px-2">
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

      {/* Notes & Completion */}
      <div className="clinical-card space-y-3">
        <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block">
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
            className="btn-primary text-base py-3 px-8 w-full sm:w-auto"
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
                    <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block">
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
                                <span className="text-[10px] text-[#737373] capitalize">
                                  {alt.target} • {alt.equipment}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedExerciseForDetail(alt.id)}
                                  className="p-1 rounded-[14px] hover:bg-[#f5f5f5] text-[#737373]"
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
                        <p className="text-xs text-[#737373] py-4 text-center">
                          No compatible movements matching &quot;{swapSearchQuery}&quot;
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Otherwise: Show Recommended Alternatives */
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block">
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
                                <span className="text-[10px] text-[#737373] capitalize">
                                  {alt.target} • {alt.equipment}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedExerciseForDetail(alt.id)}
                                  className="p-1 rounded-[14px] hover:bg-[#f5f5f5] text-[#737373]"
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
                        <p className="text-xs text-[#737373] py-4 text-center">
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
