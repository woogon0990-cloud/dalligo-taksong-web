import React from 'react';
import { Type, LayoutDashboard, Image as ImageIcon } from 'lucide-react';

interface ContentTabProps {
  localContent: any;
  updateLocalField: (fields: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
  setIsDirty: (dirty: boolean) => void;
}

const ContentTab: React.FC<ContentTabProps> = React.memo(({ localContent, updateLocalField, handleFileUpload, setIsDirty }) => {
  // Local state for immediate input feedback without triggering parent re-renders on every keystroke
  const [formData, setFormData] = React.useState(localContent);

  // Sync local state when parent state changes (e.g. on reset or save)
  React.useEffect(() => {
    setFormData(localContent);
  }, [localContent]);

  const handleLocalChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Also update parent immediately to ensure Save button has latest data
    updateLocalField({ [field]: value });
  };

  const handleBlur = (field: string, value: any) => {
    updateLocalField({ [field]: value });
  };

  const handleServiceChange = (idx: number, field: string, value: any) => {
    const newServices = [...formData.services];
    newServices[idx] = { ...newServices[idx], [field]: value };
    setFormData((prev: any) => ({ ...prev, services: newServices }));
    setIsDirty(true);
    updateLocalField({ services: newServices });
  };

  const handleServiceBlur = (idx: number) => {
    updateLocalField({ services: formData.services });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Logo & Hero Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Type className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>메인 히어로 섹션</span></h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>로고 텍스트</span></label>
            <input 
              type="text" 
              value={formData.logoText || ""}
              onChange={(e) => handleLocalChange('logoText', e.target.value)}
              onBlur={(e) => handleBlur('logoText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 타이틀 (상단)</span></label>
            <input 
              type="text" 
              value={formData.heroTitle || ""}
              onChange={(e) => handleLocalChange('heroTitle', e.target.value)}
              onBlur={(e) => handleBlur('heroTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 타이틀 (강조)</span></label>
            <input 
              type="text" 
              value={formData.heroSubtitle || ""}
              onChange={(e) => handleLocalChange('heroSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('heroSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>서비스 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.servicesTitle || ""}
              onChange={(e) => handleLocalChange('servicesTitle', e.target.value)}
              onBlur={(e) => handleBlur('servicesTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>요금표 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.pricingTitle || ""}
              onChange={(e) => handleLocalChange('pricingTitle', e.target.value)}
              onBlur={(e) => handleBlur('pricingTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>배너 타이틀</span></label>
            <input 
              type="text" 
              value={formData.bannerTitle || ""}
              onChange={(e) => handleLocalChange('bannerTitle', e.target.value)}
              onBlur={(e) => handleBlur('bannerTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>프로세스 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.processTitle || ""}
              onChange={(e) => handleLocalChange('processTitle', e.target.value)}
              onBlur={(e) => handleBlur('processTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>설명 문구 (줄바꿈 가능)</span></label>
            <textarea 
              rows={5}
              value={formData.heroDescription || ""}
              onChange={(e) => handleLocalChange('heroDescription', e.target.value)}
              onBlur={(e) => handleBlur('heroDescription', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>푸터 로고 설명 (로고 옆)</span></label>
            <textarea 
              rows={3}
              value={formData.footerDescription || ""}
              onChange={(e) => handleLocalChange('footerDescription', e.target.value)}
              onBlur={(e) => handleBlur('footerDescription', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>푸터 로고 텍스트 (하단 왼쪽)</span></label>
            <input 
              type="text" 
              value={formData.footerLogoText || ""}
              onChange={(e) => handleLocalChange('footerLogoText', e.target.value)}
              onBlur={(e) => handleBlur('footerLogoText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>푸터 하단 파란색 문구</span></label>
            <input 
              type="text" 
              value={formData.footerSubText || ""}
              onChange={(e) => handleLocalChange('footerSubText', e.target.value)}
              onBlur={(e) => handleBlur('footerSubText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>푸터 저작권 텍스트</span></label>
            <input 
              type="text" 
              value={formData.footerText || ""}
              onChange={(e) => handleLocalChange('footerText', e.target.value)}
              onBlur={(e) => handleBlur('footerText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Footer Headers Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Type className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>푸터 헤더 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>서비스 안내 헤더</span></label>
            <input 
              type="text" 
              value={formData.footerServiceTitle || ""}
              onChange={(e) => handleLocalChange('footerServiceTitle', e.target.value)}
              onBlur={(e) => handleBlur('footerServiceTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>고객센터 헤더</span></label>
            <input 
              type="text" 
              value={formData.footerCustomerTitle || ""}
              onChange={(e) => handleLocalChange('footerCustomerTitle', e.target.value)}
              onBlur={(e) => handleBlur('footerCustomerTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>회사정보 헤더</span></label>
            <input 
              type="text" 
              value={formData.footerCompanyTitle || ""}
              onChange={(e) => handleLocalChange('footerCompanyTitle', e.target.value)}
              onBlur={(e) => handleBlur('footerCompanyTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Consignment Page Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>탁송 페이지 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentHeroTitle || ""}
              onChange={(e) => handleLocalChange('consignmentHeroTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentHeroTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentHeroSubtitle || ""}
              onChange={(e) => handleLocalChange('consignmentHeroSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentHeroSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 뱃지 텍스트</span></label>
            <input 
              type="text" 
              value={formData.consignmentBadgeText || ""}
              onChange={(e) => handleLocalChange('consignmentBadgeText', e.target.value)}
              onBlur={(e) => handleBlur('consignmentBadgeText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>특징 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFeaturesTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFeaturesTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFeaturesTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>프로세스 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentProcessTitle || ""}
              onChange={(e) => handleLocalChange('consignmentProcessTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentProcessTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentBannerTitle || ""}
              onChange={(e) => handleLocalChange('consignmentBannerTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentBannerTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentBannerSubtitle || ""}
              onChange={(e) => handleLocalChange('consignmentBannerSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentBannerSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Consignment Form Labels Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>탁송 신청폼 라벨 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>의뢰인 정보 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormClientTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormClientTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormClientTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>차량 정보 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormVehicleTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormVehicleTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormVehicleTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>출발지 정보 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormDepartureTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormDepartureTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormDepartureTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>목적지 정보 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormDestinationTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormDestinationTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormDestinationTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송료 결제방식 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormPaymentTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormPaymentTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormPaymentTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>기타 메모란 타이틀</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormNotesTitle || ""}
              onChange={(e) => handleLocalChange('consignmentFormNotesTitle', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormNotesTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 신청 버튼 라벨 (메인)</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormHeroButtonLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormHeroButtonLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormHeroButtonLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 신청 버튼 라벨 (배너)</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormBannerButtonLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormBannerButtonLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormBannerButtonLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 신청 완료 버튼 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormSubmitLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormSubmitLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormSubmitLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>변속기 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormTransmissionLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormTransmissionLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormTransmissionLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>스틱 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormStickLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormStickLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormStickLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>현장 연락처 라벨 (공통)</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormSiteContactLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormSiteContactLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormSiteContactLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>출발지 연락처 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormDepartureContactLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormDepartureContactLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormDepartureContactLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>도착지 연락처 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormDestinationContactLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormDestinationContactLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormDestinationContactLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>출발지 주소 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormStartAddressLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormStartAddressLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormStartAddressLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>도착지 주소 라벨</span></label>
            <input 
              type="text" 
              value={formData.consignmentFormEndAddressLabel || ""}
              onChange={(e) => handleLocalChange('consignmentFormEndAddressLabel', e.target.value)}
              onBlur={(e) => handleBlur('consignmentFormEndAddressLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>

          <div className="col-span-full pt-8 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900">대리 신청 폼 설정</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 폼 의뢰인 섹션 제목</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormClientTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFormClientTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormClientTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 폼 출발지 섹션 제목</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormDepartureTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFormDepartureTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormDepartureTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 폼 도착지 섹션 제목</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormDestinationTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFormDestinationTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormDestinationTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 폼 요금 섹션 제목</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormPriceTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFormPriceTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormPriceTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 폼 차량 섹션 제목</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormVehicleTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFormVehicleTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormVehicleTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 신청 완료 버튼 라벨</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormSubmitLabel || ""}
              onChange={(e) => handleLocalChange('chauffeurFormSubmitLabel', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormSubmitLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리 신청 버튼 라벨 (배너)</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFormBannerButtonLabel || ""}
              onChange={(e) => handleLocalChange('chauffeurFormBannerButtonLabel', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFormBannerButtonLabel', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
            />
          </div>
        </div>
      </section>

      {/* Chauffeur Page Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>대리운전 페이지 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurHeroTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurHeroTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurHeroTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurHeroSubtitle || ""}
              onChange={(e) => handleLocalChange('chauffeurHeroSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurHeroSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 뱃지 텍스트</span></label>
            <input 
              type="text" 
              value={formData.chauffeurBadgeText || ""}
              onChange={(e) => handleLocalChange('chauffeurBadgeText', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurBadgeText', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>특징 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurFeaturesTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurFeaturesTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurFeaturesTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>프로세스 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurProcessTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurProcessTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurProcessTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurBannerTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurBannerTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurBannerTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurBannerSubtitle || ""}
              onChange={(e) => handleLocalChange('chauffeurBannerSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurBannerSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>요금표 섹션 타이틀</span></label>
            <input 
              type="text" 
              value={formData.chauffeurPricingTitle || ""}
              onChange={(e) => handleLocalChange('chauffeurPricingTitle', e.target.value)}
              onBlur={(e) => handleBlur('chauffeurPricingTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Recruitment Page Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>기사모집 페이지 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentHeroTitle || ""}
              onChange={(e) => handleLocalChange('recruitmentHeroTitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentHeroTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentHeroSubtitle || ""}
              onChange={(e) => handleLocalChange('recruitmentHeroSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentHeroSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>지원 시스템 타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentSupportTitle || ""}
              onChange={(e) => handleLocalChange('recruitmentSupportTitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentSupportTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>가입 안내 타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentGuideTitle || ""}
              onChange={(e) => handleLocalChange('recruitmentGuideTitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentGuideTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>보험료 안내 타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentRentalTitle || ""}
              onChange={(e) => handleLocalChange('recruitmentRentalTitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentRentalTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentBannerTitle || ""}
              onChange={(e) => handleLocalChange('recruitmentBannerTitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentBannerTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>하단 배너 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.recruitmentBannerSubtitle || ""}
              onChange={(e) => handleLocalChange('recruitmentBannerSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('recruitmentBannerSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Customer Center Page Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>고객센터 페이지 관리</span></h3>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 타이틀</span></label>
            <input 
              type="text" 
              value={formData.customerHeroTitle || ""}
              onChange={(e) => handleLocalChange('customerHeroTitle', e.target.value)}
              onBlur={(e) => handleBlur('customerHeroTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>히어로 서브타이틀</span></label>
            <input 
              type="text" 
              value={formData.customerHeroSubtitle || ""}
              onChange={(e) => handleLocalChange('customerHeroSubtitle', e.target.value)}
              onBlur={(e) => handleBlur('customerHeroSubtitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Navigation & Buttons Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>네비게이션 및 버튼 라벨</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 메뉴 라벨</span></label>
            <input 
              type="text" 
              value={formData.navConsignment || ""}
              onChange={(e) => handleLocalChange('navConsignment', e.target.value)}
              onBlur={(e) => handleBlur('navConsignment', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>대리운전 메뉴 라벨</span></label>
            <input 
              type="text" 
              value={formData.navChauffeur || ""}
              onChange={(e) => handleLocalChange('navChauffeur', e.target.value)}
              onBlur={(e) => handleBlur('navChauffeur', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 히어로 탁송 타이틀</span></label>
            <input 
              type="text" 
              value={formData.heroConsignmentTitle || ""}
              onChange={(e) => handleLocalChange('heroConsignmentTitle', e.target.value)}
              onBlur={(e) => handleBlur('heroConsignmentTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 히어로 대리운전 타이틀</span></label>
            <input 
              type="text" 
              value={formData.heroChauffeurTitle || ""}
              onChange={(e) => handleLocalChange('heroChauffeurTitle', e.target.value)}
              onBlur={(e) => handleBlur('heroChauffeurTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 히어로 탁송 설명</span></label>
            <input 
              type="text" 
              value={formData.heroConsignmentDesc || ""}
              onChange={(e) => handleLocalChange('heroConsignmentDesc', e.target.value)}
              onBlur={(e) => handleBlur('heroConsignmentDesc', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>메인 히어로 대리운전 설명</span></label>
            <input 
              type="text" 
              value={formData.heroChauffeurDesc || ""}
              onChange={(e) => handleLocalChange('heroChauffeurDesc', e.target.value)}
              onBlur={(e) => handleBlur('heroChauffeurDesc', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>폐차 메뉴 라벨</span></label>
            <input 
              type="text" 
              value={formData.navScrap || ""}
              onChange={(e) => handleLocalChange('navScrap', e.target.value)}
              onBlur={(e) => handleBlur('navScrap', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>기사모집 메뉴 라벨</span></label>
            <input 
              type="text" 
              value={formData.navRecruitment || ""}
              onChange={(e) => handleLocalChange('navRecruitment', e.target.value)}
              onBlur={(e) => handleBlur('navRecruitment', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>고객센터 메뉴 라벨</span></label>
            <input 
              type="text" 
              value={formData.navCustomerCenter || ""}
              onChange={(e) => handleLocalChange('navCustomerCenter', e.target.value)}
              onBlur={(e) => handleBlur('navCustomerCenter', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 신청 버튼 제목</span></label>
            <input 
              type="text" 
              value={formData.heroConsignmentTitle || ""}
              onChange={(e) => handleLocalChange('heroConsignmentTitle', e.target.value)}
              onBlur={(e) => handleBlur('heroConsignmentTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 신청 버튼 설명</span></label>
            <input 
              type="text" 
              value={formData.heroConsignmentDesc || ""}
              onChange={(e) => handleLocalChange('heroConsignmentDesc', e.target.value)}
              onBlur={(e) => handleBlur('heroConsignmentDesc', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>폐차 신청 버튼 제목</span></label>
            <input 
              type="text" 
              value={formData.heroScrapTitle || ""}
              onChange={(e) => handleLocalChange('heroScrapTitle', e.target.value)}
              onBlur={(e) => handleBlur('heroScrapTitle', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>폐차 신청 버튼 설명</span></label>
            <input 
              type="text" 
              value={formData.heroScrapDesc || ""}
              onChange={(e) => handleLocalChange('heroScrapDesc', e.target.value)}
              onBlur={(e) => handleBlur('heroScrapDesc', e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold"
              translate="no"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>서비스 항목 관리</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.services.map((service: any, idx: number) => (
            <div key={service.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest"><span>Service {idx + 1}</span></span>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={service.title}
                  onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                  onBlur={() => handleServiceBlur(idx)}
                  placeholder="서비스 제목"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 font-bold text-sm"
                  translate="no"
                />
                <input 
                  type="text" 
                  value={service.tag}
                  onChange={(e) => handleServiceChange(idx, 'tag', e.target.value)}
                  onBlur={() => handleServiceBlur(idx)}
                  placeholder="태그 (예: #안전탁송)"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 font-bold text-xs text-blue-600"
                  translate="no"
                />
                <textarea 
                  rows={3}
                  value={service.description}
                  onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                  onBlur={() => handleServiceBlur(idx)}
                  placeholder="서비스 설명"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 text-xs text-slate-500 leading-relaxed resize-none"
                  translate="no"
                />
                <div className="relative group">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
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
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>진행 절차 관리</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(formData.steps || []).map((step: any, idx: number) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest"><span>Step {step.id}</span></span>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={step.title}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                    setFormData((prev: any) => ({ ...prev, steps: newSteps }));
                    setIsDirty(true);
                    updateLocalField({ steps: newSteps });
                  }}
                  placeholder="단계 제목"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 font-bold text-sm"
                  translate="no"
                />
                <textarea 
                  rows={3}
                  value={step.desc}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                    setFormData((prev: any) => ({ ...prev, steps: newSteps }));
                    setIsDirty(true);
                    updateLocalField({ steps: newSteps });
                  }}
                  placeholder="단계 설명"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 text-xs text-slate-500 leading-relaxed resize-none"
                  translate="no"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Pricing Tables & Policies Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>요금표 및 정책 관리</span></h3>
        </div>

        {/* Consignment Pricing */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            <span>탁송 요금표 관리</span>
          </h4>
          
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>요금표 데이터 (JSON 형식)</span></label>
            <textarea 
              rows={8}
              value={JSON.stringify(formData.consignmentPricingTable, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleLocalChange('consignmentPricingTable', parsed);
                } catch (err) {
                  // Allow typing invalid JSON temporarily
                  setFormData((prev: any) => ({ ...prev, consignmentPricingTable: e.target.value }));
                }
              }}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleBlur('consignmentPricingTable', parsed);
                } catch (err) {
                  alert("유효한 JSON 형식이 아닙니다. 이전 데이터로 복구합니다.");
                  setFormData((prev: any) => ({ ...prev, consignmentPricingTable: localContent.consignmentPricingTable }));
                }
              }}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-mono text-xs leading-relaxed"
              translate="no"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>탁송 요금 조건 (줄바꿈으로 구분)</span></label>
              <textarea 
                rows={5}
                value={formData.consignmentPricingConditions?.join('\n') || ""}
                onChange={(e) => handleLocalChange('consignmentPricingConditions', e.target.value.split('\n'))}
                onBlur={(e) => handleBlur('consignmentPricingConditions', e.target.value.split('\n'))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold text-sm"
                translate="no"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>탁송 취소 규정 (줄바꿈으로 구분)</span></label>
              <textarea 
                rows={5}
                value={formData.consignmentCancellationPolicy?.join('\n') || ""}
                onChange={(e) => handleLocalChange('consignmentCancellationPolicy', e.target.value.split('\n'))}
                onBlur={(e) => handleBlur('consignmentCancellationPolicy', e.target.value.split('\n'))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold text-sm"
                translate="no"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-50 my-8" />

        {/* Chauffeur Pricing */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            <span>대리운전 요금표 관리</span>
          </h4>
          
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>요금표 데이터 (JSON 형식)</span></label>
            <textarea 
              rows={8}
              value={JSON.stringify(formData.chauffeurPricingTable, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleLocalChange('chauffeurPricingTable', parsed);
                } catch (err) {
                  setFormData((prev: any) => ({ ...prev, chauffeurPricingTable: e.target.value }));
                }
              }}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleBlur('chauffeurPricingTable', parsed);
                } catch (err) {
                  alert("유효한 JSON 형식이 아닙니다. 이전 데이터로 복구합니다.");
                  setFormData((prev: any) => ({ ...prev, chauffeurPricingTable: localContent.chauffeurPricingTable }));
                }
              }}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-mono text-xs leading-relaxed"
              translate="no"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>대리운전 요금 조건 (줄바꿈으로 구분)</span></label>
              <textarea 
                rows={5}
                value={formData.chauffeurPricingConditions?.join('\n') || ""}
                onChange={(e) => handleLocalChange('chauffeurPricingConditions', e.target.value.split('\n'))}
                onBlur={(e) => handleBlur('chauffeurPricingConditions', e.target.value.split('\n'))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold text-sm"
                translate="no"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block"><span>대리운전 취소 규정 (줄바꿈으로 구분)</span></label>
              <textarea 
                rows={5}
                value={formData.chauffeurCancellationPolicy?.join('\n') || ""}
                onChange={(e) => handleLocalChange('chauffeurCancellationPolicy', e.target.value.split('\n'))}
                onBlur={(e) => handleBlur('chauffeurCancellationPolicy', e.target.value.split('\n'))}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all font-bold text-sm"
                translate="no"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default ContentTab;
