import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  User, 
  Phone, 
  MapPin, 
  Navigation,
  ChevronRight, 
  PhoneCall, 
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Clock
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

interface ChauffeurFormProps {
  onBack: () => void;
  content?: any;
}

const ChauffeurForm: React.FC<ChauffeurFormProps> = ({ onBack, content }) => {
  const contactPhone = content?.contactPhone || "1844-1585";
  
  const labels = {
    clientTitle: content?.chauffeurFormClientTitle || "의뢰인 정보",
    departureTitle: content?.chauffeurFormDepartureTitle || "출발지 정보",
    destinationTitle: content?.chauffeurFormDestinationTitle || "도착지 정보",
    priceTitle: content?.chauffeurFormPriceTitle || "요금 정보",
    vehicleTitle: content?.chauffeurFormVehicleTitle || "차량 정보",
    submitLabel: content?.chauffeurFormSubmitLabel || "대리 신청하기"
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientPhone: '',
    carModel: '',
    startAddress: '',
    viaAddress: '',
    endAddress: '',
    transmission: '오토',
    paymentMethod: '후불',
    viaPhone: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    try {
      const path = 'chauffeur_requests';
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
        carModel: formData.transmission + ' (대리)',
        type: '대리운전',
        status: 'pending'
      });

              try {
                await fetch('/api/notify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'chauffeur',
                    data: {
                      user_name: '비회원',
                      user_phone: formData.clientPhone,
                      car_model: formData.carModel,
                      start_addr: formData.startAddress,
                      via_addr: formData.viaAddress,
                      via_phone: formData.viaPhone,
                      end_addr: formData.endAddress,
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
      handleFirestoreError(err, OperationType.WRITE, 'chauffeur_requests');
      setError('신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name.includes('Phone')) {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
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
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">신청 접수 완료</h2>
          <p className="text-slate-500 text-lg font-medium mb-12">
            최종요금 확정후 배차 안내 연락 드립니다
          </p>

          <div className="space-y-6">
            <a 
              href={`tel:${contactPhone.replace(/-/g, '')}`}
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

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-blue-600 p-10 lg:p-12 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Car className="w-10 h-10" />
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">대리 신청</h1>
            </div>
            <p className="text-blue-100 font-medium opacity-80">
              안전하고 편안한 귀가를 위해 최선을 다하겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-12">
            {/* Section 1: Client Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">의뢰인 정보</h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">연락처 (휴대폰 번호)</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vehicle Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">차량 정보</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">차량 모델명</label>
                  <div className="relative">
                    <Car className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      placeholder="예: 그랜저, 아반떼"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">변속기 종류</label>
                  <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Section 3: Payment Info */}
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

            {/* Section 4: Departure Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-black text-slate-900">출발지 정보</h2>
              </div>
              <div className="space-y-4">
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
                      placeholder="출발지 상세 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Destination Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Navigation className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-black text-slate-900">도착지 정보</h2>
              </div>
              <div className="space-y-4">
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
                      placeholder="도착지 상세 주소를 입력해 주세요"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 focus:bg-white rounded-2xl pl-14 pr-6 py-4 outline-none transition-all font-medium"
                    />
                  </div>
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
                    대리 신청하기 <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Banner */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-2">100% 보험 가입</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              모든 기사님은 대리운전 보험에 가입되어 있어 사고 발생 시 완벽한 보상을 약속드립니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-2">24시간 실시간 배차</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              연중무휴 24시간 운영팀이 대기하여 가장 가까운 곳의 베테랑 기사님을 즉시 배정합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChauffeurForm;
