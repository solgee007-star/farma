import React from 'react';
import { Sparkles, Droplets, Shield, Package, Check, ArrowUpRight } from 'lucide-react';
import { Upgrade } from '../types';
import { INITIAL_CROPS } from '../data/gameData';
import { sound } from '../utils/audio';

interface FarmShopProps {
  upgrades: Upgrade[];
  coins: number;
  level: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

export const FarmShop: React.FC<FarmShopProps> = ({
  upgrades,
  coins,
  level,
  onBuyUpgrade
}) => {
  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-6 h-6 text-sky-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Shield': return <Shield className="w-6 h-6 text-emerald-500" />;
      case 'Package': return <Package className="w-6 h-6 text-orange-500" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Facilities Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>농장 설비 및 영구 업그레이드</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          스프링클러와 황금 농기구를 설치하여 농장의 자동화와 생산성을 극대화하세요.
        </p>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map((upgrade) => {
          const isMaxed = upgrade.level >= upgrade.maxLevel;
          const upgradeCost = Math.round(upgrade.cost * Math.pow(1.6, upgrade.level));
          const canAfford = coins >= upgradeCost;

          return (
            <div
              key={upgrade.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0">
                    {getUpgradeIcon(upgrade.iconName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-stone-900">{upgrade.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                        {isMaxed ? '최고 레벨 (MAX)' : `Lv.${upgrade.level} / ${upgrade.maxLevel}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{upgrade.description}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">효과: {upgrade.effect}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {!isMaxed ? (
                    <div className="text-xs">
                      <span className="text-stone-500">업그레이드 비용: </span>
                      <span className="font-bold text-amber-700">{upgradeCost.toLocaleString()}G</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>완료된 시설</span>
                    </span>
                  )}
                </div>

                {!isMaxed && (
                  <button
                    onClick={() => {
                      if (!canAfford) {
                        alert(`골드가 부족합니다! (${upgradeCost.toLocaleString()}G 필요)`);
                        return;
                      }
                      sound.playCoin();
                      onBuyUpgrade(upgrade.id);
                    }}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    업그레이드
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crop Economics Guide Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-1">
          📊 작물 재배 수익 분석표
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          각 작물의 성장 주기와 순수익을 비교하여 최고의 농장 경영 전략을 세워보세요.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">작물명</th>
                <th className="py-2.5 px-3 font-semibold">해금 레벨</th>
                <th className="py-2.5 px-3 font-semibold">씨앗 원가</th>
                <th className="py-2.5 px-3 font-semibold">수확 판매가</th>
                <th className="py-2.5 px-3 font-semibold">순이익</th>
                <th className="py-2.5 px-3 font-semibold">성장 시간</th>
                <th className="py-2.5 px-3 font-semibold">수확 경험치</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {INITIAL_CROPS.map((crop) => {
                const profit = crop.sellPrice - crop.seedPrice;
                const isUnlocked = level >= crop.unlockLevel;

                return (
                  <tr key={crop.id} className={isUnlocked ? 'hover:bg-stone-50/50' : 'opacity-50'}>
                    <td className="py-2.5 px-3 font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{crop.emoji}</span>
                      <span>{crop.name}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-semibold ${isUnlocked ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                        Lv.{crop.unlockLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-stone-600 tabular-nums">{crop.seedPrice}G</td>
                    <td className="py-2.5 px-3 font-medium text-stone-900 tabular-nums">{crop.sellPrice}G</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700 tabular-nums">+{profit}G</td>
                    <td className="py-2.5 px-3 font-medium text-stone-600 tabular-nums">{crop.growthTimeSec}초</td>
                    <td className="py-2.5 px-3 font-medium text-amber-700 tabular-nums">+{crop.expYield} EXP</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
