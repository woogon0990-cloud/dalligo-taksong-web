import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Clock, 
  Phone, 
  Shield, 
  Award, 
  Users, 
  FileText, 
  Calendar, 
  Zap, 
  Car,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useContent } from '../AuthContext';

interface DriverRecruitmentProps {
  onConsult?: () => void;
  content?: any;
}

const DriverRecruitment: React.FC<DriverRecruitmentProps> = ({ onConsult, content: propContent }) => {
  const { content: hookContent } = useContent();
  const content = propContent || hookContent;
  const contactPhone = content?.contactPhone || "1844-1585";
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-200 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
              Driver Recruitment | Dalligo Consignment
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
              {content.recruitmentHeroTitle || "달리고 탁송 기사 모집"}<br />
              <span className="text-blue-400">{content.recruitmentHeroSubtitle || "최고의 대우와 체계적인 시스템으로 모십니다"}</span>
            </h1>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto font-medium leading-relaxed">
              업계 최상위 오더 보유, 24시간 완벽 지원 시스템.<br />
              달리고 탁송과 함께 성장할 신뢰할 수 있는 파트너를 기다립니다.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-4">가입 축하금 지원</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              소속사 변경 등록 시 <span className="text-blue-600 font-bold">가입축하금 20만원</span> 보조 (1년 보험 유지 조건)
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-4">사고/과태료 50% 지원</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              차량 사고 시 <span className="text-orange-600 font-bold">면책금 50%</span> 및 <span className="text-orange-600 font-bold">과태료/범칙금 50%</span> 본사 지원
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-4">저렴한 보험료</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              업계 최저 수준 보험료 및 <span className="text-emerald-600 font-bold">보험료 일비 처리</span> 가능으로 부담 최소화
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Operations Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" /> {content.recruitmentSupportTitle || "24시간 완벽 지원 시스템"}
            </h2>
            
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">24시간 상황실 운영</h4>
                    <p className="text-slate-500 font-medium">야간 당직자 운영으로 사고 접수 및 일반 문의 상시 가능</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">업무 시간 안내</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <span className="text-xs font-black text-blue-600 uppercase mb-1 block">주간</span>
                        <p className="text-sm font-bold">평일 09:00 - 18:00</p>
                        <p className="text-xs text-slate-400 mt-1">프로그램 및 모든 업무 문의</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <span className="text-xs font-black text-orange-600 uppercase mb-1 block">야간/당직</span>
                        <p className="text-sm font-bold">18:00 - 익일 09:00</p>
                        <p className="text-xs text-slate-400 mt-1">사고 접수 및 긴급 문의</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">압도적인 오더 보유</h4>
                    <p className="text-slate-500 font-medium">수도권 1일 탁송 500콜, 대리 1000콜 이상의 풍부한 오더</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">자체 단톡방 운영</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">예약콜 우선 공유</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">최상위 등급 프로그램</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Programs & Contact */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" /> {content.recruitmentGuideTitle || "프로그램 및 가입 안내"}
            </h2>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-6 text-blue-400">사용 프로그램</h4>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-white/40 mb-1">로지</p>
                    <p className="font-bold">D1, D2, D3</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-white/40 mb-1">언라이언스</p>
                    <p className="font-bold">상생, 힐링, 미래로</p>
                    <p className="text-[10px] text-blue-400 mt-1">1차 0등급 최상위</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-white/40 mb-1">콜마너</p>
                    <p className="font-bold">0차 최상등급</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-white/40 mb-1">아이콘</p>
                    <p className="font-bold">수도권연합 특등급</p>
                  </div>
                </div>

                <div className="bg-blue-600 p-8 rounded-3xl">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> 가입 문의 (문자 전송)
                  </h4>
                  <a href="tel:010-4868-5893" className="text-4xl font-black mb-6 tracking-tighter block hover:text-blue-200 transition-colors">010-4868-5893</a>
                  <div className="bg-black/20 p-4 rounded-xl text-sm leading-relaxed">
                    <p className="font-bold text-blue-200 mb-2">필수 기재 사항</p>
                    <p className="text-white/90">면허증 사진, 통신사, 희망 보험 종류<br />(대리/탁송/대리탁송/껀바이껀)</p>
                  </div>
                  <p className="text-xs text-white/60 mt-4 text-center">문자 주시면 보험료 확인 후 유선 안내해 드립니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Guide */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-blue-600" /> {content.recruitmentRentalTitle || "보험료 안내"}
              </h2>
              <p className="text-slate-500 font-medium">3년 무사고 기준 (사고 유무에 따라 변동 가능)</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">대리운전 전용</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">무사고 기준</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Table 1: With Rent Special */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                <h4 className="font-bold">만 나이 기준 (렌트특약 포함)</h4>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Rent O</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-sm font-black text-slate-700">연령</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-700">월 보험료</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-700">일일 환산</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { age: "30 ~ 49세", monthly: "66,000원", daily: "2,200원" },
                      { age: "50 ~ 55세", monthly: "87,000원", daily: "2,900원" },
                      { age: "56 ~ 60세", monthly: "112,000원", daily: "3,800원" },
                      { age: "61 ~ 65세", monthly: "117,000원", daily: "3,900원" },
                      { age: "66세", monthly: "120,000원", daily: "4,000원" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{row.age}</td>
                        <td className="px-6 py-4 text-sm font-black text-blue-600">{row.monthly}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-400">{row.daily}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Without Rent Special */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-slate-800 px-6 py-4 text-white flex justify-between items-center">
                <h4 className="font-bold">만 나이 기준 (렌트특약 제외)</h4>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">Rent X</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-sm font-black text-slate-700">연령</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-700">월 보험료</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-700">일일 환산</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { age: "30 ~ 40세", monthly: "53,750원", daily: "1,800원" },
                      { age: "41 ~ 49세", monthly: "59,500원", daily: "2,000원" },
                      { age: "50 ~ 55세", monthly: "90,833원", daily: "3,000원" },
                      { age: "56 ~ 65세", monthly: "112,500원", daily: "3,750원" },
                      { age: "66세 이상", monthly: "상담 문의", daily: "-" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{row.age}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900">{row.monthly}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-400">{row.daily}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800 leading-relaxed">
              <p className="font-black mb-1">보험료 관련 유의사항</p>
              <p className="font-medium opacity-80">위 보험료는 3년 무사고 기준이며, 사고 유무 및 개인별 보험 이력에 따라 인상될 수 있습니다. 정확한 보험료는 가입 상담 시 확인 가능합니다.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-blue-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6">{content.recruitmentBannerTitle || "지금 바로 달리고 탁송의 파트너가 되세요"}</h2>
            <p className="text-xl text-blue-100 mb-10 font-medium">{content.recruitmentBannerSubtitle || "최고의 오더와 완벽한 지원으로 기사님의 수익을 보장합니다."}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:010-4868-5893"
                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-xl"
              >
                <Phone className="w-6 h-6" /> 전화 상담하기
              </a>
              <a 
                href={`tel:${contactPhone.replace(/-/g, '')}`}
                className="bg-blue-900 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-950 transition-all shadow-xl"
              >
                <MessageCircle className="w-6 h-6" /> 실시간 상담
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverRecruitment;
