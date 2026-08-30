import React from 'react';
import {
  Flame,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Trophy,
  Dumbbell,
  PlayCircle,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { getTranslation } from '../core/i18n';

export const HomeDashboard: React.FC = () => {
  const { profile, history, personalRecords, setCurrentTab, activePlan } = useFitness();
  const t = getTranslation(profile.language);

  const totalVolumeKg = history.reduce((sum, log) => sum + log.totalVolumeKg, 0);
  const totalCompleted = history.length;
  const currentStreak = Math.min(history.length, 7);
  const recentWorkout = history[0];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="clinical-card p-6 md:p-8 bg-[#ffffff]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge-solid">
                <Flame className="w-4 h-4" />
                <span>{currentStreak} {t.streak_badge}</span>
              </span>
              <span className="badge-soft capitalize">
                {profile.experienceLevel} {t.level_badge}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[#0a0a0a] leading-tight">
              {t.hero_greeting}, {profile.name}?
            </h1>
            <p className="text-sm text-[#737373] max-w-xl leading-relaxed">
              {t.hero_subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('wizard')}
              className="btn-primary text-sm py-2.5 px-5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.btn_generate_daily}</span>
            </button>
            <button
              onClick={() => setCurrentTab('splits')}
              className="btn-secondary text-sm py-2.5 px-4"
            >
              <Layers className="w-4 h-4" />
              <span>{t.btn_weekly_splits}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Workout Resume Card (if in progress) */}
      {activePlan && (
        <div className="clinical-card border-[#0a0a0a] bg-[#fafafa] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[18px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center shrink-0">
              <PlayCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                {t.workout_in_progress}
              </span>
              <h4 className="text-base font-semibold text-[#0a0a0a]">{activePlan.title}</h4>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('active_workout')}
            className="btn-primary text-xs py-2 px-4"
          >
            <span>{t.nav_resume_session}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stat Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="clinical-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
                {t.stat_active_streak}
              </span>
              <div className="w-8 h-8 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-semibold tracking-[-0.04em] text-[#0a0a0a]">
              {currentStreak} <span className="text-sm font-normal text-[#737373]">{t.days}</span>
            </div>
          </div>
          <p className="text-xs text-[#737373] mt-3 pt-3 border-t border-[#f5f5f5]">
            {t.stat_active_streak_sub}
          </p>
        </div>

        <div className="clinical-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
                {t.stat_total_sessions}
              </span>
              <div className="w-8 h-8 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-semibold tracking-[-0.04em] text-[#0a0a0a]">
              {totalCompleted} <span className="text-sm font-normal text-[#737373]">{t.completed}</span>
            </div>
          </div>
          <p className="text-xs text-[#737373] mt-3 pt-3 border-t border-[#f5f5f5]">
            {profile.weeklyTargetSessions} {t.stat_total_sessions_sub}
          </p>
        </div>

        <div className="clinical-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
                {t.stat_total_volume}
              </span>
              <div className="w-8 h-8 rounded-[18px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-semibold tracking-[-0.04em] text-[#0a0a0a]">
              {totalVolumeKg > 0 ? (totalVolumeKg / 1000).toFixed(1) : 0} <span className="text-sm font-normal text-[#737373]">{t.tonnes}</span>
            </div>
          </div>
          <p className="text-xs text-[#737373] mt-3 pt-3 border-t border-[#f5f5f5]">
            {personalRecords.length} {t.stat_prs_logged}
          </p>
        </div>
      </div>

      {/* Quick Launch Programs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-[#0a0a0a]">
            {t.section_quick_access}
          </h2>
          <button
            onClick={() => setCurrentTab('splits')}
            className="text-xs font-medium text-[#737373] hover:text-[#0a0a0a] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t.link_all_programs}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setCurrentTab('wizard')}
            className="clinical-card hover:border-[#0a0a0a] transition-all cursor-pointer group flex items-start justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge-solid text-[10px]">{t.card_smart_daily_badge}</span>
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] group-hover:text-[#171717]">
                {t.card_smart_daily_title}
              </h3>
              <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
                {t.card_smart_daily_desc}
              </p>
            </div>
            <div className="w-9 h-9 rounded-[18px] bg-[#f5f5f5] group-hover:bg-[#0a0a0a] group-hover:text-[#fafafa] flex items-center justify-center text-[#0a0a0a] transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => setCurrentTab('library')}
            className="clinical-card hover:border-[#0a0a0a] transition-all cursor-pointer group flex items-start justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge-soft text-[10px]">{t.card_library_badge}</span>
              </div>
              <h3 className="text-base font-semibold text-[#0a0a0a] group-hover:text-[#171717]">
                {t.card_library_title}
              </h3>
              <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
                {t.card_library_desc}
              </p>
            </div>
            <div className="w-9 h-9 rounded-[18px] bg-[#f5f5f5] group-hover:bg-[#0a0a0a] group-hover:text-[#fafafa] flex items-center justify-center text-[#0a0a0a] transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      {recentWorkout && (
        <div className="clinical-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
              {t.card_recent_title}
            </span>
            <span className="text-xs text-[#737373]">{recentWorkout.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-[#0a0a0a]">{recentWorkout.title}</h4>
              <p className="text-xs text-[#737373] mt-0.5">
                {Math.round(recentWorkout.durationSeconds / 60)} min • {recentWorkout.totalReps} total reps • {recentWorkout.exercisesCompletedCount} movements
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="btn-outline text-xs py-1.5 px-3"
            >
              {t.card_recent_view}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
