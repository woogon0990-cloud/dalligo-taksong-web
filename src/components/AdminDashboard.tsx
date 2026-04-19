import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, runTransaction, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { useContent } from '../ContentContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  LogOut, 
  CheckCircle2, 
  Trash2,
  ExternalLink,
  Edit3,
  Save,
  Eye,
  X,
  FileText,
  Printer,
  Lock,
  Image as ImageIcon,
  Upload,
  Home,
  ArrowLeft,
  Users,
  Coins,
  History,
  Plus,
  Minus
} from 'lucide-react';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  points: number;
  createdAt: string;
}

interface PointLog {
  id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
}

interface Order {
  id: string;
  type: 'consignment' | 'chauffeur';
  serviceType: string;
  customerPhone: string;
  carName: string;
  carNumber: string;
  carModel: string;
  transmission: string;
  operationStatus: string;
  departureAddr: string;
  departureContact: string;
  arrivalAddr: string;
  arrivalContact: string;
  stopoverAddr: string;
  stopoverContact: string;
  hasStopover: boolean;
  estimatedFare: number;
  paymentMethod: string;
  memo: string;
  pickupTime: string;
  pickupAmPm?: '오전' | '오후';
  distance: number;
  isRoundTrip?: boolean;
  agreedToTerms?: boolean;
  agreedAt?: string;
  contractConfirmed?: boolean;
  confirmedAt?: string;
  contractSnapshot?: {
    id: string;
    version: string;
    confirmedBy: string;
  };
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
}

