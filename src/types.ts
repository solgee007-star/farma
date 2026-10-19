export type WeatherType = 'sunny' | 'rainy' | 'rainbow' | 'breeze';
export type TimeOfDay = 'morning' | 'day' | 'sunset' | 'night';

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  seedPrice: number;
  sellPrice: number;
  growthTimeSec: number;
  unlockLevel: number;
  expYield: number;
  color: string;
  description: string;
}

export type PlotStatus = 'locked' | 'weeds' | 'empty' | 'planted' | 'ready';

export interface Plot {
  id: number;
  status: PlotStatus;
  cropId?: string;
  plantedAt?: number; // timestamp
  harvestAt?: number; // timestamp
  isWatered: boolean;
  isFertilized: boolean;
  hasSprinkler?: boolean;
  unlockCost: number;
}

export type ToolType = 'inspect' | 'water' | 'seed' | 'harvest' | 'fertilizer' | 'clear';

export interface Animal {
  id: string;
  name: string;
  type: 'chicken' | 'cow' | 'sheep' | 'pig';
  level: number;
  fedAt: number | null;
  produceCooldownSec: number;
  producesItem: string;
  produceItemName: string;
  produceEmoji: string;
  sellPrice: number;
  affection: number; // 0 - 100
  isReadyToCollect: boolean;
  cost: number;
  unlockLevel: number;
}

export interface ArtisanMachine {
  id: string;
  name: string;
  description: string;
  inputItemId: string;
  inputItemName: string;
  inputItemEmoji: string;
  inputCount: number;
  outputItemId: string;
  outputItemName: string;
  outputItemEmoji: string;
  outputSellPrice: number;
  processingTimeSec: number;
  unlockLevel: number;
  unlockCost: number;
  unlocked: boolean;
  // active job:
  currentJob?: {
    startedAt: number;
    finishAt: number;
  } | null;
  isReady: boolean;
}

export interface MarketOrder {
  id: string;
  customerName: string;
  customerTitle: string;
  customerEmoji: string;
  requestedItems: {
    itemId: string;
    itemName: string;
    itemEmoji: string;
    count: number;
  }[];
  rewardGold: number;
  rewardExp: number;
  expiresInSec?: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  iconName: string;
  effect: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardGold: number;
  rewardGems: number;
  isClaimed: boolean;
  icon: string;
}

export interface FloatingNoticeData {
  id: string;
  text: string;
  x?: number;
  y?: number;
  type?: 'gold' | 'exp' | 'item' | 'info';
}
