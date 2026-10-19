import { Crop, Animal, ArtisanMachine, Upgrade, Achievement, MarketOrder } from '../types';

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'carrot',
    name: '싱싱 당근',
    emoji: '🥕',
    seedPrice: 8,
    sellPrice: 18,
    growthTimeSec: 8,
    unlockLevel: 1,
    expYield: 6,
    color: '#F97316',
    description: '가장 기초적이고 빠르게 자라는 아삭아삭한 주황빛 당근.'
  },
  {
    id: 'wheat',
    name: '황금빛 밀',
    emoji: '🌾',
    seedPrice: 15,
    sellPrice: 32,
    growthTimeSec: 15,
    unlockLevel: 2,
    expYield: 12,
    color: '#EAB308',
    description: '바람에 살랑이는 밀. 가공하여 빵이나 동물 사료를 만들 수 있습니다.'
  },
  {
    id: 'strawberry',
    name: '달콤 딸기',
    emoji: '🍓',
    seedPrice: 30,
    sellPrice: 65,
    growthTimeSec: 25,
    unlockLevel: 3,
    expYield: 24,
    color: '#EF4444',
    description: '향긋하고 달콤한 딸기. 잼으로 가공하면 가치가 크게 뜁니다.'
  },
  {
    id: 'corn',
    name: '찰 옥수수',
    emoji: '🌽',
    seedPrice: 55,
    sellPrice: 120,
    growthTimeSec: 40,
    unlockLevel: 4,
    expYield: 45,
    color: '#FBBF24',
    description: '키가 쑥쑥 자라며 알알이 꽉 찬 고소한 옥수수.'
  },
  {
    id: 'tomato',
    name: '완숙 토마토',
    emoji: '🍅',
    seedPrice: 90,
    sellPrice: 210,
    growthTimeSec: 60,
    unlockLevel: 5,
    expYield: 75,
    color: '#DC2626',
    description: '태양의 붉은 기운을 듬뿍 받은 싱싱한 토마토.'
  },
  {
    id: 'pumpkin',
    name: '호박 대왕',
    emoji: '🎃',
    seedPrice: 150,
    sellPrice: 380,
    growthTimeSec: 90,
    unlockLevel: 6,
    expYield: 130,
    color: '#EA580C',
    description: '크고 묵직한 가을 호박. 높은 수익을 자랑합니다.'
  },
  {
    id: 'watermelon',
    name: '시원 수박',
    emoji: '🍉',
    seedPrice: 260,
    sellPrice: 700,
    growthTimeSec: 130,
    unlockLevel: 8,
    expYield: 220,
    color: '#10B981',
    description: '여름의 제왕, 속이 빨갛고 과즙이 풍부한 최고급 수박.'
  },
  {
    id: 'golden_apple',
    name: '황금 사과',
    emoji: '🍏',
    seedPrice: 500,
    sellPrice: 1600,
    growthTimeSec: 180,
    unlockLevel: 10,
    expYield: 500,
    color: '#F59E0B',
    description: '신비로운 황금빛으로 빛나는 기적의 명품 사과.'
  }
];

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'chicken_1',
    name: '꼬꼬댁 닭',
    type: 'chicken',
    level: 1,
    fedAt: null,
    produceCooldownSec: 25,
    producesItem: 'egg',
    produceItemName: '신선한 달걀',
    produceEmoji: '🥚',
    sellPrice: 35,
    affection: 30,
    isReadyToCollect: false,
    cost: 120,
    unlockLevel: 1
  },
  {
    id: 'cow_1',
    name: '얼룩 젖소',
    type: 'cow',
    level: 1,
    fedAt: null,
    produceCooldownSec: 45,
    producesItem: 'milk',
    produceItemName: '고소한 우유',
    produceEmoji: '🥛',
    sellPrice: 75,
    affection: 40,
    isReadyToCollect: false,
    cost: 350,
    unlockLevel: 3
  },
  {
    id: 'sheep_1',
    name: '몽실 양',
    type: 'sheep',
    level: 1,
    fedAt: null,
    produceCooldownSec: 70,
    producesItem: 'wool',
    produceItemName: '포근한 양모',
    produceEmoji: '🧶',
    sellPrice: 140,
    affection: 25,
    isReadyToCollect: false,
    cost: 800,
    unlockLevel: 5
  },
  {
    id: 'pig_1',
    name: '황금 돼지',
    type: 'pig',
    level: 1,
    fedAt: null,
    produceCooldownSec: 110,
    producesItem: 'truffle',
    produceItemName: '자연산 송로버섯',
    produceEmoji: '🍄',
    sellPrice: 280,
    affection: 20,
    isReadyToCollect: false,
    cost: 1600,
    unlockLevel: 7
  }
];

