import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Dumbbell,
  Target,
  Info,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import { ExerciseDataset } from '../core/datasetService';
import type { StandardEquipmentType } from '../core/types';

export const ExerciseLibrary: React.FC = () => {
  const { setSelectedExerciseForDetail } = useFitness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  const categories = useMemo(() => ['all', ...ExerciseDataset.getCategories()], []);

  const equipmentOptions: { id: string; label: string; count?: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'body_weight', label: 'Bodyweight', count: '306' },
    { id: 'pull_up_bar', label: 'Pull-Up Bar', count: '47' },
    { id: 'dumbbell', label: 'Dumbbells', count: '260' },
    { id: 'barbell', label: 'Barbell & EZ', count: '179' },
    { id: 'resistance_band', label: 'Bands', count: '60' },
    { id: 'kettlebell', label: 'Kettlebells', count: '41' },
    { id: 'stability_ball', label: 'Stability Ball', count: '76' },
    { id: 'dip_station', label: 'Dip Station', count: '30' },
    { id: 'cable_machine', label: 'Cables', count: '149' },
  ];

  const filteredExercises = useMemo(() => {
    return ExerciseDataset.search({
      query: searchQuery,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      equipmentCategory:
        selectedEquipment !== 'all' ? (selectedEquipment as StandardEquipmentType) : undefined,
      limit: 120,
    });
  }, [searchQuery, selectedCategory, selectedEquipment]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
            1,324 Movements Indexed
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
            Exercise Technique Library
          </h2>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pull-ups, squats, curls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block">
          Muscle Groups
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={'px-3 py-1.5 rounded-[18px] text-xs font-semibold shrink-0 transition-all cursor-pointer capitalize ' +
                  (isSelected
                    ? 'bg-[#0a0a0a] text-[#fafafa]'
                    : 'bg-[#ffffff] text-[#737373] border border-[#e5e5e5] hover:border-[#0a0a0a]')}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Filter Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block">
          Filter by Equipment
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {equipmentOptions.map((eq) => {
            const isSelected = selectedEquipment === eq.id;
            return (
              <button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq.id)}
                className={'px-3 py-1.5 rounded-[18px] text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ' +
                  (isSelected
                    ? 'bg-[#0a0a0a] text-[#fafafa] shadow-xs font-semibold'
                    : 'bg-[#f5f5f5] text-[#737373] hover:text-[#0a0a0a] border border-[#e5e5e5]')}
              >
                <span>{eq.label}</span>
                {eq.count && (
                  <span className={'text-[10px] px-1.5 py-0.2 rounded-full ' + (isSelected ? 'bg-[#ffffff]/20 text-[#fafafa]' : 'bg-[#e5e5e5] text-[#737373]')}>
                    {eq.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-[#737373]">
        <span>Showing {filteredExercises.length} movements</span>
        {selectedEquipment !== 'all' && (
          <button 
            onClick={() => setSelectedEquipment('all')}
            className="hover:text-[#0a0a0a] underline cursor-pointer"
          >
            Clear gear filter
          </button>
        )}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExerciseForDetail(ex.id)}
            className="clinical-card p-4 flex flex-col justify-between space-y-3 hover:border-[#0a0a0a] transition-all cursor-pointer group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="badge-soft text-[10px] capitalize">
                  {ex.category}
                </span>
                <span className="text-[11px] text-[#737373] capitalize">
                  {ex.difficulty}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-[#0a0a0a] capitalize group-hover:text-[#171717] leading-snug">
                {ex.name}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f5] text-xs text-[#737373]">
              <span className="capitalize">{ex.target}</span>
              <span className="capitalize badge-outline text-[10px]">{ex.equipmentCategory.replace(/_/g, ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
