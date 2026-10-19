import React, { useState, useEffect } from 'react';
import { Sparkles, Hammer, Check, Clock, AlertCircle } from 'lucide-react';
import { ArtisanMachine } from '../types';
import { sound } from '../utils/audio';

interface ArtisanWorkshopProps {
  artisans: ArtisanMachine[];
  inventory: Record<string, number>;
  coins: number;
  level: number;
  onStartCraft: (artisanId: string) => void;
  onCollectCraft: (artisanId: string) => void;
  onUnlockArtisan: (artisanId: string) => void;
}

export const ArtisanWorkshop: React.FC<ArtisanWorkshopProps> = ({
  artisans,
  inventory,
  coins,
  level,
  onStartCraft,
  onCollectCraft,
  onUnlockArtisan
}) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Workshop Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>장인의 가공 공방</span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
            부가가치 200% 상승
          </span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          수확한 농산물과 목장 특산물을 정성껏 가공하여 더 높은 가치와 맛을 지닌 명품 특산품으로 탄생시킵니다.
        </p>
      </div>

      {/* Artisan Machine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artisans.map((artisan) => {
          const availableInputCount = inventory[artisan.inputItemId] || 0;
          const hasEnoughInput = availableInputCount >= artisan.inputCount;

          let isProcessing = false;
          let isReady = artisan.isReady;
          let remainingSec = 0;
          let progress = 0;

          if (artisan.currentJob) {
            const totalDuration = artisan.currentJob.finishAt - artisan.currentJob.startedAt;
            const elapsed = now - artisan.currentJob.startedAt;
            progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
            remainingSec = Math.max(0, Math.ceil((artisan.currentJob.finishAt - now) / 1000));
            if (now >= artisan.currentJob.finishAt) {
              isReady = true;
              isProcessing = false;
            } else {
              isProcessing = true;
            }
          }

          if (!artisan.unlocked) {
            const canUnlock = level >= artisan.unlockLevel && coins >= artisan.unlockCost;

            return (
              <div
                key={artisan.id}
                className="bg-stone-50/70 rounded-2xl border-2 border-dashed border-stone-300 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <Hammer className="w-5 h-5" />
                    <span className="font-bold text-sm text-stone-700">{artisan.name}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2">{artisan.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-xs text-stone-600">
                    <span>요구 조건: </span>
                    <span className={`font-semibold ${level >= artisan.unlockLevel ? 'text-emerald-700' : 'text-rose-600'}`}>
                      Lv.{artisan.unlockLevel}
                    </span>
                    <span className="mx-1">·</span>
                    <span className="font-bold text-amber-700">{artisan.unlockCost}G</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!canUnlock) {
                        alert(level < artisan.unlockLevel ? `Lv.${artisan.unlockLevel} 달성이 필요합니다!` : '골드가 부족합니다!');
                        return;
                      }
                      sound.playCoin();
                      onUnlockArtisan(artisan.id);
                    }}
                    disabled={!canUnlock}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      canUnlock
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    공방 설비 개설
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={artisan.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="text-xl">{artisan.outputItemEmoji}</span>
                    <span>{artisan.name}</span>
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                    가공시간 {artisan.processingTimeSec}초
                  </span>
                </div>

                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  {artisan.description}
                </p>

                {/* Recipe display */}
                <div className="my-4 p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between text-xs">
                  {/* Input Requirement */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{artisan.inputItemEmoji}</span>
                    <div>
                      <span className="font-medium text-stone-800 block">{artisan.inputItemName}</span>
                      <span className={`text-[11px] font-semibold ${hasEnoughInput ? 'text-emerald-700' : 'text-rose-600'}`}>
                        보유: {availableInputCount} / {artisan.inputCount}개 필요
                      </span>
                    </div>
                  </div>

                  <span className="text-stone-400 font-bold">➔</span>

                  {/* Output Result */}
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="font-bold text-stone-900 block">{artisan.outputItemName}</span>
                      <span className="text-[11px] font-semibold text-amber-700">판매가 {artisan.outputSellPrice}G</span>
                    </div>
                    <span className="text-lg">{artisan.outputItemEmoji}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Status */}
              <div className="pt-3 border-t border-stone-100">
                {isReady ? (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onCollectCraft(artisan.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{artisan.outputItemEmoji} {artisan.outputItemName} 수령하기!</span>
                  </button>
                ) : isProcessing ? (
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        <span>정성껏 제조 중...</span>
                      </span>
                      <span className="font-bold text-stone-800 tabular-nums">{remainingSec}초</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2.5 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!hasEnoughInput) {
                        alert(`재료가 부족합니다! (${artisan.inputItemName} ${artisan.inputCount}개 필요)`);
                        return;
                      }
                      sound.playPop();
                      onStartCraft(artisan.id);
                    }}
                    disabled={!hasEnoughInput}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      hasEnoughInput
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-95'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <span>가공 시작하기 ({artisan.inputCount}개 소모)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
