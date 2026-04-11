import React from 'react';
import { MapPin, UserCheck } from 'lucide-react';

const prices = [
  { region: "시내 기본 (5km 이내)", price: "15,000원~", note: "기본 요금" },
  { region: "시내 중거리 (10km)", price: "20,000원~", note: "시내권 이동" },
  { region: "인접 도시 이동", price: "30,000원~", note: "천안 ↔ 아산 등" },
  { region: "수도권 광역 이동", price: "50,000원~", note: "천안 ↔ 서울/경기" },
  { region: "심야 할증 (00시~04시)", price: "+5,000원", note: "시간대별 차등" },
  { region: "경유지 추가", price: "+5,000원~", note: "1곳당 추가" },
];

export default function ChauffeurPriceTable() {
  return (
    <div className="flex-1">
      <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <UserCheck size={24} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">대리 요금 가이드</h4>
            <p className="text-sm text-slate-500 font-bold italic">Chauffeur Rate Guide</p>
          </div>
        </div>

        <div className="space-y-4">
          {prices.map((item, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-black text-slate-900">{item.region}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.note}</div>
                </div>
              </div>
              <div className="text-xl font-black text-orange-600">{item.price}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-3xl bg-orange-50 border border-orange-100 flex items-start gap-4">
          <UserCheck size={20} className="text-orange-600 shrink-0 mt-1" />
          <p className="text-xs text-orange-700 font-bold leading-relaxed">
            전 직원 100% 대리운전 보험 가입 완료. 안심하고 맡기세요. 사고 시 완벽한 보상을 약속드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
