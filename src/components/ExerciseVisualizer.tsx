import React, { useState } from 'react';
import { Activity } from './Icons';
import { ExerciseDataset } from '../core/datasetService';
import type { EnrichedExercise } from '../core/types';

interface Props {
  exercise: EnrichedExercise;
  className?: string;
  showGif?: boolean;
}

export const ExerciseVisualizer: React.FC<Props> = ({
  exercise,
  className = 'w-full h-48',
  showGif = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const mediaPath = showGif && exercise.gif_url ? exercise.gif_url : exercise.image;
  const mediaUrl = ExerciseDataset.getMediaUrl(mediaPath);

  if (imageFailed || !mediaUrl) {
    return (
      <div
        className={className + ' rounded-[24px] bg-[#ffffff] border border-[#e5e5e5] flex flex-col items-center justify-center p-4 relative overflow-hidden'}
      >
        <div className="w-12 h-12 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center mb-2 shadow-xs">
          <Activity className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a] text-center px-2">
          {exercise.name}
        </span>
        <span className="text-[11px] text-[#737373] mt-0.5 capitalize">
          {exercise.category} • {exercise.equipment}
        </span>
      </div>
    );
  }

  return (
    <div
      className={className + ' relative rounded-[24px] overflow-hidden bg-[#ffffff] flex items-center justify-center border border-[#e5e5e5] group'}
    >
      <img
        src={mediaUrl}
        alt={exercise.name}
        onError={() => setImageFailed(true)}
        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 bg-[#ffffff]"
        loading="lazy"
      />
      <div className="absolute bottom-2.5 left-2.5 bg-[#ffffff]/95 backdrop-blur-sm px-2.5 py-0.5 rounded-[18px] text-[10px] font-semibold text-[#0a0a0a] border border-[#e5e5e5] shadow-xs capitalize">
        {exercise.equipment}
      </div>
    </div>
  );
};
