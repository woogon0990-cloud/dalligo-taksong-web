import React from 'react';
import { Info, Phone, CreditCard, MapPin, UserCog } from 'lucide-react';

interface ContactTabProps {
  localContent: any;
  updateLocalField: (fields: any) => void;
  setIsDirty: (dirty: boolean) => void;
}

const ContactTab: React.FC<ContactTabProps> = React.memo(({ localContent, updateLocalField, setIsDirty }) => {
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

  return (
    <div className="space-y-8 max-w-4xl">
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>회사 및 연락처 정보</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3" /> <span>대표 전화번호</span>
            </label>
            <input 
              type="text" 
              value={formData.contactPhone}
              onChange={(e) => handleLocalChange('contactPhone', e.target.value)}
              onBlur={(e) => handleBlur('contactPhone', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> <span>사업자 등록번호</span>
            </label>
            <input 
              type="text" 
              value={formData.businessNumber}
              onChange={(e) => handleLocalChange('businessNumber', e.target.value)}
              onBlur={(e) => handleBlur('businessNumber', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" /> <span>사업장 주소</span>
            </label>
            <input 
              type="text" 
              value={formData.contactAddress}
              onChange={(e) => handleLocalChange('contactAddress', e.target.value)}
              onBlur={(e) => handleBlur('contactAddress', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <UserCog className="w-3 h-3" /> <span>서비스 파트너</span>
            </label>
            <input 
              type="text" 
              value={formData.servicePartner}
              onChange={(e) => handleLocalChange('servicePartner', e.target.value)}
              onBlur={(e) => handleBlur('servicePartner', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>푸터 저작권 문구</span></label>
            <input 
              type="text" 
              value={formData.footerText}
              onChange={(e) => handleLocalChange('footerText', e.target.value)}
              onBlur={(e) => handleBlur('footerText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
        </div>
      </section>
    </div>
  );
});

export default ContactTab;
