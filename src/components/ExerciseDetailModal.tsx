import React from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell, Target, Sparkles, CheckCircle2 } from './Icons';
import { useFitness } from '../context/FitnessContext';
import { ExerciseDataset } from '../core/datasetService';
import { getEquipmentSetupTip, getExerciseRequiredEquipment } from '../core/equipmentRules';
import { translateStepsToIndonesian } from '../core/indonesianTranslations';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import { getTranslation } from '../core/i18n';

export const ExerciseDetailModal: React.FC = () => {
  const { selectedExerciseForDetail, setSelectedExerciseForDetail, profile } = useFitness();
  const t = getTranslation(profile.language);

  if (!selectedExerciseForDetail) return null;
  const exercise = ExerciseDataset.getById(selectedExerciseForDetail);
  if (!exercise) return null;

  const englishSteps =
    (exercise.instruction_steps && exercise.instruction_steps['en']) || [];

  const steps =
    profile.language === 'id'
      ? translateStepsToIndonesian(englishSteps)
      : englishSteps;

  const singleInstruction =
    profile.language === 'id'
      ? 'Lakukan gerakan dengan teknik yang benar dan kendalikan tempo gerakan secara perlahan.'
      : (exercise.instructions && exercise.instructions['en']) ||
        'Follow proper form and control the eccentric movement.';

  const equipmentTip = getEquipmentSetupTip(exercise, profile.equipment);
  const requiredGearList = getExerciseRequiredEquipment(exercise);

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[24px] max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
          <div className="pr-4">
            <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
              {exercise.category} • {exercise.difficulty}
            </span>
            <h3 className="text-lg font-semibold text-[#0a0a0a] capitalize leading-snug">
              {exercise.name}
            </h3>
          </div>
          <button
            onClick={() => setSelectedExerciseForDetail(null)}
            className="p-2 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Seamless White Container for GIF */}
          <div className="w-full bg-[#ffffff] rounded-[24px] p-1">
            <ExerciseVisualizer exercise={exercise} className="w-full h-64" showGif={true} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#ffffff] p-3.5 rounded-[18px] border border-[#e5e5e5] flex items-center gap-3">
              <div className="p-2 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#737373] block font-medium">{t.detail_primary_target}</span>
                <span className="text-sm font-semibold text-[#0a0a0a] capitalize">{exercise.target}</span>
              </div>
            </div>

            <div className="bg-[#ffffff] p-3.5 rounded-[18px] border border-[#e5e5e5] flex items-center gap-3">
              <div className="p-2 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-[#737373] block font-medium">{t.detail_required_gear}</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {requiredGearList.map((g, idx) => (
                    <span key={idx} className="badge-solid text-[10px] capitalize">
                      {g.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {equipmentTip && (
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-3.5 rounded-[18px] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#0a0a0a] shrink-0 mt-0.5" />
              <p className="text-xs text-[#171717] leading-relaxed">{equipmentTip}</p>
            </div>
          )}

          {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-[#737373] block mb-2">
                {t.detail_supporting_muscles}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondary_muscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="badge-soft capitalize"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}


          <div className="bg-[#ffffff] rounded-[18px] p-4 border border-[#e5e5e5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              {t.detail_execution_steps}
            </h4>
            {steps.length > 0 ? (
              <ol className="space-y-2.5">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#171717] leading-relaxed">
                    <span className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-[6px] bg-[#0a0a0a] text-[#fafafa] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs select-none">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[#171717] leading-relaxed">{singleInstruction}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#ffffff]/95 border-t border-[#e5e5e5] p-4">
          <button
            onClick={() => setSelectedExerciseForDetail(null)}
            className="btn-primary w-full py-3 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.btn_got_it}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
