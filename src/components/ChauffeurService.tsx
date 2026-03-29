import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  ShieldCheck, 
  Coins, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  UserCheck,
  Navigation,
  X,
  AlertCircle,
  FileText,
  ShieldAlert,
  Wrench,
  Info,
  Ban,
  Camera,
  Database,
  FileSearch,
  User
} from 'lucide-react';
import ChauffeurPriceTable from './ChauffeurPriceTable';
import { useContent } from '../AuthContext';

interface ChauffeurServiceProps {
  onConsult?: () => void;
  onForm?: () => void;
  content?: any;
}

const ChauffeurService: React.FC<ChauffeurServiceProps> = ({ onConsult, onForm, content: propContent }) => {
  const { content: hookContent } = useContent();
  const content = propContent || hookContent;
  const [selectedDetail, setSelectedDetail] = React.useState<{
    title: string;
    icon: React.ReactNode;
    color: string;
    content: React.ReactNode;
  } | null>(null);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-400 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-white/20" translate="no">
              {content.chauffeurBadgeText || "24시간 신속 배차 | 달리고 대리운전"}
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
              {content.chauffeurHeroTitle || "🚙 안전하고 편안한 귀가를 위한 최상의 선택, 달리고 대리운전"}
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
              {content.chauffeurHeroSubtitle || "베테랑 기사님들이 고객님의 소중한 차량을 안전하게 목적지까지 모십니다. 24시간 언제 어디서나 신속하게 달려가겠습니다."}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Rate Table Section */}
        <ChauffeurPriceTable />

        {/* Special Promises Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3" translate="no">
              <ShieldCheck className="w-10 h-10 text-blue-600" /> {content.chauffeurFeaturesTitle || "달리고 대리운전만의 특별한 3가지 약속"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Promise 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  1. 베테랑 기사님 <br />
                  <span className="text-blue-600">품격 있는 서비스</span>
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  단정한 복장과 고객 응대 매뉴얼을 준수하는 베테랑 기사님만 배정합니다. 
                  <span className="text-slate-900 font-bold">과속 및 신호 위반 금지</span>를 원칙으로 안전하게 모십니다.
                </p>
              </div>
            </motion.div>

            {/* Promise 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  2. 24시간 <br />
                  <span className="text-emerald-600">신속 배차 시스템</span>
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  최첨단 GPS 기반 배차 시스템으로 고객님과 가장 가까운 기사님을 즉시 매칭합니다. 
                  <span className="text-slate-900 font-bold">대기 시간을 최소화</span>하여 언제 어디서든 빠르게 모시러 갑니다.
                </p>
              </div>
            </motion.div>

            {/* Promise 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  3. 투명하고 합리적인 <br />
                  <span className="text-orange-600">정찰제 요금</span>
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  거리 기반의 정찰제 요금을 적용하여 바가지 요금 걱정이 없습니다. 
                  <span className="text-slate-900 font-bold">합리적인 가격</span>으로 고품격 대리운전 서비스를 경험해 보세요.
                </p>
              </div>
            </motion.div>

            {/* Promise 4: Accident & Insurance (Consolidated) */}
            <motion.div 
              whileHover={{ y: -10 }}
              onClick={() => setSelectedDetail({
                title: "사고 및 보험 처리 규정",
                icon: <ShieldAlert className="w-12 h-12" />,
                color: "bg-red-600",
                content: (
                  <div className="space-y-8">
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <h4 className="font-black text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> 1. 보험 가입 현황
                      </h4>
                      <p className="text-red-700 font-medium leading-relaxed">
                        달리고 대리운전의 모든 기사님은 KB손해보험, DB손해보험 등 메이저 보험사의 '대리운전 종합보험'에 100% 가입되어 있습니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" /> 2. 사고 발생 시 처리
                        </h4>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          사고 발생 시 즉시 고객센터(1844-1585)로 연락해 주세요. 
                          전문 사고 처리팀이 현장에 개입하여 보험 접수 및 보상 절차를 신속하게 진행합니다.
                        </p>
                      </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-purple-600" /> 3. 보상 범위 및 면책 사항
                      </h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        대인, 대물, 자차 보상이 포함되며, 보험 약관 한도 내에서 전액 보상됩니다. 
                        단, <span className="text-red-600 font-bold">스톤칩, 타이어 파손, 차량 원시적 결함, 인도 후 미세 기스</span> 등은 면책 사항에 해당합니다.
                      </p>
                    </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-600" /> 4. 과태료 및 범칙금
                      </h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        운행 중 기사의 과실로 발생한 신호 위반, 속도 위반 등의 과태료는 회사가 100% 책임지고 처리해 드립니다.
                      </p>
                    </div>
                  </div>
                )
              })}
              className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  4. 사고 및 보험 <br />
                  <span className="text-red-600">처리 상세 규정</span>
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  안심하고 이용하실 수 있도록 사고 발생 시 대응 매뉴얼과 보험 보장 범위에 대한 상세 내용을 확인하세요.
                </p>
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  전체 내용 보기 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Promise 5: Customer Safety System */}
            <motion.div 
              whileHover={{ y: -10 }}
              onClick={() => setSelectedDetail({
                title: "안심 귀가 서비스 시스템",
                icon: <ShieldCheck className="w-12 h-12" />,
                color: "bg-emerald-600",
                content: (
                  <div className="space-y-8">
                    <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                      <h4 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-3">
                        <Navigation className="w-6 h-6" /> 1. 실시간 위치 관제
                      </h4>
                      <p className="text-emerald-700 font-medium leading-relaxed">
                        고객님의 이동 경로를 실시간으로 모니터링하여 안전한 귀가를 돕습니다. 
                        비정상적인 경로 이탈이나 정차 시 관제 센터에서 즉시 확인합니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" /> 2. 기사 신원 확인
                        </h4>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          배차 완료 시 기사님의 성함, 사진, 연락처를 미리 전송해 드립니다. 
                          현장에서 기사님의 신원을 반드시 대조 확인 후 이용하실 수 있습니다.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-purple-600" /> 3. 도착 알림 서비스
                        </h4>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          목적지 도착 후 지인에게 도착 알림 메시지를 보낼 수 있는 기능을 제공하여 밤늦은 시간에도 안심하고 이용 가능합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              className="bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  5. 달리고만의 <br />
                  <span className="text-emerald-600">안심 귀가 시스템</span>
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  단순한 운전을 넘어 고객님의 안전한 귀가까지 책임지는 달리고 대리운전의 차별화된 시스템입니다.
                </p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  상세 시스템 보기 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-24">
          <div className="bg-slate-50 rounded-[2.5rem] lg:rounded-[4rem] p-8 lg:p-20 border border-slate-100">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Clock className="w-10 h-10 text-blue-600" /> {content.chauffeurProcessTitle || "대리운전 이용 절차"}
              </h2>
              <p className="text-slate-500 font-medium">전화 한 통이면 가장 가까운 기사님이 즉시 달려갑니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 -z-0"></div>
              
              {[
                {
                  step: "STEP 1",
                  title: "전화 신청",
                  desc: "1844-1585으로 전화하여 현재 위치와 목적지를 말씀해 주세요.",
                  icon: <PhoneCall className="w-6 h-6" />,
                  color: "bg-blue-600"
                },
                {
                  step: "STEP 2",
                  title: "기사 배정",
                  desc: "가장 가까운 곳에 있는 베테랑 기사님을 즉시 매칭해 드립니다.",
                  icon: <UserCheck className="w-6 h-6" />,
                  color: "bg-blue-600"
                },
                {
                  step: "STEP 3",
                  title: "기사 도착",
                  desc: "기사님이 고객님 계신 곳으로 신속하게 방문합니다.",
                  icon: <MapPin className="w-6 h-6" />,
                  color: "bg-blue-600"
                },
                {
                  step: "STEP 4",
                  title: "안전 귀가",
                  desc: "고객님의 차량으로 목적지까지 안전하고 편안하게 모십니다.",
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  color: "bg-blue-600"
                }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center group hover:border-blue-500 transition-colors">
                  <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-black text-blue-600 tracking-widest mb-2 block">{item.step}</span>
                  <h4 className="text-xl font-black text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exemption Clauses Section */}
        {content.chauffeurExemptionClauses && content.chauffeurExemptionClauses.length > 0 && (
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Ban className="w-10 h-10 text-red-600" /> 서비스 이용 시 유의 및 면책 사항
              </h2>
              <p className="text-slate-500 font-medium">안전한 서비스 제공을 위해 아래의 면책 규정을 반드시 확인해 주시기 바랍니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.chauffeurExemptionClauses.map((clause: any, idx: number) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{clause.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{clause.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                위 면책 사항은 표준 약관 및 보험 규정에 근거하며, 사고 발생 시 보험사의 최종 판정에 따라 보상 여부가 결정됩니다. 
                차량의 특이 사항이나 고가의 귀중품이 있는 경우 반드시 운행 시작 전 기사님께 고지해 주시기 바랍니다.
              </p>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">
              {content.chauffeurBannerTitle || "안전한 귀가, 달리고 대리운전이 책임지겠습니다."}
            </h2>
            <p className="text-xl text-slate-400 font-medium mb-12">
              {content.chauffeurBannerSubtitle || "지금 바로 전화 한 통으로 가장 빠른 기사님을 만나보세요!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href={`tel:${content?.contactPhone?.replace(/-/g, '') || '18441585'}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-2xl font-black text-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-4 animate-bounce"
              >
                <PhoneCall className="w-8 h-8" /> {content?.contactPhone || '1844-1585'}
              </a>
              <button 
                onClick={onForm || onConsult}
                className="bg-white/10 hover:bg-white/20 text-white px-12 py-6 rounded-2xl font-black text-2xl transition-all border border-white/20 flex items-center justify-center gap-4"
              >
                <UserCheck className="w-8 h-8" /> {content.chauffeurFormBannerButtonLabel || "대리 신청하기"}
              </button>
            </div>
          </div>
        </section>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedDetail && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDetail(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="p-8 sm:p-12 overflow-y-auto">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div className={`${selectedDetail.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl`}>
                        {selectedDetail.icon}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-slate-900">{selectedDetail.title}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedDetail(null)}
                      className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-500" />
                    </button>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    {selectedDetail.content}
                  </div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedDetail(null)}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                  >
                    확인했습니다
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChauffeurService;
