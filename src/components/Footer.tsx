import React from 'react';
import { ShieldCheck, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 pb-12 border-b border-slate-800">
          
          {/* 왼쪽: 필수 사업자 정보만 노출 */}
          <div>
            <h2 className="text-white text-2xl font-black mb-6 italic tracking-tighter">
              달리고 탁송 <span className="text-slate-600 text-sm not-italic font-bold ml-2">(운영사: monosolution)</span>
            </h2>
            <div className="space-y-2 text-sm font-medium leading-relaxed">
              <p><span className="text-slate-500">대표자:</span> 김우곤</p>
              <p><span className="text-slate-500">사업자등록번호:</span> 315-08-82083</p>
              <p><span className="text-slate-500">업태:</span> 도매 및 소매업, 운수 및 창고업, 정보통신업</p>
              <p><span className="text-slate-500">종목:</span> SNS마켓, 기타 육상 운송지원 서비스업, 응용 소프트웨어 개발 및 공급업</p>
              <p className="pt-6 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                © 2026 DALIGO TAKSONG. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>

          {/* 오른쪽: 대표번호 강조 (1844-1585) */}
          <div className="flex flex-col md:items-end">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl inline-block text-right">
              <div className="flex items-center justify-end gap-3 mb-3 text-blue-400">
                <Headphones className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-[0.2em]">24H Service Center</span>
              </div>
              <a href="tel:1844-1585" className="text-4xl md:text-6xl font-black text-white hover:text-blue-400 transition-colors tracking-tighter">
                1844-1585
              </a>
              <p className="mt-4 text-slate-400 font-bold text-base">
                전국 어디서나 가장 빠른 <span className="text-blue-500 font-black">달리고탁송</span>
              </p>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-blue-700" /> 전직원 100% 보험 가입</span>
            <span className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-blue-700" /> 24시간 실시간 배차 시스템</span>
          </div>
          <div className="flex gap-6 text-slate-600 font-bold">
            <button className="hover:text-white transition-colors">이용약관</button>
            <button className="hover:text-white transition-colors text-blue-500 font-black">개인정보처리방침</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
