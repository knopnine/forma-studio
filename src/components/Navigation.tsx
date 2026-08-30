import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  BookOpen,
  Wrench,
  BarChart3,
  PlayCircle,
  Zap,
  Dumbbell,
  Globe,
} from './Icons';
import { useFitness, type AppTab } from '../context/FitnessContext';
import { getTranslation } from '../core/i18n';

export const Navigation: React.FC = () => {
  const { currentTab, setCurrentTab, activePlan, profile, updateProfile } = useFitness();
  const t = getTranslation(profile.language);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.nav_overview, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'wizard', label: t.nav_daily_plan, icon: <Calendar className="w-4 h-4" /> },
    { id: 'splits', label: t.nav_splits, icon: <Layers className="w-4 h-4" /> },
    { id: 'library', label: t.nav_library, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'equipment', label: t.nav_gear, icon: <Wrench className="w-4 h-4" /> },
    { id: 'analytics', label: t.nav_analytics, icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const enabledGearCount = Object.values(profile.equipment).filter(v => v === true).length + profile.equipment.improvisedTools.filter(t => t.isEnabled).length;

  const toggleLanguage = () => {
    const nextLang = profile.language === 'en' ? 'id' : 'en';
    updateProfile({ language: nextLang });
  };

  const isLanding = currentTab === 'landing';

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e5e5]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        {/* Left: Minimalist Brand Mark */}
        <div
          onClick={() => setCurrentTab(isLanding ? 'home' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title={isLanding ? 'Open Workout Studio' : 'Back to Showcase Landing Page'}
        >
          <div className="w-7 h-7 rounded-[8px] bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#0a0a0a]">
              Forma
            </span>
            <span className="text-[11px] font-medium text-[#737373] tracking-normal">
              / studio
            </span>
          </div>
        </div>

        {/* Center: Desktop Nav Tabs (Only in Studio mode) */}
        {!isLanding ? (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={'px-3 py-1.5 rounded-[18px] text-[13px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ' +
                    (isActive
                      ? 'bg-[#0a0a0a] text-[#fafafa]'
                      : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]')}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#737373] font-medium">
            <span>1,324 Exercises</span>
            <span>•</span>
            <span>100% Offline & Local-First</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        )}

        {/* Right: Language Toggle & Context Action Area */}
        <div className="flex items-center gap-2">
          {/* Global Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-xs font-semibold text-[#0a0a0a] transition-colors border border-[#e5e5e5] cursor-pointer"
            title="Switch Language / Ganti Bahasa"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{profile.language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>

          {isLanding ? (
            <button
              onClick={() => setCurrentTab('home')}
              className="btn-primary text-xs py-1.5 px-3.5 font-medium"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t.landing_cta_launch}</span>
            </button>
          ) : activePlan ? (
            <button
              onClick={() => setCurrentTab('active_workout')}
              className={'px-3 py-1.5 rounded-[18px] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ' +
                (currentTab === 'active_workout'
                  ? 'bg-[#0a0a0a] text-[#fafafa]'
                  : 'bg-[#fafafa] text-[#0a0a0a] border border-[#e5e5e5] hover:bg-[#f5f5f5]')}
            >
              <div className="w-2 h-2 rounded-full bg-[#0a0a0a] animate-ping" />
              <PlayCircle className="w-5 h-5" />
              <span>{t.nav_resume_session}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('wizard')}
              className="btn-primary text-xs py-1.5 px-3.5 font-medium"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{t.nav_quick_start}</span>
            </button>
          )}

          {!isLanding && (
            <div
              onClick={() => setCurrentTab('equipment')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-[18px] bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[11px] font-medium text-[#737373] hover:text-[#0a0a0a] cursor-pointer transition-colors border border-[#e5e5e5]"
              title={t.gear_title}
            >
              <Wrench className="w-4 h-4" />
              <span>{enabledGearCount} {t.nav_tools}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Dock (Only rendered in Studio mode) */}
      {!isLanding && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e5e5e5] px-2 py-1.5 flex items-center justify-around shadow-lg">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={'flex flex-col items-center justify-center py-1 px-2 rounded-[18px] text-[10px] transition-all cursor-pointer ' +
                  (isActive
                    ? 'bg-[#0a0a0a] text-[#fafafa] font-semibold'
                    : 'text-[#737373] hover:text-[#0a0a0a]')}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