interface Review {
  id: string;
  name: string;
  service: string;
  content: string;
  date: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, logout, isAdmin: isGoogleAdmin } = useAuth();
  const { content, updateContent, isEditing, setIsEditing } = useContent();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'cms' | 'images' | 'reviews' | 'users'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUserLogs, setSelectedUserLogs] = useState<string | null>(null);
  
  // Point adjustment state
  const [pointAdjustModal, setPointAdjustModal] = useState<{ userId: string, email: string } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'daligoadmin123'; // 나중에 여기서 수정 가능

  // Image Management State
  const [pendingImages, setPendingImages] = useState<Record<string, string>>({});
  const [isSavingImage, setIsSavingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isGoogleAdmin) return;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      snapshot.forEach((doc) => {
        newOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(newOrders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [isAuthenticated, isGoogleAdmin]);

  useEffect(() => {
    if (!isAuthenticated && !isGoogleAdmin) return;

    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReviews: Review[] = [];
      snapshot.forEach((doc) => {
        newReviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(newReviews);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return () => unsubscribe();
  }, [isAuthenticated, isGoogleAdmin]);

  useEffect(() => {
    if (!isAuthenticated && !isGoogleAdmin) return;

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newUsers: UserProfile[] = [];
      snapshot.forEach((doc) => {
        newUsers.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(newUsers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, [isAuthenticated, isGoogleAdmin]);

  useEffect(() => {
    if (!isAuthenticated && !isGoogleAdmin || !selectedUserLogs) {
      setPointLogs([]);
      return;
    }

    const q = query(
      collection(db, 'point_logs'), 
      where('userId', '==', selectedUserLogs),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs: PointLog[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as PointLog);
      });
      setPointLogs(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'point_logs');
    });

    return () => unsubscribe();
  }, [isAuthenticated, isGoogleAdmin, selectedUserLogs]);

  const handleAdjustPoints = async () => {
    if (!pointAdjustModal || adjustAmount === 0 || !adjustReason) return;

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', pointAdjustModal.userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) throw new Error("User not found");
        
        const currentPoints = userDoc.data().points || 0;
        const newPoints = currentPoints + adjustAmount;
        
        transaction.update(userRef, { points: newPoints });

        const logRef = doc(collection(db, 'point_logs'));
        transaction.set(logRef, {
          userId: pointAdjustModal.userId,
          amount: adjustAmount,
          balanceAfter: newPoints,
          reason: adjustReason,
          createdAt: new Date().toISOString()
        });
      });

      alert('포인트가 성공적으로 조정되었습니다.');
      setPointAdjustModal(null);
      setAdjustAmount(0);
      setAdjustReason('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${pointAdjustModal.userId}/points`);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  const handleImageSave = async (serviceId: string) => {
    const base64 = pendingImages[serviceId];
    if (!base64) return;

    setIsSavingImage(serviceId);
    try {
      await updateContent(`service_img_${serviceId}`, base64, 'image');
      setPendingImages(prev => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
      alert('이미지가 저장되었습니다.');
    } catch (error) {
      console.error('Image save failed:', error);
    } finally {
      setIsSavingImage(null);
    }
  };

  if (!isAuthenticated && !isGoogleAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">관리자 인증</h2>
          <p className="text-slate-400 mb-8 font-bold">비밀번호를 입력하여 접속하세요.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 px-6 text-white font-black outline-none focus:border-blue-500 transition-all"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
            >
              접속하기
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-slate-500 hover:text-white font-bold transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter italic text-white">Admin Panel</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button 
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-bold text-xs"
              title="이전으로"
            >
              <ArrowLeft size={16} /> 뒤로
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-bold text-xs"
              title="홈페이지로"
            >
              <Home size={16} /> 홈
            </button>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <ClipboardList size={20} /> 접수 현황
            </button>
            <button 
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'cms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Edit3 size={20} /> CMS 관리
            </button>
            <button 
              onClick={() => setActiveTab('images')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'images' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <ImageIcon size={20} /> 이미지 관리
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <FileText size={20} /> 후기 관리
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Users size={20} /> 회원/포인트 관리
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-blue-500 font-black">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-red-900/20 hover:text-red-500 text-slate-400 rounded-xl font-bold transition-all"
          >
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {activeTab === 'orders' ? '실시간 접수 현황' : activeTab === 'cms' ? '홈페이지 콘텐츠 관리' : activeTab === 'images' ? '서비스 이미지 관리' : activeTab === 'reviews' ? '고객 후기 관리' : '회원 및 포인트 관리'}
            </h1>
            <p className="text-slate-500 font-bold mt-2">
              {activeTab === 'orders' ? '고객님들의 소중한 신청 건을 실시간으로 관리합니다.' : activeTab === 'cms' ? '홈페이지의 텍스트와 이미지를 실시간으로 수정할 수 있습니다.' : activeTab === 'images' ? '메인 페이지 서비스 카드의 이미지를 직접 업로드하여 변경할 수 있습니다.' : activeTab === 'reviews' ? '홈페이지에 표시될 소중한 고객 리뷰를 관리합니다.' : '가입된 회원 리스트와 포인트 자산을 통합 관리합니다.'}
            </p>
          </div>
          
          {activeTab === 'cms' && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {isEditing ? <><Save size={20} /> 편집 모드 종료</> : <><Edit3 size={20} /> 편집 모드 시작</>}
            </button>
          )}
        </header>

        {activeTab === 'orders' ? (
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            {/* ... existing table code ... */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-800">
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">ID / 일시</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">구분</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">의뢰인</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">출발 ↔ 도착</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">요금</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">상태</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="font-black text-white text-sm">#{order.id.slice(-6).toUpperCase()}</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">
                          {new Date(order.createdAt).toLocaleString('ko-KR')}
                        </div>
                        {order.contractConfirmed && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/30 text-green-400 text-[9px] font-black rounded border border-green-800/50 uppercase">
                            <CheckCircle2 size={10} /> 계약서 확정됨
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.type === 'consignment' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-orange-900/30 text-orange-400 border border-orange-800/50'}`}>
                          {order.type === 'consignment' ? '탁송' : '대리'}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-300">{order.customerPhone}</div>
                        <div className="text-xs text-slate-500">{order.carName}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <span className="text-blue-500">출</span> {order.departureAddr}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mt-1">
                          <span className="text-orange-500">도</span> {order.arrivalAddr}
                        </div>
                        {order.hasStopover && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-900/30 text-purple-400 text-[10px] font-black rounded border border-purple-800/50">
                            <CheckCircle2 size={10} /> 경유지 포함
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-black text-white">{order.estimatedFare.toLocaleString()}원</div>
                      </td>
                      <td className="px-6 py-6">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`bg-slate-800 border-none rounded-lg px-3 py-2 text-xs font-black outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                            order.status === 'pending' ? 'text-yellow-500' : 
                            order.status === 'assigned' ? 'text-blue-500' : 'text-green-500'
                          }`}
                        >
                          <option value="pending">접수 대기</option>
                          <option value="assigned">기사 배정</option>
                          <option value="completed">완료</option>
                        </select>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="상세보기"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="삭제"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center text-slate-500 font-bold">
                        접수된 신청 건이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'cms' ? (
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-8">
              <Edit3 size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">CMS 편집 모드 안내</h2>
            <p className="text-slate-400 font-bold max-w-lg mx-auto leading-relaxed mb-10">
              상단의 '편집 모드 시작' 버튼을 누른 후, 홈페이지로 이동하여 수정하고 싶은 텍스트를 클릭하세요. 
              수정 후 포커스를 해제하면 실시간으로 DB에 저장됩니다.
            </p>
            <button 
              onClick={() => window.open('/', '_blank')}
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto shadow-xl shadow-blue-600/20"
            >
              홈페이지 바로가기 <ExternalLink size={18} />
            </button>
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="space-y-8">
            {/* ... Review code ... */}
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-800">
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">사용자 정보</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">권한</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">보유 포인트</th>
                    <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="font-black text-white text-sm">{u.displayName || '이름 없음'}</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">{u.email}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-red-900/30 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="font-black text-blue-500 text-lg">{(u.points || 0).toLocaleString()}P</div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setPointAdjustModal({ userId: u.uid, email: u.email })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-black"
                          >
                            <Coins size={14} /> 조정
                          </button>
                          <button 
                            onClick={() => setSelectedUserLogs(u.uid)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all text-xs font-black"
                          >
                            <History size={14} /> 내역
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'road', label: '일반 탁송' },
              { id: 'carrier', label: '캐리어 탁송' },
              { id: 'selfloader', label: '셀프로더 탁송' },
              { id: 'jeju', label: '제주도 탁송' },
              { id: 'inspection', label: '중고차 검수 탁송' },
              { id: 'scrap', label: '폐차/수출 탁송' }
            ].map((service) => {
              const currentImg = pendingImages[service.id] || content[`service_img_${service.id}`];
              const isPending = !!pendingImages[service.id];
              return (
                <div key={service.id} className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
                  <div className="relative h-48 bg-slate-800">
                    {currentImg ? (
                      <img src={currentImg} alt={service.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    {isPending && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
                        저장 대기 중
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-black text-white">{service.label}</h3>
                    <p className="text-xs text-slate-500 font-bold">권장 사이즈: 1920x1080 (16:9)</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center justify-center gap-2 py-4 bg-slate-800 text-slate-300 font-black rounded-2xl hover:bg-slate-700 transition-all cursor-pointer">
                        <Upload size={18} /> 파일 선택
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              setPendingImages(prev => ({ ...prev, [service.id]: base64 }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      <button 
                        onClick={() => handleImageSave(service.id)}
                        disabled={!isPending || isSavingImage === service.id}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all shadow-lg ${
                          isPending 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Save size={18} /> {isSavingImage === service.id ? '저장 중...' : '저장하기'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-slate-800 p-8 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={24} />
                <h3 className="text-2xl font-black text-white">신청 상세 내역</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">기본 정보</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">주문번호</span>
                      <span className="text-white font-black">#{selectedOrder.id.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">서비스 구분</span>
                      <span className="text-blue-400 font-black">{selectedOrder.type === 'consignment' ? '탁송' : '대리'} ({selectedOrder.serviceType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">신청 일시</span>
                      <span className="text-white font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">픽업 희망 일시</span>
                      <span className="text-orange-400 font-black">
                        {selectedOrder.pickupTime || '미지정'} {selectedOrder.pickupAmPm || ''}
                      </span>
                    </div>
                    {selectedOrder.serviceType === '제주도' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">노선 구분</span>
                        <span className="text-blue-400 font-black">{selectedOrder.isRoundTrip ? '왕복' : '편도'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 의뢰인 및 차량 정보 */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">의뢰인 및 차량</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">연락처</span>
                      <span className="text-white font-black">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">차량명</span>
                      <span className="text-white font-black">{selectedOrder.carName || selectedOrder.carModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">차량번호</span>
                      <span className="text-white font-black">{selectedOrder.carNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">변속기</span>
                      <span className="text-white font-black">{selectedOrder.transmission}</span>
                    </div>
                  </div>
                </div>

                {/* 경로 정보 */}
                <div className="space-y-4 col-span-full">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">경로 및 요금</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-black shrink-0">출발</span>
                        <div>
                          <p className="text-white font-black text-sm">{selectedOrder.departureAddr}</p>
                          <p className="text-slate-500 text-xs font-bold">연락처: {selectedOrder.departureContact || '의뢰인과 동일'}</p>
                        </div>
                      </div>
                      {selectedOrder.hasStopover && (
                        <div className="flex gap-3">
                          <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-500 flex items-center justify-center text-[10px] font-black shrink-0">경유</span>
                          <div>
                            <p className="text-white font-black text-sm">{selectedOrder.stopoverAddr}</p>
                            <p className="text-slate-500 text-xs font-bold">연락처: {selectedOrder.stopoverContact || '의뢰인과 동일'}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <span className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-500 flex items-center justify-center text-[10px] font-black shrink-0">도착</span>
                        <div>
                          <p className="text-white font-black text-sm">{selectedOrder.arrivalAddr}</p>
                          <p className="text-slate-500 text-xs font-bold">연락처: {selectedOrder.arrivalContact || '의뢰인과 동일'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 border-l border-slate-700 pl-6">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">이동 거리</span>
                        <span className="text-white font-black">{selectedOrder.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">결제 방법</span>
                        <span className="text-white font-black">{selectedOrder.paymentMethod === 'prepaid' ? '선불' : '후불'}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-slate-700">
                        <span className="text-slate-500 font-black">확정 요금</span>
                        <span className="text-blue-500 font-black text-xl">{selectedOrder.estimatedFare.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 법적 동의 정보 */}
                <div className="space-y-4 col-span-full">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">법적 동의 및 계약 기록</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-6 rounded-2xl flex items-center justify-between border border-blue-900/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-white font-black">이용약관 동의</p>
                          <p className="text-slate-500 text-[10px] font-bold">신청 시점 동의 완료</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-black text-xs">Agreed</p>
                        <p className="text-slate-500 text-[10px] font-bold">{selectedOrder.agreedAt ? new Date(selectedOrder.agreedAt).toLocaleString() : '기록 없음'}</p>
                      </div>
                    </div>

                    <div className={`bg-slate-800/50 p-6 rounded-2xl flex items-center justify-between border ${selectedOrder.contractConfirmed ? 'border-green-900/30' : 'border-slate-800'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOrder.contractConfirmed ? 'bg-green-600/20 text-green-500' : 'bg-slate-700 text-slate-500'}`}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-white font-black">계약서 최종 확정</p>
                          <p className="text-slate-500 text-[10px] font-bold">{selectedOrder.contractConfirmed ? '팝업 확인 후 최종 동의' : '미확정 상태'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-xs ${selectedOrder.contractConfirmed ? 'text-green-400' : 'text-slate-500'}`}>
                          {selectedOrder.contractConfirmed ? 'Confirmed' : 'Pending'}
                        </p>
                        <p className="text-slate-500 text-[10px] font-bold">
                          {selectedOrder.confirmedAt ? new Date(selectedOrder.confirmedAt).toLocaleString() : '-'}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.contractConfirmed && selectedOrder.contractSnapshot && (
                      <div className="col-span-full bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex flex-col gap-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Lock size={10} /> Defense Evidence (Immutable Log)
                        </p>
                        <p className="text-xs text-slate-400 font-bold">
                          계약번호: <span className="text-slate-200">{selectedOrder.contractSnapshot.id}</span> | 
                          동의자: <span className="text-slate-200">{selectedOrder.contractSnapshot.confirmedBy}</span> | 
                          버전: <span className="text-slate-200">{selectedOrder.contractSnapshot.version}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 요청 사항 */}
                <div className="space-y-4 col-span-full">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">요청 사항</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl">
                    <p className="text-slate-300 font-bold whitespace-pre-wrap leading-relaxed">
                      {selectedOrder.memo || '전달된 요청 사항이 없습니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-800 border-t border-slate-700 flex gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-4 bg-slate-700 text-white font-black rounded-2xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={20} /> 내역 인쇄 / PDF 저장
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Point Adjustment Modal */}
      {pointAdjustModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-slate-800 p-8 flex justify-between items-center">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Coins className="text-blue-500" /> 포인트 수동 조정
              </h3>
              <button onClick={() => setPointAdjustModal(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">대상 사용자</p>
                <p className="text-white font-black">{pointAdjustModal.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 italic">변경 수치 (증가는 양수, 차감은 음수)</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAdjustAmount(prev => prev - 1000)}
                    className="p-3 bg-slate-800 text-red-500 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <input 
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl py-4 px-6 text-white font-black text-center outline-none focus:border-blue-500 transition-all font-mono"
                  />
                  <button 
                    onClick={() => setAdjustAmount(prev => prev + 1000)}
                    className="p-3 bg-slate-800 text-green-500 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 ml-2 italic">조정 사유</label>
                <input 
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="예: 프로모션 보너스 지급"
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl py-4 px-6 text-white font-black outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <button 
                onClick={handleAdjustPoints}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                조정 완료하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Point History Log Modal */}
      {selectedUserLogs && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-slate-800 p-8 flex justify-between items-center">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <History className="text-blue-500" /> 포인트 상세 내역
              </h3>
              <button onClick={() => setSelectedUserLogs(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {pointLogs.map((log) => (
                  <div key={log.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-all">
                    <div className="space-y-1">
                      <p className="text-white font-black text-sm">{log.reason}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${log.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {log.amount >= 0 ? '+' : ''}{log.amount.toLocaleString()}P
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold italic">
                        잔액: {log.balanceAfter.toLocaleString()}P
                      </p>
                    </div>
                  </div>
                ))}
                {pointLogs.length === 0 && (
                  <div className="py-20 text-center text-slate-500 font-bold">
                    적립 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
