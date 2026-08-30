import React from 'react';
import { Play, Pause, Plus, X, Timer } from './Icons';
import { useFitness } from '../context/FitnessContext';

export const RestTimerFloating: React.FC = () => {
  const { restTimer, pauseRestTimer, resumeRestTimer, addRestSeconds, dismissRestTimer } = useFitness();

  if (!restTimer || restTimer.remainingSeconds <= 0) return null;

  const progressPercent =
    restTimer.totalSeconds > 0
      ? ((restTimer.totalSeconds - restTimer.remainingSeconds) / restTimer.totalSeconds) * 100
      : 0;

  const minutes = Math.floor(restTimer.remainingSeconds / 60);
  const seconds = restTimer.remainingSeconds % 60;
  const formattedTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 animate-slideUp">
      <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[24px] p-4 shadow-lg shadow-black/5 relative overflow-hidden">
        {/* Subtle Progress Bar */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-[#f5f5f5] transition-all duration-1000 -z-0"
          style={{ width: progressPercent + '%' }}
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          {/* Timer display */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[18px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block">
                Rest Period
              </span>
              <div className="text-2xl font-semibold tracking-tight text-[#0a0a0a] font-mono leading-none mt-0.5">
                {formattedTime}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addRestSeconds(30)}
              className="btn-secondary text-xs py-1.5 px-2.5"
              title="Add 30 seconds"
            >
              <Plus className="w-4 h-4" />
              <span>30s</span>
            </button>

            {restTimer.isRunning ? (
              <button
                onClick={pauseRestTimer}
                className="btn-secondary text-xs py-1.5 px-2.5"
                title="Pause"
              >
                <Pause className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={resumeRestTimer}
                className="btn-primary text-xs py-1.5 px-2.5"
                title="Resume"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            )}

            <button
              onClick={dismissRestTimer}
              className="p-2 rounded-[18px] hover:bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a] transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
