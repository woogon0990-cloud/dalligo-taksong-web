import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Car, 
  Key,
  Fuel,
  ShieldAlert,
  Zap,
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
  AlertCircle,
  Search
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    carModel: '',
    drivable: '유',
    fuelType: '휘발유',
    transmission: '오토',
    accident: '무',
    mileage: '',
    valuables: '무',
    interiorCondition: '중',
    currentFuel: '',
    startAddress: '',
    startPhone: '',
    viaAddress: '',
    viaPhone: '',
    endAddress: '',
    endPhone: '',
    notes: '',
    distance: '',
    autoPrice: '',
    manualPrice: '',
    priceConfirmed: false
  });

  // Smart Distance & Consignment Price Calculation using Gemini
  const calculateConsignment = async (isManual = false) => {
    // Lower threshold to trigger calculation more easily
    const canCalculate = formData.startAddress.trim().length >= 2 && formData.endAddress.trim().length >= 2;
    
    if (canCalculate || isManual) {
      setIsCalculating(true);
      setError(null);
      
      try {
        const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          console.warn("GEMINI_API_KEY is missing.");
          setFormData(prev => ({ ...prev, autoPrice: '상담 후 결정', distance: '계산 불가' }));
          setIsCalculating(false);
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Estimate the actual driving distance in km and a realistic market-standard 'Consignment Fee' (탁송료) in KRW for a professional driver to transport a car between these South Korean locations.
          
          Start: ${formData.startAddress}
          ${formData.viaAddress ? `Via (Stopover): ${formData.viaAddress}` : ''}
          End: ${formData.endAddress}
          
          CRITICAL PRICING LOGIC:
          1. If there is NO stopover: Calculate the direct price from Start to End based on current South Korean market rates.
          2. If there IS a stopover (Via): 
             - Calculate the price for Segment A (Start to Via).
             - Calculate the price for Segment B (Via to End).
             - The total base price should be the SUM of Segment A and Segment B. This is because a stopover significantly increases the driver's time and complexity.
          
          Market Benchmarks for Consignment (탁송):
          - Consignment is more expensive than Chauffeur (대리) because it involves one-way transport where the driver must return independently.
          - Very Short (within city): ~35,000 - 55,000 KRW.
          - Medium (e.g., 50-100km): ~60,000 - 100,000 KRW.
          - Long (e.g., 150km+): ~110,000 - 160,000 KRW.
          - Extreme Long (e.g., Seoul to Busan ~400km): ~180,000 - 250,000 KRW.
          
          Example Case: Cheonan to Daegu is ~110,000 KRW. Daegu to Busan is ~60,000 KRW. A trip from Cheonan to Busan VIA Daegu should be ~170,000 KRW + stopover fee.
          
          Return ONLY a JSON object: {"km": number, "price": number}. The "price" should be the total base price (excluding the final 10,000 KRW stopover surcharge which will be added by the system).
          If you cannot estimate, return {"km": 0, "price": 0}.`,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0,
            responseMimeType: "application/json"
          }
        });

        let result = { km: 0, price: 0 };
        try {
          const text = response.text || '{"km": 0, "price": 0}';
          const jsonStr = text.replace(/```json\n?|```/g, '').trim();
          result = JSON.parse(jsonStr);
        } catch (parseErr) {
          console.error("JSON parse failed:", parseErr, response.text);
        }

        let dist = result.km || 0;
        let price = result.price || 0;
        
        if (dist === 0) {
          setFormData(prev => ({ ...prev, autoPrice: '상담 후 결정', distance: '계산 불가' }));
          return;
        }

        // Add stopover fee if viaAddress is provided
        if (formData.viaAddress.trim()) {
          price += 10000;
        }

        setFormData(prev => ({ 
          ...prev, 
          distance: `${dist.toFixed(1)}km`,
          autoPrice: price > 0 ? price.toLocaleString() + '원' : '상담 후 결정'
        }));
      } catch (err) {
        console.error("AI Consignment calculation failed:", err);
        setFormData(prev => ({ ...prev, autoPrice: '상담 후 결정', distance: '계산 불가' }));
      } finally {
        setIsCalculating(false);
      }
    } else {
      setFormData(prev => ({ ...prev, autoPrice: '', distance: '' }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => calculateConsignment(false), 1000);
    return () => clearTimeout(timer);
  }, [formData.startAddress, formData.endAddress, formData.viaAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.priceConfirmed && formData.autoPrice && formData.autoPrice !== '상담 후 결정') {
      setError('자동 산정된 탁송료를 확인하고 체크박스를 선택해 주세요.');
      const element = document.getElementById('price-section');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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
        type: '탁송',
        status: 'pending'
      });

      // Send Kakao Notification
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'consignment',
            data: {
              name: formData.clientName,
              phone: formData.clientPhone,
              start: formData.startAddress,
              via: formData.viaAddress,
              viaPhone: formData.viaPhone,
              end: formData.endAddress,
              carType: formData.carModel,
              proposedPrice: formData.manualPrice || formData.autoPrice
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
    } else if (name === 'mileage') {
      setFormData(prev => ({ ...prev, [name]: formatNumber(value) }));
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
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">신청 접수 대기</h2>
          <p className="text-slate-500 text-lg font-medium mb-12">
            입금이 확인되는 대로 즉시 전문가가 배정되어 연락드리겠습니다.<br />
            급하신 용무는 아래 버튼을 눌러 바로 전화주세요.
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
                <h2 className="text-xl font-black text-slate-900">{labels.clientTitle}</h2>
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

            {/* Section: Vehicle Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Car className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">{labels.vehicleTitle}</h2>
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
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">주유 유종</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  <label className="text-sm font-bold text-slate-500 ml-1">{labels.transmission}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['오토', labels.stick].map(option => (
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
                  <label className="text-sm font-bold text-slate-500 ml-1">운행 거리 (km)</label>
                  <input 
                    required
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="예: 50,000"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                  />
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

                <div className="space-y-2 md:col-span-2">
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

            {/* Section 2: Departure Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-black text-slate-900">{labels.departureTitle}</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">{labels.startAddress}</label>
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
                  <label className="text-sm font-bold text-slate-500 ml-1">{labels.departureContact}</label>
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

            {/* Section 3: Stopover Info */}
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

            {/* Section 4: Destination Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Navigation className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900">{labels.destinationTitle}</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">{labels.endAddress}</label>
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
                  <label className="text-sm font-bold text-slate-500 ml-1">{labels.destinationContact}</label>
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

            {/* Section: Price Calculation */}
            <div id="price-section" className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Zap className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-black text-slate-900">탁송료 자동 산정 (전국 기준)</h2>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-6 lg:p-8 border border-slate-100">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">예상 탁송 요금</span>
                    {isCalculating ? (
                      <div className="flex items-center gap-2 text-blue-600 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" /> 전국 노선 조회 중...
                      </div>
                    ) : formData.autoPrice ? (
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => calculateConsignment(true)}
                            className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-lg transition-colors font-bold"
                          >
                            재계산
                          </button>
                          <div className="text-2xl font-black text-blue-600">{formData.autoPrice}</div>
                        </div>
                        <div className="text-xs text-slate-400 font-medium">예상 주행거리: {formData.distance}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => calculateConsignment(true)}
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl transition-colors font-bold"
                          >
                            요금 계산하기
                          </button>
                          <span className="text-slate-400 text-sm">출발/도착 주소를 입력해 주세요.</span>
                        </div>
                        {!(process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY) && (
                          <div className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-lg">
                            ※ 설정에서 GEMINI_API_KEY를 입력해 주세요.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200">
                      <label className="text-sm font-bold text-slate-500 block mb-2">요금 직접 제안 (선택사항)</label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="manualPrice"
                          value={formData.manualPrice}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^\d]/g, '');
                            setFormData(prev => ({ ...prev, manualPrice: val ? Number(val).toLocaleString() + '원' : '' }));
                          }}
                          placeholder="예: 40,000"
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-bold text-blue-600 pr-10 sm:pr-40"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] sm:text-xs font-bold pointer-events-none hidden sm:block">원하시는 요금이 있다면 입력해 주세요</div>
                      </div>
                    </div>

                    {formData.autoPrice && formData.autoPrice !== '상담 후 결정' && (
                      <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
                        <input 
                          type="checkbox"
                          name="priceConfirmed"
                          checked={formData.priceConfirmed}
                          onChange={(e) => setFormData(prev => ({ ...prev, priceConfirmed: e.target.checked }))}
                          className="w-6 h-6 rounded-lg text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-slate-700">위 예상 요금을 확인했습니다. (최종 요금은 상담 시 확정)</span>
                      </label>
                    )}
                  </div>

                  <div className="mt-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                      ※ 위 요금은 전국 표준 탁송료를 기준으로 산정된 예상치입니다. <br />
                      ※ 기상 악화, 야간/새벽 시간대, 특수 차량 여부에 따라 실제 배차 시 요금이 변동될 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Payment Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">결제 안내 (선입금 원칙)</h2>
              </div>
              <div className="bg-blue-50 rounded-3xl p-6 lg:p-8 border border-blue-100">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-blue-800">입금 계좌</span>
                    <div className="text-xl font-black text-blue-900">기업은행: 361-110962-01-017</div>
                    <div className="text-lg font-bold text-blue-700">예금주: 모노솔루션 김우곤</div>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-blue-200">
                    <p className="text-xs text-blue-800 leading-relaxed font-bold">
                      ※ 탁송료는 선입금 확인 후 배차 등록이 진행됩니다.<br />
                      ※ 추가 주유비 등 기사 지출 사항 발생 시에는 기사님께 영수증 확인 후 따로 정산해 주셔야 합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Notes */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MessageSquare className="w-5 h-5 text-slate-600" />
                <h2 className="text-xl font-black text-slate-900">{labels.notesTitle}</h2>
              </div>
              <div className="space-y-2">
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="차량 종류, 희망 시간 등 추가 요청사항을 적어주세요"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-slate-400 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-medium resize-none"
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
                    입금 확인 후 신청하기 <ChevronRight className="w-6 h-6" />
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
