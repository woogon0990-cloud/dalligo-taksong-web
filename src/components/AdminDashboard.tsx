import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  Upload
} from 'lucide-react';

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
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, logout, isAdmin: isGoogleAdmin } = useAuth();
  const { content, updateContent, isEditing, setIsEditing } = useContent();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'cms' | 'images'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Password Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'daligoadmin123'; // 나중에 여기서 수정 가능

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
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic text-white">Admin Panel</span>
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
              {activeTab === 'orders' ? '실시간 접수 현황' : activeTab === 'cms' ? '홈페이지 콘텐츠 관리' : '서비스 이미지 관리'}
            </h1>
            <p className="text-slate-500 font-bold mt-2">
              {activeTab === 'orders' ? '고객님들의 소중한 신청 건을 실시간으로 관리합니다.' : activeTab === 'cms' ? '홈페이지의 텍스트와 이미지를 실시간으로 수정할 수 있습니다.' : '메인 페이지 서비스 카드의 이미지를 직접 업로드하여 변경할 수 있습니다.'}
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
              const currentImg = content[`service_img_${service.id}`];
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
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-black text-white">{service.label}</h3>
                    <p className="text-xs text-slate-500 font-bold">권장 사이즈: 1920x1080 (16:9)</p>
                    <label className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20">
                      <Upload size={18} /> 이미지 변경
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            await updateContent(`service_img_${service.id}`, base64, 'image');
                            alert(`${service.label} 이미지가 변경되었습니다.`);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
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
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">법적 동의 기록</h4>
                  <div className="bg-slate-800/50 p-6 rounded-2xl flex items-center justify-between border border-blue-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="text-white font-black">서비스 이용 및 면책 조항 동의</p>
                        <p className="text-slate-500 text-xs font-bold">고객이 신청 시 모든 약관에 직접 동의함</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-black">동의 완료 (True)</p>
                      <p className="text-slate-500 text-xs font-bold">{selectedOrder.agreedAt ? new Date(selectedOrder.agreedAt).toLocaleString() : '기록 없음'}</p>
                    </div>
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
    </div>
  );
}
