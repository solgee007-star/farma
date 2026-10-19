import React from 'react';
import { Sun, CloudRain, Wind, Sparkles, Sunrise, Sunset, Moon } from 'lucide-react';
import { WeatherType, TimeOfDay } from '../types';

interface WeatherWidgetProps {
  dayCount: number;
  weather: WeatherType;
  timeOfDay: TimeOfDay;
  onAdvanceDay: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  dayCount,
  weather,
  timeOfDay,
  onAdvanceDay
}) => {
  const getWeatherInfo = () => {
    switch (weather) {
      case 'rainy':
        return {
          label: '봄비 내림',
          desc: '모든 작물 자동 수분 공급',
          icon: <CloudRain className="w-4 h-4 text-sky-500 animate-bounce" />,
          color: 'text-sky-700 bg-sky-50 border-sky-200'
        };
      case 'rainbow':
        return {
          label: '행운의 무지개',
          desc: '작물 성장 속도 +50%',
          icon: <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />,
          color: 'text-amber-800 bg-amber-50 border-amber-200'
        };
      case 'breeze':
        return {
          label: '선선한 바람',
          desc: '가축 행복도 2배 상승',
          icon: <Wind className="w-4 h-4 text-emerald-500" />,
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
        };
      case 'sunny':
      default:
        return {
          label: '따사로운 햇살',
          desc: '수확 시 보너스 경험치',
          icon: <Sun className="w-4 h-4 text-amber-500 animate-pulse" />,
          color: 'text-amber-800 bg-amber-50/80 border-amber-200'
        };
    }
  };

  const getTimeOfDayInfo = () => {
    switch (timeOfDay) {
      case 'morning':
        return { label: '상쾌한 아침', icon: <Sunrise className="w-4 h-4 text-amber-500" /> };
      case 'day':
        return { label: '한낮', icon: <Sun className="w-4 h-4 text-amber-600" /> };
      case 'sunset':
        return { label: '노을 지는 저녁', icon: <Sunset className="w-4 h-4 text-orange-500" /> };
      case 'night':
        return { label: '별 헤는 밤', icon: <Moon className="w-4 h-4 text-indigo-400" /> };
    }
  };

  const weatherData = getWeatherInfo();
  const timeData = getTimeOfDayInfo();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-stone-200/80 rounded-xl shadow-xs">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 font-semibold text-stone-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>농장 {dayCount}일차</span>
        </div>

        <div className="flex items-center gap-1.5 text-stone-600">
          {timeData.icon}
          <span className="text-xs font-medium">{timeData.label}</span>
        </div>

        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${weatherData.color}`}>
          {weatherData.icon}
          <span>{weatherData.label}</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-600">{weatherData.desc}</span>
        </div>
      </div>

      <button
        onClick={onAdvanceDay}
        className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all rounded-lg cursor-pointer whitespace-nowrap"
        title="다음 시간대로 진행하여 날씨와 상점을 갱신합니다"
      >
        하루 넘기기 ➔
      </button>
    </div>
  );
};
