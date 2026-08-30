import React from 'react';
import {
  Dumbbell,
  Sparkles,
  Zap,
  BookOpen,
  Wrench,
  Timer,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart3,
  Layers,
  Info,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { ExerciseDataset } from '../core/datasetService';
import { getTranslation } from '../core/i18n';

export const LandingPage: React.FC = () => {
  const { setCurrentTab, setSelectedExerciseForDetail, profile } = useFitness();
  const t = getTranslation(profile.language);

  // Sample movement showcase
  const showcaseIds = [
    'pull-up',
    'push-up',
    'dumbbell-goblet-squat',
    'dumbbell-bicep-curl',
  ];

  const showcaseExercises = showcaseIds
    .map((id) => ExerciseDataset.getById(id))
    .filter((ex): ex is NonNullable<typeof ex> => ex !== undefined);

  return (
    <div className="space-y-16 animate-fadeIn pb-16">
      {/* Hero Section */}
      <section className="text-center pt-8 md:pt-14 pb-6 space-y-6 max-w-3xl mx-auto">
        {/* FOSS Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[18px] bg-[#ffffff] border border-[#e5e5e5] shadow-xs text-xs font-semibold text-[#0a0a0a] animate-slideUp">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{t.landing_badge}</span>
        </div>

        {/* Display Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-[1.15]">
          {t.landing_hero_title}
        </h1>

        {/* Body Subtitle */}
        <p className="text-sm md:text-base text-[#737373] max-w-2xl mx-auto leading-relaxed">
          {t.landing_hero_subtitle}
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentTab('home')}
            className="btn-primary w-full sm:w-auto text-sm py-3 px-6 shadow-sm hover:scale-[1.02] transition-transform"
          >
            <span>{t.landing_cta_launch}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className="btn-outline w-full sm:w-auto text-sm py-3 px-6 hover:bg-[#ffffff] transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.landing_cta_library}</span>
          </button>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-3 gap-3 pt-6 max-w-xl mx-auto border-t border-[#e5e5e5]">
          <div className="text-center p-2">
            <span className="text-xl md:text-2xl font-bold text-[#0a0a0a] block">1,324</span>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">Movements</span>
          </div>
          <div className="text-center p-2 border-x border-[#e5e5e5]">
            <span className="text-xl md:text-2xl font-bold text-[#0a0a0a] block">100%</span>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">Local & Offline</span>
          </div>
          <div className="text-center p-2">
            <span className="text-xl md:text-2xl font-bold text-[#0a0a0a] block">$0</span>
            <span className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">Paywalls / Ads</span>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0a0a0a]">
            {t.landing_feature_section_title}
          </h2>
          <p className="text-xs md:text-sm text-[#737373]">
            {t.landing_feature_section_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feature 1 */}
          <div className="clinical-card space-y-3 hover:border-[#0a0a0a] transition-all group">
            <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              {t.landing_feat1_title}
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              {t.landing_feat1_desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('wizard')}
                className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>{t.nav_daily_plan}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="clinical-card space-y-3 hover:border-[#0a0a0a] transition-all group">
            <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center transition-transform group-hover:scale-105">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              {t.landing_feat2_title}
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              {t.landing_feat2_desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('equipment')}
                className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>{t.nav_gear}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="clinical-card space-y-3 hover:border-[#0a0a0a] transition-all group">
            <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              {t.landing_feat3_title}
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              {t.landing_feat3_desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('library')}
                className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>{t.nav_library}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="clinical-card space-y-3 hover:border-[#0a0a0a] transition-all group">
            <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f5] text-[#0a0a0a] flex items-center justify-center transition-transform group-hover:scale-105">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              {t.landing_feat4_title}
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              {t.landing_feat4_desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentTab('splits')}
                className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>{t.nav_splits}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Showcase Preview Strip */}
      {showcaseExercises.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-[#0a0a0a]">
                Sample Indexed Movements
              </h3>
              <p className="text-xs text-[#737373]">
                Click any movement to test the seamless pure-white form visualizer.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('library')}
              className="text-xs font-semibold text-[#0a0a0a] flex items-center gap-1 hover:underline"
            >
              <span>View all 1,324</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {showcaseExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedExerciseForDetail(ex.id)}
                className="clinical-card p-4 hover:border-[#0a0a0a] cursor-pointer transition-all flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#737373] mb-1">
                    <span>{ex.target}</span>
                    <span className="badge-soft text-[9px]">{ex.difficulty}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize group-hover:text-[#171717] leading-snug">
                    {ex.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e5] text-[11px] text-[#737373]">
                  <span className="capitalize">{ex.equipment}</span>
                  <div className="flex items-center gap-1 font-medium text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Open-Source & Privacy Guarantee Banner */}
      <section className="clinical-card p-6 md:p-8 bg-[#0a0a0a] text-[#fafafa] space-y-4 rounded-[24px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="badge-solid bg-[#262626] text-[#fafafa] text-[10px] uppercase">
              Free & Open Source (MIT)
            </span>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#fafafa]">
              {t.landing_foss_title}
            </h3>
            <p className="text-xs md:text-sm text-[#a3a3a3] leading-relaxed">
              {t.landing_foss_desc}
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('home')}
            className="px-5 py-3 rounded-[18px] bg-[#fafafa] text-[#0a0a0a] font-semibold text-xs hover:bg-[#ffffff] hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            {t.landing_cta_launch}
          </button>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="text-center pt-8 border-t border-[#e5e5e5] text-xs text-[#737373] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-[6px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
            <Dumbbell className="w-3 h-3" />
          </div>
          <span className="font-semibold text-sm text-[#0a0a0a]">Forma</span>
          <span className="text-[11px] text-[#737373]">/ studio</span>
        </div>
        <p className="text-[11px]">
          {t.landing_footer_text}
        </p>
      </footer>
    </div>
  );
};
