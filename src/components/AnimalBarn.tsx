import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Plus, Check } from 'lucide-react';
import { Animal } from '../types';
import { INITIAL_ANIMALS } from '../data/gameData';
import { sound } from '../utils/audio';

interface AnimalBarnProps {
  animals: Animal[];
  coins: number;
  level: number;
  onFeedAnimal: (animalId: string) => void;
  onPetAnimal: (animalId: string) => void;
  onCollectProduce: (animalId: string) => void;
  onAdoptAnimal: (animalTemplate: typeof INITIAL_ANIMALS[0]) => void;
}

export const AnimalBarn: React.FC<AnimalBarnProps> = ({
  animals,
  coins,
  level,
  onFeedAnimal,
  onPetAnimal,
  onCollectProduce,
  onAdoptAnimal
}) => {
  const [now, setNow] = useState<number>(Date.now());
  const [pettingId, setPettingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePet = (animalId: string) => {
    sound.playAnimalPet();
    setPettingId(animalId);
    onPetAnimal(animalId);
    setTimeout(() => setPettingId(null), 1200);
  };

  const getAnimalEmoji = (type: Animal['type']) => {
    switch (type) {
      case 'chicken': return '🐔';
      case 'cow': return '🐮';
      case 'sheep': return '🐑';
      case 'pig': return '🐷';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pasture Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>평화로운 동물 목장</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                현재 {animals.length}마리 방목 중
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              동물들에게 사료를 주고 따뜻하게 쓰다듬어 주세요. 건강하게 자란 동물들이 귀한 특산물을 선물합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {animals.map((animal) => {
          let isReady = animal.isReadyToCollect;
          let remainingSec = 0;
          let progress = 0;

          if (animal.fedAt) {
            const finishAt = animal.fedAt + animal.produceCooldownSec * 1000;
            const totalDuration = animal.produceCooldownSec * 1000;
            const elapsed = now - animal.fedAt;
            progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
            remainingSec = Math.max(0, Math.ceil((finishAt - now) / 1000));
            if (now >= finishAt) {
              isReady = true;
            }
          }

          const isPetting = pettingId === animal.id;

          return (
            <div
              key={animal.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden"
            >
              {/* Petting heart burst animation */}
              {isPetting && (
                <div className="absolute inset-0 bg-rose-50/60 backdrop-blur-2xs flex items-center justify-center pointer-events-none z-10 animate-fade">
                  <div className="flex flex-col items-center animate-bounce">
                    <span className="text-4xl text-rose-500">❤️</span>
                    <span className="text-xs font-bold text-rose-600 mt-1">친밀도 +5!</span>
                  </div>
                </div>
              )}

              {/* Card top: Name, level, affection */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">{animal.name}</span>
                  <div className="flex items-center gap-1 text-xs text-rose-500 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{animal.affection}%</span>
                  </div>
                </div>

                {/* Big cute animal avatar */}
                <div className="my-5 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center text-4xl shadow-inner select-none hover:scale-105 transition-transform">
                    {getAnimalEmoji(animal.type)}
                  </div>
                  <span className="text-xs font-medium text-stone-500 mt-2">
                    생산물: {animal.produceEmoji} {animal.produceItemName}
                  </span>
                </div>
              </div>

              {/* Bottom status & interaction buttons */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                {/* Timer / Ready state indicator */}
                {isReady ? (
                  <button
                    onClick={() => {
                      sound.playHarvest();
                      onCollectProduce(animal.id);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{animal.produceEmoji} 특산물 수확하기!</span>
                  </button>
                ) : animal.fedAt ? (
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span>생산 중...</span>
                      <span className="tabular-nums font-semibold text-stone-700">{remainingSec}초 남음</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sound.playPop();
                      onFeedAnimal(animal.id);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🌾 사료 주기 (10G)</span>
                  </button>
                )}

                {/* Pet Button */}
                <button
                  onClick={() => handlePet(animal.id)}
                  className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>쓰다듬어 주기</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adopt New Animals Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>새 동물 입양하기</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INITIAL_ANIMALS.map((template) => {
            const isUnlocked = level >= template.unlockLevel;
            const canAfford = coins >= template.cost;

            return (
              <div
                key={template.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isUnlocked ? 'bg-stone-50/80 border-stone-200' : 'bg-stone-100/60 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getAnimalEmoji(template.type)}</span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">{template.name}</span>
                    <span className="text-[11px] text-stone-500">{template.produceEmoji} {template.produceItemName}</span>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        if (!canAfford) {
                          alert(`입양 비용이 부족합니다! (${template.cost}G 필요)`);
                          return;
                        }
                        sound.playCoin();
                        onAdoptAnimal(template);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      {template.cost}G 입양
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-200 px-2 py-1 rounded">
                      Lv.{template.unlockLevel} 해금
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
