/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Truck, Zap, 
  Menu, X, 
  UserCheck, PhoneCall,
  UserPlus,
  ShieldCheck, AlertCircle, CheckCircle2, Shield,
  Car, Settings, ClipboardCheck, MapPin, Key, CreditCard,
  ClipboardList, Info, User, Lock,
  Anchor, Coins, ArrowLeft
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ContentProvider, EditableText, useContent } from './ContentContext';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import ReviewSection from './components/ReviewSection';
import ConsignmentPriceTable from './components/ConsignmentPriceTable';
import ChauffeurPriceTable from './components/ChauffeurPriceTable';
import Footer from './components/Footer';
import OrderFormInside from './components/OrderFormInside';
import DriverApplicationForm from './components/DriverApplicationForm';

const Navbar = ({ scrolled, isMenuOpen, setIsMenuOpen }: { scrolled: boolean, isMenuOpen: boolean, setIsMenuOpen: (open: boolean) => void }) => {
  const { user, isAdmin, login, logout } = useAuth();

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white py-3 shadow-xl' : 'bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-4 md:py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${scrolled ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-white shadow-xl'}`}>
            <Truck className={`w-6 h-6 transition-colors ${scrolled ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div className={`px-3 py-1 rounded-lg transition-all duration-300 ${!scrolled ? 'bg-white/10 md:backdrop-blur-md border border-slate-200 md:border-white/20' : ''}`}>
            <span className={`text-2xl font-black tracking-tighter italic transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'}`}>
              달리고 탁송
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {['서비스 안내', '이용 방법', '요금 문의', '취소 규정'].map((item) => (
              <a 
                key={item} 
                href={`#${item.replace(' ', '')}`} 
                className={`font-bold transition-all duration-300 text-sm hover:text-blue-600 ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5 border-l border-slate-200 pl-5 ml-2 h-6">
            {user ? (
              <button 
                onClick={logout}
                className={`flex items-center gap-2 transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}
                title="로그아웃"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden transition-colors ${scrolled ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={16} className={scrolled ? 'text-slate-600' : 'text-slate-400'} />
                  )}
                </div>
                <span className="text-xs font-bold hidden lg:block">로그아웃</span>
              </button>
            ) : (
              <button 
                onClick={login}
                className={`flex items-center gap-2 font-bold transition-colors text-sm ${scrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}
              >
                <User size={18} />
                <span>로그인</span>
              </button>
            )}

            {isAdmin && (
              <Link 
                to="/admin" 
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border shadow-sm ${scrolled ? 'bg-slate-50 border-slate-200 text-blue-600 hover:bg-blue-50' : 'bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700'}`}
                title="관리자 페이지"
              >
                <Lock size={18} />
              </Link>
            )}

            <a href="tel:1844-1585" className={`px-6 py-2.5 rounded-full font-black transition-all shadow-lg flex items-center gap-2 text-sm ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-white text-blue-600 hover:bg-slate-100 shadow-black/20'}`}>
              <PhoneCall size={16} /> 1844-1585
            </a>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin" className={scrolled ? 'text-blue-600' : 'text-blue-600'}>
              <Lock size={20} />
            </Link>
          )}
          <button className={scrolled ? 'text-slate-900' : 'text-slate-900'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full border-t p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 ${scrolled ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex flex-col gap-4">
            {['서비스 안내', '이용 방법', '요금 문의', '취소 규정'].map((item) => (
              <a 
                key={item} 
                href={`#${item.replace(' ', '')}`} 
                className={`font-bold py-2 ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className={`h-px my-2 ${scrolled ? 'bg-slate-100' : 'bg-slate-800'}`} />
            <div className="flex items-center justify-between">
              {user ? (
                <button onClick={logout} className="text-slate-400 font-bold">로그아웃</button>
              ) : (
                <button onClick={login} className="text-blue-500 font-bold">로그인</button>
              )}
              <a href="tel:1844-1585" className={`font-black ${scrolled ? 'text-blue-600' : 'text-white'}`}>1844-1585</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const DalligoMain = ({ onSelect }: { onSelect: (type: 'consignment' | 'chauffeur' | 'driver') => void }) => {
  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[80vh] w-full">
        <div 
          className="flex-1 group relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden cursor-pointer min-h-[300px]" 
          onClick={() => onSelect('consignment')}
        >
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all duration-500" />
          <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
            <img 
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1000" 
              alt="Consignment" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <Truck className="w-16 h-16 mb-6 mx-auto text-[#C5A059]" />
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#C5A059] tracking-tighter">탁송신청</h2>
            <p className="text-gray-400 font-bold text-lg">전국 100% 신속배차 전문</p>
          </div>
        </div>

        <div 
          className="flex-1 group relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden cursor-pointer min-h-[300px]" 
          onClick={() => onSelect('chauffeur')}
        >
          <div className="absolute inset-0 bg-black/70 group-hover:bg-black/30 transition-all duration-500" />
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000" 
              alt="Chauffeur" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <UserCheck className="w-16 h-16 mb-6 mx-auto text-[#00E5FF]" />
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#00E5FF] tracking-tighter">대리신청</h2>
            <p className="text-gray-400 font-bold text-lg">투명한 정찰제 안전 귀가</p>
          </div>
        </div>

        <div 
          className="flex-1 group relative overflow-hidden cursor-pointer min-h-[300px]" 
          onClick={() => onSelect('driver')}
        >
          <div className="absolute inset-0 bg-black/80 group-hover:bg-black/40 transition-all duration-500" />
          <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
            <img 
              src="https://images.unsplash.com/photo-1549194388-2469d59ec75c?auto=format&fit=crop&q=80&w=1000" 
              alt="Driver" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <UserPlus className="w-16 h-16 mb-6 mx-auto text-gray-300" />
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-gray-300 tracking-tighter">기사신청</h2>
            <p className="text-gray-400 font-bold text-lg">최고의 대우 파트너 모집</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ContentProvider>
    </AuthProvider>
  );
}

interface Service {
  title: string;
  desc: string;
  longDesc?: string;
  icon: React.ElementType;
  color: string;
  tag: string;
  image: string;
  steps: string[];
}

const ServiceModal = ({ service, onClose }: { service: Service | null, onClose: () => void }) => {
  if (!service) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Clean Header without Image */}
        <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-start shrink-0">
          <div>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              홈으로 돌아가기
            </button>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 mb-2 uppercase tracking-wider">
              {service.tag}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{service.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all group"
            title="닫기"
          >
            <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-white">
          <div className="space-y-10">
            {/* Description Section */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Info className="text-blue-600" size={18} />
                </div>
                서비스 상세 안내
              </h4>
              <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
                <p className="text-slate-600 font-bold leading-[1.8] whitespace-pre-wrap text-base md:text-lg">
                  {service.longDesc || service.desc}
                </p>
              </div>
            </div>

            {/* Steps Section */}
            {service.steps && (
              <div className="space-y-6">
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ClipboardList className="text-blue-600" size={18} />
                  </div>
                  진행 절차
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {service.steps.map((step: string, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 shadow-sm">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-black text-slate-800 leading-tight">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-slate-100">
                <Coins size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Fare</p>
                <p className="text-xl font-black text-slate-900">상담 후 확정</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 md:flex-none px-8 py-4 bg-white text-slate-600 font-black rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                홈으로
              </button>
              <button 
                onClick={() => {
                  onClose();
                  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-[2] md:flex-none px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                지금 바로 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeForm, setActiveForm] = useState<'none' | 'consignment' | 'chauffeur'>('none');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeForm !== 'none') {
      const element = document.getElementById('order-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeForm]);

  const handleSelect = (type: 'consignment' | 'chauffeur' | 'driver') => {
    if (type === 'driver') {
      const element = document.getElementById('driver-application');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setActiveForm(type);
  };

  const { content, updateContent, isEditing } = useContent();
  const { isAdmin } = useAuth();

  const services: Service[] = [
    { 
      id: 'road',
      title: '일반 탁송', 
      desc: '전문 탁송 기사가 고객의 차량에 직접 탑승하여 목적지까지 운행하는 가장 보편적인 방식입니다.', 
      longDesc: '로드 탁송은 전문 탁송 기사가 고객의 차량에 직접 탑승하여 목적지까지 운행하는 가장 보편적인 방식입니다.\n\n이 서비스는 시간과 장소의 제약이 적어 전국 어디서나 24시간 신속하게 배차할 수 있다는 장점이 있습니다. 주로 중고차 매매, 공항 픽업, 혹은 음주 후 차량만 집으로 보내야 하는 경우에 많이 이용됩니다.\n\n비용 면에서 가장 경제적이지만, 기사가 직접 주행하므로 차량의 주행거리(마일리지)가 필연적으로 증가하고 유류비 등 실비 발생 가능성을 고려해야 합니다.',
      icon: Truck, 
      color: 'bg-blue-50 text-blue-600',
      tag: '경제성/신속성',
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1000',
      steps: ['실시간 접수', '기사 배정', '차량 인수/상태 체크', '목적지 안전 도착']
    },
    { 
      id: 'carrier',
      title: '캐리어 탁송', 
      desc: '차량 전용 운반 트럭에 고객의 차량을 적재하여 운송하는 프리미엄 서비스입니다.', 
      longDesc: '캐리어 탁송은 차량 전용 운반 트럭인 카캐리어(3~5카, 풀카 등)나 셀프카(세이프티 로더) 장비에 고객의 차량을 적재하여 운송하는 프리미엄 서비스입니다.\n\n차량을 싣고 이동하기 때문에 주행거리 증가가 0%에 가까워, 갓 출고된 신차나 주행 불능 상태의 사고/고장 차량, 혹은 타이어 마모를 최소화해야 하는 슈퍼카 운송에 최적화되어 있습니다.\n\n로드 탁송보다 약 50,000원 이상의 추가 비용이 발생하며, 대형 트럭이 진입하기 어려운 좁은 골목의 경우 인근 차고지까지 로드 탁송과 병행될 수 있습니다.',
      icon: Car, 
      color: 'bg-orange-50 text-orange-600',
      tag: '슈퍼카/신차 전용',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1000',
      steps: ['예약 접수', '캐리어 차량 배정', '상차 및 고정', '안전 운송 및 하차']
    },
    { 
      id: 'selfloader',
      title: '셀프로더 탁송', 
      desc: '1대 전용 저상 셀프로더 차량으로 슈퍼카나 낮고 예민한 차량을 위한 맞춤형 운송입니다.', 
      longDesc: '셀프로더 탁송은 1대 전용 저상 셀프로더(세이프티 로더) 차량을 이용하여 차량을 운송하는 방식입니다.\n\n지상고가 낮은 슈퍼카, 튜닝 차량, 혹은 고가의 수입차를 운송할 때 하부 손상을 방지하기 위해 사용됩니다. 차량 1대만을 전용으로 운송하므로 고객이 원하는 시간에 정확하게 맞춰 이동할 수 있는 맞춤형 서비스입니다.\n\n일반 캐리어보다 더 세심한 관리가 필요한 차량에 권장되며, 전문 장비를 갖춘 베테랑 기사가 직접 상/하차를 진행하여 안전성을 극대화합니다.',
      icon: Settings, 
      color: 'bg-purple-50 text-purple-600',
      tag: '1대 전용/저상차',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000',
      steps: ['차종 확인 및 상담', '셀프로더 배정', '정밀 상차 작업', '목적지 안전 인도']
    },
    { 
      id: 'jeju',
      title: '제주도 탁송', 
      desc: '내륙에서 제주까지, 선박 선적부터 현지 인도까지 책임지는 원스톱 해상 운송 서비스입니다.', 
      longDesc: '제주도 탁송은 내륙에서 제주도까지, 혹은 제주도에서 내륙으로 차량을 보내는 원스톱 운송 서비스입니다.\n\n고객의 집 앞에서 차량을 픽업하여 목포항, 부산항, 여수항 등 주요 항구로 이동시킨 뒤 배에 선적하고, 제주항 도착 후 다시 목적지까지 인도하는 복합적인 절차를 거칩니다. 기상 상황과 배편 일정에 따라 전체 운송 기간이 변동될 수 있으며, 요금에는 기사 인건비와 선적료가 포함됩니다.\n\n장기 제주 여행, 이사, 한 달 살기를 계획하는 고객들에게 렌터카보다 자차를 사용하는 합리적 대안으로 인기가 높습니다.',
      icon: Anchor, 
      color: 'bg-cyan-50 text-cyan-600',
      tag: '내륙-해상 원스톱',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000',
      steps: ['실시간 접수', '항만 차량 선적', '배편 운송', '제주 현지 인도']
    },
    { 
      id: 'inspection',
      title: '중고차 검수 탁송', 
      desc: '중고차 구매 시 전문가가 현장에서 차량 상태를 꼼꼼히 검수하고 안전하게 배송해드립니다.', 
      longDesc: '중고차 검수 탁송은 중고차 구매를 앞둔 고객님을 대신하여 전문가가 현장에 방문, 차량의 외관, 내관, 사고 유무, 소모품 상태 등을 정밀하게 검수하고 그 결과를 리포트로 제공한 뒤 안전하게 탁송까지 완료하는 서비스입니다.\n\n직접 방문하기 어려운 원거리 매물을 구매할 때 유용하며, 전문가의 눈으로 허위 매물이나 숨겨진 결함을 찾아내어 안전한 거래를 돕습니다.\n\n검수 완료 후 고객님의 승인이 떨어지면 즉시 탁송 절차로 전환되어 집 앞까지 안전하게 배송됩니다.',
      icon: ClipboardCheck, 
      color: 'bg-emerald-50 text-emerald-600',
      tag: '구매 대행/검수',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000',
      steps: ['검수 예약', '전문가 현장 방문', '상태 리포트 전송', '구매 결정 후 탁송']
    },
    { 
      id: 'scrap',
      title: '폐차/수출 탁송', 
      desc: '폐차 대행 및 수출항 이동까지, 복잡한 절차를 대행하며 안전하게 차량을 운송합니다.', 
      longDesc: '폐차/수출 탁송은 노후 차량의 폐차 처리나 해외 수출을 위한 항만 이동을 지원하는 서비스입니다.\n\n폐차장까지의 안전한 이동은 물론, 필요한 서류 절차 안내 및 대행을 통해 고객님의 번거로움을 최소화합니다. 수출 차량의 경우 인천항, 평택항 등 주요 수출항까지 정해진 스케줄에 맞춰 정확하게 입고시킵니다.\n\n주행 불능 차량의 경우 견인차(렉카)를 이용한 운송도 가능하며, 말소 처리 확인까지 꼼꼼하게 챙겨드립니다.',
      icon: Zap, 
      color: 'bg-rose-50 text-rose-600',
      tag: '폐차/수출 대행',
      image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1000',
      steps: ['상담 및 접수', '차량 인수', '폐차장/항만 이동', '말소/입고 확인']
    }
  ];

  const handleImageUpload = async (serviceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to Firebase Storage here.
    // For this environment, we'll use a FileReader to get a base64 string
    // and store it in Firestore via updateContent.
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await updateContent(`service_img_${serviceId}`, base64String, 'image');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <DalligoMain onSelect={handleSelect} />

      <section id="서비스안내" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-black tracking-widest uppercase mb-4">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              <EditableText contentKey="service_title" defaultText="전문적인 탁송 서비스 라인업" />
            </h3>
            <p className="text-xl text-slate-500 font-medium">
              <EditableText contentKey="service_desc" defaultText="차량의 특성과 고객님의 니즈에 맞춘 최적의 솔루션을 제공합니다." />
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((item, idx) => {
              const displayImage = content[`service_img_${item.id}`] || item.image;
              const displayTitle = content[`service_title_${item.id}`] || item.title;
              const displayDesc = content[`service_desc_${item.id}`] || item.desc;

              return (
                <div 
                  key={idx}
                  className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-500 flex flex-col"
                  onClick={() => setSelectedService({ ...item, image: displayImage, title: displayTitle, desc: displayDesc })}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={displayTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    {isEditing && isAdmin && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <label className="bg-white text-blue-600 px-4 py-2 rounded-xl font-black text-xs cursor-pointer hover:bg-blue-50 transition-colors">
                          이미지 변경
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(item.id, e)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </label>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-lg backdrop-blur-md`}>
                      <item.icon size={20} />
                    </div>
                  </div>
                  
                  <div className="p-8 pt-2 flex-1 flex flex-col">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 mb-4 border border-slate-100 uppercase tracking-wider w-fit">
                      {item.tag}
                    </span>
                    <EditableText 
                      contentKey={`service_title_${item.id}`} 
                      defaultText={item.title} 
                      className="text-2xl font-black text-slate-900 mb-4 drop-shadow-sm block"
                      as="h4"
                    />
                    <EditableText 
                      contentKey={`service_desc_${item.id}`} 
                      defaultText={item.desc} 
                      className="text-slate-500 font-bold leading-relaxed relative z-10 line-clamp-2 text-sm mb-6 block"
                      as="p"
                    />
                    
                    <div className="mt-auto flex items-center text-blue-600 font-black text-xs gap-1 group-hover:translate-x-1 transition-transform">
                      상세보기 <X className="rotate-45" size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-blue-600 shrink-0 shadow-xl">
                  <ShieldCheck size={48} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">자동차탁송종합보험 100% 가입</h3>
                  <p className="text-xl text-blue-100 font-bold">
                    달리고 탁송은 전 기사님 보험 가입을 원칙으로 하며, <br className="hidden md:block" />
                    미가입 기사는 배차 시스템에서 원천 차단됩니다.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-2xl font-black text-center mb-10">투명한 사고 보상 프로세스</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { step: '현장 구호', icon: AlertCircle },
                    { step: '업체 통보', icon: PhoneCall },
                    { step: '보험사 조사', icon: ClipboardCheck },
                    { step: '규정 보상', icon: CheckCircle2 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                        <item.icon size={24} />
                      </div>
                      <span className="font-black text-sm">{item.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="이용방법" className="py-24 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-blue-400 font-black tracking-widest uppercase mb-4">Process</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-6">현실적인 5단계 안심 프로세스</h3>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-5 gap-8 relative z-10">
              {[
                { step: '01', title: '신청 및 견적', desc: '실시간 견적 확인 후 간편하게 접수합니다.', icon: ClipboardList },
                { step: '02', title: '기사 매칭', desc: '20분 내 최적의 베테랑 기사님을 배정합니다.', icon: UserCheck },
                { step: '03', title: '차량 인수', desc: '출발지 차량 상태 확인 후 안전하게 인수합니다.', icon: MapPin },
                { step: '04', title: '안전 이동', desc: '실시간 경로를 준수하며 안전하게 이동합니다.', icon: Truck },
                { step: '05', title: '인도 완료', desc: '목적지 도착 및 안전하게 키를 인도합니다.', icon: Key }
              ].map((item, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40 relative">
                    <item.icon size={28} className="text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-black italic shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h4 className="text-xl font-black mb-4">{item.title}</h4>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeForm !== 'none' && (
        <section id="order-section" className="py-24 px-6 bg-slate-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                {activeForm === 'consignment' ? '탁송 신청하기' : '대리운전 신청하기'}
              </h2>
              <p className="text-xl text-slate-500 font-bold">
                필수 정보를 입력하시면 신속하게 배차를 도와드립니다.
              </p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
              <OrderFormInside type={activeForm as 'consignment' | 'chauffeur'} />
            </div>
          </div>
        </section>
      )}

      <section id="요금문의" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-black tracking-widest uppercase mb-4">Pricing Guide</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">합리적인 이용 요금</h3>
            <p className="text-xl text-slate-600 font-bold">거리와 차종에 따른 투명한 정찰제를 지향합니다.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <ConsignmentPriceTable />
            <ChauffeurPriceTable />
          </div>
        </div>
      </section>

      <section id="driver-application" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 p-10 md:p-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">달리고와 함께할<br />기사님을 모집합니다</h3>
                <p className="text-lg text-slate-500 font-bold mb-8 leading-relaxed">
                  업계 최고의 대우와 편리한 배차 시스템을 경험해보세요. 24시간 언제든 환영합니다.
                </p>
                <ul className="space-y-4">
                  {['업계 최저 수수료', '실시간 정산 시스템', '24시 사고 대응팀 운영'].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 font-black text-slate-700">
                      <Zap size={18} className="text-blue-600" /> {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <DriverApplicationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewSection />

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-black tracking-widest uppercase mb-4">FAQ & Guide</h2>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">이용 전 꼭 확인해주세요</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                q: '과태료 처리는 어떻게 되나요?', 
                a: '기사 과실로 인한 과태료 발생 시 당일 즉시 처리 원칙을 준수합니다. 위반 사실 확인 후 즉시 보상해드립니다.',
                icon: AlertCircle
              },
              { 
                q: '정산 기준이 궁금합니다.', 
                a: '톨게이트 비용 및 주유비는 실비 정산을 원칙으로 합니다. 영수증 증빙을 통해 투명하게 정산됩니다.',
                icon: CreditCard
              },
              { 
                q: '기상 악화 시에는 어떻게 하나요?', 
                a: '폭설, 폭우 등 천재지변 시 안전을 위해 일정이 조정될 수 있습니다. 고객님과 협의 후 최적의 시간을 재배정합니다.',
                icon: Zap
              },
              { 
                q: '보험 처리는 확실한가요?', 
                a: '전 기사님 자동차탁송종합보험 가입 완료 상태입니다. 사고 발생 시 보험사 조사를 통해 규정에 따른 완벽한 보상을 약속합니다.',
                icon: Shield
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-3">{item.q}</h4>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-blue-600/20">
              <Truck size={40} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tighter">
              전국 통합 배차 시스템 운영
            </h3>
            <p className="text-xl text-slate-500 font-bold leading-relaxed mb-10">
              달리고 탁송은 단순한 운송을 넘어, <br />
              <span className="text-blue-600">고객의 소중한 자산을 안전하게 연결하는 물류 전문가</span>입니다. <br />
              전국 어디서나 표준화된 고품격 서비스를 경험해보세요.
            </p>
          </div>
        </div>
      </section>
      
      <section id="취소규정" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-10">
            <Info className="text-red-500 w-8 h-8" />
            <h3 className="text-3xl font-black text-slate-900">취소 및 위약금 규정</h3>
          </div>
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 text-slate-600 font-bold">
            <p className="mb-4">• 배차 후 5분 경과 시 위약금이 발생할 수 있습니다.</p>
            <p>• 자세한 내용은 고객센터(1844-1585)로 문의 바랍니다.</p>
          </div>
        </div>
      </section>

      <Footer />
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}
