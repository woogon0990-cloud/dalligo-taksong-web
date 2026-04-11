/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FareScoreboardProps {
  value: number;
  color: string;
}

/**
 * 숫자가 표시되는 전광판 컴포넌트 (애니메이션 제거 버전)
 */
export default function FareScoreboard({ value, color }: FareScoreboardProps) {
  return (
    <div className="bg-black p-6 md:p-10 rounded-3xl border-4 border-gray-800 text-center shadow-2xl overflow-hidden relative group">
      {/* 배경 장식 (전광판 느낌) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Estimated Fare Scoreboard</p>
        <div 
          style={{ 
            color: color, 
            textShadow: `0 0 20px ${color}, 0 0 40px ${color}44` 
          }} 
          className="text-5xl md:text-7xl font-black italic tracking-tighter flex items-baseline justify-center gap-2"
        >
          <span>{value.toLocaleString()}</span>
          <span className="text-xl md:text-2xl not-italic opacity-80">KRW</span>
        </div>
      </div>

      {/* 하단 장식 선 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" style={{ color }} />
    </div>
  );
}
