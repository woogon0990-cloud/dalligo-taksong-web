import React from 'react';
import { ShieldCheck, Headphones } from 'lucide-react';
import LogoSymbol from './LogoSymbol';

export default function Footer() {
  const isIlryu = typeof window !== 'undefined' && (window.location.hostname.includes('ilryu') || window.location.hostname.includes('1ryu'));
  const brandName = isIlryu ? '일류전국탁송' : '달리고 탁송';
  const brandNameShort = isIlryu ? '일류탁송' : '달리고탁송';

  return (
    <footer className="bg-slate-950 text-slate-400 py-20 flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="flex flex-col items-center pb-12 border-b border-slate-800 w-full">
          
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-6">
              <LogoSymbol size={40} />
              <h2 className="text-white text-3xl font-black italic tracking-tighter">
                {brandName}
              </h2>
            </div>
            <p className="text-slate-600 text-sm font-bold">(운영사: monosolution)</p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="bg-slate-900 px-10 py-8 rounded-[3rem] border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-3 text-blue-400">
                <Headphones className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-[0.2em]">24H Customer Center</span>
              </div>
              <a href="tel:1844-1585" className="text-5xl md:text-7xl font-black text-white hover:text-blue-400 transition-colors tracking-tighter">
                1844-1585
              </a>
              <p className="mt-4 text-slate-400 font-bold text-base">
                전국 어디서나 가장 빠른 <span className="text-blue-500 font-black">{brandNameShort}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm font-medium leading-relaxed max-w-2xl">
            <p><span className="text-slate-500">대표자:</span> 김우곤 | <span className="text-slate-500">사업자등록번호:</span> 315-08-82083</p>
            <p><span className="text-slate-500">업태:</span> 도매 및 소매업, 운수 및 창고업, 정보통신업</p>
            <p><span className="text-slate-500">종목:</span> SNS마켓, 기타 육상 운송지원 서비스업, 응용 소프트웨어 개발 및 공급업</p>
            <p className="pt-6 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
              © 2026 {brandNameShort.toUpperCase()}. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="pt-10 flex flex-col items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            <span className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-blue-800" /> 전직원 100% 보험 가입</span>
            <span className="flex items-center gap-2 text-slate-600"><ShieldCheck className="w-4 h-4 text-blue-800" /> 24시간 실시간 배차 시스템</span>
          </div>
          <div className="flex gap-8 text-slate-600">
            <button className="hover:text-white transition-colors">이용약관</button>
            <button className="hover:text-white transition-colors text-blue-500 font-black">개인정보처리방침</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
