import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../AuthContext';
import { X, ChevronRight } from 'lucide-react';

const PopupManager: React.FC = () => {
  const { content } = useContent();
  const [closedPopups, setClosedPopups] = useState<string[]>([]);

  const activePopups = content.popups.filter(p => p.isActive && !closedPopups.includes(p.id));

  const closePopup = (id: string) => {
    setClosedPopups(prev => [...prev, id]);
  };

  if (activePopups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-4">
      <AnimatePresence>
        {activePopups.map((popup, idx) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border-4 border-blue-600/10"
            style={{ zIndex: 100 + idx }}
          >
            <button 
              onClick={() => closePopup(popup.id)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {popup.imageUrl && (
              <div className="w-full h-64 overflow-hidden relative">
                <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8">
                  <h3 className="text-2xl font-black text-white tracking-tighter">{popup.title}</h3>
                </div>
              </div>
            )}

            <div className="p-8">
              {!popup.imageUrl && (
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">{popup.title}</h3>
              )}
              <p className="text-slate-600 font-medium leading-relaxed mb-8 whitespace-pre-wrap">
                {popup.content}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => closePopup(popup.id)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  오늘 하루 닫기
                </button>
                <button 
                  onClick={() => closePopup(popup.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  확인 <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PopupManager;
