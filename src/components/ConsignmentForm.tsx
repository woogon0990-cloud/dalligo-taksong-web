import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  Key,
  Fuel,
  User, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  PhoneCall, 
  CheckCircle2, 
  ArrowLeft,
  Truck,
  Navigation,
  Loader2,
  ShieldCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ConsignmentFormProps {
  onBack: () => void;
  content?: any;
}

const ConsignmentForm: React.FC<ConsignmentFormProps> = ({ onBack, content }) => {
  const contactPhone = content?.contactPhone || "1844-1585";
  
  // Labels from content
  useEffect(() => {
    if (content) {
      console.log("ConsignmentForm Content Received:", {
        departureTitle: content.consignmentFormDepartureTitle,
        destinationTitle: content.consignmentFormDestinationTitle,
        startAddress: content.consignmentFormStartAddressLabel,
        endAddress: content.consignmentFormEndAddressLabel,
        departureContact: content.consignmentFormDepartureContactLabel,
        destinationContact: content.consignmentFormDestinationContactLabel
      });
    }
  }, [content]);

  const labels = {
    clientTitle: content?.consignmentFormClientTitle || "의뢰인 정보",
    vehicleTitle: content?.consignmentFormVehicleTitle || "차량 정보",
    departureTitle: content?.consignmentFormDepartureTitle || "출발지 정보",
    destinationTitle: content?.consignmentFormDestinationTitle || "도착지 정보",
    paymentTitle: content?.consignmentFormPaymentTitle || "탁송료(선불,후불)",
    notesTitle: content?.consignmentFormNotesTitle || "기타 메모란(기사분에게 기타 요청 사항 기록)",
    transmission: content?.consignmentFormTransmissionLabel || "변속기",
    stick: content?.consignmentFormStickLabel || "스틱",
    siteContact: content?.consignmentFormSiteContactLabel || "현장 연락처",
    departureContact: content?.consignmentFormDepartureContactLabel || "출발지 연락처",
    destinationContact: content?.consignmentFormDestinationContactLabel || "도착지 연락처",
    startAddress: content?.consignmentFormStartAddressLabel || "출발지 주소",
    endAddress: content?.consignmentFormEndAddressLabel || "도착지 주소"
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    carModel: '',
    carNumber: '',
    keyLocation: '',
    drivable: '유',
    fuelType: '휘발유',
    transmission: '오토',
    accident: '무',
    valuables: '무',
    interiorCondition: '중',
    exteriorCondition: '중',
    currentFuel: '',
    startAddress: '',
    startPhone: '',
    viaAddress: '',
    viaPhone: '',
    endAddress: '',
    endPhone: '',
    notes: '',
    distance: '',
    paymentMethod: '후불'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'consignment_requests';
      const orderData = {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, path), orderData);
      
      // Also save to unified 'orders' collection as requested
      await addDoc(collection(db, 'orders'), {
        createdAt: serverTimestamp(),
        startAddress: formData.startAddress,
        viaAddress: formData.viaAddress,
        endAddress: formData.endAddress,
        clientPhone: formData.clientPhone,
        carModel: formData.carModel,
        carNumber: formData.carNumber,
        type: '탁송',
        status: 'pending'
      });

      // Send Telegram Notification
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'consignment',
            data: {
              user_name: formData.clientName,
              user_phone: formData.clientPhone,
              car_model: formData.carModel,
              car_number: formData.carNumber,
              key_location: formData.keyLocation,
              drivable: formData.drivable,
              fuel_type: formData.fuelType,
              transmission: formData.transmission,
              accident: formData.accident,
              valuables: formData.valuables,
              interior_condition: formData.interiorCondition,
              exterior_condition: formData.exteriorCondition,
              current_fuel: formData.currentFuel,
              start_addr: formData.startAddress,
              start_phone: formData.startPhone,
              via_addr: formData.viaAddress,
              via_phone: formData.viaPhone,
              end_addr: formData.endAddress,
              end_phone: formData.endPhone,
              payment_method: formData.paymentMethod,
              user_memo: formData.notes
            }
          })
        });
      } catch (notifyErr) {
        console.warn("Notification failed:", notifyErr);
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'consignment_requests');
      setError('상담 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('Phone')) {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 lg:p-16 text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">신청 접수 완료</h2>
          <p className="text-slate-500 text-lg font-medium mb-12">
            최종요금 확정후 배차 안내 연락 드립니다
          </p>

          <div className="space-y-6">
            <a 
              href="tel:1844-1585"
              className="flex items-center justify-center gap-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-2xl transition-all shadow-xl shadow-blue-600/30 animate-bounce"
            >
              <PhoneCall className="w-8 h-8" /> 지금 바로 전화하기
            </a>
            
            <button 
              onClick={onBack}
              className="text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          돌아가기
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="bg-blue-600 p-10 lg:p-12 text-white rounded-t-[3rem]">
            <div className="flex items-center gap-4 mb-4">
              <Truck className="w-10 h-10" />
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">탁송 신청</h1>
            </div>
            <p className="text-blue-100 font-medium opacity-80">
              정확한 정보를 입력해 주시면 더욱 빠른 견적 안내가 가능합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            {/* Section 1: Client Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">의뢰인 정보</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">성함</label>
                  <input 
                    required
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="홍길동"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">연락처</label>
                  <input 
                    required
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vehicle Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Car className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">차량 정보 (상세 체크)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량명</label>
                  <input 
                    required
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    placeholder="예: 그랜저, 아반떼"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량번호</label>
                  <input 
                    required
                    type="text"
                    name="carNumber"
                    value={formData.carNumber}
                    onChange={handleChange}
                    placeholder="예: 12가 3456"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량 키 보관 위치</label>
                  <input 
                    required
                    type="text"
                    name="keyLocation"
                    value={formData.keyLocation}
                    onChange={handleChange}
                    placeholder="예: 앞바퀴 위, 경비실 보관, 직접 전달 등"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">현재 운행가능 여부</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['유', '무'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, drivable: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.drivable === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">주유 유종</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['휘발유', '경유', '가스', '전기'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, fuelType: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.fuelType === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">변속기</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['오토', '스틱'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, transmission: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.transmission === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">사고 유/무</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['유', '무'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, accident: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.accident === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">실내 귀중품 유/무</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['유', '무'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, valuables: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.valuables === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량 실내 상태</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['상', '중', '하'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, interiorCondition: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.interiorCondition === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량 외관 상태</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['상', '중', '하'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, exteriorCondition: option }))}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          formData.exteriorCondition === option 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">현 주유량</label>
                  <input 
                    required
                    type="text"
                    name="currentFuel"
                    value={formData.currentFuel}
                    onChange={handleChange}
                    placeholder="예: 절반, 70%, 한칸 등"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Departure Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-black text-slate-900">출발지 정보</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">출발지 주소</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input 
                      required
                      type="text"
                      name="startAddress"
                      value={formData.startAddress}
                      onChange={handleChange}
                      placeholder="상세 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">출발지 연락처</label>
                  <input 
                    required
                    type="tel"
                    name="startPhone"
                    value={formData.startPhone}
                    onChange={handleChange}
                    placeholder="출발지 담당자 연락처"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Destination Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Navigation className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900">도착지 정보</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">도착지 주소</label>
                  <div className="relative">
                    <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
                    <input 
                      required
                      type="text"
                      name="endAddress"
                      value={formData.endAddress}
                      onChange={handleChange}
                      placeholder="상세 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">도착지 연락처</label>
                  <input 
                    required
                    type="tel"
                    name="endPhone"
                    value={formData.endPhone}
                    onChange={handleChange}
                    placeholder="도착지 담당자 연락처"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Stopover Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-black text-slate-900">경유지 정보 (선택사항)</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">경유지 주소</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input 
                      type="text"
                      name="viaAddress"
                      value={formData.viaAddress}
                      onChange={handleChange}
                      placeholder="경유지가 있다면 상세 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-amber-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">경유지 연락처</label>
                  <input 
                    type="tel"
                    name="viaPhone"
                    value={formData.viaPhone}
                    onChange={handleChange}
                    placeholder="경유지 담당자 연락처"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-amber-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Payment Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">결제 정보</h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">결제 방식</label>
                <div className="grid grid-cols-2 gap-4">
                  {['선불', '후불'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: option }))}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        formData.paymentMethod === option 
                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 7: Notes & Instructions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MessageSquare className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-black text-slate-900">기타 메모 및 기사님 요청사항</h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">탁송 기사님께 전달할 상세 내용을 자유롭게 적어주세요</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={8}
                  placeholder="차량 종류, 희망 시간, 키 보관 상세 방법, 차량 특이사항 등 기사님이 알아야 할 모든 정보를 상세히 적어주세요."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-400 focus:bg-white rounded-3xl px-8 py-6 outline-none transition-all font-medium resize-none text-lg leading-relaxed shadow-inner"
                />
              </div>
            </div>

            <div className="pt-6">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold text-center">
                  {error}
                </div>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> 접수 중...
                  </>
                ) : (
                  <>
                    탁송 신청하기 <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
              <p className="text-center text-slate-400 text-sm mt-6 font-medium">
                접수 즉시 담당자가 확인하여 연락드립니다.
              </p>
            </div>
          </form>
        </div>

        {/* Quick Call Banner */}
        <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">상담이 급하신가요?</h3>
            <p className="text-slate-400 font-medium tracking-tight">전화 한 통으로 즉시 배차 및 견적 확인이 가능합니다.</p>
          </div>
          <a 
            href={`tel:${contactPhone.replace(/-/g, '')}`}
            className="bg-[#FF9800] hover:bg-[#F57C00] text-white px-10 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-3 shadow-xl shadow-orange-500/20"
          >
            <PhoneCall className="w-6 h-6" /> {contactPhone}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentForm;
