import React from 'react';
import { motion } from 'motion/react';
import { Handshake, MessageSquare, ChevronRight, PhoneCall } from 'lucide-react';
import { useContent } from '../AuthContext';

interface CustomerCenterProps {
  onBack: () => void;
}

const CustomerCenter: React.FC<CustomerCenterProps> = ({ onBack }) => {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">{content.customerHeroTitle || "고객센터"}</h1>
          <p className="text-xl text-slate-500 font-medium">{content.customerHeroSubtitle || "무엇을 도와드릴까요? 원하시는 서비스를 선택해주세요."}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* 업무제휴문의 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500 cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">업무제휴문의</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                달리고 탁송과 함께 성장할 비즈니스 파트너를 찾습니다. <br />
                기업 물류, 법인 탁송 등 다양한 제휴 제안을 환영합니다.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                문의하기 <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Handshake className="w-64 h-64" />
            </div>
          </motion.div>

          {/* 사용후기 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-500 cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">사용후기</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                달리고 탁송을 이용하신 고객님들의 생생한 목소리입니다. <br />
                더 나은 서비스를 위해 소중한 의견을 남겨주세요.
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
                후기보기 <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <MessageSquare className="w-64 h-64" />
            </div>
          </motion.div>
        </div>

        {/* Quick Contact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/20">
            <p className="text-blue-100 font-bold mb-4">빠른 상담이 필요하신가요?</p>
            <a href={`tel:${content.contactPhone}`} className="flex items-center gap-4 text-3xl font-black hover:scale-105 transition-transform">
              <PhoneCall className="w-8 h-8" /> {content.contactPhone}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerCenter;
