import React from 'react';
import { Check, Coins, Sparkles, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { MarketOrder } from '../types';
import { INITIAL_CROPS, INITIAL_ANIMALS, INITIAL_ARTISANS } from '../data/gameData';
import { sound } from '../utils/audio';

interface MarketOrdersProps {
  orders: MarketOrder[];
  inventory: Record<string, number>;
  coins: number;
  onDeliverOrder: (orderId: string) => void;
  onSellItem: (itemId: string, count: number, pricePerUnit: number) => void;
  onSellAll: () => void;
}

export const MarketOrders: React.FC<MarketOrdersProps> = ({
  orders,
  inventory,
  coins,
  onDeliverOrder,
  onSellItem,
  onSellAll
}) => {
  // Build a lookup for item details
  const getItemDetails = (itemId: string) => {
    const crop = INITIAL_CROPS.find(c => c.id === itemId);
    if (crop) {
      return { name: crop.name, emoji: crop.emoji, price: crop.sellPrice };
    }
    const animal = INITIAL_ANIMALS.find(a => a.producesItem === itemId);
    if (animal) {
      return { name: animal.produceItemName, emoji: animal.produceEmoji, price: animal.sellPrice };
    }
    const artisan = INITIAL_ARTISANS.find(a => a.outputItemId === itemId);
    if (artisan) {
      return { name: artisan.outputItemName, emoji: artisan.outputItemEmoji, price: artisan.outputSellPrice };
    }
    return { name: itemId, emoji: '📦', price: 20 };
  };

  const inventoryEntries = Object.entries(inventory).filter(([_, count]) => count > 0);
  const totalInventoryValue = inventoryEntries.reduce((sum, [id, count]) => {
    return sum + getItemDetails(id).price * count;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Village Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/farm_market_vendor_1792394253311.jpg"
            alt="시골 장터 곰 상인"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-amber-200 shadow-xs shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>도토리 마을 직거래 장터</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              마을 주민들이 농장에 특별 주문서를 보냈습니다. 주문을 완수하면 보너스 골드와 명성 경험치를 얻습니다.
            </p>
          </div>
        </div>

        {inventoryEntries.length > 0 && (
          <button
            onClick={() => {
              sound.playCoin();
              onSellAll();
            }}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <Coins className="w-4 h-4" />
            <span>창고 전량 즉시 일괄 판매 ({totalInventoryValue.toLocaleString()}G)</span>
          </button>
        )}
      </div>

      {/* Village Delivery Board */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
          <span>📜 마을 주민 긴급 납품 의뢰</span>
          <span className="text-xs font-normal text-stone-500">· 실시간 의뢰 {orders.length}건</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orders.map((order) => {
            // Check if player has all required items
            const canDeliver = order.requestedItems.every(req => {
              const currentCount = inventory[req.itemId] || 0;
              return currentCount >= req.count;
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all"
              >
                <div>
                  {/* Customer info */}
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xl select-none">
                      {order.customerEmoji}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-stone-500">{order.customerTitle}</span>
                    </div>
                  </div>

                  {/* Requested items */}
                  <div className="my-3.5 space-y-2">
                    <span className="text-[11px] font-semibold text-stone-500 block">요청 농산물:</span>
                    {order.requestedItems.map((req, idx) => {
                      const hasCount = inventory[req.itemId] || 0;
                      const isComplete = hasCount >= req.count;

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200/60 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span>{req.itemEmoji}</span>
                            <span className="font-medium text-stone-800">{req.itemName}</span>
                          </div>
                          <span className={`font-bold tabular-nums ${isComplete ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {hasCount} / {req.count}개
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rewards and Deliver button */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">완료 보상:</span>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-amber-700">+{order.rewardGold}G</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-emerald-700">+{order.rewardExp} EXP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!canDeliver) {
                        alert('요청 수확물이 부족합니다!');
                        return;
                      }
                      sound.playSuccess();
                      onDeliverOrder(order.id);
                    }}
                    disabled={!canDeliver}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      canDeliver
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95 animate-pulse'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>납품 완료하기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Selling Stand (창고 직판장) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-600" />
          <span>보유 창고 물품 개별 판매</span>
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          창고에 보관 중인 작물과 가공품을 상인에게 판매하여 골드를 마련하세요.
        </p>

        {inventoryEntries.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
            창고가 비어있습니다. 작물을 수확하거나 가공품을 제작해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {inventoryEntries.map(([itemId, count]) => {
              const details = getItemDetails(itemId);

              return (
                <div
                  key={itemId}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{details.emoji}</span>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{details.name}</span>
                        <span className="text-[11px] text-amber-700 font-semibold">단가 {details.price}G</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {count}개
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => {
                        sound.playCoin();
                        onSellItem(itemId, 1, details.price);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer"
                    >
                      1개 판매
                    </button>
                    {count > 1 && (
                      <button
                        onClick={() => {
                          sound.playCoin();
                          onSellItem(itemId, count, details.price);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                      >
                        전부 ({count * details.price}G)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
