import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User, Phone, MapPin, Mail, ShieldCheck, ArrowLeft, Save, Loader2, Key, Coins, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyPage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [points, setPoints] = useState(0);
  const [pointHistory, setPointHistory] = useState<PointLog[]>([]);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    subPassword: '', // Placeholder for "password" requested
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPoints(data.points || 0);
          setFormData({
            displayName: data.displayName || user.displayName || '',
            phone: data.phone || '',
            address: data.address || '',
            subPassword: data.subPassword || '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    const fetchPointHistory = () => {
      if (!user) return;
      const q = query(
        collection(db, 'point_logs'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs: PointLog[] = [];
        snapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() } as PointLog);
        });
        setPointHistory(logs);
      });
      return unsubscribe;
    };

    let unsubscribePoints: () => void;
    if (user) {
      fetchUserData();
      unsubscribePoints = fetchPointHistory();
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribePoints) unsubscribePoints();
    };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      alert('성공적으로 변경되었습니다!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 pt-32">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">회원 전용 메뉴</h2>
          <p className="text-slate-500 font-bold mb-8 leading-relaxed">마이페이지는 로그인 후 <br />이용하실 수 있습니다.</p>
          <button 
            onClick={login}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-32">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold">
            <ArrowLeft size={20} />
            메인으로
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">마이페이지</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-white flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black border-4 border-white/10 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user.displayName?.[0] || 'U'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{formData.displayName || '회원님'}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-slate-400 font-bold flex items-center gap-1">
                  <Mail size={14} /> {user.email}
                </p>
                <div className="h-4 w-[1px] bg-white/10" />
                <p className="text-blue-400 font-black flex items-center gap-1">
                  <Coins size={14} /> {points.toLocaleString()}P
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-12 pb-0">
            {/* Point Card */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Coins size={28} />
                </div>
                <div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-0.5">현재 가용 포인트</p>
                  <h3 className="text-3xl font-black text-slate-900">{points.toLocaleString()}P</h3>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <p className="text-[10px] text-slate-400 font-bold text-center md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 leading-relaxed">
                  회원가입/상담/이용 후 <br className="hidden md:block" /> 적립된 소집한 포인트입니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-4">
                  <ShieldCheck size={18} className="text-blue-500" /> 개인정보 수정
                </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-2 italic">아이디 (이메일)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4.5 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      value={user.email || ''} 
                      readOnly
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-400 outline-none cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-2 italic">이름 / 닉네임</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4.5 w-5 h-5 text-blue-500" />
                    <input 
                      type="text" 
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="이름을 입력해 주세요" 
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-black shadow-sm outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-2 italic">전화번호</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4.5 w-5 h-5 text-blue-500" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000" 
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-black shadow-sm outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-2 italic">기본 주소</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4.5 w-5 h-5 text-blue-500" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="주소를 입력해 주세요" 
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-black shadow-sm outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-2 italic">보조 비밀번호 (간편 인증용)</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-4.5 w-5 h-5 text-blue-500" />
                    <input 
                      type="password" 
                      name="subPassword"
                      value={formData.subPassword}
                      onChange={handleChange}
                      placeholder="수정 불가능 (상담원용)" 
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-black shadow-sm outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold ml-2">※ 구글 소셜 로그인은 구글 계정 비밀번호를 사용합니다. 위 칸은 내부 서비스 이용을 위한 보조 수단입니다.</p>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full pt-1 pb-1 flex items-center justify-center"
            >
              <div className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                변경 내용 저장
              </div>
            </button>
          </form>
        </div>

        {/* Point History Log */}
          <div className="bg-slate-50 border-t border-slate-100 p-10 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-4">
              <History size={18} className="text-blue-500" /> 포인트 이용 내역
            </h3>
            <div className="space-y-4">
              {pointHistory.map((log) => (
                <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-blue-200 transition-all shadow-sm">
                  <div className="space-y-1">
                    <p className="text-slate-900 font-black text-sm">{log.reason}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${log.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.amount >= 0 ? '+' : ''}{log.amount.toLocaleString()}P
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold italic">
                      잔액: {log.balanceAfter.toLocaleString()}P
                    </p>
                  </div>
                </div>
              ))}
              {pointHistory.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-bold">
                  포인트 내역이 아직 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50">
          <h4 className="flex items-center gap-2 text-slate-900 font-black mb-4 tracking-tighter">
            <ShieldCheck size={20} className="text-slate-400" /> 개인정보 처리 안내
          </h4>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            회원님의 소중한 정보는 서비스 제공(탁송, 대리운전 등) 및 상담을 위한 목적으로만 사용되며, 
            관계 법령에 따라 안전하게 관리됩니다. 정보가 유출되지 않도록 최선을 다하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
