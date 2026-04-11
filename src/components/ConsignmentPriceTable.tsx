import React from 'react';
import { MapPin, Info, Truck } from 'lucide-react';

const prices = [
  { region: "서울/수도권", short: "30,000원~", long: "50,000원~", note: "시내 기본 요금" },
  { region: "충청권", short: "60,000원~", long: "80,000원~", note: "천안, 대전 등" },
  { region: "강원권", short: "80,000원~", long: "120,000원~", note: "원주, 강릉 등" },
  { region: "경상권", short: "120,000원~", long: "180,000원~", note: "대구, 부산 등" },
  { region: "전라권", short: "110,000원~", long: "170,000원~", note: "광주, 목포 등" },
  { region: "제주도", short: "250,000원~", long: "별도문의", note: "항만 이용료 포함" },
];

export default function ConsignmentPriceTable() {
  return (
    <div className="flex-1">
      <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tighter">탁송 요금표</h4>
            <p className="text-sm text-slate-500 font-bold italic">Consignment Rate Card</p>
          </div>
        </div>

        <div className="space-y-4">
          {prices.map((item, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-black text-slate-900">{item.region}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.note}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-blue-600">{item.short}</div>
                <div className="text-[10px] text-slate-400 font-bold">장거리: {item.long}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-start gap-4">
          <Info size={20} className="text-blue-600 shrink-0 mt-1" />
          <p className="text-xs text-blue-700 font-bold leading-relaxed">
            위 요금은 승용차 기준이며, 화물차 및 특수 차량은 별도 문의 바랍니다. 기상 상황 및 야간 할증에 따라 변동될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
