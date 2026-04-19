/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Send, ClipboardList, Info, MapPin, User, X, Copy, Check, Anchor, Truck, Car, Settings, FileText, ChevronRight, ClipboardCheck, Trash2, Calendar, Clock, Zap } from 'lucide-react';
import { calculateFare, FareOptions } from '../lib/fareUtils';
import axios from 'axios';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';

type ServiceType = 'road' | 'carrier' | 'selfloader' | 'jeju' | 'inspection' | 'scrap';

export default function OrderFormInside({ type }: { type: 'consignment' | 'chauffeur' }) {
  const { user } = useAuth();
  const [hasStopover, setHasStopover] = useState(false);
  const [isUpward, setIsUpward] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [showContractPopup, setShowContractPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('road');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isReservation, setIsReservation] = useState(false);
  const [isTimeSaved, setIsTimeSaved] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  
  // Agreement States
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [formData, setFormData] = useState({
    customerPhone: '',
    carName: '',
    carNumber: '',
    carModel: '',
    transmission: '오토',
    operationStatus: '현 운행 유',
    departureAddr: '',
    departureContact: '',
    arrivalAddr: '',
    arrivalContact: '',
    stopovers: [] as { address: string; contact: string; detail?: string }[],
    memo: '',
    pickupTime: '',
    pickupAmPm: '오전' as '오전' | '오후'
  });

  const [contractData, setContractData] = useState<{
    id: string;
    customerName: string;
    customerPhone: string;
    carModel: string;
    carNumber: string;
    departure: string;
    arrival: string;
    fare: number;
    serviceType: string;
  } | null>(null);

  const serviceTypes: { id: ServiceType; label: string; icon: React.ElementType }[] = [
    { id: 'road', label: '일반 탁송', icon: Truck },
    { id: 'carrier', label: '캐리어 탁송', icon: Car },
    { id: 'selfloader', label: '셀프로더 탁송', icon: Settings },
    { id: 'jeju', label: '제주도 탁송', icon: Anchor },
    { id: 'inspection', label: '중고차 검수 탁송', icon: ClipboardCheck },
    { id: 'scrap', label: '폐차/수출 탁송', icon: Trash2 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData(prev => ({
              ...prev,
              customerPhone: userData.phone || prev.customerPhone,
              carNumber: userData.carNumber || prev.carNumber
            }));
          }
        } catch (err) {
          console.error("Error pre-filling user data:", err);
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Distance estimation logic removed as per request
    const options: FareOptions = {
      hasStopover,
      isUpward,
      dist1: 0,
      dist2: 0,
    };
    setEstimatedFare(calculateFare(0, options));
  }, [hasStopover, isUpward]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.toLowerCase().includes('phone') || name.toLowerCase().includes('contact') ? formatPhone(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.customerPhone || !formData.departureAddr || !formData.arrivalAddr) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    if (!agreedPrivacy || !agreedTerms) {
      alert('필수 약관에 동의하셔야 신청이 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    const serviceLabel = serviceTypes.find(s => s.id === serviceType)?.label || '일반';
    const carInfo = `${formData.carName || formData.carModel || '정보 없음'} ${formData.carNumber ? `(${formData.carNumber})` : ''} (${formData.transmission}${type === 'consignment' ? `, ${formData.operationStatus}` : ''})`;
    const pickupTimeFull = isReservation ? formData.pickupTime.replace('T', ' ') : '즉시 배차 (최대한 빨리)';
    
    // 제주도 탁송은 무조건 선불 원칙이며 요금은 상담 후 결정
    const finalPaymentMethod = serviceType === 'jeju' ? 'prepaid' : paymentMethod;
    const paymentMethodText = finalPaymentMethod === 'prepaid' ? '선불' : '후불';

    const stopoversText = formData.stopovers.length > 0 
      ? formData.stopovers.map((s, i) => `\n🛑 경유${i+1}: ${s.address} ${s.detail} (📞 ${s.contact || formData.customerPhone})`).join('')
      : ' 없음';

    const message = `
🚀 <b>[신규 접수 알림 - ${serviceLabel}]</b>
📍 출발: ${formData.departureAddr}
${stopoversText}
🏁 도착: ${formData.arrivalAddr}
📞 연락처: ${formData.customerPhone || '정보 없음'}
🚗 차량: ${carInfo}
📅 픽업: ${pickupTimeFull}
💰 요금: ${serviceType === 'jeju' ? '상담 후 결정 (제주도 특수 노선)' : `상담 후 결정 (${paymentMethodText})`}
📱 의뢰인: ${formData.customerPhone || '정보 없음'}
📝 요청: ${formData.memo || '정보 없음'}
${serviceType === 'jeju' ? `🏝️ 제주도 왕복: ${isRoundTrip ? '예' : '아니오'}` : ''}
    `.trim();

    try {
      const orderData = {
        ...formData,
        type,
        serviceType,
        isRoundTrip: serviceType === 'jeju' ? isRoundTrip : false,
        estimatedFare: serviceType === 'jeju' ? 0 : estimatedFare,
        paymentMethod: finalPaymentMethod,
        hasStopover,
        status: 'pending',
        agreedToTerms: true,
        agreedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setCurrentOrderId(docRef.id);

      // 2. Prepare Contract Data
      setContractData({
        id: `2026-${docRef.id.slice(0, 4).toUpperCase()}`,
        customerName: '고객',
        customerPhone: formData.customerPhone,
        carModel: formData.carName || formData.carModel,
        carNumber: formData.carNumber,
        departure: formData.departureAddr,
        arrival: formData.arrivalAddr,
        fare: serviceType === 'jeju' ? 0 : estimatedFare,
        serviceType: serviceLabel,
        pickupTime: pickupTimeFull
      });

      // 3. Send Telegram Notification
      await axios.post('/api/send-telegram', { message });
      
      setShowContractPopup(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintContract = () => {
    window.print();
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('361-110962-01-017');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSelectAll = (checked: boolean) => {
    setAgreedPrivacy(checked);
    setAgreedTerms(checked);
  };

  const addStopover = () => {
    setFormData(prev => ({
      ...prev,
      stopovers: [...prev.stopovers, { address: '', contact: '' }]
    }));
    setHasStopover(true);
  };

  const removeStopover = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stopovers: prev.stopovers.filter((_, i) => i !== index)
    }));
    if (formData.stopovers.length <= 1) {
      setHasStopover(false);
    }
  };

  const handleStopoverChange = (index: number, field: 'address' | 'contact', value: string) => {
    const newStopovers = [...formData.stopovers];
    newStopovers[index] = { 
      ...newStopovers[index], 
      [field]: field === 'contact' ? formatPhone(value) : value 
    };
    setFormData(prev => ({ ...prev, stopovers: newStopovers }));
  };

  const isAgreedAll = agreedPrivacy && agreedTerms;

  return (
    <div className={`p-8 mt-[-30px] pt-14 rounded-b-[2.5rem] shadow-inner ${type === 'consignment' ? 'bg-blue-50/50' : 'bg-slate-100'}`}>
      <div className="space-y-8">
        
        {/* 0. 서비스 유형 선택 (탁송 전용) */}
        {type === 'consignment' && (
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 ml-2 uppercase tracking-widest">Service Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {serviceTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setServiceType(item.id)}
                  className={`relative flex flex-col items-center justify-center aspect-square rounded-full transition-all duration-300 group ${
                    serviceType === item.id 
                      ? 'scale-110' 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-4 border-b-8 transition-all duration-300 ${
                    serviceType === item.id 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-900 shadow-[0_20px_50px_rgba(37,99,235,0.4)] text-white translate-y-[-8px]' 
                      : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-slate-400 hover:border-blue-300'
                  }`}>
                    <div className={`mb-2 p-3 rounded-full ${serviceType === item.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                      <item.icon 
                        size={serviceType === item.id ? 36 : 32} 
                        className={`${serviceType === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} 
                      />
                    </div>
                    <span className={`text-[13px] font-black leading-tight text-center ${serviceType === item.id ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                    {serviceType === item.id && (
                      <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full p-1 shadow-lg animate-bounce">
                        <Check size={16} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* 제주도 전용 옵션 (노선 선택) */}
            {serviceType === 'jeju' && (
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 ml-2 italic">제주도 노선 선택</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsRoundTrip(false)}
                    className={`py-6 rounded-2xl font-black transition-all border-2 shadow-lg text-xl ${!isRoundTrip ? 'bg-blue-600 border-blue-800 text-white translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
                  >
                    편도
                  </button>
                  <button 
                    onClick={() => setIsRoundTrip(true)}
                    className={`py-6 rounded-2xl font-black transition-all border-2 shadow-lg text-xl ${isRoundTrip ? 'bg-blue-600 border-blue-800 text-white translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
                  >
                    왕복
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. 의뢰인 정보 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isReservation ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                {isReservation ? <Clock size={20} /> : <Zap size={20} />}
              </div>
              <div>
                <h4 className="font-black text-slate-900 leading-tight">예약신청</h4>
                <p className="text-[10px] font-bold text-slate-400">
                  {isReservation ? '원하시는 시간에 배차' : '지금 바로 즉시 배차'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsReservation(!isReservation)}
              className="flex items-center gap-2 group outline-none"
            >
              <span className={`text-[11px] font-black tracking-tight transition-colors ${isReservation ? 'text-blue-600' : 'text-slate-400'}`}>
                {isReservation ? '예약 이용 중' : '예약하기'}
              </span>
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isReservation ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isReservation ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 ml-2 italic underline underline-offset-4 decoration-blue-500/30 font-black">의뢰인 연락처</label>
              <div className="relative">
                <Phone className="absolute left-4 top-5 w-6 h-6 text-blue-500" />
                <input 
                  type="tel" 
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xl transition-all placeholder:text-slate-300 text-slate-900" 
                />
              </div>
            </div>

            <AnimatePresence>
              {isReservation && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-black text-slate-900 ml-2 italic underline underline-offset-4 decoration-blue-500/30 font-black">픽업 희망 일시</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-4 top-5 w-5 h-5 text-blue-500 z-10" />
                      <input 
                        type="datetime-local" 
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-12 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xl transition-all text-slate-900" 
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isTimeSaved ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200 group-hover:border-blue-400'}`}>
                        {isTimeSaved && <Check size={16} className="text-white" strokeWidth={4} />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isTimeSaved}
                        onChange={(e) => setIsTimeSaved(e.target.checked)}
                      />
                      <span className={`text-sm font-black transition-colors ${isTimeSaved ? 'text-blue-600' : 'text-slate-500'}`}>선택 시간 저장/확정</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. 차량 정보 */}
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-900 ml-2 italic underline underline-offset-4 decoration-blue-500/30 font-black">차량 정보 (정밀 입력)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              name="carModel"
              value={formData.carModel}
              onChange={handleInputChange}
              placeholder="모델명 (예: GV80)" 
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 px-6 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 text-xl transition-all placeholder:text-slate-300 text-slate-900" 
            />
            <input 
              type="text" 
              name="carNumber"
              value={formData.carNumber}
              onChange={handleInputChange}
              placeholder="차량번호 (예: 12가 3456)" 
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 px-6 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 text-xl transition-all placeholder:text-slate-300 text-slate-900" 
            />
            <select 
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className="bg-white border-2 border-slate-200 rounded-2xl py-5 px-6 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 text-xl transition-all text-slate-900"
            >
              <option>오토</option>
              <option>수동</option>
            </select>
          </div>
        </div>

        {/* 3 & 4. 출발지 및 도착지 정보 */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 ml-2 text-blue-600 font-black">출발지 주소</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 w-6 h-6 text-blue-500" />
                <input 
                  type="text" 
                  name="departureAddr"
                  value={formData.departureAddr}
                  onChange={handleInputChange}
                  placeholder="출발지 주소를 입력해 주세요" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 text-xl transition-all text-slate-900" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 ml-2 text-blue-600 font-black">출발지 연락처</label>
              <div className="relative">
                <User className="absolute left-4 top-5 w-6 h-6 text-blue-500" />
                <input 
                  type="tel" 
                  name="departureContact"
                  value={formData.departureContact}
                  onChange={handleInputChange}
                  placeholder="현장 연락처" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 text-xl transition-all text-slate-900" 
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 ml-2 text-orange-600 font-black">도착지 주소</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 w-6 h-6 text-orange-500" />
                <input 
                  type="text" 
                  name="arrivalAddr"
                  value={formData.arrivalAddr}
                  onChange={handleInputChange}
                  placeholder="도착지 주소를 입력해 주세요" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:border-orange-500 text-xl transition-all text-slate-900" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 ml-2 text-orange-600 font-black">도착지 연락처</label>
              <div className="relative">
                <User className="absolute left-4 top-5 w-6 h-6 text-orange-500" />
                <input 
                  type="tel" 
                  name="arrivalContact"
                  value={formData.arrivalContact}
                  onChange={handleInputChange}
                  placeholder="현장 연락처" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 pl-14 pr-4 font-black shadow-lg shadow-slate-100 outline-none focus:border-orange-500 text-xl transition-all text-slate-900" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 거리 입력 제거 - 경유지 추가 버튼만 유지 */}
        <div className="flex items-center gap-4">
          <button
            onClick={addStopover}
            type="button"
            className="flex items-center gap-2 px-8 py-5 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 text-lg"
          >
            <MapPin size={24} />
            경유지 추가
          </button>
          
          <label className="flex items-center gap-3 cursor-pointer select-none py-4 ml-auto">
                <input type="checkbox" checked={isUpward} onChange={(e) => setIsUpward(e.target.checked)} className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-base font-black text-slate-900">상행선 할증</span>
              </label>
            </div>

        {/* 5. 경유지 정보 (여러 개 가능) */}
        {formData.stopovers.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-lg font-black text-purple-600 ml-2 flex items-center gap-2">
              <MapPin size={20} /> 경유지 목록 ({formData.stopovers.length})
            </h4>
            {formData.stopovers.map((stopover, index) => (
              <div key={index} className="bg-purple-50/50 p-6 rounded-[2rem] border-2 border-purple-100 relative animate-in slide-in-from-top-4 duration-300">
                <button 
                  onClick={() => removeStopover(index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                >
                  <X size={16} />
                </button>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-purple-700 ml-2 uppercase tracking-widest">경유지 {index + 1} 주소</label>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={stopover.address}
                        onChange={(e) => handleStopoverChange(index, 'address', e.target.value)}
                        placeholder="경유지 주소" 
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-6 font-black shadow-md outline-none focus:border-purple-500 text-lg transition-all text-slate-900" 
                      />
                      <input 
                        type="text" 
                        value={stopover.detail}
                        onChange={(e) => handleStopoverChange(index, 'detail', e.target.value)}
                        placeholder="경유지 상세 주소" 
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 px-6 font-bold shadow-sm outline-none focus:border-purple-500 text-base transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-purple-700 ml-2 uppercase tracking-widest">경유지 {index + 1} 연락처</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-purple-500" />
                      <input 
                        type="tel" 
                        value={stopover.contact}
                        onChange={(e) => handleStopoverChange(index, 'contact', e.target.value)}
                        placeholder="현장 연락처" 
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-black shadow-md outline-none focus:border-purple-500 text-lg transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 입금 계좌 안내 (요금 박스 대체) */}
        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-600 shadow-2xl shadow-blue-100 text-center space-y-4">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-black mb-2">입금 계좌 안내</div>
          <div className="space-y-2">
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              기업은행 <span className="text-blue-600">361-110962-01-017</span>
            </p>
            <p className="text-2xl font-black text-slate-900">모노솔루션 김우곤</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-base font-black text-slate-600 leading-relaxed">
              ※ 요금은 상담을 통해 확정되며, <br className="md:hidden" />
              확정된 요금을 위 계좌로 입금해 주세요.
            </p>
          </div>
        </div>

        {/* 6. 기타 전달사항 */}
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-900 ml-2 flex items-center gap-1">
            <ClipboardList className="w-4 h-4 text-blue-600" /> 기타 전달사항
          </label>
          <textarea 
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            rows={3}
            placeholder={type === 'consignment' ? "기사님께 전달할 추가 요청사항을 적어주세요." : "주차 위치나 차량 진입 방법 등 요청사항을 적어주세요."} 
            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-5 px-6 font-black shadow-lg shadow-slate-100 outline-none focus:border-blue-500 resize-none text-xl transition-all"
          />
        </div>

        {/* 7. 결제방법 (제주도는 선불 고정) */}
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-900 ml-2">결제방법</label>
          {serviceType === 'jeju' ? (
            <div className="bg-blue-600 py-5 rounded-2xl font-black text-white text-center border-2 border-blue-600 text-lg">
              선불 (제주도 노선 원칙)
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('prepaid')}
                className={`py-6 rounded-2xl font-black transition-all border-2 shadow-md text-xl ${paymentMethod === 'prepaid' ? 'bg-blue-600 border-blue-800 text-white translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}
              >
                선불
              </button>
              <button 
                onClick={() => setPaymentMethod('postpaid')}
                className={`py-6 rounded-2xl font-black transition-all border-2 shadow-md text-xl ${paymentMethod === 'postpaid' ? 'bg-slate-900 border-slate-950 text-white translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`}
              >
                후불
              </button>
            </div>
          )}
        </div>

        {/* 법적 동의 섹션 */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAgreedAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" 
              />
              <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">서비스 이용 및 면책 조항 전체 동의</span>
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">[필수] 개인정보 수집 및 이용 동의</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">[필수] 탁송 이용 약관 및 사고 발생 시 면책 조항 동의</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              본인은 탁송 신청 시 입력한 정보가 사실임을 확인하며, 안내된 면책 조항 및 책임 소재에 대해 충분히 숙지하고 이에 동의합니다. 
              동의 후 발생하는 분쟁에 대해 '달리고'에 책임을 묻지 않을 것에 동의합니다.
            </p>
          </div>
        </div>

        {/* 8. 신청접수 버튼 */}
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-8 mt-4 rounded-[2.5rem] font-black text-3xl text-white shadow-2xl active:scale-95 transition-all disabled:opacity-50 border-b-8 ${!isAgreedAll ? 'opacity-50 grayscale-[0.5]' : ''} ${type === 'consignment' ? 'bg-blue-600 border-blue-800 shadow-blue-600/30 hover:bg-blue-500' : 'bg-slate-900 border-black shadow-slate-900/30 hover:bg-slate-800'}`}
        >
          <div className="flex items-center justify-center gap-4">
            <Send className="w-8 h-8" />
            {isSubmitting ? '접수 중...' : (type === 'consignment' ? '탁송 신청 완료' : '대리운전 신청 완료')}
          </div>
        </button>

        {/* 탁송 신청 가이드 (최하단으로 이동) */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl mt-12">
          <h4 className="flex items-center gap-2 text-xl font-black text-slate-900 mb-8">
            <ClipboardList size={24} className="text-blue-600" />
            {serviceType === 'jeju' ? '제주도 탁송 신청 가이드' : '탁송 신청 가이드'}
          </h4>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '1', title: '서비스 유형 선택', desc: serviceType === 'jeju' ? '제주도 노선 및 왕복 여부를 체크합니다.' : '일반 또는 캐리어 방식을 선택합니다.' },
              { step: '2', title: '정밀 차종 입력', desc: '요율 산정을 위해 차종, 모델명, 번호를 정확히 입력합니다.' },
              { step: '3', title: '일시 및 장소 지정', desc: '픽업 희망 일시와 정확한 주소를 입력합니다.' },
              { step: '4', title: '고객 정보 기재', desc: '예약자 및 인수자 연락처, 특이사항을 입력합니다.' },
              { step: '5', title: '결제 및 확정', desc: '선불 결제 원칙이며, 상담 후 예약이 최종 확정됩니다.' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-3">
                <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-blue-200">
                  {item.step}
                </span>
                <div>
                  <p className="text-base font-black text-slate-900 mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 font-bold leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 위약금 안내 */}
        <div className="flex items-start gap-3 px-2">
          <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              {type === 'consignment' 
                ? '탁송 당일 취소 시 이용료 전액(100%)이 위약금으로 부과됩니다.' 
                : '대리 배차 5분 후 취소 시 5,000원, 도착 후 취소 시 10,000원의 위약금이 발생합니다.'}
            </p>
            <p className="text-xs text-slate-600 font-bold">
              상세 내용은 하단의 <span className="text-blue-600 underline cursor-pointer" onClick={() => document.getElementById('취소규정')?.scrollIntoView({ behavior: 'smooth' })}>취소 및 위약금 규정</span>을 확인해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 전자 위탁운송 계약서 팝업 */}
      {showContractPopup && contractData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white relative">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-blue-400" size={24} />
                <h4 className="text-2xl font-black tracking-tighter">[달리고] 전자 위탁운송 계약서</h4>
              </div>
              <p className="text-slate-400 text-sm font-bold">제 {contractData.id} 호</p>
              <button 
                onClick={() => {
                  setShowContractPopup(false);
                  if (paymentMethod === 'prepaid') setShowBankPopup(true);
                }}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar print-content">
              {/* 1. 계약 당사자 및 차량 정보 */}
              <div className="space-y-4">
                <h5 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  계약 당사자 및 차량 정보
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">위탁자</p>
                    <p className="text-slate-900 font-black">{contractData.customerPhone} 님</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">운송인</p>
                    <p className="text-slate-900 font-black">달리고 (배정기사: 미정)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">차량정보</p>
                    <p className="text-slate-900 font-black">{contractData.carModel} / {contractData.carNumber || '정보없음'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">운송구간</p>
                    <p className="text-slate-900 font-black">{contractData.departure.slice(0, 10)}... ▶ {contractData.arrival.slice(0, 10)}...</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <p className="text-slate-400 font-bold">운송요금</p>
                    <p className="text-blue-600 font-black text-lg">
                      {contractData.serviceType === '제주도' ? '상담 후 확정 (선불)' : `${contractData.fare.toLocaleString()}원 (${paymentMethod === 'prepaid' ? '선납 예정' : '후불 예정'})`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. 주요 약관 고지 */}
              <div className="space-y-4">
                <h5 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  주요 약관 고지 (필수 확인)
                </h5>
                <div className="space-y-3 text-xs text-slate-600 font-bold leading-relaxed">
                  <p className="flex gap-2"><ChevronRight size={14} className="text-blue-500 shrink-0" /> <b>보험 적용:</b> 자동차손해배상보장법에 따른 탁송종합보험 가입 기사가 운송하며, 사고 시 해당 보험 한도 내에서 처리됩니다 (대차 비용은 제외).</p>
                  <p className="flex gap-2"><ChevronRight size={14} className="text-blue-500 shrink-0" /> <b>과태료 책임:</b> 운행 중 기사 과실로 발생한 과태료는 회사가 통보받은 당일 즉시 대납합니다.</p>
                  <p className="flex gap-2"><ChevronRight size={14} className="text-blue-500 shrink-0" /> <b>예약 취소:</b> 당일 취소 시 50~100%의 위약금이 발생할 수 있습니다.</p>
                </div>
              </div>

              {/* 3. 달리고 '무적의 특약' */}
              <div className="space-y-4">
                <h5 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                  달리고 '무적의 특약' (분쟁 방지)
                </h5>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-3 text-xs text-blue-900 font-bold leading-relaxed">
                  <p>• <b>8지점 촬영 동의:</b> 기사가 타임스탬프 카메라로 촬영한 8지점 정밀 사진을 차량 상태의 유일한 객관적 증거로 인정합니다.</p>
                  <p>• <b>원시적 결함 면책:</b> 엔진, 미션 등 내부 기계적 고장 및 운송 전 발견되지 않은 미세 흠집은 면책 대상입니다.</p>
                  <p>• <b>불가항력 면책:</b> 주행 중 스톤칩(유리 돌튐), 타이어 펑크, 천재지변으로 인한 인도 지연은 책임을 묻지 않기로 합의합니다.</p>
                  <p>• <b>간접 손해 부제소:</b> 보험 범위를 초과하는 렌터카 비용이나 영업 손실에 대해 운송인에게 청구하지 않습니다.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 text-center">
                <p className="text-sm font-black text-slate-900 mb-2">4. 전자 서명 및 동의</p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                  <p className="text-[10px] text-blue-600 font-black mb-1">✓ 서비스 이용 및 면책 조항 동의 완료</p>
                  <p className="text-[10px] text-slate-400 font-bold">동의 일시: {new Date().toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  위 내용을 모두 확인하였으며, 위탁운임 납입 및 본 메시지 수신으로 <br />
                  계약 체결에 동의한 것으로 간주합니다.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              <button 
                onClick={handlePrintContract}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <Copy size={18} /> 계약서 출력 / PDF 저장
              </button>
              <button 
                onClick={async () => {
                  if (currentOrderId) {
                    try {
                      await updateDoc(doc(db, 'orders', currentOrderId), {
                        contractConfirmed: true,
                        confirmedAt: new Date().toISOString(),
                        contractSnapshot: {
                          id: contractData.id,
                          version: '1.0',
                          confirmedBy: formData.customerPhone
                        }
                      });
                    } catch (error) {
                      console.error("Error confirming contract:", error);
                    }
                  }
                  setShowContractPopup(false);
                  if (serviceType === 'jeju' || paymentMethod === 'prepaid') setShowBankPopup(true);
                  else alert('신청이 성공적으로 접수되었습니다.');
                }}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                최종 접수가 완료 되었습니다
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                메인 화면으로 (홈)
              </button>
              <p className="text-center mt-2 text-[10px] text-slate-400 font-bold">
                안전한 길의 파트너, 달리고 고객센터: 1844-1585
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 입금 계좌 팝업 */}
      {showBankPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-blue-600 p-8 text-white relative">
              <button 
                onClick={() => setShowBankPopup(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h4 className="text-2xl font-black mb-2">선불 결제 안내</h4>
              <p className="text-blue-100 font-bold">아래 계좌로 입금해주시면 확인 후 배차가 진행됩니다.</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Bank Account</p>
                <p className="text-xl font-black text-slate-900 mb-1">기업은행</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-blue-600 tracking-tighter">361-110962-01-017</p>
                  <button 
                    onClick={handleCopyAccount}
                    className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">예금주</span>
                  <span className="text-slate-900 font-black">모노솔루션 김우곤</span>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Info className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700 font-bold leading-relaxed">
                  입금 시 신청하신 연락처 뒷번호를 기재해주시면 더욱 빠른 확인이 가능합니다.
                </p>
              </div>
              <button 
                onClick={() => setShowBankPopup(false)}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl"
              >
                확인 완료
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                메인 화면으로 (홈)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
