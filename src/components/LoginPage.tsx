import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { Truck, User, Lock, Mail, ChevronRight, Loader2, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, register, user, resetPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      setError("비밀번호 재설정을 위해 이메일을 입력해주세요.");
      return;
    }
    const result = await resetPassword(email);
    if (result.success) {
      setError("비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.");
    } else {
      setError(result.error || "이메일 발송 중 오류가 발생했습니다.");
    }
  };

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          setLoading(false);
          return;
        }
        const result = await register(email, password);
        if (result.success) {
          setIsRegister(false);
          setConfirmPassword('');
          setError('회원가입이 완료되었습니다. 로그인해주세요.');
        } else {
          setError(result.error || '회원가입 중 오류가 발생했습니다.');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error || '구글 로그인 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 mb-6">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
            <span>{isRegister ? '회원가입' : '로그인'}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            <span>{isRegister ? '달리고 탁송의 새로운 회원이 되어보세요.' : '관리자 및 회원 서비스를 이용하시려면 로그인하세요.'}</span>
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${error.includes('완료') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"><span>이메일 주소</span></label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-900"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>비밀번호</span></label>
              {!isRegister && (
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest"
                >
                  <span>비밀번호를 잊으셨나요?</span>
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-bold text-slate-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"><span>비밀번호 확인</span></label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-bold text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isRegister ? '가입하기' : '로그인'}
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>

          {!isRegister && (
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-700 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 mt-4"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" referrerPolicy="no-referrer" />
              구글로 로그인
            </button>
          )}
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-slate-500 hover:text-blue-600 font-bold transition-colors"
          >
            <span>{isRegister ? '이미 계정이 있으신가요? 로그인하기' : '아직 회원이 아니신가요? 회원가입하기'}</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Admin: woogon0990@gmail.com / admin77881
          </p>
          <p className="text-[10px] text-blue-300 font-bold mt-1">
            * 처음 접속 시 '회원가입' 탭에서 위 계정을 생성해 주세요.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
