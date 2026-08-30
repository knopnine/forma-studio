import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Wrench,
  Dumbbell,
  Plus,
  Trash2,
  Check,
  Sparkles,
} from './Icons';
import { useFitness } from '../context/FitnessContext';
import type { ImprovisedTool, StandardEquipmentType, EquipmentConfig } from '../core/types';

interface EquipmentSection {
  title: string;
  description: string;
  items: {
    key: keyof Omit<EquipmentConfig, 'dumbbellWeightsKg' | 'improvisedTools'>;
    label: string;
    desc: string;
    tag?: string;
  }[];
}

export const EquipmentManager: React.FC = () => {
  const { profile, updateEquipment, addImprovisedTool, toggleImprovisedTool, deleteImprovisedTool } = useFitness();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<ImprovisedTool['category']>('custom');
  const [newToolWeight, setNewToolWeight] = useState<number>(10);

  const sections: EquipmentSection[] = [
    {
      title: 'Free Weights & Calisthenics',
      description: 'Standard home weights, bars, and progressive bodyweight anchors.',
      items: [
        { key: 'hasBodyweight', label: 'Bodyweight & Calisthenics', desc: 'Push-ups, squats, planks, mobility', tag: 'Core' },
        { key: 'hasDumbbells', label: 'Dumbbells', desc: 'Adjustable or fixed weight pairs', tag: '387 movements' },
        { key: 'hasBarbell', label: 'Barbell & EZ Bar', desc: 'Straight bar, curl bar, olympic plates', tag: '179 movements' },
        { key: 'hasPullUpBar', label: 'Pull-Up Bar', desc: 'Doorway or wall mounted bar', tag: 'Back & Core' },
        { key: 'hasDipStation', label: 'Dip Station / Parallel Bars', desc: 'Parallettes or high dip station', tag: 'Chest & Triceps' },
        { key: 'hasResistanceBands', label: 'Resistance Bands', desc: 'Loop bands, tube bands with handles', tag: '61 movements' },
        { key: 'hasKettlebell', label: 'Kettlebells', desc: 'Swings, goblet squats, cleans, snatches', tag: '41 movements' },
      ],
    },
    {
      title: 'Benches, Balls & Core Gear',
      description: 'Support surfaces and instability tools required for specific angle variations.',
      items: [
        { key: 'hasBench', label: 'Workout Bench (Flat / Incline)', desc: 'Flat, incline, or decline workout bench', tag: '73 movements' },
        { key: 'hasStabilityBall', label: 'Stability / Exercise Ball', desc: 'Swiss ball, inflatable balance ball', tag: '93 movements' },
        { key: 'hasBoxOrChair', label: 'Box / Step-Up Platform / Chair', desc: 'Plyo box, step platform, sturdy chair', tag: 'Elevation' },
        { key: 'hasBosuBall', label: 'Bosu Ball / Balance Dome', desc: 'Half-ball balance trainer', tag: 'Balance' },
        { key: 'hasMedicineBall', label: 'Medicine Ball / Slam Ball', desc: 'Weighted throwing/slimming ball', tag: '13 movements' },
        { key: 'hasAbWheel', label: 'Ab Wheel Roller', desc: 'Rollout wheel for core extension', tag: 'Core' },
        { key: 'hasFoamRoller', label: 'Foam Roller', desc: 'Myofascial release & mobility', tag: 'Mobility' },
        { key: 'hasJumpRope', label: 'Jump Rope', desc: 'Conditioning, warmup, and HIIT', tag: 'Cardio' },
      ],
    },
    {
      title: 'Gym Machines & Cable Systems',
      description: 'Heavy pulley and gym apparatus (enable if you have a home pulley or gym access).',
      items: [
        { key: 'hasCableMachine', label: 'Cable Machine / Dual Pulley', desc: 'Adjustable cable tower, lat pulldown', tag: '157 movements' },
        { key: 'hasSmithMachine', label: 'Smith Machine', desc: 'Guided barbell track', tag: '48 movements' },
        { key: 'hasLeverageMachine', label: 'Leverage & Gym Machines', desc: 'Leg press, chest press machine, hack squat', tag: '81 movements' },
      ],
    },
  ];

  const handleToggleStandard = (key: keyof Omit<EquipmentConfig, 'dumbbellWeightsKg' | 'improvisedTools'>) => {
    const updated = { ...profile.equipment, [key]: !profile.equipment[key] };
    updateEquipment(updated);
  };

  const handleCreateTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;

    addImprovisedTool({
      name: newToolName.trim(),
      category: newToolCategory,
      description: newToolDesc.trim() || 'Custom household workout tool',
      mapsToStandard: ['dumbbell', 'body_weight'] as StandardEquipmentType[],
      customWeightKg: newToolWeight > 0 ? newToolWeight : undefined,
      isEnabled: true,
    });

    setNewToolName('');
    setNewToolDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
        <div>
          <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373]">
            Gear & Household Setup
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a0a0a] mt-0.5">
            Available Equipment
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            Toggle what you currently have at home. The daily plan algorithm strictly uses only available gear.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs py-2 px-3.5 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Custom Tool</span>
        </button>
      </div>

      {/* Categorized Equipment Sections */}
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-3">
          <div>
            <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block">
              {section.title}
            </span>
            <p className="text-xs text-[#737373] mt-0.5">{section.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.items.map((item) => {
              const isEnabled = Boolean(profile.equipment[item.key]);
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggleStandard(item.key)}
                  className={'clinical-card p-4 flex items-center justify-between cursor-pointer transition-all ' +
                    (isEnabled ? 'border-[#0a0a0a] shadow-xs' : 'hover:border-[#a3a3a3] opacity-75')}
                >
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#0a0a0a]">{item.label}</h4>
                      {item.tag && (
                        <span className="badge-soft text-[10px] font-medium">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#737373]">{item.desc}</p>
                  </div>

                  <div
                    className={'w-6 h-6 rounded-[18px] flex items-center justify-center transition-colors shrink-0 ' +
                      (isEnabled ? 'bg-[#0a0a0a] text-[#fafafa]' : 'bg-[#f5f5f5] text-transparent border border-[#e5e5e5]')}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Improvised Household Tools */}
      <div className="space-y-4 pt-4 border-t border-[#e5e5e5]">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[12px] uppercase font-semibold tracking-[0.6px] text-[#737373] block">
              Improvised Household Tools
            </span>
            <p className="text-xs text-[#737373]">
              Everyday objects mapped to gym movements (chairs for dips, backpacks for weights, towels for sliders).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.equipment.improvisedTools.map((tool) => (
            <div
              key={tool.id}
              className={'clinical-card p-4 flex items-start justify-between gap-3 transition-all ' +
                (tool.isEnabled ? 'border-[#0a0a0a]' : 'opacity-60')}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#0a0a0a]">{tool.name}</h4>
                  {tool.customWeightKg && (
                    <span className="badge-solid text-[10px]">
                      {tool.customWeightKg} kg
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737373]">{tool.description}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-4 h-4 text-[#737373]" />
                  <span className="text-[11px] text-[#737373]">
                    Maps to: {tool.mapsToStandard.join(', ').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleImprovisedTool(tool.id)}
                  className={'w-6 h-6 rounded-[18px] flex items-center justify-center transition-colors cursor-pointer ' +
                    (tool.isEnabled ? 'bg-[#0a0a0a] text-[#fafafa]' : 'bg-[#f5f5f5] text-transparent border border-[#e5e5e5]')}
                >
                  <Check className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteImprovisedTool(tool.id)}
                  className="p-1.5 rounded-[18px] text-[#737373] hover:text-[#e7000b] transition-colors cursor-pointer"
                  title="Remove Tool"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Tool Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[24px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-[#0a0a0a]">Add Improvised Home Tool</h3>
            <form onSubmit={handleCreateTool} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#737373] block mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Water Jug, Dining Chair, Ottoman"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#737373] block mb-1">
                  Description / Use Case
                </label>
                <input
                  type="text"
                  placeholder="e.g. Used for loaded rows and curls"
                  value={newToolDesc}
                  onChange={(e) => setNewToolDesc(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#737373] block mb-1">
                  Estimated Load / Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newToolWeight}
                  onChange={(e) => setNewToolWeight(Number(e.target.value))}
                  className="input-field w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
