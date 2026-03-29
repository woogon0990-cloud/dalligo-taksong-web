import React from 'react';
import { Image as ImageIcon, Plus, LayoutDashboard } from 'lucide-react';

interface ImagesTabProps {
  localContent: any;
  updateLocalField: (fields: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
  content: any;
  setIsDirty: (dirty: boolean) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = React.memo(({ localContent, updateLocalField, handleFileUpload, content, setIsDirty }) => {
  // Local state for immediate input feedback without triggering parent re-renders on every keystroke
  const [formData, setFormData] = React.useState(localContent);

  // Sync local state when parent state changes (e.g. on reset or save)
  React.useEffect(() => {
    setFormData(localContent);
  }, [localContent]);

  const handleLocalChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleBlur = (field: string, value: any) => {
    updateLocalField({ [field]: value });
  };

  const handleServiceChange = (idx: number, field: string, value: any) => {
    const newServices = [...formData.services];
    newServices[idx] = { ...newServices[idx], [field]: value };
    setFormData((prev: any) => ({ ...prev, services: newServices }));
    setIsDirty(true);
  };

  const handleServiceBlur = (idx: number) => {
    updateLocalField({ services: formData.services });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>로고 이미지 관리</span></h3>
        </div>
        
        <div className="space-y-4">
          <div className="w-48 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-2">
            {content.logoImage ? (
              <img src={content.logoImage} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xs font-bold text-slate-400 italic"><span>이미지 없음 (텍스트 로고 사용 중)</span></span>
            )}
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={formData.logoImage || ""}
              onChange={(e) => handleLocalChange('logoImage', e.target.value)}
              onBlur={(e) => handleBlur('logoImage', e.target.value)}
              placeholder="로고 이미지 URL 입력 (비워두면 텍스트 로고 사용)"
              className="flex-1 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, (base64) => {
                  handleLocalChange('logoImage', base64);
                  updateLocalField({ logoImage: base64 });
                })}
                className="hidden" 
                id="logo-image-upload"
              />
              <label 
                htmlFor="logo-image-upload"
                className="flex items-center justify-center gap-2 h-full bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold cursor-pointer transition-all"
              >
                <Plus className="w-5 h-5" />
                파일 업로드
              </label>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">* 배경이 투명한 PNG 파일을 권장합니다. 이미지가 없으면 설정된 로고 텍스트가 표시됩니다.</p>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>메인 배너 이미지</span></h3>
        </div>
        
        <div className="space-y-4">
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={content.heroImage} alt="Hero Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={formData.heroImage || ""}
              onChange={(e) => handleLocalChange('heroImage', e.target.value)}
              onBlur={(e) => handleBlur('heroImage', e.target.value)}
              placeholder="이미지 URL 입력"
              className="flex-1 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e, (base64) => {
                  handleLocalChange('heroImage', base64);
                  updateLocalField({ heroImage: base64 });
                })}
                className="hidden" 
                id="hero-image-upload"
              />
              <label 
                htmlFor="hero-image-upload"
                className="flex items-center justify-center gap-2 h-full bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold cursor-pointer transition-all"
              >
                <Plus className="w-5 h-5" />
                파일 업로드
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>서비스별 이미지 관리</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.services.map((service: any, idx: number) => (
            <div key={service.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{service.title}</p>
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={service.image}
                  onChange={(e) => handleServiceChange(idx, 'image', e.target.value)}
                  onBlur={() => handleServiceBlur(idx)}
                  placeholder="이미지 URL"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 font-medium text-xs"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (base64) => {
                    const newServices = [...formData.services];
                    newServices[idx] = { ...newServices[idx], image: base64 };
                    setFormData((prev: any) => ({ ...prev, services: newServices }));
                    updateLocalField({ services: newServices });
                  })}
                  className="hidden" 
                  id={`service-img-${service.id}`}
                />
                <label 
                  htmlFor={`service-img-${service.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 text-slate-600 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all border border-slate-200"
                >
                  <ImageIcon className="w-3 h-3" />
                  이미지 변경
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export default ImagesTab;
