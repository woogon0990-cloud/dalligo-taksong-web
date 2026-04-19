/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, Zap, 
  Menu, X, 
  UserCheck, PhoneCall,
  UserPlus,
  ShieldCheck, AlertCircle, CheckCircle2, Shield,
  Car, Settings, ClipboardCheck, MapPin, Key, CreditCard,
  ClipboardList, Info, User, Lock, FileText,
  Coins, ArrowLeft,
  ShieldAlert, MessageCircle, Headphones,
  Clock
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
import LogoSymbol from './components/LogoSymbol';
import MyPage from './components/MyPage';
import Chatbot from './components/Chatbot';

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  
  const { login, loginWithEmail, signupWithEmail } = useAuth();

  if (!isOpen) return null;

  const isSignupValid = !isLoginMode && password === confirmPassword && password.length >= 6 && name.length > 0;
  const isFormValid = isLoginMode ? (email && password) : isSignupValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLoginMode && (password !== confirmPassword)) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md my-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20 relative">
        <div className="bg-slate-900 p-8 text-white relative text-center">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all hover:rotate-90"><X size={26} /></button>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30 ring-4 ring-blue-600/20"><Lock size={24} /></div>
          <h4 className="text-2xl font-black tracking-tighter mb-1">{isLoginMode ? '로그인' : '회원가입'}</h4>
          <p className="text-blue-200 font-bold text-[10px] opacity-60">서비스 이용을 위해 정보를 입력해 주세요.</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-base text-slate-900 placeholder:text-slate-300" 
                  placeholder="이메일 주소" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-base text-slate-900 placeholder:text-slate-300" 
                  placeholder="비밀번호" 
                  required 
                />
              </div>

              {!isLoginMode && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 mt-4">
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all text-base text-slate-900 placeholder:text-slate-300" 
                    placeholder="비밀번호 확인" 
                    required 
                  />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-600 transition-all text-base text-slate-900 placeholder:text-slate-300" 
                    placeholder="이름 (성함)" 
                    required 
                  />
                </div>
              )}
            </div>
            
            <div className="pt-2">
              {error && (
                <div className="mb-4 bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl animate-in shake duration-500">
                  <p className="text-rose-600 text-sm font-black text-center flex items-center justify-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                  </p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full py-5 text-white text-lg font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                {isLoginMode ? '시작하기' : '가입 완료하기'}
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }} 
              className="text-sm font-black text-slate-500 hover:text-blue-600 transition-colors block w-full text-center py-2 underline underline-offset-4 decoration-slate-200 hover:decoration-blue-400"
            >
              {isLoginMode ? '아직 회원이 아니신가요? 회원 가입하기' : '이미 계정이 있으신가요? 로그인하기'}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] tracking-[0.3em] text-slate-300"><span className="bg-white px-4 font-black uppercase">Social Login</span></div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGoogleLogin}
              className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
            >
              <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black text-slate-500">구글 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectionModal = ({ 
  isOpen, 
  type,
  onClose, 
  onSelectGuest, 
  onSelectMember 
}: { 
  isOpen: boolean, 
  type: string,
  onClose: () => void, 
  onSelectGuest: () => void, 
  onSelectMember: () => void 
}) => {
  if (!isOpen || type === 'driver') return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 p-8 text-white relative text-center">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-all hover:rotate-90"><X size={24} /></button>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/40">
            <ClipboardList size={32} />
          </div>
          <h4 className="text-3xl font-black tracking-tighter mb-2">신청 방식 선택</h4>
          <p className="text-blue-100 font-extrabold text-sm py-1 px-4 rounded-full inline-block">
            회원가입 시포인트 적립 및 특별 혜택 제공!
          </p>
        </div>

        <div className="p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={onSelectGuest}
              className="group relative h-48 rounded-[2rem] bg-slate-50 border-4 border-slate-100 hover:border-blue-200 transition-all p-8 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-blue-400 transition-all" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
              </div>
              <span className="text-xl font-black text-slate-900 mb-1">비회원 신청</span>
              <span className="text-xs text-slate-500 font-bold">즉시 신청서로 연결</span>
            </button>

            <button 
              onClick={onSelectMember}
              className="group relative h-48 rounded-[2rem] bg-blue-50 border-4 border-blue-100 hover:border-blue-600 transition-all p-8 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 group-hover:bg-blue-600 transition-all" />
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-black text-blue-900 mb-1">회원 신청</span>
              <span className="text-xs text-blue-600 font-bold italic group-hover:scale-110 transition-all">포인트 혜택 적용</span>
            </button>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-2xl text-center">
            <p className="text-xs text-slate-400 font-bold">기존 회원은 로그인 후 신청해 주세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const useSiteConfig = () => {
  const [config, setConfig] = useState({
    brandName: '달리고 탁송',
    brandNameShort: '달리고',
    primaryColor: 'blue',
    isIlryu: false
  });

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('ilryu') || hostname.includes('1ryu')) {
      setConfig({
        brandName: '일류전국탁송',
        brandNameShort: '일류탁송',
        primaryColor: 'blue',
        isIlryu: true
      });
      document.title = '일류전국탁송';
    } else {
      setConfig({
        brandName: '달리고 탁송',
        brandNameShort: '달리고',
        primaryColor: 'blue',
        isIlryu: false
      });
      document.title = '달리고 탁송';
    }
  }, []);

  return config;
};

