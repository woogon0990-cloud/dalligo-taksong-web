import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, AppContent, PricingItem } from './types';
import { db, auth } from './firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if admin based on email
          const isAdmin = firebaseUser.email?.toLowerCase() === 'woogon0990@gmail.com';
          console.log("Auth State Changed:", firebaseUser.email, "isAdmin:", isAdmin);
          
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: isAdmin ? 'admin' : 'user'
          };

          setUser(userData);

          // Ensure user document exists in Firestore (non-blocking)
          if (isAdmin) {
            const userRef = doc(db, 'users', firebaseUser.uid);
            setDoc(userRef, {
              email: firebaseUser.email,
              role: 'admin',
              updatedAt: serverTimestamp()
            }, { merge: true }).catch(e => {
              console.warn("Failed to ensure admin document:", e);
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login Error:", error);
      let errorMessage = "로그인 중 오류가 발생했습니다.";
      if (error.code === 'auth/user-not-found') errorMessage = "등록되지 않은 이메일입니다.";
      else if (error.code === 'auth/wrong-password') errorMessage = "비밀번호가 올바르지 않습니다.";
      else if (error.code === 'auth/invalid-email') errorMessage = "유효하지 않은 이메일 형식입니다.";
      return { success: false, error: errorMessage };
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      console.error("Google Login Error:", error);
      return { success: false, error: "구글 로그인 중 오류가 발생했습니다." };
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Register Error:", error);
      let errorMessage = "회원가입 중 오류가 발생했습니다.";
      if (error.code === 'auth/email-already-in-use') errorMessage = "이미 사용 중인 이메일입니다.";
      else if (error.code === 'auth/weak-password') errorMessage = "비밀번호가 너무 취약합니다.";
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      let errorMessage = "이메일 발송 중 오류가 발생했습니다.";
      if (error.code === 'auth/user-not-found') errorMessage = "등록되지 않은 이메일입니다.";
      else if (error.code === 'auth/invalid-email') errorMessage = "유효하지 않은 이메일 형식입니다.";
      return { success: false, error: errorMessage };
    }
  }, []);

  const authValue = useMemo(() => ({ 
    user, 
    login, 
    loginWithGoogle,
    register, 
    logout, 
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading
  }), [user, login, loginWithGoogle, register, logout, resetPassword, isLoading]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Content Context to manage editable content
interface ContentContextType {
  content: AppContent;
  updateContent: (newContent: Partial<AppContent>) => Promise<void>;
  resetContent: () => Promise<void>;
  addPopup: (popup: Omit<AppContent['popups'][0], 'id'>) => Promise<void>;
  deletePopup: (id: string) => Promise<void>;
  togglePopup: (id: string) => Promise<void>;
  forceFixContent: () => Promise<void>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DEFAULT_PRICING: PricingItem[] = [
  { dist: "0 ~ 20km", price: "15,000원 ~ 20,000원", type: "시내 권역" },
  { dist: "20 ~ 50km", price: "20,000원 ~ 30,000원", type: "근교 권역" },
  { dist: "50 ~ 100km", price: "30,000원 ~ 50,000원", type: "중거리" },
  { dist: "100km 이상", price: "50,000원 ~ 200,000원+", type: "장거리/전국" }
];

const DEFAULT_CONTENT: AppContent = {
  heroTitle: "대한민국 어디든 부르면 바로 달리고!",
  heroSubtitle: "전국 100% 보험 가입 전문 기사 실시간 배차",
  heroDescription: "24시간 Full-Care: 대한민국 어디든 바로 달려갑니다.\n\n안전 그 이상의 가치: 전 기사 100% 보험 가입으로 안심하고 맡기세요.\n\n비교 불가한 전문성: 복잡한 절차는 달리고가 해결합니다. 고객님은 열쇠만 건네세요.",
  heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1280&q=75",
  contactPhone: "1844-1585",
  contactAddress: "천안시 동남구 양지11길11 양란하우스 4F",
  businessNumber: "315-08-82083",
  pricingTable: DEFAULT_PRICING,
  footerText: "© 2026 달리고 탁송 (monosolution). All Rights Reserved.",
  footerDescription: "달리고 탁송은 대한민국 어디든 부르면 바로 달려가는 신속하고 안전한 차량 탁송 전문 기업입니다. 100% 보험 가입 전문 기사 배차로 고객님의 소중한 자산을 안전하게 운송하겠습니다.",
  footerLogoText: "달리고 탁송/대리",
  footerSubText: "달리고 탁송 서비스",
  servicePartner: "일류전국탁송",
  servicesTitle: "믿을 수 있는 탁송 서비스",
  pricingTitle: "전국 자동차 탁송 요율표",
  processTitle: "탁송 진행 절차",
  bannerTitle: "전문 탁송 기사님 실시간 배차",
  logoText: "달리고",
  logoImage: "",
  navConsignment: "탁송서비스",
  navScrap: "폐차/수출",
  navChauffeur: "대리운전",
  navRecruitment: "기사모집",
  navCustomerCenter: "고객센터",
  heroConsignmentTitle: "탁송 신청",
  heroConsignmentDesc: "실시간 전문가 1:1 상담 연결",
  heroScrapTitle: "폐차 신청",
  heroScrapDesc: "당일 최고가 시세 확인하기",
  heroChauffeurTitle: "대리 신청",
  heroChauffeurDesc: "신속하고 안전한 대리운전 서비스",
  // Consignment Page
  consignmentHeroTitle: "탁송 서비스",
  consignmentHeroSubtitle: "전국 어디든 안전하고 신속하게",
  consignmentBadgeText: "안전하고 믿을 수 있는 배송 | 달리고 탁송",
  consignmentFeaturesTitle: "달리고 탁송만의 특별함",
  consignmentProcessTitle: "탁송 서비스 이용 안내",
  consignmentBannerTitle: "지금 바로 탁송 상담을 받아보세요",
  consignmentBannerSubtitle: "24시간 연중무휴 실시간 배차 시스템",
  consignmentFormClientTitle: "의뢰인 정보(연락처)",
  consignmentFormVehicleTitle: "차량 정보",
  consignmentFormDepartureTitle: "출발지 정보",
  consignmentFormDestinationTitle: "도착지 정보",
  consignmentFormPaymentTitle: "탁송료(선불,후불)",
  consignmentFormNotesTitle: "기타 메모란(기사분에게 기타 요청 사항 기록)",
  consignmentFormTransmissionLabel: "변속기",
  consignmentFormStickLabel: "스틱",
  consignmentFormSiteContactLabel: "현장 연락처",
  consignmentFormDepartureContactLabel: "출발지 연락처",
  consignmentFormDestinationContactLabel: "도착지 연락처",
  consignmentFormStartAddressLabel: "출발지 주소",
  consignmentFormEndAddressLabel: "도착지 주소",
  consignmentFormSubmitLabel: "탁송 신청하기",
  consignmentFormHeroButtonLabel: "탁송 신청하기",
  consignmentFormBannerButtonLabel: "탁송 신청하기",

  // Chauffeur Page
  chauffeurHeroTitle: "대리운전 서비스",
  chauffeurHeroSubtitle: "안전하고 편안한 귀가를 약속드립니다",
  chauffeurBadgeText: "24시간 신속 배차 | 달리고 대리운전",
  chauffeurFeaturesTitle: "달리고 대리운전만의 특별함",
  chauffeurProcessTitle: "대리운전 이용 안내",
  chauffeurBannerTitle: "지금 바로 대리운전 상담을 받아보세요",
  chauffeurBannerSubtitle: "전 기사 100% 보험 가입으로 안심하고 이용하세요",
  chauffeurPricingTitle: "대리운전 요금 안내",
  chauffeurPricingTable: [
    { dist: "0 ~ 20km", price: "15,000원 ~ 20,000원", type: "시내 권역" },
    { dist: "20 ~ 50km", price: "20,000원 ~ 30,000원", type: "근교 권역" },
    { dist: "50 ~ 100km", price: "30,000원 ~ 50,000원", type: "중거리" },
    { dist: "100km 이상", price: "50,000원 ~ 200,000원+", type: "장거리/전국" }
  ],
  chauffeurPricingConditions: [
    { title: "할증 요율", description: "야간(22시~04시), 주말 및 공휴일, 기상 악화(폭설, 폭우) 시 기본 요금에서 1~2만 원의 할증이 발생할 수 있습니다." },
    { title: "차종 및 지역", description: "대형 세단, 수입차, 특수 차량 또는 산간 오지/도서 지역 운행 시 추가 비용이 협의될 수 있습니다." },
    { title: "경유 및 대기", description: "운행 중 경유지 추가 시 지점당 5,000원~10,000원, 기사 도착 후 대기 시 10분당 5,000원의 추가금이 발생합니다." }
  ],
  chauffeurCancellationPolicy: [
    { time: "배차 직후 취소", policy: "운행 요금의 20% 위약금 발생", color: "text-orange-600", bg: "bg-orange-50" },
    { time: "출발 전 취소", policy: "운행 요금의 50% 위약금 발생 (배차 30분 경과 시)", color: "text-red-600", bg: "bg-red-50" },
    { time: "현장 도착 후", policy: "취소 수수료 10,000원 + 대기료 별도 청구", color: "text-red-700", bg: "bg-red-100" }
  ],
  chauffeurExemptionClauses: [
    { title: "기존 결함", description: "차량의 노후화로 인한 엔진, 미션, 전기 장치 등 기존 기계적 결함에 대해서는 책임을 지지 않습니다." },
    { title: "소모품 및 외관", description: "운행 중 발생하는 타이어 펑크, 유리 스톤칩, 단순 소모품 마모는 면책 사항에 해당합니다." },
    { title: "간접 손해", description: "사고 발생 시 수리비 외의 대차료(렌트비), 영업 손실, 휴차 보상 등 간접적인 손해는 보상 범위에서 제외됩니다." }
  ],

  // Scrap Page
  scrapHeroTitle: "폐차/수출 서비스",
  scrapHeroSubtitle: "당일 최고가 매입 및 신속한 말소 처리",
  scrapFormTitle: "폐차/수출 무료 견적 신청",
  scrapProcessTitle: "폐차/수출 진행 절차",
  scrapGuideTitle: "폐차 시 필요 서류 안내",
  scrapPriceTitle: "차종별 예상 매입 시세",
  scrapBannerTitle: "소중한 내 차, 정직한 가격으로",
  scrapBannerSubtitle: "복잡한 서류 절차부터 말소까지 한 번에",
  scrapLegalNotice: [
    { title: "서비스의 성격", description: "본 업체는 국토교통부 정식 허가를 받은 '자동차 해체 재활용업자(관허폐차장)' 및 '수출 매입 전문 기업'과 전략적 협력 관계를 맺고, 고객의 차량 처분을 돕는 매입 중개 및 상담 서비스를 제공합니다." },
    { title: "책임의 한계", description: "\"달리고 탁송·대리\"는 차량 매입에 관한 정보 전달 및 연결 업무를 수행하며, 실제 폐차 인수증명서 발행, 자동차 등록 말소 처리, 매매 대금의 최종 정산 등 실무적인 계약 및 행정 처리는 해당 협력 업체(관허업체)의 책임 하에 진행됩니다." },
    { title: "분쟁 해결", description: "차량의 상태 점검, 최종 매입 가격 결정 및 대금 지급과 관련된 직접적인 계약 관계는 고객님과 해당 협력사 간에 성립됩니다. 당사는 원활한 상담을 지원하나, 협력사의 개별적인 계약 위반이나 과실로 인한 분쟁에 대해서는 법적 책임이 없음을 알려드립니다." },
    { title: "안전 가이드", description: "당사는 고객님의 안전한 거래를 위해 협력 업체의 사업자 등록증 및 영업사원증을 상시 확인하고 있으며, 고객님께서도 차량 인도 전 반드시 매입 대금을 선입금 받으시길 권장합니다." }
  ],
  scrapStrategicPoints: [
    { title: "중개자 역할", description: "정식 관허업체로 연결해 드리는 중개 및 상담 서비스를 제공합니다." },
    { title: "선입금 원칙", description: "차량 인도 전 매입 대금을 선입금 받아 사기 피해를 원천 차단합니다." },
    { title: "행정 처리 주체", description: "말소 처리 및 증명서 발급은 협력 폐차장에서 직접 수행합니다." },
    { title: "압류/저당 조회", description: "원활한 진행을 위해 신청 전 압류 및 저당 조회를 권장합니다." }
  ],

  // Recruitment Page
  recruitmentHeroTitle: "달리고 기사 모집",
  recruitmentHeroSubtitle: "대한민국 No.1 탁송 플랫폼과 함께하세요",
  recruitmentSupportTitle: "달리고만의 기사 지원 혜택",
  recruitmentGuideTitle: "기사 등록 및 활동 안내",
  recruitmentRentalTitle: "탁송 전용 렌탈 차량 안내",
  recruitmentBannerTitle: "지금 바로 달리고 기사로 등록하세요",
  recruitmentBannerSubtitle: "자유로운 시간 선택과 안정적인 수익 보장",

  // Customer Center Page
  customerHeroTitle: "고객센터",
  customerHeroSubtitle: "궁금하신 점을 친절히 안내해 드립니다",

  // Chauffeur Form Labels
  chauffeurFormClientTitle: "의뢰인 정보",
  chauffeurFormDepartureTitle: "출발지 정보",
  chauffeurFormDestinationTitle: "도착지 정보",
  chauffeurFormPriceTitle: "요금 정보",
  chauffeurFormVehicleTitle: "차량 정보",
  chauffeurFormSubmitLabel: "대리 신청하기",
  chauffeurFormBannerButtonLabel: "대리 신청하기",

  // Footer Headers
  footerServiceTitle: "서비스 안내",
  footerCustomerTitle: "고객센터",
  footerCompanyTitle: "회사정보",
  services: [
    {
      id: '1',
      title: "일반탁송",
      description: "베테랑 기사의 1:1 맞춤 배차로 전국 어디든 안전하게 도어 투 도어 서비스를 제공합니다.",
      tag: "#1:1 안전 탁송",
      iconName: "Car",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=400"
    },
    {
      id: '2',
      title: "견인탁송",
      description: "견인차를 이용한 운송 및 무주행 이동이 필요한 차량을 위한 전문 서비스입니다.",
      tag: "#견인/무주행 이동",
      iconName: "Truck",
      image: "https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '3',
      title: "특수차탁송",
      description: "크레인, 굴착기 등 대형 특수 장비 및 특장 차량 운송을 위한 전문 인력을 배치합니다.",
      tag: "#특수차량 전문",
      iconName: "HardHat",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&h=400"
    },
    {
      id: '4',
      title: "캐리어탁송",
      description: "카 캐리어를 이용한 안전한 운송 및 수입차, 신차 등 프리미엄 탁송 서비스를 제공합니다.",
      tag: "#프리미엄 캐리어",
      iconName: "Zap",
      image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=600&h=400"
    },
    {
      id: '5',
      title: "대형차탁송",
      description: "버스, 대형 트럭, 캠핑카 등 규격이 큰 차량의 안정적인 운행을 위한 전문 면허 기사를 파견합니다.",
      tag: "#버스/트럭 전문",
      iconName: "Bus",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&h=400"
    },
    {
      id: '6',
      title: "제주도탁송",
      description: "육지에서 제주도로, 제주도에서 전국으로 이어지는 내륙-항만 통합 원스톱 운송입니다.",
      tag: "#내륙-제주 원스톱",
      iconName: "Ship",
      image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=600&h=400"
    }
  ],
  steps: [
    { id: "01", title: "탁송 신청", desc: "차종 및 지역 정보 기반\n실시간 무료 견적 상담" },
    { id: "02", title: "현장픽업", desc: "원하는 시간과 장소로\n전문 기사가 방문하여 인수" },
    { id: "03", title: "대금지급", desc: "차량 입고 즉시 확인 후\n협력사를 통해 당일 최고가 지급" },
    { id: "04", title: "말소처리", desc: "협력 폐차장에서 말소 신고 대행 후\n증명서를 안전하게 전달" }
  ],
  pricingConditions: [
    { title: "요금 변동", description: "야간, 주말, 공휴일 및 기상 악화 시 기본 요금 대비 1~2만 원의 할증이 적용될 수 있습니다." },
    { title: "실비 정산", description: "고속도로 통행료 및 유류비는 고객 부담이며, 영수증 기반 사후 정산을 원칙으로 합니다." },
    { title: "특수 차량", description: "대형 화물, 특장차, 고가의 슈퍼카 등은 별도의 프리미엄 요율이 적용됩니다." },
    { title: "과태료 처리", description: "운행 중 발생한 신호위반, 과속 등 교통법규 위반 과태료는 회사에서 100% 책임 처리해 드립니다." }
  ],
  cancellationPolicy: [
    { time: "예약 확정 후", policy: "운행 요금의 20% 위약금", color: "text-orange-600", bg: "bg-orange-50" },
    { time: "배차 완료 후", policy: "운행 요금의 50% 위약금", color: "text-red-600", bg: "bg-red-50" },
    { time: "당일/현장 취소", policy: "환불 불가 (기사 이동 비용 포함)", color: "text-red-700", bg: "bg-red-100" }
  ],
  consignmentExemptionClauses: [
    { title: "불가항력", description: "천재지변, 전쟁, 폭동 등 불가항력적인 사유로 발생한 사고나 지연에 대해서는 면책됩니다." },
    { title: "귀중품 분실", description: "사전에 고지되지 않은 차량 내 현금, 귀금속 등 고가의 유실물에 대해서는 책임을 지지 않습니다." },
    { title: "비순정 부품", description: "비순정 튜닝 부품이나 사후 장착된 액세서리의 파손은 보험 보상 범위에서 제외될 수 있습니다." }
  ],
  popups: []
};

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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const contentRef = doc(db, 'site_content', 'main');
    
    const unsubscribe = onSnapshot(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.data() as any;
        
        // Helper to ensure string values
        const s = (val: any, fallback: string) => (typeof val === 'string' ? val : fallback);

        // Merge with DEFAULT_CONTENT to ensure no missing fields
        const data: AppContent = {
          ...DEFAULT_CONTENT,
          ...rawData,
          heroTitle: s(rawData.heroTitle, DEFAULT_CONTENT.heroTitle),
          heroSubtitle: s(rawData.heroSubtitle, DEFAULT_CONTENT.heroSubtitle),
          heroDescription: s(rawData.heroDescription, DEFAULT_CONTENT.heroDescription),
          logoText: s(rawData.logoText, DEFAULT_CONTENT.logoText),
          logoImage: s(rawData.logoImage, DEFAULT_CONTENT.logoImage),
          contactPhone: s(rawData.contactPhone, DEFAULT_CONTENT.contactPhone),
          businessNumber: s(rawData.businessNumber, DEFAULT_CONTENT.businessNumber),
          contactAddress: s(rawData.contactAddress, DEFAULT_CONTENT.contactAddress),
          servicePartner: s(rawData.servicePartner, DEFAULT_CONTENT.servicePartner),
          footerText: s(rawData.footerText, DEFAULT_CONTENT.footerText),
          servicesTitle: s(rawData.servicesTitle, DEFAULT_CONTENT.servicesTitle),
          pricingTitle: s(rawData.pricingTitle, DEFAULT_CONTENT.pricingTitle),
          processTitle: s(rawData.processTitle, DEFAULT_CONTENT.processTitle),
          bannerTitle: s(rawData.bannerTitle, DEFAULT_CONTENT.bannerTitle),
          navConsignment: s(rawData.navConsignment, DEFAULT_CONTENT.navConsignment),
          navScrap: s(rawData.navScrap, DEFAULT_CONTENT.navScrap),
          navRecruitment: s(rawData.navRecruitment, DEFAULT_CONTENT.navRecruitment),
          navCustomerCenter: s(rawData.navCustomerCenter, DEFAULT_CONTENT.navCustomerCenter),
          heroConsignmentTitle: s(rawData.heroConsignmentTitle, DEFAULT_CONTENT.heroConsignmentTitle),
          heroConsignmentDesc: s(rawData.heroConsignmentDesc, DEFAULT_CONTENT.heroConsignmentDesc),
          heroScrapTitle: s(rawData.heroScrapTitle, DEFAULT_CONTENT.heroScrapTitle),
          heroScrapDesc: s(rawData.heroScrapDesc, DEFAULT_CONTENT.heroScrapDesc),
          heroChauffeurTitle: s(rawData.heroChauffeurTitle, DEFAULT_CONTENT.heroChauffeurTitle),
          heroChauffeurDesc: s(rawData.heroChauffeurDesc, DEFAULT_CONTENT.heroChauffeurDesc),
          // Consignment Page
          consignmentHeroTitle: s(rawData.consignmentHeroTitle, DEFAULT_CONTENT.consignmentHeroTitle),
          consignmentHeroSubtitle: s(rawData.consignmentHeroSubtitle, DEFAULT_CONTENT.consignmentHeroSubtitle),
          consignmentBadgeText: s(rawData.consignmentBadgeText, DEFAULT_CONTENT.consignmentBadgeText),
          consignmentFeaturesTitle: s(rawData.consignmentFeaturesTitle, DEFAULT_CONTENT.consignmentFeaturesTitle),
          consignmentProcessTitle: s(rawData.consignmentProcessTitle, DEFAULT_CONTENT.consignmentProcessTitle),
          consignmentBannerTitle: s(rawData.consignmentBannerTitle, DEFAULT_CONTENT.consignmentBannerTitle),
          consignmentBannerSubtitle: s(rawData.consignmentBannerSubtitle, DEFAULT_CONTENT.consignmentBannerSubtitle),
          consignmentFormClientTitle: s(rawData.consignmentFormClientTitle, DEFAULT_CONTENT.consignmentFormClientTitle),
          consignmentFormVehicleTitle: s(rawData.consignmentFormVehicleTitle, DEFAULT_CONTENT.consignmentFormVehicleTitle),
          consignmentFormDepartureTitle: s(rawData.consignmentFormDepartureTitle, DEFAULT_CONTENT.consignmentFormDepartureTitle),
          consignmentFormDestinationTitle: s(rawData.consignmentFormDestinationTitle, DEFAULT_CONTENT.consignmentFormDestinationTitle),
          consignmentFormPaymentTitle: s(rawData.consignmentFormPaymentTitle, DEFAULT_CONTENT.consignmentFormPaymentTitle),
          consignmentFormTransmissionLabel: s(rawData.consignmentFormTransmissionLabel, DEFAULT_CONTENT.consignmentFormTransmissionLabel),
          consignmentFormStickLabel: s(rawData.consignmentFormStickLabel, DEFAULT_CONTENT.consignmentFormStickLabel),
          consignmentFormSiteContactLabel: s(rawData.consignmentFormSiteContactLabel, DEFAULT_CONTENT.consignmentFormSiteContactLabel),
          consignmentFormDepartureContactLabel: s(rawData.consignmentFormDepartureContactLabel, DEFAULT_CONTENT.consignmentFormDepartureContactLabel),
          consignmentFormDestinationContactLabel: s(rawData.consignmentFormDestinationContactLabel, DEFAULT_CONTENT.consignmentFormDestinationContactLabel),
          consignmentFormStartAddressLabel: s(rawData.consignmentFormStartAddressLabel, DEFAULT_CONTENT.consignmentFormStartAddressLabel),
          consignmentFormEndAddressLabel: s(rawData.consignmentFormEndAddressLabel, DEFAULT_CONTENT.consignmentFormEndAddressLabel),
          consignmentFormSubmitLabel: s(rawData.consignmentFormSubmitLabel, DEFAULT_CONTENT.consignmentFormSubmitLabel),
          consignmentFormHeroButtonLabel: s(rawData.consignmentFormHeroButtonLabel, DEFAULT_CONTENT.consignmentFormHeroButtonLabel),
          consignmentFormBannerButtonLabel: s(rawData.consignmentFormBannerButtonLabel, DEFAULT_CONTENT.consignmentFormBannerButtonLabel),
          consignmentExemptionClauses: (rawData.consignmentExemptionClauses && Array.isArray(rawData.consignmentExemptionClauses) && rawData.consignmentExemptionClauses.length > 0) ? rawData.consignmentExemptionClauses : DEFAULT_CONTENT.consignmentExemptionClauses,

          // Chauffeur Page
          chauffeurHeroTitle: s(rawData.chauffeurHeroTitle, DEFAULT_CONTENT.chauffeurHeroTitle),
          chauffeurHeroSubtitle: s(rawData.chauffeurHeroSubtitle, DEFAULT_CONTENT.chauffeurHeroSubtitle),
          chauffeurBadgeText: s(rawData.chauffeurBadgeText, DEFAULT_CONTENT.chauffeurBadgeText),
          chauffeurFeaturesTitle: s(rawData.chauffeurFeaturesTitle, DEFAULT_CONTENT.chauffeurFeaturesTitle),
          chauffeurProcessTitle: s(rawData.chauffeurProcessTitle, DEFAULT_CONTENT.chauffeurProcessTitle),
          chauffeurBannerTitle: s(rawData.chauffeurBannerTitle, DEFAULT_CONTENT.chauffeurBannerTitle),
          chauffeurBannerSubtitle: s(rawData.chauffeurBannerSubtitle, DEFAULT_CONTENT.chauffeurBannerSubtitle),
          chauffeurPricingTitle: s(rawData.chauffeurPricingTitle, DEFAULT_CONTENT.chauffeurPricingTitle),
          chauffeurPricingTable: (rawData.chauffeurPricingTable && Array.isArray(rawData.chauffeurPricingTable) && rawData.chauffeurPricingTable.length > 0) ? rawData.chauffeurPricingTable : DEFAULT_CONTENT.chauffeurPricingTable,
          chauffeurPricingConditions: (rawData.chauffeurPricingConditions && Array.isArray(rawData.chauffeurPricingConditions) && rawData.chauffeurPricingConditions.length > 0) ? rawData.chauffeurPricingConditions : DEFAULT_CONTENT.chauffeurPricingConditions,
          chauffeurCancellationPolicy: (rawData.chauffeurCancellationPolicy && Array.isArray(rawData.chauffeurCancellationPolicy) && rawData.chauffeurCancellationPolicy.length > 0) ? rawData.chauffeurCancellationPolicy : DEFAULT_CONTENT.chauffeurCancellationPolicy,
          chauffeurExemptionClauses: (rawData.chauffeurExemptionClauses && Array.isArray(rawData.chauffeurExemptionClauses) && rawData.chauffeurExemptionClauses.length > 0) ? rawData.chauffeurExemptionClauses : DEFAULT_CONTENT.chauffeurExemptionClauses,

          // Scrap Page
          scrapHeroTitle: s(rawData.scrapHeroTitle, DEFAULT_CONTENT.scrapHeroTitle),
          scrapHeroSubtitle: s(rawData.scrapHeroSubtitle, DEFAULT_CONTENT.scrapHeroSubtitle),
          scrapFormTitle: s(rawData.scrapFormTitle, DEFAULT_CONTENT.scrapFormTitle),
          scrapProcessTitle: s(rawData.scrapProcessTitle, DEFAULT_CONTENT.scrapProcessTitle),
          scrapGuideTitle: s(rawData.scrapGuideTitle, DEFAULT_CONTENT.scrapGuideTitle),
          scrapPriceTitle: s(rawData.scrapPriceTitle, DEFAULT_CONTENT.scrapPriceTitle),
          scrapBannerTitle: s(rawData.scrapBannerTitle, DEFAULT_CONTENT.scrapBannerTitle),
          scrapBannerSubtitle: s(rawData.scrapBannerSubtitle, DEFAULT_CONTENT.scrapBannerSubtitle),
          scrapLegalNotice: (rawData.scrapLegalNotice && Array.isArray(rawData.scrapLegalNotice) && rawData.scrapLegalNotice.length > 0) ? rawData.scrapLegalNotice : DEFAULT_CONTENT.scrapLegalNotice,
          scrapStrategicPoints: (rawData.scrapStrategicPoints && Array.isArray(rawData.scrapStrategicPoints) && rawData.scrapStrategicPoints.length > 0) ? rawData.scrapStrategicPoints : DEFAULT_CONTENT.scrapStrategicPoints,

          // Recruitment Page
          recruitmentHeroTitle: s(rawData.recruitmentHeroTitle, DEFAULT_CONTENT.recruitmentHeroTitle),
          recruitmentHeroSubtitle: s(rawData.recruitmentHeroSubtitle, DEFAULT_CONTENT.recruitmentHeroSubtitle),
          recruitmentSupportTitle: s(rawData.recruitmentSupportTitle, DEFAULT_CONTENT.recruitmentSupportTitle),
          recruitmentGuideTitle: s(rawData.recruitmentGuideTitle, DEFAULT_CONTENT.recruitmentGuideTitle),
          recruitmentRentalTitle: s(rawData.recruitmentRentalTitle, DEFAULT_CONTENT.recruitmentRentalTitle),
          recruitmentBannerTitle: s(rawData.recruitmentBannerTitle, DEFAULT_CONTENT.recruitmentBannerTitle),
          recruitmentBannerSubtitle: s(rawData.recruitmentBannerSubtitle, DEFAULT_CONTENT.recruitmentBannerSubtitle),

          // Customer Center Page
          customerHeroTitle: s(rawData.customerHeroTitle, DEFAULT_CONTENT.customerHeroTitle),
          customerHeroSubtitle: s(rawData.customerHeroSubtitle, DEFAULT_CONTENT.customerHeroSubtitle),

          // Footer Headers
          footerServiceTitle: s(rawData.footerServiceTitle, DEFAULT_CONTENT.footerServiceTitle),
          footerCustomerTitle: s(rawData.footerCustomerTitle, DEFAULT_CONTENT.footerCustomerTitle),
          footerCompanyTitle: s(rawData.footerCompanyTitle, DEFAULT_CONTENT.footerCompanyTitle),
          footerLogoText: s(rawData.footerLogoText, DEFAULT_CONTENT.footerLogoText),
          footerSubText: s(rawData.footerSubText, DEFAULT_CONTENT.footerSubText),
          // Ensure critical arrays are not empty
          services: (rawData.services && Array.isArray(rawData.services) && rawData.services.length > 0) ? rawData.services : DEFAULT_CONTENT.services,
          steps: (rawData.steps && Array.isArray(rawData.steps) && rawData.steps.length > 0) ? rawData.steps : DEFAULT_CONTENT.steps,
          pricingTable: (rawData.pricingTable && Array.isArray(rawData.pricingTable) && rawData.pricingTable.length > 0) ? rawData.pricingTable : DEFAULT_CONTENT.pricingTable,
          pricingConditions: (rawData.pricingConditions && Array.isArray(rawData.pricingConditions) && rawData.pricingConditions.length > 0) ? rawData.pricingConditions : DEFAULT_CONTENT.pricingConditions,
          cancellationPolicy: (rawData.cancellationPolicy && Array.isArray(rawData.cancellationPolicy) && rawData.cancellationPolicy.length > 0) ? rawData.cancellationPolicy : DEFAULT_CONTENT.cancellationPolicy,
          popups: Array.isArray(rawData.popups) ? rawData.popups : []
        };

        setContent(data);
      } else {
        console.log("Content document does not exist, initializing...");
        // Initialize with default content if not exists
        setDoc(contentRef, DEFAULT_CONTENT).catch(err => {
          console.error("Failed to initialize content:", err);
          handleFirestoreError(err, OperationType.WRITE, 'site_content/main');
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Content Sync Error:", error);
      // Don't throw here to avoid crashing the whole app if content fails to load
      // Just log it and set loading to false so the app can show default content
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: Partial<AppContent>) => {
    try {
      if (!auth.currentUser) {
        console.error("Update failed: User not authenticated");
        throw new Error("로그인이 필요합니다.");
      }
      console.log("Updating content in Firestore:", newContent, "by user:", auth.currentUser.email);
      const contentRef = doc(db, 'site_content', 'main');
      // Use setDoc WITHOUT merge: true to ensure the entire document is updated with the latest local state
      // This prevents issues with nested objects or arrays not merging as expected
      await setDoc(contentRef, {
        ...newContent,
        updatedAt: serverTimestamp()
      });
      console.log("Firestore update successful");
    } catch (error) {
      console.error("Firestore Update Error:", error);
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };
  
  const resetContent = async () => {
    try {
      const contentRef = doc(db, 'site_content', 'main');
      await setDoc(contentRef, DEFAULT_CONTENT);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };

  const addPopup = async (popup: Omit<AppContent['popups'][0], 'id'>) => {
    try {
      const newPopup = { ...popup, id: Math.random().toString(36).substr(2, 9) };
      const updated = { ...content, popups: [...content.popups, newPopup] };
      const contentRef = doc(db, 'site_content', 'main');
      await setDoc(contentRef, updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };

  const deletePopup = async (id: string) => {
    try {
      const updated = { ...content, popups: content.popups.filter(p => p.id !== id) };
      const contentRef = doc(db, 'site_content', 'main');
      await setDoc(contentRef, updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };

  const togglePopup = async (id: string) => {
    try {
      const updated = {
        ...content,
        popups: content.popups.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
      };
      const contentRef = doc(db, 'site_content', 'main');
      await setDoc(contentRef, updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };

  const forceFixContent = async () => {
    try {
      console.log("Force fix content triggered - Fixing typos and terminology...");
      const contentRef = doc(db, 'site_content', 'main');
      
      // Explicitly fix the reported typos and ensure all fields are present
      // This is a "hard reset" for the core fields that the user reported
      const fixedContent = {
        ...DEFAULT_CONTENT,
        // Global Navigation
        navScrap: "폐차/수출",
        
        // Home Page Hero
        heroScrapTitle: "폐차 신청",
        heroScrapDesc: "당일 최고가 시세 확인하기",
        heroChauffeurTitle: "대리 신청",
        heroChauffeurDesc: "신속하고 안전한 대리운전 서비스",
        
        // Scrap Page
        scrapHeroTitle: "폐차/수출 서비스",
        scrapHeroSubtitle: "당일 최고가 매입 및 신속한 말소 처리",
        scrapFormTitle: "폐차/수출 무료 견적 신청",
        scrapProcessTitle: "폐차/수출 진행 절차",
        scrapGuideTitle: "폐차 시 필요 서류 안내",
        scrapPriceTitle: "차종별 예상 매입 시세",
        scrapBannerTitle: "소중한 내 차, 정직한 가격으로",
        scrapBannerSubtitle: "복잡한 서류 절차부터 말소까지 한 번에",
        
        // Consignment Form Labels - HARD RESET to fix user reported "corrupted" labels
        consignmentFormClientTitle: "의뢰인 정보(연락처)",
        consignmentFormVehicleTitle: "차량 정보",
        consignmentFormDepartureTitle: "출발지 정보",
        consignmentFormDestinationTitle: "도착지 정보",
        consignmentFormPaymentTitle: "탁송료(선불,후불)",
        consignmentFormNotesTitle: "기타 메모란(기사분에게 기타 요청 사항 기록)",
        consignmentFormTransmissionLabel: "변속기",
        consignmentFormStickLabel: "스틱",
        consignmentFormSiteContactLabel: "현장 연락처",
        consignmentFormDepartureContactLabel: "출발지 연락처",
        consignmentFormDestinationContactLabel: "도착지 연락처",
        consignmentFormStartAddressLabel: "출발지 주소",
        consignmentFormEndAddressLabel: "도착지 주소",
        consignmentFormSubmitLabel: "탁송 신청하기",
        consignmentFormHeroButtonLabel: "탁송 신청하기",
        consignmentFormBannerButtonLabel: "탁송 신청하기",
        
        // Other core fields
        heroSubtitle: "전국 100% 보험 가입 전문 기사 실시간 배차",
        logoText: "달리고",
        
        // Chauffeur Form
        chauffeurFormClientTitle: "의뢰인 정보",
        chauffeurFormDepartureTitle: "출발지 정보",
        chauffeurFormDestinationTitle: "도착지 정보",
        chauffeurFormPriceTitle: "요금 정보",
        chauffeurFormVehicleTitle: "차량 정보",
        chauffeurFormSubmitLabel: "대리 신청하기",
        chauffeurFormBannerButtonLabel: "대리 신청하기",
        
        updatedAt: serverTimestamp()
      };

      // We use setDoc WITHOUT merge: true here to completely overwrite any corrupted data
      // This is a "hard reset" for the core fields
      await setDoc(contentRef, fixedContent);
      
      console.log("Typos and terminology fixed successfully in Firestore via hard reset");
      
      // Wait a bit before reloading to ensure Firestore write is propagated
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Force fix error:", error);
      handleFirestoreError(error, OperationType.WRITE, 'site_content/main');
    }
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateContent, 
      resetContent, 
      addPopup, 
      deletePopup, 
      togglePopup,
      forceFixContent,
      isLoading 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
