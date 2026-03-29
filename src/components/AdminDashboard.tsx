import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useContent } from '../AuthContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Type, 
  Bell, 
  Save, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  ChevronRight,
  X,
  Check,
  UserCog,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  CreditCard,
  Globe,
  Info,
  ArrowRight,
  Zap,
  ClipboardList
} from 'lucide-react';

// Import Tab Components
import ContentTab from './admin/ContentTab';
import PricingTab from './admin/PricingTab';
import ContactTab from './admin/ContactTab';
import ImagesTab from './admin/ImagesTab';
import PopupsTab from './admin/PopupsTab';
import AccountTab from './admin/AccountTab';
import OrdersTab from './admin/OrdersTab';

interface AdminDashboardProps {
  onBack?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { content, updateContent, resetContent, addPopup, deletePopup, togglePopup, forceFixContent, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'pricing' | 'contact' | 'popups' | 'account' | 'orders'>('orders');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Local state for form management to prevent UI lag
  const [localContent, setLocalContent] = useState(content);
  const [isDirty, setIsDirty] = useState(false);

  // Sync local content with global content when it changes (and not dirty)
  useEffect(() => {
    if (!isDirty && content) {
      setLocalContent(content);
    }
  }, [content, isDirty]);

  const handleSave = async () => {
    console.log("AdminDashboard: Saving content...", localContent);
    setSaveStatus('saving');
    setError(null);
    try {
      await updateContent(localContent);
      console.log("AdminDashboard: Save successful");
      setIsDirty(false);
      setSaveStatus('saved');
      
      // Show success for 2 seconds then reset status
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // Force a reload after a short delay to ensure Firestore has updated and the user sees the change
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveStatus('idle');
      
      // Parse error message if it's JSON from handleFirestoreError
      let errorMsg = "저장 중 오류가 발생했습니다.";
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error && parsed.error.toLowerCase().includes('permission')) {
          errorMsg = "저장 권한이 없습니다. 관리자 계정인지 확인해주세요.";
        }
      } catch (e) {
        // Not JSON or other error
      }
      setError(errorMsg);
    }
  };

  const handleForceFix = async () => {
    setSaveStatus('saving');
    setError(null);
    try {
      if (forceFixContent) {
        await forceFixContent();
        setSaveStatus('saved');
        // Force a reload after a short delay to ensure Firestore has updated and the user sees the change
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error in force fix:", err);
      setError("강제 복구 중 오류가 발생했습니다.");
      setSaveStatus('idle');
    }
  };

  const handleReset = async () => {
    try {
      await resetContent();
      setIsDirty(false);
      setSaveStatus('idle');
    } catch (error) {
      console.error("Reset error:", error);
    }
  };

  const handleFileUpload = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const updateLocalField = React.useCallback((fields: Partial<typeof content>) => {
    setIsDirty(true);
    setLocalContent(prev => {
      if (!prev) return prev;
      return { ...prev, ...fields };
    });
  }, []);

  // Stabilize tab rendering to prevent 'removeChild' errors
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab key="orders" />;
      case 'content':
        return (
          <ContentTab 
            key="content"
            localContent={localContent} 
            updateLocalField={updateLocalField} 
            handleFileUpload={handleFileUpload} 
            setIsDirty={setIsDirty}
          />
        );
      case 'images':
        return (
          <ImagesTab 
            key="images"
            localContent={localContent} 
            updateLocalField={updateLocalField} 
            handleFileUpload={handleFileUpload}
            content={content}
            setIsDirty={setIsDirty}
          />
        );
      case 'pricing':
        return (
          <PricingTab 
            key="pricing"
            localContent={localContent} 
            updateLocalField={updateLocalField} 
            setIsDirty={setIsDirty}
          />
        );
      case 'contact':
        return (
          <ContactTab 
            key="contact"
            localContent={localContent} 
            updateLocalField={updateLocalField} 
            setIsDirty={setIsDirty}
          />
        );
      case 'popups':
        return (
          <PopupsTab 
            key="popups"
            content={content}
            addPopup={addPopup}
            deletePopup={deletePopup}
            togglePopup={togglePopup}
            handleFileUpload={handleFileUpload}
          />
        );
      case 'account':
        return (
          <AccountTab 
            key="account"
            user={user}
            setSaveStatus={setSaveStatus}
          />
        );
      default:
        return null;
    }
  }, [activeTab, localContent, updateLocalField, handleFileUpload, setIsDirty, content, addPopup, deletePopup, togglePopup, user, setSaveStatus]);

  if (isLoading || !localContent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 bottom-0 z-40">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-blue-900 tracking-tighter" translate="no">달리고 CMS</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1"><span>Admin Dashboard</span></p>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
              title="홈으로 돌아가기"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'orders', name: '신청 내역 확인', icon: <ClipboardList className="w-5 h-5" /> },
            { id: 'content', name: '메인 텍스트 관리', icon: <Type className="w-5 h-5" /> },
            { id: 'images', name: '배너/이미지 관리', icon: <ImageIcon className="w-5 h-5" /> },
            { id: 'pricing', name: '요금표 관리', icon: <CreditCard className="w-5 h-5" /> },
            { id: 'contact', name: '회사 정보 관리', icon: <Info className="w-5 h-5" /> },
            { id: 'popups', name: '팝업창 관리', icon: <Bell className="w-5 h-5" /> },
            { id: 'account', name: '계정 설정', icon: <UserCog className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1"><span>Admin Info</span></p>
            <p className="text-xs font-bold text-blue-900 truncate"><span>{user?.email}</span></p>
            <p className="text-[10px] text-blue-400 mt-1"><span>Role: {user?.role}</span></p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all mb-3"
          >
            {saveStatus === 'saving' ? <span>저장 중...</span> : saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{saveStatus === 'saved' ? '저장 완료' : '변경사항 저장'}</span>
          </button>

          <button 
            onClick={handleForceFix}
            disabled={saveStatus === 'saving'}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>{saveStatus === 'saving' ? '복구 중...' : '오타 수정 및 강제 복구'}</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleReset}
              className="bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
            >
              <X className="w-3 h-3" /> <span>리셋</span>
            </button>
            <button 
              onClick={handleForceFix}
              disabled={saveStatus === 'saving'}
              className="bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              <Info className="w-3 h-3" /> <span>강제 복구</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen overflow-y-auto p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              <span>
                {activeTab === 'orders' ? '신청 내역 확인' :
                 activeTab === 'content' ? '메인 텍스트 관리' : 
                 activeTab === 'images' ? '배너/이미지 관리' : 
                 activeTab === 'pricing' ? '요금표 관리' : 
                 activeTab === 'contact' ? '회사 정보 관리' : 
                 activeTab === 'popups' ? '팝업창 관리' : '계정 설정'}
              </span>
            </h1>
            <p className="text-slate-500 font-medium mt-2"><span>웹사이트의 모든 정보를 실시간으로 수정하고 관리하세요.</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all shadow-lg ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 text-white shadow-green-600/20' 
                  : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
              }`}
            >
              {saveStatus === 'saving' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : saveStatus === 'saved' ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saveStatus === 'saving' ? '저장 중...' : saveStatus === 'saved' ? '저장 완료' : '변경사항 저장'}</span>
            </button>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>달리고있어요.kr</span>
            </a>
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>홈으로 돌아가기</span>
              </button>
            )}
          </div>
        </header>

        {/* Status & Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <X className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900">저장 실패</p>
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {saveStatus === 'saved' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">저장 완료</p>
              <p className="text-xs text-green-600 font-medium">변경사항이 성공적으로 반영되었습니다. 잠시 후 페이지가 새로고침됩니다.</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