export const INITIAL_ARTISANS: ArtisanMachine[] = [
  {
    id: 'jam_maker',
    name: '수제 잼 달임솥',
    description: '딸기 3개를 졸여 달콤하고 향긋한 고급 딸기잼을 만듭니다.',
    inputItemId: 'strawberry',
    inputItemName: '달콤 딸기',
    inputItemEmoji: '🍓',
    inputCount: 3,
    outputItemId: 'strawberry_jam',
    outputItemName: '유기농 수제 딸기잼',
    outputItemEmoji: '🍯',
    outputSellPrice: 320,
    processingTimeSec: 30,
    unlockLevel: 3,
    unlockCost: 300,
    unlocked: true,
    currentJob: null,
    isReady: false
  },
  {
    id: 'mayo_maker',
    name: '마요네즈 교반기',
    description: '신선한 달걀 2개로 고소하고 부드러운 수제 마요네즈를 만듭니다.',
    inputItemId: 'egg',
    inputItemName: '신선한 달걀',
    inputItemEmoji: '🥚',
    inputCount: 2,
    outputItemId: 'mayo',
    outputItemName: '특제 황금 마요네즈',
    outputItemEmoji: '🧈',
    outputSellPrice: 150,
    processingTimeSec: 25,
    unlockLevel: 2,
    unlockCost: 200,
    unlocked: false,
    currentJob: null,
    isReady: false
  },
  {
    id: 'cheese_press',
    name: '치즈 숙성기',
    description: '진한 우유 2병을 저온 숙성하여 풍미 가득한 자연 치즈를 완성합니다.',
    inputItemId: 'milk',
    inputItemName: '고소한 우유',
    inputItemEmoji: '🥛',
    inputCount: 2,
    outputItemId: 'cheese',
    outputItemName: '숙성 체다 치즈',
    outputItemEmoji: '🧀',
    outputSellPrice: 260,
    processingTimeSec: 45,
    unlockLevel: 4,
    unlockCost: 550,
    unlocked: false,
    currentJob: null,
    isReady: false
  },
  {
    id: 'bakery_oven',
    name: '시골 빵 오븐',
    description: '황금 밀 3개와 옥수수 1개로 갓 구운 바삭한 농부 빵을 굽습니다.',
    inputItemId: 'wheat',
    inputItemName: '황금빛 밀',
    inputItemEmoji: '🌾',
    inputCount: 3,
    outputItemId: 'farm_bread',
    outputItemName: '따끈따끈 농부 빵',
    outputItemEmoji: '🍞',
    outputSellPrice: 290,
    processingTimeSec: 40,
    unlockLevel: 4,
    unlockCost: 650,
    unlocked: false,
    currentJob: null,
    isReady: false
  }
];

export const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'sprinkler',
    name: '자동 스프링클러 시스템',
    description: '물이 마른 밭에 자동으로 상쾌한 물을 공급해줍니다.',
    cost: 500,
    level: 0,
    maxLevel: 3,
    iconName: 'Droplets',
    effect: '모든 밭 자동 수분 공급'
  },
  {
    id: 'golden_sickle',
    name: '장인의 황금 낫',
    description: '작물 수확 시 더 많은 정성을 담아 경험치와 수확량이 증가합니다.',
    cost: 400,
    level: 0,
    maxLevel: 3,
    iconName: 'Sparkles',
    effect: '수확 경험치 +25% 및 15% 확률 2배 수확'
  },
  {
    id: 'scarecrow',
    name: '행운의 짚 허수아비',
    description: '농장을 새와 벌레로부터 지켜내어 작물 성장을 촉진합니다.',
    cost: 300,
    level: 0,
    maxLevel: 2,
    iconName: 'Shield',
    effect: '작물 성장 속도 20% 단축'
  },
  {
    id: 'storage_expansion',
    name: '창고 수납함 정리술',
    description: '더 많은 수확물과 가공품을 효율적으로 보관합니다.',
    cost: 350,
    level: 1,
    maxLevel: 5,
    iconName: 'Package',
    effect: '창고 최대 보관 한도 대폭 증가'
  }
];

