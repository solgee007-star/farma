import React, { useState, useEffect } from 'react';
import { Droplet, Sparkles, Sprout, Axe, Check, AlertCircle } from 'lucide-react';
import { Plot, Crop, ToolType } from '../types';
import { INITIAL_CROPS } from '../data/gameData';
import { sound } from '../utils/audio';

interface FarmFieldProps {
  plots: Plot[];
  coins: number;
  level: number;
  inventory: Record<string, number>;
  hasSprinkler: boolean;
  hasScarecrow: boolean;
  goldenSickleLevel: number;
  onPlant: (plotId: number, crop: Crop) => void;
  onWater: (plotId: number) => void;
  onWaterAll: () => void;
  onHarvest: (plotId: number) => void;
  onHarvestAll: () => void;
  onFertilize: (plotId: number) => void;
  onClearPlot: (plotId: number) => void;
  onUnlockPlot: (plotId: number) => void;
}

export const FarmField: React.FC<FarmFieldProps> = ({
  plots,
  coins,
  level,
  hasSprinkler,
  hasScarecrow,
  goldenSickleLevel,
  onPlant,
  onWater,
  onWaterAll,
  onHarvest,
  onHarvestAll,
  onFertilize,
  onClearPlot,
  onUnlockPlot
}) => {
  const [selectedTool, setSelectedTool] = useState<ToolType>('water');
  const [selectedCropId, setSelectedCropId] = useState<string>('carrot');
  const [now, setNow] = useState<number>(Date.now());

  // Update clock every second for live timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedCrop = INITIAL_CROPS.find(c => c.id === selectedCropId) || INITIAL_CROPS[0];

  // Count ready to harvest and dry plots
  const readyPlotsCount = plots.filter(p => {
    if (p.status !== 'planted' || !p.harvestAt) return false;
    return now >= p.harvestAt;
  }).length;

  const dryPlotsCount = plots.filter(p => p.status === 'planted' && !p.isWatered).length;

  const handlePlotClick = (plot: Plot) => {
    sound.playPop();

    // 1. Locked plot
    if (plot.status === 'locked') {
      if (coins >= plot.unlockCost) {
        onUnlockPlot(plot.id);
      } else {
        alert(`골드가 부족합니다! (${plot.unlockCost}G 필요)`);
      }
      return;
    }

    // 2. Weeds plot
    if (plot.status === 'weeds') {
      if (coins >= plot.unlockCost) {
        onClearPlot(plot.id);
      } else {
        alert(`정리 비용이 부족합니다! (${plot.unlockCost}G 필요)`);
      }
      return;
    }

    // 3. Harvest if crop is ready
    if (plot.status === 'planted' && plot.harvestAt && now >= plot.harvestAt) {
      onHarvest(plot.id);
      return;
    }

    // 4. Handle based on active tool or natural context
    if (plot.status === 'empty') {
      // Natural plant if seed tool or clicking empty
      if (level < selectedCrop.unlockLevel) {
        alert(`Lv.${selectedCrop.unlockLevel} 이상에서 재배할 수 있습니다!`);
        return;
      }
      if (coins < selectedCrop.seedPrice) {
        alert(`씨앗 구매 골드가 부족합니다! (${selectedCrop.seedPrice}G 필요)`);
        return;
      }
      onPlant(plot.id, selectedCrop);
      return;
    }

    if (plot.status === 'planted') {
      if (selectedTool === 'water' || !plot.isWatered) {
        onWater(plot.id);
      } else if (selectedTool === 'fertilizer' && !plot.isFertilized) {
        onFertilize(plot.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Status and Quick Action Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>비옥한 텃밭</span>
              {hasSprinkler && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                  스프링클러 가동 중
                </span>
              )}
              {hasScarecrow && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                  허수아비 보호 중
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              씨앗을 심고, 물을 주어 정성껏 가꾸세요. 수확물이 여러분의 창고를 채웁니다.
            </p>
          </div>

          {/* Quick Batch Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playWater();
                onWaterAll();
              }}
              disabled={dryPlotsCount === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                dryPlotsCount > 0
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs active:scale-95'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>모두 물주기 ({dryPlotsCount})</span>
            </button>

            <button
              onClick={() => {
                sound.playHarvest();
                onHarvestAll();
              }}
              disabled={readyPlotsCount === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                readyPlotsCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95 animate-pulse'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>모두 수확 ({readyPlotsCount})</span>
            </button>
          </div>
        </div>

        {/* Tool Belt & Seed Picker */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tool selector */}
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-2">기본 농기구 선택</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sound.playPop(); setSelectedTool('water'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedTool === 'water'
                    ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Droplet className="w-4 h-4 text-sky-500" />
                <span>물조리개</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setSelectedTool('seed'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedTool === 'seed'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>씨앗 심기</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setSelectedTool('fertilizer'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedTool === 'fertilizer'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>비료 (20G)</span>
              </button>
            </div>
          </div>

          {/* Active Seed to Plant */}
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-2">심을 씨앗 선택</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {INITIAL_CROPS.map((crop) => {
                const isUnlocked = level >= crop.unlockLevel;
                const isSelected = selectedCropId === crop.id;

                return (
                  <button
                    key={crop.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        alert(`Lv.${crop.unlockLevel} 달성 시 해금됩니다!`);
                        return;
                      }
                      sound.playPop();
                      setSelectedCropId(crop.id);
                      setSelectedTool('seed');
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-400/30'
                        : isUnlocked
                        ? 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className="text-base">{crop.emoji}</span>
                    <span>{crop.name}</span>
                    <span className="text-[10px] text-amber-700 font-medium">({crop.seedPrice}G)</span>
                    {!isUnlocked && <span className="text-[10px] bg-stone-200 text-stone-600 px-1 rounded">Lv.{crop.unlockLevel}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* The 4x4 Grid of Plots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {plots.map((plot) => {
          const crop = plot.cropId ? INITIAL_CROPS.find(c => c.id === plot.cropId) : null;
          let progress = 0;
          let remainingSec = 0;
          let isReady = false;

          if (plot.status === 'planted' && plot.plantedAt && plot.harvestAt) {
            const totalDuration = plot.harvestAt - plot.plantedAt;
            const elapsed = Math.max(0, now - plot.plantedAt);
            progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
            remainingSec = Math.max(0, Math.ceil((plot.harvestAt - now) / 1000));
            if (now >= plot.harvestAt) {
              isReady = true;
            }
          }

          // Visual soil state styling
          let soilBackground = 'bg-amber-100/90 border-amber-300';
          if (plot.status === 'locked') {
            soilBackground = 'bg-stone-100 border-stone-300/80 border-dashed';
          } else if (plot.status === 'weeds') {
            soilBackground = 'bg-emerald-950/20 border-emerald-800/40';
          } else if (plot.isWatered) {
            soilBackground = 'bg-[#4a2e1b] border-[#382112] text-amber-100 shadow-inner';
          } else {
            soilBackground = 'bg-[#8d6244] border-[#704d35] text-amber-100';
          }

          return (
            <div
              key={plot.id}
              onClick={() => handlePlotClick(plot)}
              className={`relative h-44 rounded-2xl border-2 flex flex-col justify-between p-3.5 transition-all select-none cursor-pointer group hover:scale-[1.02] active:scale-[0.99] ${soilBackground}`}
            >
              {/* Plot Header: plot id and water/fertilizer icons */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] opacity-75">#{plot.id + 1} 구역</span>

                <div className="flex items-center gap-1">
                  {plot.isWatered && (
                    <span className="p-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px]" title="물주기 완료">
                      💧
                    </span>
                  )}
                  {plot.isFertilized && (
                    <span className="p-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px]" title="비료 효과 적용">
                      ✨
                    </span>
                  )}
                </div>
              </div>

              {/* Center Content based on Status */}
              <div className="flex flex-col items-center justify-center flex-1 my-1 text-center">
                {plot.status === 'locked' && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl opacity-60">🔒</span>
                    <span className="text-xs font-bold text-stone-700">새 밭 개간</span>
                    <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold">
                      {plot.unlockCost}G
                    </span>
                  </div>
                )}

                {plot.status === 'weeds' && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl animate-pulse">🌿🪨</span>
                    <span className="text-xs font-bold text-stone-800">잡초 밭</span>
                    <span className="text-[11px] px-2 py-0.5 bg-stone-200 text-stone-700 rounded font-semibold flex items-center gap-1">
                      <Axe className="w-3 h-3" />
                      <span>{plot.unlockCost}G 정리</span>
                    </span>
                  </div>
                )}

                {plot.status === 'empty' && (
                  <div className="flex flex-col items-center gap-1 group-hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-full border border-dashed border-amber-300/40 flex items-center justify-center text-amber-200">
                      <Sprout className="w-5 h-5 opacity-60" />
                    </div>
                    <span className="text-xs font-medium text-amber-100/90 mt-1">비어있는 밭</span>
                    <span className="text-[10px] text-amber-200/70">클릭하여 씨앗 심기</span>
                  </div>
                )}

                {plot.status === 'planted' && crop && (
                  <div className="flex flex-col items-center gap-1">
                    {/* Visual stage of growth */}
                    {isReady ? (
                      <div className="flex flex-col items-center animate-bounce">
                        <span className="text-4xl filter drop-shadow-md">{crop.emoji}</span>
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-1 bg-black/40 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>수확 가능!</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl transition-all duration-500">
                          {progress < 35 ? '🌱' : progress < 75 ? '🌿' : crop.emoji}
                        </span>
                        <span className="text-xs font-semibold text-amber-100 mt-1">
                          {crop.name}
                        </span>
                        <span className="text-[11px] text-amber-200/80 tabular-nums">
                          {plot.isWatered ? `${remainingSec}초 남음` : '💧 물 필요!'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer: Progress bar or status hint */}
              {plot.status === 'planted' && (
                <div className="w-full">
                  <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isReady ? 'bg-amber-400' : plot.isWatered ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {!plot.isWatered && !isReady && (
                    <span className="text-[10px] text-rose-300 font-medium block text-center mt-1">
                      물이 말라 성장이 멈췄습니다!
                    </span>
                  )}
                </div>
              )}

              {plot.status === 'empty' && (
                <div className="text-[10px] text-amber-200/60 text-center">
                  선택: {selectedCrop.name} ({selectedCrop.seedPrice}G)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
