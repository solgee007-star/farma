import React from 'react';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { INITIAL_CROPS, INITIAL_ANIMALS, INITIAL_ARTISANS } from '../data/gameData';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  const unlockedCrops = INITIAL_CROPS.filter(c => c.unlockLevel === newLevel);
  const unlockedAnimals = INITIAL_ANIMALS.filter(a => a.unlockLevel === newLevel);
  const unlockedArtisans = INITIAL_ARTISANS.filter(m => m.unlockLevel === newLevel);

  const bonusCoins = newLevel * 100;
  const bonusGems = 5;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl w-full max-w-md p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl animate-bounce">
          🎉
        </div>

        <h2 className="text-2xl font-black text-stone-900 mt-4 tracking-tight">
          레벨 업! (Lv.{newLevel})
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          농장이 더욱 번창하여 새로운 가능성이 열렸습니다!
        </p>

        {/* Bonus Rewards */}
        <div className="my-5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
            <span>💰</span>
            <span>+{bonusCoins}G</span>
          </div>
          <div className="text-stone-300">|</div>
          <div className="flex items-center gap-1.5 font-bold text-sky-900 text-sm">
            <span>💎</span>
            <span>+{bonusGems} 다이아</span>
          </div>
        </div>

        {/* Newly Unlocked Items */}
        {(unlockedCrops.length > 0 || unlockedAnimals.length > 0 || unlockedArtisans.length > 0) && (
          <div className="mb-5 text-left bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2.5">
            <span className="text-xs font-bold text-stone-700 block">새로 해금된 항목:</span>
            {unlockedCrops.map(crop => (
              <div key={crop.id} className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                <span>{crop.emoji}</span>
                <span>새 작물: <strong>{crop.name}</strong></span>
              </div>
            ))}
            {unlockedAnimals.map(animal => (
              <div key={animal.id} className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                <span>{animal.produceEmoji}</span>
                <span>새 동물: <strong>{animal.name}</strong></span>
              </div>
            ))}
            {unlockedArtisans.map(machine => (
              <div key={machine.id} className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                <span>{machine.outputItemEmoji}</span>
                <span>공방 설비: <strong>{machine.name}</strong></span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          <span>농장 가꾸기 계속하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
