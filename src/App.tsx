import React, { useState, useEffect, useRef } from 'react';
import {
  GameState,
  loadGameState,
  saveGameState,
  clearGameState,
  calculateExpNeeded,
  DEFAULT_GAME_STATE
} from './utils/storage';
import { Crop, WeatherType, TimeOfDay, MarketOrder } from './types';
import {
  INITIAL_CROPS,
  INITIAL_ANIMALS,
  INITIAL_ARTISANS,
  INITIAL_UPGRADES,
  ORDER_CUSTOMERS_POOL
} from './data/gameData';
import { sound } from './utils/audio';

import { Navbar, ActiveTab } from './components/Navbar';
import { WeatherWidget } from './components/WeatherWidget';
import { FarmField } from './components/FarmField';
import { AnimalBarn } from './components/AnimalBarn';
import { ArtisanWorkshop } from './components/ArtisanWorkshop';
import { MarketOrders } from './components/MarketOrders';
import { FarmShop } from './components/FarmShop';
import { AchievementsModal } from './components/AchievementsModal';
import { LevelUpModal } from './components/LevelUpModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadGameState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('field');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(false);

  // Modals
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);

  // Floating notifications
  const [notifications, setNotifications] = useState<{ id: string; text: string; color: string }[]>([]);

  const addNotice = (text: string, color: string = 'text-amber-700 bg-amber-50 border-amber-200') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev.slice(-3), { id, text, color }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2800);
  };

  // Autosave to localStorage
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Weather & time cycle
  const weathers: WeatherType[] = ['sunny', 'sunny', 'rainy', 'breeze', 'rainbow'];
  const times: TimeOfDay[] = ['morning', 'day', 'sunset', 'night'];

  const advanceDay = () => {
    sound.playPop();
    setState(prev => {
      const nextDay = prev.dayCount + 1;
      const nextWeather = weathers[Math.floor(Math.random() * weathers.length)];
      const nextTime = times[(times.indexOf(prev.timeOfDay) + 1) % times.length];

      // Auto-water if rainy
      const updatedPlots = prev.plots.map(p => {
        if (nextWeather === 'rainy' && p.status === 'planted') {
          return { ...p, isWatered: true };
        }
        return p;
      });

      addNotice(`새로운 날이 밝았습니다! (농장 ${nextDay}일차)`, 'text-emerald-800 bg-emerald-50 border-emerald-200');
      return {
        ...prev,
        dayCount: nextDay,
        weather: nextWeather,
        timeOfDay: nextTime,
        plots: updatedPlots
      };
    });
  };

  // Sprinkler automation loop (Runs every 4 seconds)
  useEffect(() => {
    const sprinklerUpgrade = state.upgrades.find(u => u.id === 'sprinkler');
    const hasSprinkler = (sprinklerUpgrade?.level || 0) > 0;

    const interval = setInterval(() => {
      if (hasSprinkler || state.weather === 'rainy') {
        setState(prev => {
          let wateredAny = false;
          const updatedPlots = prev.plots.map(p => {
            if (p.status === 'planted' && !p.isWatered) {
              wateredAny = true;
              return { ...p, isWatered: true };
            }
            return p;
          });
          if (wateredAny) {
            return { ...prev, plots: updatedPlots };
          }
          return prev;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [state.upgrades, state.weather]);

  // Audio toggles
  const handleToggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  const handleToggleMusic = () => {
    sound.toggleMusic();
    setIsMusicOn(sound.isMusicOn);
  };

  // EXP & Level Up Handler
  const addExpAndGold = (expGain: number, goldGain: number) => {
    setState(prev => {
      let currentExp = prev.exp + expGain;
      let currentLevel = prev.level;
      let expReq = calculateExpNeeded(currentLevel);
      let didLevelUp = false;

      while (currentExp >= expReq) {
        currentExp -= expReq;
        currentLevel += 1;
        expReq = calculateExpNeeded(currentLevel);
        didLevelUp = true;
      }

      if (didLevelUp) {
        sound.playLevelUp();
        setLevelUpData(currentLevel);
        addNotice(`🎉 레벨 업! Lv.${currentLevel} 달성!`, 'text-amber-900 bg-amber-100 border-amber-300 font-bold');
      }

      const newCoins = prev.coins + goldGain;
      const totalGoldEarned = prev.stats.totalGoldEarned + (goldGain > 0 ? goldGain : 0);

      // Check achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'gold_magnate') {
          return { ...ach, currentCount: totalGoldEarned };
        }
        return ach;
      });

      return {
        ...prev,
        coins: newCoins,
        level: currentLevel,
        exp: currentExp,
        stats: {
          ...prev.stats,
          totalGoldEarned
        },
        achievements: updatedAchievements
      };
    });
  };

  // 1. Plant Crop
  const handlePlant = (plotId: number, crop: Crop) => {
    if (state.coins < crop.seedPrice) {
      alert('씨앗을 구매할 골드가 부족합니다!');
      return;
    }

    const scarecrowUpgrade = state.upgrades.find(u => u.id === 'scarecrow');
    const hasScarecrow = (scarecrowUpgrade?.level || 0) > 0;
    const speedMultiplier = hasScarecrow ? 0.8 : 1.0;
    const weatherSpeed = state.weather === 'rainbow' ? 0.7 : 1.0;

    const growthDurationMs = Math.round(crop.growthTimeSec * 1000 * speedMultiplier * weatherSpeed);
    const now = Date.now();

    const sprinklerUpgrade = state.upgrades.find(u => u.id === 'sprinkler');
    const hasSprinkler = (sprinklerUpgrade?.level || 0) > 0;
    const isAutoWatered = hasSprinkler || state.weather === 'rainy';

    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId) {
          return {
            ...p,
            status: 'planted' as const,
            cropId: crop.id,
            plantedAt: now,
            harvestAt: now + growthDurationMs,
            isWatered: isAutoWatered,
            isFertilized: false
          };
        }
        return p;
      });

      return {
        ...prev,
        coins: prev.coins - crop.seedPrice,
        plots: updatedPlots
      };
    });

    addNotice(`${crop.name} 씨앗을 심었습니다 (-${crop.seedPrice}G)`);
  };

  // 2. Water Plot
  const handleWater = (plotId: number) => {
    sound.playWater();
    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId) {
          return { ...p, isWatered: true };
        }
        return p;
      });
      return { ...prev, plots: updatedPlots };
    });
  };

  const handleWaterAll = () => {
    sound.playWater();
    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.status === 'planted') {
          return { ...p, isWatered: true };
        }
        return p;
      });
      return { ...prev, plots: updatedPlots };
    });
    addNotice('모든 밭에 맑은 물을 주었습니다! 💧');
  };

  // 3. Fertilize Plot
  const handleFertilize = (plotId: number) => {
    const cost = 20;
    if (state.coins < cost) {
      alert('비료를 구매할 골드가 부족합니다!');
      return;
    }

    sound.playHarvest();
    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId && p.status === 'planted' && p.harvestAt && p.plantedAt) {
          const remaining = Math.max(0, p.harvestAt - Date.now());
          const boostTime = Math.round(remaining * 0.5); // cut remaining time in half
          return {
            ...p,
            isFertilized: true,
            harvestAt: p.harvestAt - boostTime
          };
        }
        return p;
      });

      return {
        ...prev,
        coins: prev.coins - cost,
        plots: updatedPlots
      };
    });
    addNotice('특효 비료로 성장을 2배 촉진했습니다! (-20G)');
  };

  // 4. Harvest Plot
  const handleHarvest = (plotId: number) => {
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || plot.status !== 'planted' || !plot.cropId) return;

    const crop = INITIAL_CROPS.find(c => c.id === plot.cropId);
    if (!crop) return;

    sound.playHarvest();

    // Check golden sickle
    const sickleUpgrade = state.upgrades.find(u => u.id === 'golden_sickle');
    const sickleLevel = sickleUpgrade?.level || 0;
    const isDoubleHarvest = sickleLevel > 0 && Math.random() < 0.15 * sickleLevel;
    const yieldCount = isDoubleHarvest ? 2 : 1;
    const bonusExp = Math.round(crop.expYield * (1 + sickleLevel * 0.25));

    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId) {
          return {
            ...p,
            status: 'empty' as const,
            cropId: undefined,
            plantedAt: undefined,
            harvestAt: undefined,
            isWatered: false,
            isFertilized: false
          };
        }
        return p;
      });

      const updatedInventory = {
        ...prev.inventory,
        [crop.id]: (prev.inventory[crop.id] || 0) + yieldCount
      };

      const newHarvestsCount = prev.stats.totalHarvests + 1;

      // Update achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'first_harvest' || ach.id === 'harvest_master_1') {
          return { ...ach, currentCount: newHarvestsCount };
        }
        return ach;
      });

      return {
        ...prev,
        inventory: updatedInventory,
        plots: updatedPlots,
        stats: {
          ...prev.stats,
          totalHarvests: newHarvestsCount
        },
        achievements: updatedAchievements
      };
    });

    addExpAndGold(bonusExp, 0);
    addNotice(`${crop.emoji} ${crop.name} ${yieldCount}개 수확! (+${bonusExp} EXP)`);
  };

  const handleHarvestAll = () => {
    const now = Date.now();
    const readyPlots = state.plots.filter(p => p.status === 'planted' && p.harvestAt && now >= p.harvestAt);
    if (readyPlots.length === 0) return;

    sound.playHarvest();
    readyPlots.forEach(p => handleHarvest(p.id));
    addNotice(`총 ${readyPlots.length}개의 작물을 일괄 수확했습니다! ✨`);
  };

  // 5. Clear Weeds
  const handleClearPlot = (plotId: number) => {
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || state.coins < plot.unlockCost) return;

    sound.playPop();
    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId) {
          return { ...p, status: 'empty' as const, unlockCost: 0 };
        }
        return p;
      });
      return {
        ...prev,
        coins: prev.coins - plot.unlockCost,
        plots: updatedPlots
      };
    });
    addNotice(`잡초를 제거하여 새 밭을 일구었습니다! (-${plot.unlockCost}G)`);
  };

  // 6. Unlock Expansion Plot
  const handleUnlockPlot = (plotId: number) => {
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || state.coins < plot.unlockCost) return;

    sound.playCoin();
    setState(prev => {
      const updatedPlots = prev.plots.map(p => {
        if (p.id === plotId) {
          return { ...p, status: 'empty' as const, unlockCost: 0 };
        }
        return p;
      });
      return {
        ...prev,
        coins: prev.coins - plot.unlockCost,
        plots: updatedPlots
      };
    });
    addNotice(`농장 영역을 확장했습니다! (-${plot.unlockCost}G)`);
  };

  // 7. Animal Actions
  const handleFeedAnimal = (animalId: string) => {
    const cost = 10;
    if (state.coins < cost) {
      alert('사료 구매 골드가 부족합니다!');
      return;
    }

    sound.playPop();
    setState(prev => {
      const updatedAnimals = prev.animals.map(a => {
        if (a.id === animalId) {
          return {
            ...a,
            fedAt: Date.now(),
            isReadyToCollect: false
          };
        }
        return a;
      });

      const newFeedCount = prev.stats.totalFeedCount + 1;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'animal_friend') {
          return { ...ach, currentCount: newFeedCount };
        }
        return ach;
      });

      return {
        ...prev,
        coins: prev.coins - cost,
        animals: updatedAnimals,
        stats: {
          ...prev.stats,
          totalFeedCount: newFeedCount
        },
        achievements: updatedAchievements
      };
    });

    addNotice('동물에게 영양 사료를 주었습니다 (-10G)');
  };

  const handlePetAnimal = (animalId: string) => {
    setState(prev => {
      const updatedAnimals = prev.animals.map(a => {
        if (a.id === animalId) {
          return {
            ...a,
            affection: Math.min(100, a.affection + 5)
          };
        }
        return a;
      });
      return { ...prev, animals: updatedAnimals };
    });
  };

  const handleCollectProduce = (animalId: string) => {
    const animal = state.animals.find(a => a.id === animalId);
    if (!animal) return;

    sound.playHarvest();
    setState(prev => {
      const updatedAnimals = prev.animals.map(a => {
        if (a.id === animalId) {
          return {
            ...a,
            fedAt: null,
            isReadyToCollect: false
          };
        }
        return a;
      });

      const updatedInventory = {
        ...prev.inventory,
        [animal.producesItem]: (prev.inventory[animal.producesItem] || 0) + 1
      };

      return {
        ...prev,
        inventory: updatedInventory,
        animals: updatedAnimals
      };
    });

    addExpAndGold(30, 0);
    addNotice(`${animal.produceEmoji} ${animal.produceItemName} 1개를 수확했습니다! (+30 EXP)`);
  };

  const handleAdoptAnimal = (template: typeof INITIAL_ANIMALS[0]) => {
    setState(prev => {
      const newAnimal = {
        ...template,
        id: `${template.type}_${Date.now()}`,
        name: `${template.name} #${prev.animals.filter(a => a.type === template.type).length + 1}`
      };

      return {
        ...prev,
        coins: prev.coins - template.cost,
        animals: [...prev.animals, newAnimal]
      };
    });

    addNotice(`새로운 가족 ${template.name}을(를) 입양했습니다! 💖`);
  };

  // 8. Artisan Actions
  const handleStartCraft = (artisanId: string) => {
    const artisan = state.artisans.find(a => a.id === artisanId);
    if (!artisan) return;

    const available = state.inventory[artisan.inputItemId] || 0;
    if (available < artisan.inputCount) return;

    sound.playPop();
    const now = Date.now();
    const finishAt = now + artisan.processingTimeSec * 1000;

    setState(prev => {
      const updatedInventory = {
        ...prev.inventory,
        [artisan.inputItemId]: prev.inventory[artisan.inputItemId] - artisan.inputCount
      };

      const updatedArtisans = prev.artisans.map(m => {
        if (m.id === artisanId) {
          return {
            ...m,
            currentJob: { startedAt: now, finishAt },
            isReady: false
          };
        }
        return m;
      });

      return {
        ...prev,
        inventory: updatedInventory,
        artisans: updatedArtisans
      };
    });

    addNotice(`${artisan.outputItemName} 가공을 시작했습니다!`);
  };

  const handleCollectCraft = (artisanId: string) => {
    const artisan = state.artisans.find(a => a.id === artisanId);
    if (!artisan) return;

    setState(prev => {
      const updatedArtisans = prev.artisans.map(m => {
        if (m.id === artisanId) {
          return {
            ...m,
            currentJob: null,
            isReady: false
          };
        }
        return m;
      });

      const updatedInventory = {
        ...prev.inventory,
        [artisan.outputItemId]: (prev.inventory[artisan.outputItemId] || 0) + 1
      };

      const newCraftCount = prev.stats.totalCraftCount + 1;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'artisan_apprentice') {
          return { ...ach, currentCount: newCraftCount };
        }
        return ach;
      });

      return {
        ...prev,
        inventory: updatedInventory,
        artisans: updatedArtisans,
        stats: {
          ...prev.stats,
          totalCraftCount: newCraftCount
        },
        achievements: updatedAchievements
      };
    });

    addExpAndGold(60, 0);
    addNotice(`${artisan.outputItemEmoji} ${artisan.outputItemName} 완성! (+60 EXP)`);
  };

  const handleUnlockArtisan = (artisanId: string) => {
    const artisan = state.artisans.find(a => a.id === artisanId);
    if (!artisan || state.coins < artisan.unlockCost) return;

    setState(prev => {
      const updatedArtisans = prev.artisans.map(m => {
        if (m.id === artisanId) {
          return { ...m, unlocked: true };
        }
        return m;
      });

      return {
        ...prev,
        coins: prev.coins - artisan.unlockCost,
        artisans: updatedArtisans
      };
    });

    addNotice(`새로운 공방 설비 [${artisan.name}]을(를) 구축했습니다!`);
  };

  // 9. Deliver Market Order
  const handleDeliverOrder = (orderId: string) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    setState(prev => {
      const updatedInventory = { ...prev.inventory };
      order.requestedItems.forEach(req => {
        updatedInventory[req.itemId] = Math.max(0, (updatedInventory[req.itemId] || 0) - req.count);
      });

      // Generate a new replacement order
      const randomCustomer = ORDER_CUSTOMERS_POOL[Math.floor(Math.random() * ORDER_CUSTOMERS_POOL.length)];
      const randomCrop1 = INITIAL_CROPS[Math.floor(Math.random() * Math.min(prev.level + 1, INITIAL_CROPS.length))];
      const newOrder: MarketOrder = {
        id: `order_${Date.now()}`,
        customerName: randomCustomer.name,
        customerTitle: randomCustomer.title,
        customerEmoji: randomCustomer.emoji,
        requestedItems: [
          { itemId: randomCrop1.id, itemName: randomCrop1.name, itemEmoji: randomCrop1.emoji, count: Math.floor(Math.random() * 3) + 2 }
        ],
        rewardGold: randomCrop1.sellPrice * 3 + 40,
        rewardExp: randomCrop1.expYield * 3 + 25
      };

      const updatedOrders = prev.orders.map(o => (o.id === orderId ? newOrder : o));
      const newOrdersDone = prev.stats.totalOrdersDone + 1;

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'order_champion') {
          return { ...ach, currentCount: newOrdersDone };
        }
        return ach;
      });

      return {
        ...prev,
        inventory: updatedInventory,
        orders: updatedOrders,
        stats: {
          ...prev.stats,
          totalOrdersDone: newOrdersDone
        },
        achievements: updatedAchievements
      };
    });

    addExpAndGold(order.rewardExp, order.rewardGold);
    addNotice(`주문 납품 완료! (+${order.rewardGold}G, +${order.rewardExp} EXP)`);
  };

  // 10. Sell Inventory Items
  const handleSellItem = (itemId: string, count: number, pricePerUnit: number) => {
    const current = state.inventory[itemId] || 0;
    const sellCount = Math.min(current, count);
    if (sellCount <= 0) return;

    const goldTotal = sellCount * pricePerUnit;

    setState(prev => {
      const updatedInventory = {
        ...prev.inventory,
        [itemId]: (prev.inventory[itemId] || 0) - sellCount
      };

      return {
        ...prev,
        inventory: updatedInventory
      };
    });

    addExpAndGold(Math.round(sellCount * 4), goldTotal);
    addNotice(`아이템 판매 완료 (+${goldTotal}G)`);
  };

  const handleSellAll = () => {
    let totalGold = 0;
    let totalItems = 0;

    Object.entries(state.inventory).forEach(([itemId, count]) => {
      if (count <= 0) return;
      const crop = INITIAL_CROPS.find(c => c.id === itemId);
      const animal = INITIAL_ANIMALS.find(a => a.producesItem === itemId);
      const artisan = INITIAL_ARTISANS.find(a => a.outputItemId === itemId);
      const unitPrice = crop?.sellPrice || animal?.sellPrice || artisan?.outputSellPrice || 20;

      totalGold += unitPrice * count;
      totalItems += count;
    });

    if (totalItems === 0) return;

    setState(prev => ({
      ...prev,
      inventory: {}
    }));

    addExpAndGold(totalItems * 5, totalGold);
    addNotice(`창고 물품 ${totalItems}개 전량 판매 완료! (+${totalGold.toLocaleString()}G)`);
  };

  // 11. Buy Upgrades
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const upgradeCost = Math.round(upgrade.cost * Math.pow(1.6, upgrade.level));
    if (state.coins < upgradeCost) return;

    setState(prev => {
      const updatedUpgrades = prev.upgrades.map(u => {
        if (u.id === upgradeId) {
          return { ...u, level: u.level + 1 };
        }
        return u;
      });

      return {
        ...prev,
        coins: prev.coins - upgradeCost,
        upgrades: updatedUpgrades
      };
    });

    addNotice(`[${upgrade.name}] 업그레이드 완료!`);
  };

  // 12. Claim Achievement Reward
  const handleClaimReward = (achievementId: string) => {
    const ach = state.achievements.find(a => a.id === achievementId);
    if (!ach || ach.isClaimed) return;

    setState(prev => {
      const updatedAchievements = prev.achievements.map(a => {
        if (a.id === achievementId) {
          return { ...a, isClaimed: true };
        }
        return a;
      });

      return {
        ...prev,
        coins: prev.coins + ach.rewardGold,
        gems: prev.gems + ach.rewardGems,
        achievements: updatedAchievements
      };
    });

    addNotice(`업적 달성 보상 획득! (+${ach.rewardGold}G, +${ach.rewardGems}💎)`);
  };

  // 13. Reset Farm Game
  const handleConfirmReset = () => {
    clearGameState();
    setState(DEFAULT_GAME_STATE);
    setIsResetOpen(false);
    addNotice('농장이 처음 상태로 초기화되었습니다.');
  };

  const expNeeded = calculateExpNeeded(state.level);
  const sprinklerUpgrade = state.upgrades.find(u => u.id === 'sprinkler');
  const hasSprinkler = (sprinklerUpgrade?.level || 0) > 0;
  const scarecrowUpgrade = state.upgrades.find(u => u.id === 'scarecrow');
  const hasScarecrow = (scarecrowUpgrade?.level || 0) > 0;
  const sickleUpgrade = state.upgrades.find(u => u.id === 'golden_sickle');

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Bar following contract */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        coins={state.coins}
        gems={state.gems}
        level={state.level}
        exp={state.exp}
        expNeeded={expNeeded}
        isMuted={isMuted}
        isMusicOn={isMusicOn}
        onToggleMute={handleToggleMute}
        onToggleMusic={handleToggleMusic}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onResetGame={() => setIsResetOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Weather & Day Bar */}
        <WeatherWidget
          dayCount={state.dayCount}
          weather={state.weather}
          timeOfDay={state.timeOfDay}
          onAdvanceDay={advanceDay}
        />

        {/* Farm Hero Overview Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/90 bg-stone-900 text-white min-h-[170px] flex items-center">
          <img
            src="/src/assets/images/farm_scenic_banner_1792394252485.jpg"
            alt="초록 농장 전경"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-950/60 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-6 w-full">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  평화로운 힐링 라이프
                </span>
                <span className="text-xs text-stone-300">농장 가치: {((state.coins) + Object.values(state.inventory).length * 100).toLocaleString()}G</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                햇살 가득 초록 농장
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                정성껏 땅을 갈고, 씨앗을 뿌려보세요. 계절마다 풍성한 결실이 여러분의 일상을 채워줍니다.
              </p>
            </div>

            {/* Farmer Avatar showcase */}
            <div className="hidden md:flex items-center gap-3.5 bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
              <img
                src="/src/assets/images/farm_farmer_avatar_1792394253156.jpg"
                alt="농장주 아바타"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-amber-300/40 shadow-xs"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">새싹 농장주</span>
                <span className="text-[11px] text-emerald-300 block">수확 완료: {state.stats.totalHarvests}회</span>
                <span className="text-[10px] text-stone-400">누적 골드: {state.stats.totalGoldEarned.toLocaleString()}G</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'field' && (
          <FarmField
            plots={state.plots}
            coins={state.coins}
            level={state.level}
            inventory={state.inventory}
            hasSprinkler={hasSprinkler}
            hasScarecrow={hasScarecrow}
            goldenSickleLevel={sickleUpgrade?.level || 0}
            onPlant={handlePlant}
            onWater={handleWater}
            onWaterAll={handleWaterAll}
            onHarvest={handleHarvest}
            onHarvestAll={handleHarvestAll}
            onFertilize={handleFertilize}
            onClearPlot={handleClearPlot}
            onUnlockPlot={handleUnlockPlot}
          />
        )}

        {activeTab === 'animals' && (
          <AnimalBarn
            animals={state.animals}
            coins={state.coins}
            level={state.level}
            onFeedAnimal={handleFeedAnimal}
            onPetAnimal={handlePetAnimal}
            onCollectProduce={handleCollectProduce}
            onAdoptAnimal={handleAdoptAnimal}
          />
        )}

        {activeTab === 'artisan' && (
          <ArtisanWorkshop
            artisans={state.artisans}
            inventory={state.inventory}
            coins={state.coins}
            level={state.level}
            onStartCraft={handleStartCraft}
            onCollectCraft={handleCollectCraft}
            onUnlockArtisan={handleUnlockArtisan}
          />
        )}

        {activeTab === 'market' && (
          <MarketOrders
            orders={state.orders}
            inventory={state.inventory}
            coins={state.coins}
            onDeliverOrder={handleDeliverOrder}
            onSellItem={handleSellItem}
            onSellAll={handleSellAll}
          />
        )}

        {activeTab === 'shop' && (
          <FarmShop
            upgrades={state.upgrades}
            coins={state.coins}
            level={state.level}
            onBuyUpgrade={handleBuyUpgrade}
          />
        )}
      </main>

      {/* Floating Notice Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-2.5 rounded-2xl shadow-lg border text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${n.color}`}
          >
            {n.text}
          </div>
        ))}
      </div>

      {/* Modals */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={state.achievements}
        inventory={state.inventory}
        onClaimReward={handleClaimReward}
      />

      {levelUpData !== null && (
        <LevelUpModal
          newLevel={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}

      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
