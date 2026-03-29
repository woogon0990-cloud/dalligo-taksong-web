import React from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  Truck, 
  FileSearch, 
  CheckCircle, 
  FileText, 
  User, 
  Building2, 
  AlertCircle, 
  Coins, 
  Zap, 
  Settings, 
  Navigation,
  HelpCircle,
  ArrowRight,
  Info,
  Banknote,
  ShieldCheck
} from 'lucide-react';
import ScrapExportForm from './ScrapExportForm';

interface ScrapExportProps {
  content?: any;
}

const ScrapExport: React.FC<ScrapExportProps> = ({ content }) => {
  const contactPhone = content?.contactPhone || "1844-1585";
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-blue-500/30">
              Scrap & Export Guide | Dalligo Consignment
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
              {content.scrapHeroTitle || "폐차, 이제 자산의 회수가 됩니다"} <br />
              <span className="text-2xl lg:text-3xl font-bold text-slate-400">{content.scrapHeroSubtitle || "복잡한 행정 절차, 달리고 탁송이 완벽하게 대행합니다."}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Vehicle Information Form - Added as per user request */}
        <ScrapExportForm content={content} />

        {/* Section 1: Process Timeline */}
        <section className="mb-24">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 lg:p-16 border border-slate-100">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{content.scrapProcessTitle || "한눈에 보는 폐차 진행 절차"}</h2>
              <p className="text-slate-500 font-medium">단 4단계로 마무리되는 가장 스마트한 폐차 방법</p>
            </div>

            <div className="relative">
              {/* Desktop Connector Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: "STEP 1",
                    title: "상담 및 견적 신청",
                    desc: "차량 번호와 기본 상태를 알려주시면 협력사를 통해 최적의 매입 단가를 안내해 드립니다.",
                    icon: <PhoneCall className="w-8 h-8" />,
                    color: "bg-blue-600"
                  },
                  {
                    step: "STEP 2",
                    title: "무료 탁송 및 입고",
                    desc: "전문 기사가 방문하여 차량을 픽업하며, 인도 전 매입 대금을 선입금 받아 안전합니다.",
                    icon: <Truck className="w-8 h-8" />,
                    color: "bg-indigo-600"
                  },
                  {
                    step: "STEP 3",
                    title: "원부 조회 및 말소",
                    desc: "압류/저당 확인 후 협력 폐차장에서 말소 처리를 대행하며, 당일 처리를 지향합니다.",
                    icon: <FileSearch className="w-8 h-8" />,
                    color: "bg-violet-600"
                  },
                  {
                    step: "STEP 4",
                    title: "증명서 전달 및 환급",
                    desc: "말소 사실 증명서를 안전하게 전달해 드리며, 보험료 및 세금 환급을 안내합니다.",
                    icon: <CheckCircle className="w-8 h-8" />,
                    color: "bg-emerald-600"
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-slate-400 tracking-widest mb-2 block">{item.step}</span>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Document Guide */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">{content.scrapGuideTitle || "상황별 폐차 등록 서류 가이드"}</h2>
              <p className="text-slate-500 font-medium">스마트폰 사진 전송만으로도 간편하게 진행 가능합니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* General Scrap */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-black text-slate-900">일반 폐차</h3>
                </div>
                <p className="text-sm text-slate-500 font-bold mb-8 bg-emerald-50 p-3 rounded-xl border border-emerald-100">압류/미납 없을 시 당일 말소 가능</p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" /> 개인
                    </h4>
                    <ul className="space-y-2 text-slate-600 font-medium text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 자동차 등록증 원본</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 신분증 사본 (앞면)</li>
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> 법인
                    </h4>
                    <ul className="space-y-2 text-slate-600 font-medium text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 자동차 등록증 원본</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 법인 인감증명서 (원본)</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 법인 등기부등본 (원본)</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 사업자등록증 사본</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Early Scrap */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-black text-slate-900">조기 폐차</h3>
                </div>
                <p className="text-sm text-slate-500 font-bold mb-8 bg-blue-50 p-3 rounded-xl border border-blue-100">노후 경유차 정부 보조금 지원 대상</p>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> 필요 서류
                  </h4>
                  <ul className="space-y-3 text-slate-600 font-medium text-sm">
                    <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"><ArrowRight className="w-4 h-4 text-blue-500" /> 자동차 등록증</li>
                    <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"><ArrowRight className="w-4 h-4 text-blue-500" /> 신분증 사본</li>
                    <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"><ArrowRight className="w-4 h-4 text-blue-500" /> 통장 사본 (지원금 수령용)</li>
                    <li className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"><ArrowRight className="w-4 h-4 text-blue-500" /> 차주 전화번호</li>
                  </ul>
                  <div className="mt-8 p-4 bg-blue-600 rounded-2xl text-white text-xs font-bold leading-relaxed">
                    배출가스 4~5등급 차량 대상<br />최대 수백만 원의 정부 지원금 지급!
                  </div>
                </div>
              </div>
            </div>

            {/* Seized Scrap */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-black text-slate-900">압류 폐차</h3>
                </div>
                <p className="text-sm text-slate-500 font-bold mb-8 bg-rose-50 p-3 rounded-xl border border-rose-100">차령초과말소 (11년 이상 노후차)</p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> 진행 조건
                    </h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      과태료나 압류가 많아 당장 납부가 어렵지만 차령이 11년 이상 오래된 경우 진행 가능합니다.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> 필요 서류
                    </h4>
                    <ul className="space-y-2 text-slate-600 font-medium text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-rose-500" /> 일반 폐차 서류 일체</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-rose-500" /> 위임장</li>
                    </ul>
                    <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white text-xs font-bold">
                      <span className="text-rose-400">※ 소요 기간:</span> 말소까지 45~60일 소요
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Compensation Criteria */}
        <section className="mb-24">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black mb-6 flex items-center justify-center gap-3">
                  <Coins className="w-10 h-10 text-blue-400" /> {content.scrapPriceTitle || "차량 매매단가 요율 안내"}
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                  "내 차는 낡았는데 돈을 받을 수 있을까?"<br />
                  <span className="text-white">네, 무조건 받으셔야 합니다.</span> 고철 무게를 넘어 부품 가치까지 산정합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "핵심 부품(촉매) 가치",
                    desc: "정품 촉매 장착 시 백금, 팔라듐 등 귀금속 추출이 가능해 보상금이 대폭 상승합니다.",
                    icon: <Settings className="w-6 h-6" />,
                    tag: "가장 중요"
                  },
                  {
                    title: "부품 재활용 가치",
                    desc: "엔진, 미션, 알루미늄 휠 등 상태가 양호한 부품이 많을수록 유리하게 책정됩니다.",
                    icon: <Zap className="w-6 h-6" />,
                    tag: "추가 보상"
                  },
                  {
                    title: "정상 운행 가능 여부",
                    desc: "정상 주행이 가능하여 '로드 탁송' 이동 시 견인비가 절감되어 단가가 높아집니다.",
                    icon: <Navigation className="w-6 h-6" />,
                    tag: "비용 절감"
                  },
                  {
                    title: "수도권 대형 업체 인프라",
                    desc: "판로가 확보된 수도권 대형 관허폐차장을 통해 진행 시 폐차비 단가가 더 높습니다.",
                    icon: <Building2 className="w-6 h-6" />,
                    tag: "인프라 차이"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full text-white/60">{item.tag}</span>
                    </div>
                    <h4 className="text-xl font-black mb-4">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Tip Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 lg:p-12 rounded-[3rem] shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <HelpCircle className="w-24 h-24 text-white/10" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  <div className="bg-white/20 p-6 rounded-full">
                    <Banknote className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-black mb-2">정부 조기폐차 지원금을 확인하세요!</h3>
                    <p className="text-blue-100 font-medium leading-relaxed">
                      배출가스 4, 5등급 차량이라면 폐차 보상금과 별개로 정부에서 <br className="hidden lg:block" />
                      <span className="text-white font-black text-xl">최대 300만 원 ~ 800만 원</span>의 지원금을 추가로 받을 수 있습니다.
                    </p>
                  </div>
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-colors shadow-lg shrink-0">
                    대상 확인 상담하기
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4: Strategic Points (Safety Guide) */}
        {content.scrapStrategicPoints && content.scrapStrategicPoints.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4">안전한 거래를 위한 달리고의 약속</h2>
              <p className="text-slate-500 font-medium">고객님의 소중한 자산을 보호하기 위한 4가지 핵심 전략</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.scrapStrategicPoints.map((point: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">{point.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Legal Notice */}
        {content.scrapLegalNotice && content.scrapLegalNotice.length > 0 && (
          <section className="mb-24">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <AlertCircle className="w-6 h-6 text-slate-400" />
                <h2 className="text-xl font-black text-slate-900">서비스 이용 안내 및 면책 고지</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {content.scrapLegalNotice.map((notice: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pl-3.5">
                      {notice.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-slate-200">
                <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                  본 고지 내용은 관련 법령 및 서비스 운영 정책에 따라 변경될 수 있으며, 이용자는 서비스 이용 시 최신 고지 내용을 확인해야 합니다. <br />
                  &copy; {new Date().getFullYear()} Dalligo Consignment & Chauffeur. All rights reserved.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center mb-24">
          <h2 className="text-3xl font-black text-slate-900 mb-8">{content.scrapBannerTitle || "지금 바로 내 차의 가치를 확인해 보세요"}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`tel:${contactPhone.replace(/-/g, '')}`}
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
            >
              <PhoneCall className="w-6 h-6" /> 전화로 견적 받기
            </a>
            <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3">
              <Info className="w-6 h-6" /> 카톡으로 서류 보내기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScrapExport;
