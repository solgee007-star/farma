import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-900">농장 데이터를 초기화할까요?</h3>
        <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
          모든 작물, 가축, 보유 골드 및 공방 시설이 초기 상태로 되돌아갑니다. 이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={() => { sound.playPop(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onConfirm();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            초기화 실행
          </button>
        </div>
      </div>
    </div>
  );
};
