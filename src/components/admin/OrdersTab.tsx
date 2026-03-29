import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface Order {
  id: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: any;
  startAddress: string;
  endAddress: string;
  clientPhone: string;
  carModel: string;
  [key: string]: any;
}

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch from unified 'orders' collection
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (order: Order, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus as any } : o));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'orders', order.id));
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesSearch = 
      (order.clientPhone?.includes(searchTerm)) ||
      (order.startAddress?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.endAddress?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.carModel?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.type?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['신청일시', '구분', '출발지', '도착지', '연락처', '차종', '상태'];
    const rows = filteredOrders.map(o => [
      formatDate(o.createdAt),
      o.type,
      o.startAddress,
      o.endAddress,
      o.clientPhone,
      o.carModel,
      o.status === 'completed' ? '완료' : o.status === 'cancelled' ? '취소' : '대기중'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `접수내역_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">접수 내역 목록</h2>
            <p className="text-xs text-slate-400 font-bold">구글 시트 스타일의 실시간 접수 관리</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-pointer"
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기중</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>

          <button 
            onClick={() => { setRefreshing(true); fetchOrders(); }}
            className={`p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all ${refreshing ? 'animate-spin' : ''}`}
            title="새로고침"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>

          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>엑셀 다운로드</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Style Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="w-12 px-2 py-3 text-[10px] font-black text-slate-400 text-center border-r border-slate-200">#</th>
                <th className="w-40 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">신청일시</th>
                <th className="w-24 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">구분</th>
                <th className="px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">출발지</th>
                <th className="px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">도착지</th>
                <th className="w-36 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">연락처</th>
                <th className="w-40 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">차종</th>
                <th className="w-28 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">상태</th>
                <th className="w-20 px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-sm font-bold">데이터 로딩 중...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center">
                    <p className="text-slate-400 text-sm font-bold">신청 내역이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-2 py-2 text-[10px] font-bold text-slate-400 text-center border-r border-slate-100">{index + 1}</td>
                    <td className="px-4 py-2 text-xs font-medium text-slate-600 border-r border-slate-100">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-2 border-r border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        order.type === '탁송' ? 'bg-blue-100 text-blue-700' : 
                        order.type === '대리운전' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs font-bold text-slate-700 truncate border-r border-slate-100" title={order.startAddress}>{order.startAddress}</td>
                    <td className="px-4 py-2 text-xs font-bold text-slate-700 truncate border-r border-slate-100" title={order.endAddress}>{order.endAddress}</td>
                    <td className="px-4 py-2 text-xs font-black text-blue-600 border-r border-slate-100">{order.clientPhone}</td>
                    <td className="px-4 py-2 text-xs font-medium text-slate-600 truncate border-r border-slate-100" title={order.carModel}>{order.carModel}</td>
                    <td className="px-4 py-2 border-r border-slate-100">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order, e.target.value)}
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border-none outline-none cursor-pointer ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <option value="pending">대기중</option>
                        <option value="completed">완료</option>
                        <option value="cancelled">취소</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button 
                        onClick={() => handleDelete(order)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Spreadsheet Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400">총 {filteredOrders.length}개의 항목이 표시됨</p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-500">대기중</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-500">완료</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-500">취소</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
