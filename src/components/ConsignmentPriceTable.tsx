import React from 'react';
import { motion } from 'motion/react';
import { Navigation, ShieldCheck, X } from 'lucide-react';
import { useContent } from '../AuthContext';

const ConsignmentPriceTable: React.FC = () => {
  const { content } = useContent();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Navigation className="w-10 h-10 text-blue-600" /> {content.pricingTitle || "전국 자동차 탁송 요율표"}
            </h2>
            <p className="text-slate-500 font-medium text-lg">합리적이고 투명한 정찰제 요금을 약속드립니다.</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-8 py-6 font-bold text-lg">이동 거리</th>
                  <th className="px-8 py-6 font-bold text-lg">기본 요금</th>
                  <th className="px-8 py-6 font-bold text-lg">탁송 구분</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {content.pricingTable.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-700">{row.dist}</td>
                    <td className="px-8 py-6 font-black text-blue-600">{row.price}</td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
                        {row.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 lg:p-12 bg-slate-50 border-t border-slate-100">
            <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> 요금 산정 시 참고 및 할증 조건
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.pricingConditions || []).map((condition, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-sm font-bold text-blue-600 mb-2">{condition.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Cancellation Policy */}
            <div className="mt-12 pt-12 border-t border-slate-200">
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" /> 취소 및 환불 규정
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(content.cancellationPolicy || []).map((item, i) => (
                  <div key={i} className={`${item.bg} p-4 rounded-xl border border-slate-100 text-center`}>
                    <p className="text-xs font-bold text-slate-400 mb-1">{item.time}</p>
                    <p className={`text-sm font-black ${item.color}`}>{item.policy}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 text-center font-medium">
                ※ 취소 시점은 고객센터 운영 시간(평일 09:00~18:00) 접수 기준입니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsignmentPriceTable;
