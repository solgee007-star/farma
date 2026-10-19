import React from 'react';
import { Volume2, VolumeX, Music, Award, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export type ActiveTab = 'field' | 'animals' | 'artisan' | 'market' | 'shop';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  coins: number;
  gems: number;
  level: number;
  exp: number;
  expNeeded: number;
  isMuted: boolean;
  isMusicOn: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onOpenAchievements: () => void;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  coins,
  gems,
  level,
  exp,
  expNeeded,
  isMuted,
  isMusicOn,
  onToggleMute,
  onToggleMusic,
  onOpenAchievements,
  onResetGame
}) => {
  const expPercentage = Math.min(100, Math.round((exp / expNeeded) * 100));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm font-bold text-lg select-none">
            🌱
          </div>
          <div>
            <span className="text-lg font-bold text-stone-900 tracking-tight whitespace-nowrap block">
              햇살 가득 초록 농장
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-emerald-700">Lv.{level} 농장주</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">경험치 {exp}/{expNeeded} ({expPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => { sound.playPop(); onTabChange('field'); }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'field'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🌾 작물 텃밭
          </button>
          <button
            onClick={() => { sound.playPop(); onTabChange('animals'); }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'animals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🐮 동물 우리
          </button>
          <button
            onClick={() => { sound.playPop(); onTabChange('artisan'); }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'artisan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🍯 가공 공방
          </button>
          <button
            onClick={() => { sound.playPop(); onTabChange('market'); }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'market'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            📜 마을 주문 & 상점
          </button>
          <button
            onClick={() => { sound.playPop(); onTabChange('shop'); }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            ⚙️ 시설 업그레이드
          </button>
        </nav>

        {/* Zone 3: Currencies & Utility Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Gold */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 font-bold text-sm shadow-2xs">
            <span className="text-base">💰</span>
            <span className="tabular-nums">{coins.toLocaleString()}</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 border border-sky-200/80 rounded-lg text-sky-900 font-bold text-sm shadow-2xs">
            <span className="text-base">💎</span>
            <span className="tabular-nums">{gems.toLocaleString()}</span>
          </div>

          {/* Achievements button */}
          <button
            onClick={() => { sound.playPop(); onOpenAchievements(); }}
            className="p-2 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer border border-stone-200"
            title="업적 및 도감"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Sound Effect Toggle */}
          <button
            onClick={() => { sound.playPop(); onToggleMute(); }}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer border border-stone-200"
            title={isMuted ? '효과음 켜기' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={() => { sound.playPop(); onToggleMusic(); }}
            className={`p-2 rounded-lg transition-colors cursor-pointer border border-stone-200 ${
              isMusicOn ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'text-stone-600 hover:bg-stone-100'
            }`}
            title={isMusicOn ? '배경음 끄기' : '힐링 배경음 켜기'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Reset button */}
          <button
            onClick={onResetGame}
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="농장 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200 bg-stone-50 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => { sound.playPop(); onTabChange('field'); }}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'field' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
        >
          🌾 밭
        </button>
        <button
          onClick={() => { sound.playPop(); onTabChange('animals'); }}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'animals' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
        >
          🐮 동물
        </button>
        <button
          onClick={() => { sound.playPop(); onTabChange('artisan'); }}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'artisan' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
        >
          🍯 공방
        </button>
        <button
          onClick={() => { sound.playPop(); onTabChange('market'); }}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'market' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
        >
          📜 주문·상점
        </button>
        <button
          onClick={() => { sound.playPop(); onTabChange('shop'); }}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'shop' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
        >
          ⚙️ 업그레이드
        </button>
      </div>

      {/* EXP Progress bar */}
      <div className="w-full bg-stone-100 h-1">
        <div
          className="bg-emerald-500 h-1 transition-all duration-300"
          style={{ width: `${expPercentage}%` }}
        />
      </div>
    </header>
  );
};
