/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Truck, 
  Car, 
  Zap, 
  Bus, 
  Ship, 
  HardHat, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Loader2,
  User,
  Settings,
  Lock,
  MapPin,
  Navigation,
  ShieldCheck,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { generateTransportImage } from './services/imageService';
import DriverRecruitment from './components/DriverRecruitment';
import ConsignmentForm from './components/ConsignmentForm';
import ConsignmentService from './components/ConsignmentService';
import ConsignmentPriceTable from './components/ConsignmentPriceTable';
import ChauffeurPriceTable from './components/ChauffeurPriceTable';
import ChauffeurService from './components/ChauffeurService';
import ChauffeurForm from './components/ChauffeurForm';
import CustomerCenter from './components/CustomerCenter';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import PopupManager from './components/PopupManager';
import Chatbot from './components/Chatbot';
import { useAuth, useContent } from './AuthContext';

const ICON_MAP: Record<string, React.FC<any>> = {
  Truck,
  Car,
  Zap,
  Bus,
  Ship,
  HardHat,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Loader2,
  User,
  Settings,
  Lock,
  MapPin,
  Navigation,
  ShieldCheck,
  ArrowLeft,
  MessageSquare
};

const steps = [
  { id: "01", title: "상담신청", desc: "차종 및 지역 정보 기반\n실시간 무료 견적 상담" },
  { id: "02", title: "현장픽업", desc: "원하는 시간과 장소로\n전문 기사가 방문하여 인수" },
  { id: "03", title: "안전운송", desc: "베테랑 기사가 목적지까지\n안전하게 차량을 운송합니다" },
  { id: "04", title: "운송완료", desc: "목적지 도착 후 차량 상태 확인 및\n고객님께 최종 인도 완료" }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'recruitment' | 'consignmentForm' | 'consignmentService' | 'chauffeur' | 'chauffeurForm' | 'customerCenter' | 'login' | 'admin'>('home');
  const { user, logout, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { content, isLoading: isContentLoading } = useContent();

  useEffect(() => {
    if (content) {
      console.log("Current App Content:", content);
    }
  }, [content]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Auto-redirect after login
  useEffect(() => {
    if (user) {
      if (currentPage === 'login') {
        setCurrentPage('home');
      }
      // Admin page is handled by ternary in render
    }
  }, [user, currentPage]);

  // Helper to render icon by name
  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : <Car className="w-8 h-8" />;
  };

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn("Hero image generation timed out, using fallback.");
        setIsLoadingImage(false);
      }
    }, 8000); // 8 second timeout for AI image

    async function loadImage() {
      try {
        const img = await generateTransportImage();
        if (isMounted) {
          setHeroImage(img);
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
      } finally {
        if (isMounted) {
          setIsLoadingImage(false);
          clearTimeout(timeoutId);
        }
      }
    }
    loadImage();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const isDefaultHeroImage = content.heroImage === "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1280&q=75";
  const displayHeroImage = isDefaultHeroImage ? (heroImage || content.heroImage) : content.heroImage;

  // Global loading state
  if (isAuthLoading || isContentLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold">시스템을 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PopupManager />
      {/* Navigation */}
      {currentPage !== 'admin' && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-600 shadow-sm">
                    <img 
                      src={content.logoImage || "https://storage.googleapis.com/static.antigravity.ai/asb/input_file_0.png"} 
                      alt="Dalligo Logo" 
                      className="w-full h-full object-contain p-1"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = "https://storage.googleapis.com/static.antigravity.ai/asb/input_file_0.png";
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-900 tracking-tighter leading-none" translate="no">{content.logoText || "달리고 탁송"}</span>
                    <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase" translate="no">Dalligo Consignment</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 border-l border-slate-100 pl-8">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest"><span>{user.role}</span></span>
                        <span className="text-xs font-bold text-slate-900"><span>{user.email.split('@')[0]}님</span></span>
                      </div>
                      <button 
                        onClick={logout}
                        className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span>로그아웃</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setCurrentPage('login');
                        setIsMenuOpen(false);
                      }}
                      className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-600 transition-colors group"
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold"><span>로그인</span></span>
                    </button>
                  )}
                  
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        setCurrentPage('admin');
                        setIsMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-0.5 transition-colors group text-slate-500 hover:text-blue-600`}
                    >
                      <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                      <span className="text-[10px] font-bold"><span>관리자</span></span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-10">
                {[
                  { name: content.navConsignment || '탁송서비스', page: 'consignmentService' },
                  { name: content.navChauffeur || '대리운전', page: 'chauffeur' },
                  { name: content.navRecruitment || '기사모집', page: 'recruitment' },
                  { name: content.navCustomerCenter || '고객센터', page: 'customerCenter' }
                ].map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => setCurrentPage(item.page as any)}
                    className={`text-[15px] font-semibold transition-colors ${
                      currentPage === item.page && item.page !== 'home' 
                        ? 'text-blue-600' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => {
                    setCurrentPage('chauffeurForm');
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>{content.chauffeurFormHeroButtonLabel || "대리 신청하기"}</span>
                </button>

                <button 
                  onClick={() => {
                    setCurrentPage('consignmentForm');
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
                >
                  <span>{content.consignmentFormHeroButtonLabel || "탁송 신청하기"}</span>
                </button>
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-100 py-6 px-6 space-y-6">
              <div className="flex justify-around items-center pb-4 border-b border-slate-50">
                {user ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.role}</span>
                    <span className="text-sm font-bold text-slate-900">{user.email}</span>
                    <button onClick={logout} className="text-xs text-red-500 font-bold mt-1">로그아웃</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setCurrentPage('login');
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 text-slate-600"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xs font-bold">로그인/가입</span>
                  </button>
                )}
                
                {isAdmin && (
                  <button 
                    onClick={() => {
                      setCurrentPage('admin');
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 text-slate-600"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-xs font-bold">관리자</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { name: content.navConsignment || '탁송서비스', page: 'consignmentService' },
                  { name: content.navChauffeur || '대리운전', page: 'chauffeur' },
                  { name: content.navRecruitment || '기사모집', page: 'recruitment' },
                  { name: content.navCustomerCenter || '고객센터', page: 'customerCenter' }
                ].map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => {
                      setCurrentPage(item.page as any);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left text-lg font-semibold transition-colors ${
                      currentPage === item.page && item.page !== 'home' 
                        ? 'text-blue-600' 
                        : 'text-slate-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setCurrentPage('chauffeurForm');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg"
                >
                  {content.chauffeurFormHeroButtonLabel || "대리 신청하기"}
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('consignmentForm');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-[#FF9800] text-white py-4 rounded-xl font-bold text-lg"
                >
                  {content.consignmentFormHeroButtonLabel || "탁송 신청하기"}
                </button>
              </div>
            </div>
          )}
        </nav>
      )}

      {currentPage === 'recruitment' ? (
        <DriverRecruitment key="recruitment" content={content} onConsult={() => setIsChatbotOpen(true)} />
      ) : currentPage === 'consignmentForm' ? (
        <ConsignmentForm key="consignmentForm" content={content} onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'consignmentService' ? (
        <ConsignmentService 
          key="consignmentService" 
          content={content} 
          onConsult={() => setIsChatbotOpen(true)} 
          onForm={() => setCurrentPage('consignmentForm')}
        />
      ) : currentPage === 'chauffeur' ? (
        <ChauffeurService key="chauffeur" content={content} onConsult={() => setIsChatbotOpen(true)} onForm={() => setCurrentPage('chauffeurForm')} />
      ) : currentPage === 'chauffeurForm' ? (
        <ChauffeurForm key="chauffeurForm" onBack={() => setCurrentPage('home')} content={content} />
      ) : currentPage === 'customerCenter' ? (
        <CustomerCenter key="customerCenter" onBack={() => setCurrentPage('home')} />
      ) : currentPage === 'login' ? (
        <LoginPage key="login" />
      ) : currentPage === 'admin' ? (
        isAdmin ? <AdminDashboard key="admin" onBack={() => setCurrentPage('home')} /> : (user ? (
          <div key="no-access" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">접근 권한 없음</h2>
              <p className="text-slate-500 font-medium mb-8">
                관리자 계정({user.email})으로 로그인되어 있으나, 관리자 권한이 없습니다.<br />
                개발자에게 문의해 주세요.
              </p>
              <button 
                onClick={() => setCurrentPage('home')}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        ) : <LoginPage key="login-fallback" />)
      ) : (
        <div key="home">
          {/* Hero Section */}
          <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
            {content.heroImage && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={displayHeroImage} 
                  alt="Hero Background" 
                  className="w-full h-full object-cover opacity-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
              </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Animated Connection Boxes */}
            <div className="flex flex-col gap-6 justify-center order-1 lg:order-1">
              <motion.button
                onClick={() => setCurrentPage('consignmentForm')}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-full bg-white border-4 border-blue-50 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl hover:shadow-blue-200/50 hover:border-blue-400 transition-all text-left group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="text-blue-600 font-black text-lg uppercase tracking-widest mb-3 block">Quick Service</span>
                  <h3 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tighter">{content.heroConsignmentTitle || "탁송 신청"}</h3>
                  <p className="text-lg lg:text-2xl text-slate-500 font-bold">{content.heroConsignmentDesc || "실시간 전문가 1:1 상담 연결"}</p>
                </div>
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Truck className="w-64 h-64" />
                </div>
                <div className="absolute bottom-8 right-10 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                  <ChevronRight className="w-8 h-8" />
                </div>
              </motion.button>

              <motion.button
                onClick={() => setCurrentPage('chauffeurForm')}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="w-full bg-blue-600 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl hover:shadow-blue-500/20 transition-all text-left group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="text-blue-100 font-black text-lg uppercase tracking-widest mb-3 block">Safe Drive</span>
                  <h3 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tighter">{content.heroChauffeurTitle || "대리 신청"}</h3>
                  <p className="text-lg lg:text-2xl text-blue-100 font-bold opacity-80">{content.heroChauffeurDesc || "신속하고 안전한 대리운전 서비스"}</p>
                </div>
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                  <Car className="w-64 h-64" />
                </div>
                <div className="absolute bottom-8 right-10 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-blue-600 transition-all shadow-lg">
                  <ChevronRight className="w-8 h-8" />
                </div>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-2 flex flex-col items-center text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
                전국 어디서나 24시간 상담 가능
              </span>
              <h1 className="text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight mb-8" translate="no">
                {content.heroTitle} <br />
                {content.heroSubtitle.includes('입니다.') ? (
                  <>
                    <span className="text-blue-600">{content.heroSubtitle.replace('입니다.', '')}</span>
                    <span className="text-slate-900">입니다.</span>
                  </>
                ) : (
                  <span className="text-blue-600">{content.heroSubtitle}</span>
                )}
              </h1>
              <div className="space-y-6 mb-12 max-w-2xl" translate="no">
                {content.heroDescription.split('\n').filter(line => line.trim()).map((line, i) => {
                  const [title, ...rest] = line.split(':');
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-3 group text-left"
                    >
                      <div className="mt-1 bg-blue-50 p-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:text-white" />
                      </div>
                      <div className="text-lg lg:text-xl leading-relaxed">
                        {rest.length > 0 ? (
                          <p className="text-slate-600 font-medium">
                            <span className="text-blue-600 font-black mr-2">{title}:</span>
                            {rest.join(':')}
                          </p>
                        ) : (
                          <p className="text-slate-600 font-medium">{line}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => setCurrentPage('consignmentForm')}
                  className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  {content.consignmentFormHeroButtonLabel || "탁송 신청하기"} <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsChatbotOpen(true)}
                  className="bg-white border-2 border-slate-100 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" /> 실시간 채팅 상담
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consignment Price Table */}
      <ConsignmentPriceTable />

      {/* Chauffeur Price Table */}
      <ChauffeurPriceTable />

      {/* Services Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" translate="no">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{content.servicesTitle || "믿을 수 있는 탁송 서비스"}</h2>
            <p className="text-slate-500 font-medium">차종과 상황에 맞는 최적의 운송 솔루션을 제공합니다.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {content.services.map((service, idx) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
                    {renderIcon(service.iconName)}
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col flex-grow">
                  <h3 className="text-xl lg:text-2xl font-bold mb-4" translate="no">{service.title}</h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-6 flex-grow" translate="no">
                    {service.description}
                  </p>
                  <span className="text-orange-500 font-bold text-sm tracking-tight" translate="no">
                    {service.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Banner */}
      <section className="bg-[#1A237E] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 h-full w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-r border-white/20 h-full" />
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{content.bannerTitle || "전문 탁송 기사님 상시 모집"}</h2>
              <p className="text-blue-100 text-lg opacity-80 font-medium">달리고 탁송과 함께 성장할 신뢰할 수 있는 파트너를 기다립니다.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('recruitment')}
              className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-black/20 shrink-0"
            >
              기사 지원하기
            </button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{content.processTitle || "간편한 탁송 프로세스"}</h2>
            <p className="text-slate-500 font-medium">전화 한 통으로 시작되는 빠르고 완벽한 서비스</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {(content.steps || []).map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mb-8 shadow-2xl transition-all ${idx === 0 ? 'bg-white border-4 border-[#FF9800] text-[#FF9800]' : 'bg-slate-50 text-slate-300 border-4 border-slate-100'}`}>
                    {step.id}
                  </div>
                  <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                  <p className="text-slate-500 text-[15px] leading-relaxed whitespace-pre-line font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )}

      {/* Footer */}
      {currentPage !== 'admin' && (
        <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 lg:col-span-1">
                  <div className="flex items-center gap-2 text-blue-600 mb-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                      <img 
                        src="https://storage.googleapis.com/static.antigravity.ai/asb/input_file_0.png" 
                        alt="Dalligo Logo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xl font-black text-blue-900 tracking-tighter" translate="no">{content.footerLogoText || content.logoText || "달리고 탁송"}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4" translate="no">
                    {content.footerDescription || "달리고 탁송은 대한민국 어디든 부르면 바로 달려가는 신속하고 안전한 차량 탁송 전문 기업입니다. 100% 보험 가입 전문 기사 배차로 고객님의 소중한 자산을 안전하게 운송하겠습니다."}
                  </p>
                  <p className="text-sm font-bold text-blue-600" translate="no">{content.footerSubText || "Dalligo Consignment Service"}</p>
                </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-8">{content.footerServiceTitle || "서비스 안내"}</h4>
                <ul className="space-y-4 text-sm text-slate-500 font-medium">
                  {['전국 탁송 요금표', '대리운전 서비스', '기사 지원 안내'].map(item => (
                    <li key={item}><a href="#" className="hover:text-blue-600 transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-8">{content.footerCustomerTitle || "고객센터"}</h4>
                <div className="space-y-4 text-sm text-slate-500 font-medium">
                  <a href={`tel:${content.contactPhone}`} className="flex items-center gap-3 group">
                    <PhoneCall className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{content.contactPhone}</span>
                  </a>
                  <p className="text-slate-500 font-bold">24시간 연중무휴 상담 가능</p>
                  <p>상담시간: 00:00 - 24:00</p>
                  <p>(공휴일 포함 전국 어디서나)</p>
                  <button 
                    onClick={() => setIsChatbotOpen(true)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    실시간 상담 바로가기
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-8">{content.footerCompanyTitle || "회사 정보"}</h4>
                <div className="space-y-2 text-sm text-slate-500 font-medium">
                  <p className="font-bold text-slate-700">시스템/운영: 모노솔루션 (monosolution)</p>
                  <p>대표: 김우곤</p>
                  <p>사업자등록번호: {content.businessNumber}</p>
                  <p>주소: {content.contactAddress}</p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-400">서비스 파트너: {content.servicePartner}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">서비스 이용 안내 및 면책 고지</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    달리고 탁송·대리는 국토교통부 정식 허가를 받은 전문 기업과 협력하여 탁송 및 대리운전 중개 및 상담 서비스를 제공합니다. 실제 운송 업무는 해당 협력 업체의 책임 하에 진행되며, 당사는 중개자로서 협력사의 과실로 인한 분쟁에 대해서는 법적 책임이 없음을 알려드립니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">안전 거래 가이드</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    당사는 안전한 거래를 위해 협력 업체의 자격을 상시 확인하고 있습니다. 고객님의 안전을 위해 차량 인도 전 반드시 보험 가입 여부를 확인하시길 강력히 권장하며, 예약 시 정확한 위치 정보를 제공해 주시면 더욱 신속한 처리가 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400 font-medium">{content.footerText}</p>
              <div className="flex gap-8">
                <a href="#" className="text-xs text-slate-400 hover:text-slate-600 font-medium">이용약관</a>
                <a href="#" className="text-xs text-slate-600 hover:text-slate-900 font-bold">개인정보처리방침</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Sticky Call Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[55] bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <a 
          href={`tel:${content.contactPhone.replace(/-/g, '')}`}
          className="flex-1 bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
        >
          <PhoneCall className="w-6 h-6" /> 전화 상담
        </a>
        <button 
          onClick={() => setIsChatbotOpen(true)}
          className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>

      {/* Floating Chat Button (Desktop Only) */}
      <button 
        onClick={() => setIsChatbotOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 z-[60] w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all group"
        aria-label="실시간 상담"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
          LIVE
        </span>
      </button>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
        content={content}
      />
    </div>
  );
}