export const INITIAL_ORDERS: MarketOrder[] = [
  {
    id: 'order_1',
    customerName: '도토리 마을 이장님',
    customerTitle: '마을 축제 준비',
    customerEmoji: '👴',
    requestedItems: [
      { itemId: 'carrot', itemName: '싱싱 당근', itemEmoji: '🥕', count: 3 }
    ],
    rewardGold: 90,
    rewardExp: 35
  },
  {
    id: 'order_2',
    customerName: '베이커리 파티시에 루시',
    customerTitle: '신선한 과일 타르트',
    customerEmoji: '👩‍🍳',
    requestedItems: [
      { itemId: 'strawberry', itemName: '달콤 딸기', itemEmoji: '🍓', count: 2 },
      { itemId: 'egg', itemName: '신선한 달걀', itemEmoji: '🥚', count: 1 }
    ],
    rewardGold: 220,
    rewardExp: 60
  },
  {
    id: 'order_3',
    customerName: '시골 찻집 은방울',
    customerTitle: '고소한 우유차',
    customerEmoji: '🍵',
    requestedItems: [
      { itemId: 'milk', itemName: '고소한 우유', itemEmoji: '🥛', count: 2 }
    ],
    rewardGold: 240,
    rewardExp: 70
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_harvest',
    title: '새내기 농부의 첫 걸음',
    description: '작물을 총 5회 수확하세요.',
    targetCount: 5,
    currentCount: 0,
    rewardGold: 100,
    rewardGems: 5,
    isClaimed: false,
    icon: '🌱'
  },
  {
    id: 'harvest_master_1',
    title: '풍작의 기쁨',
    description: '작물을 총 30회 수확하세요.',
    targetCount: 30,
    currentCount: 0,
    rewardGold: 350,
    rewardGems: 15,
    isClaimed: false,
    icon: '🌾'
  },
  {
    id: 'animal_friend',
    title: '동물들의 다정한 친구',
    description: '가축에게 먹이를 주거나 교감하세요 (총 10회).',
    targetCount: 10,
    currentCount: 0,
    rewardGold: 250,
    rewardGems: 10,
    isClaimed: false,
    icon: '🐮'
  },
  {
    id: 'artisan_apprentice',
    title: '공방 장인의 솜씨',
    description: '공방에서 가공품을 5개 생산하세요.',
    targetCount: 5,
    currentCount: 0,
    rewardGold: 400,
    rewardGems: 20,
    isClaimed: false,
    icon: '🍯'
  },
  {
    id: 'order_champion',
    title: '마을의 신뢰받는 납품왕',
    description: '마을 주문서 배달을 10회 완료하세요.',
    targetCount: 10,
    currentCount: 0,
    rewardGold: 600,
    rewardGems: 25,
    isClaimed: false,
    icon: '📜'
  },
  {
    id: 'gold_magnate',
    title: '초록 들판의 부자 농부',
    description: '누적 골드 2,000 이상을 획득하세요.',
    targetCount: 2000,
    currentCount: 0,
    rewardGold: 800,
    rewardGems: 30,
    isClaimed: false,
    icon: '💰'
  }
];

export const ORDER_CUSTOMERS_POOL = [
  { name: '도토리 마을 이장님', title: '마을 식량 창고 보충', emoji: '👴' },
  { name: '파티시에 루시', title: '달콤한 디저트 재료', emoji: '👩‍🍳' },
  { name: '시골 찻집 은방울', title: '따뜻한 티타임 세트', emoji: '🍵' },
  { name: '자연식당 요리사 한스', title: '오늘의 신선 추천 요리', emoji: '🧑‍🌾' },
  { name: '미식가 토끼 벤자민', title: '아삭아삭한 신선 채소', emoji: '🐰' },
  { name: '숲속 학교 선생님', title: '어린이 농업 체험 간식', emoji: '👩‍🏫' }
];
