import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Car, Send, ChevronRight, ChevronLeft, CreditCard, Info } from 'lucide-react';

export default function OrderForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // 다음 단계로
  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  // 이전 단계로
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <section id="실시간 신청" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">실시간 탁송 신청</h2>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div 
                key={num} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= num ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                }`} 
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-12 relative overflow-hidden"
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {/* STEP 1: 의뢰인 정보 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Phone className="text-blue-600" /> 의뢰인 정보</h3>
                  <div className="space-y-4">
                    <label className="block font-bold text-slate-700 ml-1">연락처 (전화번호)</label>
                    <input type="tel" placeholder="010-0000-0000" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: 차량 정보 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Car className="text-blue-600" /> 차량 정보</h3>
                  <div className="space-y-6">
                    <input type="text" placeholder="차명 (예: 그랜저, 1톤 탑차)" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner">
                        <option>오토매틱</option>
                        <option>수동(스틱)</option>
                      </select>
                      <select className="bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner">
                        <option>현재 운행 가능</option>
                        <option>현재 운행 불가</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 & 4: 출발지/도착지 정보 */}
              {(step === 3 || step === 4) && (
                <motion.div key={`step${step}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <MapPin className={step === 3 ? "text-blue-600" : "text-orange-600"} /> 
                    {step === 3 ? "출발지 정보" : "도착지 정보"}
                  </h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="상세주소 입력" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner" />
                    <input type="tel" placeholder="현장 연락처" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner" />
                  </div>
                </motion.div>
              )}

              {/* STEP 5: 경유지 정보 */}
              {step === 5 && (
                <motion.div key="step5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-600"><MapPin /> 경유지 정보 (선택)</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="경유지가 있는 경우 상세주소 입력" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner" />
                    <input type="tel" placeholder="경유지 연락처" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold outline-none shadow-inner" />
                    <p className="text-xs text-slate-400 font-bold ml-1">* 경유지가 없으면 바로 다음을 눌러주세요.</p>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: 결제방법 및 접수 */}
              {step === 6 && (
                <motion.div key="step6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2"><CreditCard className="text-blue-600" /> 탁송료 결제방법</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="py-5 rounded-2xl border-2 border-blue-600 text-blue-600 font-black hover:bg-blue-50 transition-colors focus:bg-blue-600 focus:text-white">선불 (출발지)</button>
                    <button className="py-5 rounded-2xl border-2 border-slate-200 text-slate-500 font-black hover:bg-slate-50 transition-colors focus:bg-slate-900 focus:text-white focus:border-slate-900">후불 (도착지)</button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
                  >
                    <Send /> 신청접수 완료
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 네비게이션 버튼 */}
            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <button onClick={prevStep} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                  <ChevronLeft className="w-5 h-5" /> 이전으로
                </button>
              )}
              {step < 6 && (
                <button onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-900/20">
                  다음 단계로 <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* 위약금 및 안내사항 */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-red-50/50 p-5 rounded-2xl border border-red-100">
              <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-500 leading-relaxed font-bold">
                <p className="text-red-600 mb-1">[필독] 취소 및 위약금 안내</p>
                <ul className="list-disc ml-3 space-y-1">
                  <li>실시간 접수 확인 후 담당 상담원이 고객님께 측정된 탁송 금액을 유선 안내드립니다.</li>
                  <li>배차 진행 후 고객 단순 변심으로 인한 취소 시 운행 거리 및 기사 이동 시간에 따라 <span className="text-red-600 underline">위약금(1~3만원)</span>이 발생할 수 있습니다.</li>
                  <li>차량 정보 오기재(수동 차량 미고지 등)로 인한 현장 배차 취소 시에도 동일한 위약금이 청구됩니다.</li>
                  <li>천재지변이나 도로 통제 상황에 따라 배차가 지연될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
