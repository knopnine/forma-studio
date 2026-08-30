import React from 'react';
import {
  Flame,
  TrendingUp,
  Trophy,
  Calendar,
  Download,
  Upload,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { StorageService } from '../adapters/storageAdapter';

export const AnalyticsView: React.FC = () => {
  const { history, personalRecords } = useFitness();

  const totalVolumeKg = history.reduce((sum, log) => sum + log.totalVolumeKg, 0);
  const totalReps = history.reduce((sum, log) => sum + log.totalReps, 0);
  const totalDurationMinutes = Math.round(
    history.reduce((sum, log) => sum + log.durationSeconds, 0) / 60
  );

  // Generate 28-day activity heatmap
  const today = new Date();
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = history.find((h) => h.date === dateStr);
    return {
      date: dateStr,
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      hasWorkout: !!log,
      volume: log ? log.totalVolumeKg : 0,
    };
  });

  const handleExportData = async () => {
    const json = await StorageService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forma-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const success = await StorageService.importBackupJSON(text);
        if (success) {
          window.location.reload();
        }
      }
    };
    input.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
            Training Analytics & Records
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
            Progress Overview
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Export JSON Backup"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleImportData}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Import JSON Backup"
          >
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clinical-card">
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block mb-2">
            Total Tonnage Lifted
          </span>
          <div className="text-3xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">
            {totalVolumeKg > 0 ? (totalVolumeKg / 1000).toFixed(1) : 0} <span className="text-sm font-normal text-[#737373]">tonnes</span>
          </div>
          <p className="text-xs text-[#737373] mt-2">
            Across {history.length} completed sessions
          </p>
        </div>

        <div className="clinical-card">
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block mb-2">
            Total Repetitions
          </span>
          <div className="text-3xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">
            {totalReps.toLocaleString()} <span className="text-sm font-normal text-[#737373]">reps</span>
          </div>
          <p className="text-xs text-[#737373] mt-2">
            All bodyweight & loaded sets
          </p>
        </div>

        <div className="clinical-card">
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block mb-2">
            Time Under Tension
          </span>
          <div className="text-3xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">
            {totalDurationMinutes} <span className="text-sm font-normal text-[#737373]">mins</span>
          </div>
          <p className="text-xs text-[#737373] mt-2">
            Active workout volume
          </p>
        </div>
      </div>

      {/* 28-Day Activity Heatmap (Monochromatic DESIGN.md style) */}
      <div className="clinical-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0a0a0a]" />
            <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
              28-Day Consistency Heatmap
            </span>
          </div>
          <span className="text-xs text-[#737373]">
            {history.length} Sessions Logged
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {past28Days.map((item, idx) => {
            const hasActivity = item.hasWorkout;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={'w-full aspect-square rounded-[10px] transition-all flex items-center justify-center ' +
                    (hasActivity
                      ? 'bg-[#0a0a0a] text-[#fafafa] shadow-sm'
                      : 'bg-[#f5f5f5] text-[#a3a3a3] border border-[#e5e5e5]')}
                  title={item.date + (hasActivity ? ' - Workout Completed' : ' - Rest')}
                >
                  {hasActivity && <Flame className="w-3 h-3 text-[#fafafa]" />}
                </div>
                <span className="text-[9px] text-[#737373]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Records Logbook */}
      <div className="clinical-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#0a0a0a]" />
            <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
              Personal Records (PRs)
            </span>
          </div>
          <span className="badge-soft text-[10px]">
            {personalRecords.length} Milestones
          </span>
        </div>

        {personalRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalRecords.map((pr, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize">
                    {pr.exerciseName}
                  </h4>
                  <span className="text-xs text-[#737373]">
                    {pr.metricType === 'max_weight' ? pr.recordValue + ' kg max load' : pr.recordValue + ' reps max'}
                  </span>
                </div>
                <span className="text-[11px] text-[#737373]">
                  {pr.achievedAt.split('T')[0]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#737373] text-center py-4">
            Complete workouts with reps and weights to automatically unlock Personal Records.
          </p>
        )}
      </div>
    </div>
  );
};