const Navbar = ({ scrolled, isMenuOpen, setIsMenuOpen, setIsLoginModalOpen }: { scrolled: boolean, isMenuOpen: boolean, setIsMenuOpen: (open: boolean) => void, setIsLoginModalOpen: (open: boolean) => void }) => {
  const { user, isAdmin, logout, login } = useAuth();
  const { brandName } = useSiteConfig();

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-900 py-3 shadow-xl' : 'bg-slate-900/90 backdrop-blur-md py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <LogoSymbol size={24} isWhite />
          </div>
          <span className="text-2xl font-black tracking-tighter italic text-white">
            {brandName}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {['서비스 안내', '이용 방법', '요금 문의', '자료실'].map((item) => (
              <a 
                key={item} 
                href={`#${item.replace(' ', '')}`} 
                className="font-bold transition-all duration-300 text-sm hover:text-blue-400 text-slate-300"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5 border-l border-slate-700 pl-5 ml-2 h-6">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/mypage"
                  className="flex items-center gap-2 transition-colors text-slate-300 hover:text-white"
                  title="마이페이지"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-700 bg-slate-800 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={16} className="text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold hidden lg:block">마이페이지</span>
                </Link>
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-slate-500 hover:text-red-400 transition-colors border-l border-slate-700 pl-3 h-4 flex items-center"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-black rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 text-sm"
              >
                <User size={18} />
                <span>로그인</span>
              </button>
            )}
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all border border-slate-700 bg-slate-800 text-blue-400 hover:bg-slate-700 shadow-sm"
                title="관리자 페이지"
              >
                <Lock size={18} />
              </Link>
            )}

            <a href="tel:1844-1585" className="px-6 py-2.5 rounded-full font-black transition-all shadow-lg flex items-center gap-2 text-sm bg-white text-blue-600 hover:bg-slate-100">
              <PhoneCall size={16} /> 1844-1585
            </a>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          {user ? (
            <Link to="/mypage" className="text-slate-300">
              <User size={20} />
            </Link>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-black rounded-full text-xs shadow-lg"
            >
              <User size={14} /> 로그인
            </button>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-blue-400">
              <Lock size={20} />
            </Link>
          )}
          <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-t p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 bg-slate-900 border-slate-800">
          <div className="flex flex-col gap-4">
            {['서비스 안내', '이용 방법', '요금 문의', '자료실'].map((item) => (
              <a 
                key={item} 
                href={`#${item.replace(' ', '')}`} 
                className="font-bold py-2 text-slate-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="h-px my-2 bg-slate-800" />
            <div className="flex items-center justify-between">
              {user ? (
                <button onClick={logout} className="text-slate-400 font-bold">로그아웃</button>
              ) : (
                <button onClick={login} className="text-blue-500 font-bold">로그인</button>
              )}
              <a href="tel:1844-1585" className="font-black text-white">1844-1585</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const DalligoMain = ({ onSelect }: { onSelect: (type: 'consignment' | 'chauffeur' | 'driver') => void }) => {
  return (
    <div className="w-full bg-slate-50 text-white overflow-hidden pt-24 pb-12 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* 탁송신청 카드 */}
          <div 
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-blue-200/50 border-2 border-white transition-all duration-500 hover:scale-[1.02] flex flex-col h-40 md:h-[400px]" 
            onClick={() => onSelect('consignment')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-500" />
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1000" 
                alt="Consignment" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative flex-1 flex flex-row md:flex-col items-center justify-center p-6 md:p-10 text-center gap-6 md:gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
                <Truck className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-left md:text-center">
                <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-4 text-white tracking-tighter">
                  <EditableText contentKey="hero_card1_title" defaultText="탁송신청" />
                </h2>
                <p className="text-blue-100 font-bold text-sm md:text-lg">
                  <EditableText contentKey="hero_card1_desc" defaultText="전국 100% 신속배차 전문" />
                </p>
              </div>
            </div>
          </div>

          {/* 대리신청 카드 */}
          <div 
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-teal-200/50 border-2 border-white transition-all duration-500 hover:scale-[1.02] flex flex-col h-40 md:h-[400px]" 
            onClick={() => onSelect('chauffeur')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 group-hover:from-teal-400 group-hover:to-teal-500 transition-all duration-500" />
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000" 
                alt="Chauffeur" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative flex-1 flex flex-row md:flex-col items-center justify-center p-6 md:p-10 text-center gap-6 md:gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
                <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-left md:text-center">
                <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-4 text-white tracking-tighter">
                  <EditableText contentKey="hero_card2_title" defaultText="대리신청" />
                </h2>
                <p className="text-teal-50 font-bold text-sm md:text-lg">
                  <EditableText contentKey="hero_card2_desc" defaultText="투명한 정찰제 안전 귀가" />
                </p>
              </div>
            </div>
          </div>

          {/* 기사모집신청 카드 */}
          <div 
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-slate-200/50 border-2 border-white transition-all duration-500 hover:scale-[1.02] flex flex-col h-40 md:h-[400px]" 
            onClick={() => onSelect('driver')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-slate-700 group-hover:to-slate-800 transition-all duration-500" />
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1549194388-2469d59ec75c?auto=format&fit=crop&q=80&w=1000" 
                alt="Driver" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative flex-1 flex flex-row md:flex-col items-center justify-center p-6 md:p-10 text-center gap-6 md:gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-left md:text-center">
                <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-4 text-white tracking-tighter">
                  <EditableText contentKey="hero_card3_title" defaultText="기사모집신청" />
                </h2>
                <p className="text-slate-400 font-bold text-sm md:text-lg">
                  <EditableText contentKey="hero_card3_desc" defaultText="최고의 대우 파트너 모집" />
                </p>
              </div>
            </div>
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
          <Route path="/mypage" element={<MyPage />} />
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

const FloatingPhoneButton = () => {
  return (
    <motion.a 
      href="tel:1844-1585"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 z-[9998] w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] border-2 border-white/20 transition-all group"
    >
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
      <PhoneCall size={28} className="md:w-8 md:h-8" />
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
    </motion.a>
  );
};

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeForm, setActiveForm] = useState<'none' | 'consignment' | 'chauffeur' | 'driver'>('none');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
   const [selectionModal, setSelectionModal] = useState<{ 
    isOpen: boolean; 
    type: 'consignment' | 'chauffeur' | 'driver' | 'none' 
  }>({ isOpen: false, type: 'none' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingForm, setPendingForm] = useState<'consignment' | 'chauffeur' | 'driver' | 'none'>('none');

  const { user } = useAuth();

  useEffect(() => {
    // Auto-redirect to pending form after login
    if (user && pendingForm !== 'none') {
      if (pendingForm === 'driver') {
        document.getElementById('driver-application')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveForm(pendingForm as 'consignment' | 'chauffeur');
      }
      setPendingForm('none');
    }
  }, [user, pendingForm]);

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
      setActiveForm('driver');
      return;
    }

    // If already logged in, skip the selection/login modal and go straight to the form
    if (user) {
      setActiveForm(type as 'consignment' | 'chauffeur');
      return;
    }

    setSelectionModal({ isOpen: true, type });
  };

  const handleSelectGuest = () => {
    const type = selectionModal.type;
    setSelectionModal({ isOpen: false, type: 'none' });
    setActiveForm(type as 'consignment' | 'chauffeur' | 'driver');
  };

  const handleSelectMember = async () => {
    const type = selectionModal.type;
    if (!user) {
      setPendingForm(type);
      setSelectionModal({ isOpen: false, type: 'none' }); 
      setIsLoginModalOpen(true);
      return;
    }
    
    setSelectionModal({ isOpen: false, type: 'none' });
    setActiveForm(type as 'consignment' | 'chauffeur' | 'driver');
  };

  const { content } = useContent();

  const services: Service[] = [
    { 
      id: 'road',
      title: '일반 탁송', 
      desc: '신속하고 정확한 일반 탁송 서비스입니다.', 
      longDesc: '전문 기사가 고객님의 차량을 목적지까지 신속하고 안전하게 운송합니다.',
      icon: Truck, 
      color: 'bg-blue-50 text-blue-600',
      tag: '신속/정확',
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1000',
      steps: ['접수', '배정', '운송', '완료']
    },
    { 
      id: 'carrier',
      title: '캐리어 탁송', 
      desc: '신차 및 고가 차량을 위한 전용 캐리어 운송입니다.', 
      longDesc: '카캐리어를 이용하여 차량의 주행 없이 목적지까지 안전하게 운송합니다.',
      icon: Car, 
      color: 'bg-orange-50 text-orange-600',
      tag: '프리미엄',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1000',
      steps: ['접수', '상차', '운송', '하차']
    },
    { 
      id: 'road_direct',
      title: '로드 탁송', 
      desc: '베테랑 기사가 직접 운행하는 합리적인 서비스.', 
      longDesc: '숙련된 전문 탁송 기사가 차량을 직접 주행하여 전국 어디든 달려갑니다.',
      icon: ShieldCheck, 
      color: 'bg-purple-50 text-purple-600',
      tag: '가성비/베테랑',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000',
      steps: ['접수', '검수', '주행', '인도']
    },
    { 
      id: 'corporate',
      title: '법인 탁송', 
      desc: '품격 있는 비즈니스 파트너 전용 탁송 서비스.', 
      longDesc: '법인 고객님을 위한 맞춤형 관리와 정산 시스템을 제공하는 격조 높은 서비스입니다.',
      icon: UserCheck, 
      color: 'bg-cyan-50 text-cyan-600',
      tag: 'B2B/정기관리',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000',
      steps: ['계약', '배정', '운송', '월말정산']
    },
    { 
      id: 'today',
      title: '당일 탁송', 
      desc: '오늘 바로 도착하는 번개같은 서비스.', 
      longDesc: '접수 즉시 배차되어 당일 내에 목적지까지 도착을 보장하는 긴급 서비스입니다.',
      icon: Zap, 
      color: 'bg-yellow-50 text-yellow-600',
      tag: '초고속/당일완료',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000',
      steps: ['긴급접수', '즉시배차', '직통운송', '즉시완료']
    },
    { 
      id: 'reserved',
      title: '예약 탁송', 
      desc: '원하는 시간에 딱 맞춰 도착하는 계획적인 서비스.', 
      longDesc: '고객님이 설정한 정확한 스케줄에 맞춰 한 치의 오차 없이 진행되는 예약 전용 탁송입니다.',
      icon: Clock, 
      color: 'bg-rose-50 text-rose-600',
      tag: '정시성/스케줄링',
      image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=1000',
      steps: ['예약', '알림', '진행', '도착']
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar 
        scrolled={scrolled} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        setIsLoginModalOpen={setIsLoginModalOpen} 
      />
      
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {services.map((item, idx) => {
              const displayImage = content[`service_img_${item.id}`] || item.image;
              const displayTitle = content[`service_title_${item.id}`] || item.title;
              const displayDesc = content[`service_desc_${item.id}`] || item.desc;

              return (
                <div 
                  key={idx}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedService({ ...item, image: displayImage, title: displayTitle, desc: displayDesc })}
                >
                  <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center bg-slate-50 shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] group-hover:shadow-[inset_12px_12px_24px_#d1d9e6,inset_-12px_-12px_24px_#ffffff] transition-all duration-500 overflow-hidden border-[6px] border-white">
                    <img 
                      src={displayImage} 
                      alt={displayTitle}
                      className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-opacity"
                    />
                    <div className={`${item.color} p-5 rounded-full relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <item.icon size={40} strokeWidth={2.5} />
                    </div>
                  </div>
                  <h4 className="mt-6 text-xl md:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors drop-shadow-sm">
                    {displayTitle}
                  </h4>
                  <span className="mt-2 px-4 py-1.5 bg-blue-50 text-[11px] font-black text-blue-700 rounded-full shadow-sm border border-blue-100">
                    {item.tag}
                  </span>
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
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">
                    <EditableText contentKey="ins_title" defaultText="자동차탁송종합보험 100% 가입" />
                  </h3>
                  <p className="text-xl text-blue-100 font-bold">
                    <EditableText contentKey="ins_desc" defaultText="달리고 탁송은 전 기사님 보험 가입을 원칙으로 하며, 미가입 기사는 배차 시스템에서 원천 차단됩니다." />
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
        <section id="order-section" className="py-16 px-6 bg-slate-50 font-black">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
              {activeForm === 'driver' ? (
                <div className="p-10 md:p-16">
                  <div className="max-w-2xl mx-auto">
                    <DriverApplicationForm />
                  </div>
                </div>
              ) : (
                <OrderFormInside type={activeForm as 'consignment' | 'chauffeur'} />
              )}
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
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <ConsignmentPriceTable />
            <ChauffeurPriceTable />
          </div>

          <div id="취소규정" className="max-w-4xl mx-auto pt-12">
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-red-500 w-6 h-6" />
              <h4 className="text-xl font-black text-slate-900">취소 및 위약금 규정</h4>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-600 font-bold text-sm">
              <p className="mb-2">• 배차 후 5분 경과 시 위약금이 발생할 수 있습니다.</p>
              <p>• 자세한 내용은 고객센터(1844-1585)로 문의 바랍니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="driver-application" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 md:p-16">
              <div className="flex flex-col lg:flex-row gap-16">
                {/* 왼쪽: 모집 요강 및 혜택 */}
                <div className="flex-1 space-y-10">
                  <div>
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200">
                      <UserPlus size={32} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                      <span className="text-blue-600">
                        <EditableText contentKey="driver_sub" defaultText="★달리고 대리/탁송 전문★" />
                      </span><br />
                      <EditableText contentKey="driver_title" defaultText="함께 성장할 기사님을 모집합니다" />
                    </h3>
                    <p className="text-lg text-slate-500 font-bold leading-relaxed">
                      <EditableText contentKey="driver_desc" defaultText="업계 최고의 대우와 압도적인 오더량을 자랑하는 달리고에서 베테랑 기사님들의 새로운 시작을 전폭적으로 지원합니다." />
                    </p>
                  </div>

                  {/* 핵심 혜택 그리드 */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { title: '가입 축하금 20만원', desc: '소속사 변경 등록 시 보조 (1년 유지 조건)', icon: Coins, color: 'text-orange-500', bg: 'bg-orange-50' },
                      { title: '면책금/과태료 50%', desc: '사고 면책금 및 과태료/범칙금 50% 지원', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
                      { title: '압도적 오더 보유', desc: '수도권 일 탁송 500콜 / 대리 1000콜 이상', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                      { title: '자사 전용 단톡방', desc: '수도권 전용 단톡방 운영 (예약콜 우선 공유)', icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-50' },
                      { title: '24시 상황실 운영', desc: '야간 당직자 상주, 사고 및 일반 문의 즉시 대응', icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { title: '보상 전문가 상담', desc: '보상과 출신 전문가의 사고 처리 및 법률 상담', icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all group">
                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <item.icon size={24} />
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 text-sm mb-1">{item.title}</h5>
                          <p className="text-xs text-slate-500 font-bold leading-tight">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 프로그램 안내 */}
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                    <h5 className="text-lg font-black mb-6 flex items-center gap-2">
                      <Settings className="text-blue-400" size={20} />
                      운용 프로그램 및 등급
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-blue-400 text-xs font-black mb-2 uppercase tracking-widest">로지 (D1, D2, D3)</p>
                        <p className="text-sm font-bold text-slate-300">상생, 힐링, 미래로<br />(1차 0등급 최상위)</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-xs font-black mb-2 uppercase tracking-widest">콜마너</p>
                        <p className="text-sm font-bold text-slate-300">0차 최상등급 보유</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-xs font-black mb-2 uppercase tracking-widest">아이콘</p>
                        <p className="text-sm font-bold text-slate-300">수도권 연합 특등급<br />(최상위 등급)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 보험료 안내 및 신청 폼 */}
                <div className="lg:w-[400px] space-y-8">
                  <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                    <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                      <CreditCard size={24} />
                      대리운전 보험료 안내
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3">무사고 3년 기준 (렌트특약 포함)</p>
                        <div className="space-y-2">
                          {[
                            { age: '30~49세', month: '66,000원', day: '2,200원' },
                            { age: '50~55세', month: '87,000원', day: '2,900원' },
                            { age: '56~60세', month: '112,000원', day: '3,800원' },
                            { age: '61~65세', month: '117,000원', day: '3,900원' },
                            { age: '66세 이상', month: '120,000원', day: '4,000원' },
                          ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                              <span className="font-bold opacity-80">{row.age}</span>
                              <span className="font-black">{row.month} <span className="text-[10px] opacity-60 ml-1">(일 {row.day})</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3">무사고 3년 기준 (렌트 제외)</p>
                        <div className="space-y-2">
                          {[
                            { age: '30~40세', month: '53,750원', day: '1,800원' },
                            { age: '41~49세', month: '59,500원', day: '2,000원' },
                            { age: '50~55세', month: '90,833원', day: '3,000원' },
                            { age: '56~65세', month: '112,500원', day: '3,750원' },
                          ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                              <span className="font-bold opacity-80">{row.age}</span>
                              <span className="font-black">{row.month} <span className="text-[10px] opacity-60 ml-1">(일 {row.day})</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 text-[10px] font-bold text-blue-100 leading-relaxed">
                      ※ 사고 유무에 따라 보험료는 인상될 수 있습니다.<br />
                      ※ 저렴한 보험료 및 보험료 일비 처리 가능합니다.
                    </p>
                  </div>

                  <div id="driver-form-target" className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 scroll-mt-24">
                    <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                      <PhoneCall size={20} className="text-blue-600" />
                      간편 가입 문의
                    </h4>
                    <DriverApplicationForm />
                    <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                      <p className="text-xs font-bold text-slate-500 mb-4">문자로 바로 지원하기 (추천)</p>
                      <a 
                        href="sms:010-4868-5893?body=면허증사진,통신사,희망보험종류(대리/탁송/껀바이껀) 적어서 보내주세요."
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg"
                      >
                        <MessageCircle size={18} /> 010-4868-5893
                      </a>
                      <p className="mt-4 text-[10px] text-slate-400 font-medium">
                        면허증, 통신사, 보험종류를 적어 보내주시면<br />확인 후 유선 안내 드립니다.
                      </p>
                    </div>
                  </div>
                </div>
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
              <LogoSymbol size={48} isWhite />
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
      
      <section id="자료실" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-black tracking-widest uppercase mb-4">Archive</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">자료실</h3>
            <p className="text-xl text-slate-600 font-bold">일류 전국 탁송: 완벽한 법적 보호를 위한 핵심 프로세스 설계서</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-12 text-slate-700 font-medium leading-relaxed">
            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
              <h4 className="text-2xl font-black text-slate-900 mb-6">1. 서론: 법적 분쟁의 필연성과 디지털 프로토콜의 전략적 가치</h4>
              <p className="mb-4">국내 자동차 탁송 시장은 플랫폼 경제의 확산과 비대면 거래 활성화에 힘입어 급격히 고도화되고 있습니다. 그러나 이러한 성장의 이면에는 운송 과정에서 발생하는 차량의 파손, 기계적 결함 등을 둘러싼 법적 갈등의 필연적 증가라는 그림자가 존재합니다. 상법상 운송인은 '선량한 관리자의 주의 의무(선관주의 의무)'를 부담하며, 사고 발생 시 자신의 무과실을 스스로 입증해야 하는 '입증 책임의 전환' 원칙(상법 제135조) 아래 놓이게 됩니다. 이러한 법적 환경에서, 체계적인 디지털 기록 프로토콜은 단순한 업무 절차를 넘어 운송사와 기사를 법적 분쟁으로부터 보호하는 가장 강력하고 핵심적인 자산이 됩니다.</p>
              <p className="mb-4">본 문서는 '일류전국탁송' 앱의 핵심 프로세스를 단계별로 정의하고, 각 절차가 어떻게 잠재적 법적 리스크를 원천적으로 차단하는지 구체적으로 설계하는 것을 목적으로 합니다. 기사 인증부터 차량의 출발 및 도착 상태 기록, 그리고 AI 기반의 최종 비교 보고서 생성에 이르는 전 과정을 통해, 어떠한 분쟁 상황에서도 완벽한 면책 근거를 확보하는 기술적·법률적 방어 체계를 구축하고자 합니다.</p>
              <p>이 모든 법적 보호 장치의 성공은 신뢰할 수 있는 기사를 식별하고 운송 책임을 명확히 할당하는 것에서 시작됩니다. 다음 장에서는 그 첫 단추인 기사 인증 및 오더 매칭 프로세스에 대해 상세히 기술하겠습니다.</p>
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 mb-6">2. 기사 인증 및 오더 매칭 프로세스</h4>
              <p className="mb-4">정확한 기사 신원 확인은 서비스 신뢰도의 기반이며, 모든 운송 과정의 책임 소재를 명확히 하는 첫 단계입니다. 본 섹션에서 설계하는 핸드폰 번호 기반의 개별 오더 매칭 시스템은 특정 운송 건에 대한 법적 책임을 특정 기사에게 귀속시키는 가장 명확하고 효율적인 수단으로서, 전체 법적 보호 프로토콜의 시작점이라는 전략적 중요성을 가집니다.</p>
              <p className="mb-4">'기사 핸드폰 뒷번호 4자리'를 이용한 인증 방식은 보안, 책임, 편의성 측면에서 다음과 같은 장점을 가집니다.</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>보안성: 특정 기사에게만 오더 정보를 할당하고 해당 기사만이 인증을 통해 오더를 수행할 수 있도록 제한함으로써, 민감한 운송 정보의 외부 유출 및 제3자에 의한 무단 운행 리스크를 원천적으로 차단합니다.</li>
                <li>책임 추적성: 출발부터 도착까지의 모든 디지털 기록이 특정 기사의 고유 식별 정보(핸드폰 번호)와 직접 연결됩니다. 이는 사고 발생 시 책임 소재를 규명하는 명확한 근거 자료가 되며, 해당 운송 업무에 있어 기사를 특정 ‘이행보조자(performance assistant)’로 법적으로 확립하여 책임의 연쇄를 명확히 하고 분쟁 발생 시의 모호함을 방지합니다.</li>
                <li>편의성: 기사는 별도의 복잡한 아이디나 비밀번호 입력 절차 없이, 자신에게 익숙한 핸드폰 번호 뒷자리만으로 신속하게 오더를 수락하고 업무를 개시할 수 있습니다. 이는 사용자 경험(UX)을 개선하여 업무 효율성을 높이는 효과를 가져옵니다.</li>
              </ul>
              <p>이처럼 안전하고 효율적으로 인증된 기사가 오더를 수락한 후, 가장 먼저 접하게 되는 것은 운송의 정확성을 담보하는 오더 정보 확인 단계입니다. 다음 섹션에서는 핵심 정보의 구성과 기능에 대해 살펴보겠습니다.</p>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
              <h4 className="text-2xl font-black text-slate-900 mb-6">3. 오더 수락 및 핵심 정보 확인</h4>
              <p className="mb-6">운송 업무의 효율성과 정확성은 출발지와 도착지에 대한 핵심 정보가 얼마나 명확하게 전달되는지에 달려있습니다. 특히 고객 연락처 및 주소 정보에 대한 즉각적인 접근성과 편의 기능은 불필요한 시간 낭비를 줄이고, 픽업 및 인도 과정에서의 조율 오류를 최소화하여 현장 업무의 생산성을 극대화하는 핵심 요소입니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-4 text-left">정보 항목</th>
                      <th className="p-4 text-left">표시 방식 및 기능</th>
                      <th className="p-4 text-left">기대 효과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 font-black">출발지 주소</td>
                      <td className="p-4">전체 주소 텍스트 표시.<br/>클릭 시 스마트폰의 기본 지도 앱으로 자동 연결.</td>
                      <td className="p-4">경로 설정 오류 방지 및 시간 단축</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">출발지 연락처</td>
                      <td className="p-4">연락처 번호 표시.<br/>클릭 시 통화 앱으로 자동 연결.</td>
                      <td className="p-4">신속한 픽업 조율 및 대기 시간 절약</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">도착지 주소</td>
                      <td className="p-4">전체 주소 텍스트 표시.<br/>클릭 시 스마트폰의 기본 지도 앱으로 자동 연결.</td>
                      <td className="p-4">오배송 방지 및 정확한 목적지 도착</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">도착지 연락처</td>
                      <td className="p-4">연락처 번호 표시.<br/>클릭 시 통화 앱으로 자동 연결.</td>
                      <td className="p-4">원활한 인계를 통한 고객 만족도 제고 및 분쟁 예방</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 mb-6">4. 출발 기록: 법적 증거 확보를 위한 '무적의 프로토콜'</h4>
              <p className="mb-4">본 출발 기록 단계는 향후 발생할 수 있는 모든 법적 분쟁에서 운송인의 무과실을 입증하는 가장 결정적인 프로토콜입니다. 상법 제135조는 운송인에게 운송물의 멸실, 훼손에 대한 입증 책임을 부과하고 있으며, 본 프로토콜은 이 책임을 기술적으로 완벽하게 해결하기 위해 설계되었습니다.</p>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h5 className="font-black text-lg mb-3">4.1. 14단계 정밀 사진 촬영 프로토콜 설계</h5>
                  <ul className="list-decimal pl-6 space-y-2">
                    <li>전체 뷰 (4장): 차량의 정면, 후면, 좌측, 우측 전체 모습을 각각 촬영하여 전반적인 상태를 기록합니다.</li>
                    <li>모서리 뷰 (4장): 차량의 네 모서리를 각각 45도 각도에서 촬영합니다.</li>
                    <li>핵심 부위 (4장): 분쟁이 가장 잦은 4개의 휠 상태를 각각 근접 촬영하여 기록합니다.</li>
                    <li>내부 상태 (2장): 출발 시점의 정확한 주행거리가 표시된 계기판과 연료 게이지를 촬영합니다.</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h5 className="font-black text-lg mb-3">4.2. 사고 유무 분기 로직 및 표준 상태 부호 적용</h5>
                  <p className="mb-3">표준 상태 부호(Standard Condition Codes) 적용:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>A</strong>: 흠집 (Scratch)</div>
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>U</strong>: 요철 (Dent)</div>
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>W</strong>: 판금/용접 (Welding)</div>
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>X</strong>: 교환 (Exchange)</div>
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>C</strong>: 부식 (Corrosion)</div>
                    <div className="p-3 bg-slate-50 rounded-xl text-sm"><strong>T</strong>: 손상 (Damage)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
              <h4 className="text-2xl font-black text-slate-900 mb-6">5. 운송 중 특이사항 관리: 주유비 협의 로직</h4>
              <p className="mb-4">운송 과정에서는 예측 불가능한 비용 문제가 발생할 수 있으며, 특히 연료 부족 상황은 즉각적인 대응을 요구합니다. 본 섹션의 주유비 협의 로직은 이러한 돌발 상황을 투명하고 신속하게 처리하여 기사와 상황실 간의 신뢰를 구축하고, 비용 정산과 관련된 잠재적 분쟁을 사전에 방지하는 것을 목적으로 합니다.</p>
              <ol className="list-decimal pl-6 space-y-4">
                <li><strong>상황 발생</strong>: 기사는 운행 중 차량의 연료 부족을 인지하는 즉시 앱을 통해 상황실에 보고합니다.</li>
                <li><strong>금액 협의</strong>: 상황실과 기사는 실시간 소통을 통해 예상 주유 필요량과 그에 따른 금액을 신속하게 협의합니다.</li>
                <li><strong>금액 선입력</strong>: 기사는 협의된 금액을 앱 내 '주유비 선입력 시스템'에 입력하고, 상황실은 이를 확인 후 원격으로 승인합니다.</li>
                <li><strong>증빙 제출</strong>: 주유를 마친 기사는 도착 기록 시, 주유 영수증을 타임스탬프 카메라로 촬영하여 최종 결제 금액과 함께 제출함으로써 정산 절차를 명확하게 완료합니다.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 mb-6">6. 도착 기록 및 최종 검수</h4>
              <p className="mb-4">도착 기록 프로세스는 운송의 성공적인 완료를 공식적으로 증명하고, 운송 중 차량 상태에 어떠한 변화도 없었음을 입증하는 최종 방어선입니다. 인도 바로 그 시점의 차량 상태에 대한 반박 불가능한 증거를 확보하는 것이 무엇보다 중요합니다.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>도착 사진</strong>: 출발 시와 동일한 구도와 각도에서 최소 4장의 차량 상태 사진을 타임스탬프 카메라로 촬영하여 제출합니다.</li>
                <li><strong>연료 칸수 기록</strong>: 최종 도착 시점의 연료 게이지 상태를 사진으로 촬영하여 입력합니다.</li>
                <li><strong>주유 증빙 제출</strong>: 운송 중 주유가 있었을 경우, 주유 영수증 사진과 최종 결제 금액을 입력하여 정산 절차를 마무리합니다.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
              <h4 className="text-2xl font-black text-slate-900 mb-6">7. 최종 출력: AI 비교 보고서 및 데이터 자동화</h4>
              <p className="mb-6">모든 기록 프로세스의 정점은 분산된 데이터를 가치 있는 정보로 변환하는 최종 출력 단계에 있습니다. AI 기술을 통해 객관적이고 강력한 법적 증거 문서로 자동 생성합니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-4 text-left">기능</th>
                      <th className="p-4 text-left">상세 설명</th>
                      <th className="p-4 text-left">법적 가치</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    <tr>
                      <td className="p-4 font-black">출발-도착 이미지 병렬 비교</td>
                      <td className="p-4">출발 시와 도착 시에 촬영된 동일 구도의 사진을 보고서 내에 나란히 배치합니다.</td>
                      <td className="p-4">운송 중 발생한 손상이 아님을 직관적으로 증명</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">타임스탬프 데이터 추출</td>
                      <td className="p-4">모든 사진에 기록된 촬영 시간 및 GPS 위치 정보를 자동으로 추출합니다.</td>
                      <td className="p-4">운송 시간 및 경로의 객관적 사실을 확정</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">계기판 데이터 변화 분석</td>
                      <td className="p-4">출발 및 도착 시의 주행거리와 연료량 데이터를 비교 분석합니다.</td>
                      <td className="p-4">계약 조건 준수 및 주유비 정산의 투명성 확보</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-black">자동화된 문서 생성</td>
                      <td className="p-4">모든 비교 데이터와 분석 결과를 포함한 최종 보고서를 PDF 형식으로 자동 생성합니다.</td>
                      <td className="p-4">분쟁 발생 시 즉각 제출 가능한 공식 증거 자료</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-black text-slate-900 mb-6">8. 결론: 기술 기반의 완벽한 책임 방어 체계 구축</h4>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h5 className="font-black text-blue-600 mb-2">입증 책임의 해결</h5>
                  <p className="text-sm">객관적이고 위변조 불가능한 시각적 데이터를 통해 무과실 입증 책임을 완벽하게 수행합니다.</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h5 className="font-black text-blue-600 mb-2">분쟁의 사전 예방</h5>
                  <p className="text-sm">명확한 면책 조항 고지와 상태 확인 절차를 통해 불필요한 사후 분쟁을 원천 차단합니다.</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h5 className="font-black text-blue-600 mb-2">운영 효율성 극대화</h5>
                  <p className="text-sm">모든 과정을 자동화하여 업무 부담을 줄이고 휴먼 에러를 최소화합니다.</p>
                </div>
              </div>
              <p className="mt-10 text-slate-500 font-bold italic">"일류전국탁송은 기술로 신뢰를 구축하고 모든 참여자를 법적으로 보호합니다."</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SelectionModal 
        isOpen={selectionModal.isOpen} 
        type={selectionModal.type}
        onClose={() => setSelectionModal({ isOpen: false, type: 'none' })}
        onSelectGuest={handleSelectGuest}
        onSelectMember={handleSelectMember}
      />
      {activeForm === 'none' && !selectionModal.isOpen && !isLoginModalOpen && (
        <>
          <FloatingPhoneButton />
          <Chatbot />
        </>
      )}
    </div>
  );
}
