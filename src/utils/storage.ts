import { Plot, Animal, ArtisanMachine, Upgrade, Achievement, MarketOrder, WeatherType, TimeOfDay } from '../types';
import { INITIAL_ANIMALS, INITIAL_ARTISANS, INITIAL_UPGRADES, INITIAL_ACHIEVEMENTS, INITIAL_ORDERS } from '../data/gameData';

export interface GameState {
  coins: number;
  gems: number;
  level: number;
  exp: number;
  dayCount: number;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  plots: Plot[];
  inventory: Record<string, number>;
  animals: Animal[];
  artisans: ArtisanMachine[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  orders: MarketOrder[];
  stats: {
    totalHarvests: number;
    totalGoldEarned: number;
    totalFeedCount: number;
    totalOrdersDone: number;
    totalCraftCount: number;
  };
}

const STORAGE_KEY = 'green_harvest_farm_save_v1';

export function getInitialPlots(): Plot[] {
  const plots: Plot[] = [];
  // 16 total plots:
  // 0-5: empty & tilled, ready to plant
  // 6-7: ready to plant
  // 8-11: covered with weeds/stones (small clearing fee)
  // 12-15: locked territory (expansion purchase)
  for (let i = 0; i < 16; i++) {
    let status: Plot['status'] = 'empty';
    let cost = 0;

    if (i < 8) {
      status = 'empty';
      cost = 0;
    } else if (i < 12) {
      status = 'weeds';
      cost = 50 + (i - 8) * 40;
    } else {
      status = 'locked';
      cost = 250 + (i - 12) * 150;
    }

    plots.push({
      id: i,
      status,
      isWatered: false,
      isFertilized: false,
      unlockCost: cost
    });
  }
  return plots;
}

export const DEFAULT_GAME_STATE: GameState = {
  coins: 150, // Enough to buy initial carrot/wheat seeds
  gems: 10,
  level: 1,
  exp: 0,
  dayCount: 1,
  weather: 'sunny',
  timeOfDay: 'morning',
  plots: getInitialPlots(),
  inventory: {
    carrot: 2, // starting gift
    wheat: 1
  },
  animals: INITIAL_ANIMALS,
  artisans: INITIAL_ARTISANS,
  upgrades: INITIAL_UPGRADES,
  achievements: INITIAL_ACHIEVEMENTS,
  orders: INITIAL_ORDERS,
  stats: {
    totalHarvests: 0,
    totalGoldEarned: 0,
    totalFeedCount: 0,
    totalOrdersDone: 0,
    totalCraftCount: 0
  }
};

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_GAME_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_GAME_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GAME_STATE,
      ...parsed,
      plots: parsed.plots?.length ? parsed.plots : getInitialPlots(),
      inventory: parsed.inventory || DEFAULT_GAME_STATE.inventory,
      animals: parsed.animals?.length ? parsed.animals : INITIAL_ANIMALS,
      artisans: parsed.artisans?.length ? parsed.artisans : INITIAL_ARTISANS,
      upgrades: parsed.upgrades?.length ? parsed.upgrades : INITIAL_UPGRADES,
      achievements: parsed.achievements?.length ? parsed.achievements : INITIAL_ACHIEVEMENTS,
      orders: parsed.orders?.length ? parsed.orders : INITIAL_ORDERS,
      stats: { ...DEFAULT_GAME_STATE.stats, ...(parsed.stats || {}) }
    };
  } catch (err) {
    console.error('Failed to load game state:', err);
    return DEFAULT_GAME_STATE;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save game state:', err);
  }
}

export function clearGameState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear game state:', err);
  }
}

export function calculateExpNeeded(level: number): number {
  return Math.floor(50 * Math.pow(1.35, level - 1));
}
