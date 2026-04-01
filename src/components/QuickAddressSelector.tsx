import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';

interface QuickAddressSelectorProps {
  isOpen: boolean;
  onSelect: (address: string) => void;
  onClose: () => void;
}

const regions = [
  "서울", "경기", "인천", "강원",
  "충북", "충남", "대전", "세종",
  "전북", "전남", "광주",
  "경북", "경남", "대구", "울산", "부산", "제주"
];

const QuickAddressSelector: React.FC<QuickAddressSelectorProps> = ({ isOpen, onSelect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Check if the click was on the input field or search button to avoid immediate closing
        const target = event.target as HTMLElement;
        if (target.closest('input') || target.closest('button')) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-[100] max-h-[400px] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              빠른 지역 선택
            </h3>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} 
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(region);
                }}
                className="py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all"
              >
                {region}
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              ※ 지역을 선택하시면 주소창에 자동 입력됩니다.<br />
              ※ 상세 주소(동/읍/면/건물명)를 추가로 입력해 주세요.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddressSelector;
