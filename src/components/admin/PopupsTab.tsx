import React, { useState } from 'react';
import { Plus, ToggleRight, ToggleLeft, Trash2 } from 'lucide-react';

interface PopupsTabProps {
  content: any;
  addPopup: (popup: any) => void;
  deletePopup: (id: string) => void;
  togglePopup: (id: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
}

const PopupsTab: React.FC<PopupsTabProps> = React.memo(({ content, addPopup, deletePopup, togglePopup, handleFileUpload }) => {
  const [newPopup, setNewPopup] = useState({ title: '', content: '', imageUrl: '', isActive: true });

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-8 rounded-3xl border-2 border-dashed border-blue-200 space-y-6">
        <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
          <Plus className="w-5 h-5" /> <span>새 팝업창 등록</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-blue-400 uppercase tracking-widest"><span>팝업 제목</span></label>
            <input 
              type="text" 
              placeholder="공지사항 제목"
              value={newPopup.title}
              onChange={(e) => setNewPopup({...newPopup, title: e.target.value})}
              className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-blue-400 uppercase tracking-widest"><span>이미지 설정 (선택)</span></label>
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="이미지 URL (https://...)"
                value={newPopup.imageUrl}
                onChange={(e) => setNewPopup({...newPopup, imageUrl: e.target.value})}
                className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-xl py-3 px-4 outline-none transition-all font-bold"
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (base64) => setNewPopup({...newPopup, imageUrl: base64}))}
                  className="hidden" 
                  id="file-popup-new"
                />
                <label 
                  htmlFor="file-popup-new"
                  className="flex items-center justify-center gap-2 w-full bg-white hover:bg-blue-50 text-blue-600 py-3 rounded-xl font-bold cursor-pointer transition-all border-2 border-dashed border-blue-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>파일 업로드</span>
                </label>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-blue-400 uppercase tracking-widest"><span>팝업 내용</span></label>
            <textarea 
              rows={3}
              placeholder="팝업에 표시될 상세 내용을 입력하세요."
              value={newPopup.content}
              onChange={(e) => setNewPopup({...newPopup, content: e.target.value})}
              className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
        </div>
        <button 
          onClick={() => {
            if (!newPopup.title) return;
            addPopup(newPopup);
            setNewPopup({ title: '', content: '', imageUrl: '', isActive: true });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black transition-all shadow-lg shadow-blue-600/20"
        >
          <span>등록하기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.popups.map((popup: any) => (
          <div key={popup.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900"><span>{popup.title}</span></h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1"><span>ID: {popup.id}</span></p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => togglePopup(popup.id)}
                  className={`p-2 rounded-lg transition-all ${popup.isActive ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}`}
                >
                  {popup.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button 
                  onClick={() => deletePopup(popup.id)}
                  className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-4 flex-1"><span>{popup.content}</span></p>
            {popup.imageUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <img src={popup.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${popup.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>{popup.isActive ? '현재 노출 중' : '비활성화됨'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PopupsTab;
