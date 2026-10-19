import React from 'react';
import { X, Award, Check, Sparkles, BookOpen } from 'lucide-react';
import { Achievement } from '../types';
import { INITIAL_CROPS, INITIAL_ANIMALS, INITIAL_ARTISANS } from '../data/gameData';
import { sound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  inventory: Record<string, number>;
  onClaimReward: (achievementId: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  inventory,
  onClaimReward
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'achieve' | 'dex'>('achieve');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">명예의 전당 & 도감</h2>
              <p className="text-xs text-stone-500">목표를 달성하고 보석과 골드 보상을 획득하세요.</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playPop(); onClose(); }}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-stone-100 flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('achieve')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'achieve'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🏆 농장 업적 목록
          </button>
          <button
            onClick={() => setActiveSubTab('dex')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'dex'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📖 수집 도감 (컬렉션)
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {activeSubTab === 'achieve' ? (
            achievements.map((item) => {
              const progress = Math.min(100, Math.round((item.currentCount / item.targetCount) * 100));
              const isCompleted = item.currentCount >= item.targetCount;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    item.isClaimed
                      ? 'bg-stone-50 border-stone-200/80 opacity-60'
                      : isCompleted
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <span className="text-3xl select-none">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900 text-sm">{item.title}</h3>
                        {item.isClaimed && (
                          <span className="text-[10px] font-semibold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded">
                            보상 완료
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>

                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-stone-600 tabular-nums">
                          {item.currentCount} / {item.targetCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <div className="text-right text-xs">
                      <span className="text-amber-700 font-bold block">+{item.rewardGold}G</span>
                      <span className="text-sky-600 font-bold block">+{item.rewardGems}💎</span>
                    </div>

                    {!item.isClaimed && (
                      <button
                        onClick={() => {
                          if (!isCompleted) return;
                          sound.playSuccess();
                          onClaimReward(item.id);
                        }}
                        disabled={!isCompleted}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs animate-bounce'
                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        보상 받기
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-5">
              {/* Crops Dex */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 mb-2">🌿 재배 작물</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INITIAL_CROPS.map((crop) => (
                    <div key={crop.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center gap-2">
                      <span className="text-2xl">{crop.emoji}</span>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{crop.name}</span>
                        <span className="text-[10px] text-stone-500">Lv.{crop.unlockLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animals Dex */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 mb-2">🐮 목장 가축</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INITIAL_ANIMALS.map((animal) => (
                    <div key={animal.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center gap-2">
                      <span className="text-2xl">{animal.produceEmoji}</span>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{animal.name}</span>
                        <span className="text-[10px] text-stone-500">{animal.produceItemName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artisan Dex */}
              <div>
                <h3 className="text-xs font-bold text-stone-500 mb-2">🍯 공방 가공품</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INITIAL_ARTISANS.map((artisan) => (
                    <div key={artisan.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center gap-2">
                      <span className="text-2xl">{artisan.outputItemEmoji}</span>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{artisan.outputItemName}</span>
                        <span className="text-[10px] text-amber-700 font-medium">{artisan.outputSellPrice}G</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
