import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2, PhoneCall } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  content?: any;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, content }) => {
  const contactPhone = content?.contactPhone || "1844-1585";
  const systemInstruction = `
당신은 '달리고 탁송'의 전문 상담 챗봇입니다. 고객의 질문에 친절하고 전문적으로 답변해 주세요.
홈페이지의 내용을 바탕으로 답변해야 하며, 모르는 내용은 대표번호(${contactPhone})로 문의하도록 안내하세요.

[회사 정보]
- 회사명: 달리고 탁송 (Dalligo)
- 시스템/운영: 모노솔루션 (monosolution)
- 대표: 김우곤
- 사업자등록번호: 315-08-82083
- 서비스: 전국 탁송(로드 탁송, 캐리어 탁송, 특수차 탁송), 100% 보험 가입 기사 배차
- 전국대표번호: ${contactPhone}
- 상담전화: 010-4868-5893
- 주소: 충청남도 천안시 동남구 양지11길 11, 4F(봉명동, 양란하우스)
- 상담시간: 평일 09:00 - 18:00 (주말 및 공휴일 휴무)
- 서비스 파트너: 일류전국탁송

[서비스 특징]
1. 로드 탁송: 기사님이 직접 운전하여 이동하는 방식으로 견인비를 절감해 고객 보상금을 높여드림.
2. 무료 견인: 운행 불가 차량도 추가 비용 없이 무료로 견인 서비스 제공.
3. 선입금 시스템: 차량 인도 전 약속된 보상금을 고객 계좌로 먼저 입금하여 사기 피해 방지.

[전국 탁송 요율표]
- 0 ~ 20km: 15,000원 ~ 20,000원 (시내)
- 20 ~ 50km: 20,000원 ~ 30,000원 (근교)
- 50 ~ 100km: 30,000원 ~ 50,000원 (중거리)
- 100 ~ 200km: 50,000원 ~ 80,000원 (장거리)
- 200 ~ 300km: 80,000원 ~ 110,000원 (초장거리)
- 300km 이상: 120,000원 ~ 200,000원 (전국)
* 톨게이트 비용 포함, 주유비 실비 정산, 야간/주말/특수차량 할증(1~2만 원) 발생 가능.

[취소 및 환불 규정]
- 15일 전: 전액 환불
- 14일 ~ 7일 전: 20% 공제 후 환불
- 6일 ~ 3일 전: 50% 공제 후 환불
- 2일 ~ 1일 전: 70% 공제 후 환불
- 당일 취소: 환불 불가
* 취소 시점은 고객센터 운영 시간 기준입니다.

[사고 및 보험 처리]
1. 사고 발생 시: 즉시 회사 통보 및 부상자 후송 등 초기 조치 필수.
2. 증거 확보: 블랙박스 영상 등 증거 서류 제출 협조.
3. 보험 접수: 기사의 '자동차탁송종합보험'으로 처리. 자기부담금은 원칙적으로 기사 부담.
4. 차량 수리: 다자간 협의를 통해 확정한 정비업체에서 진행.
5. 면책 사항: 대차료(렌터카) 및 영업 손실 등 간접 손해 제외, 원시적 결함 및 자연 소모 제외, 주행 중 불가항력적 훼손(스톤칩 등) 제외.

[무과실 증명 및 데이터 리포트 체계]
1. 타임스탬프 정밀 촬영: 위변조 불가 타임스탬프 앱으로 외관 8지점 및 내부 결함(계기판, 엔진음 등) 기록.
   - 8지점: 정면, 후면, 좌/우 측면, 4개 모서리(45도 각도), 루프 및 하부.
   - 필수: 분쟁이 잦은 휠(Wheel)과 사이드 스텝은 반드시 근접 촬영.
2. 표준 상태 부호 활용: 주관적 서술 대신 표준 부호(A, U, W 등)로 객관적 리포트 작성.
3. 디지털 증거 보존: 주유 영수증, 메시지 내역 등 디지털 데이터 보존으로 법적 효력 확보.
4. 면책 특약: 기계적 결함, 자연적 손상(스톤칩), 간접 손해(대차료), 육안 확인 불가 흠집 등에 대한 면책 규정 적용.

[답변 가이드]
- 답변은 한국어로 정중하게 하세요.
- 가급적 짧고 명확하게 답변하세요.
- 구체적인 견적 문의는 "무료 견적 신청" 메뉴를 이용하거나 대표번호로 전화하도록 안내하세요.
- 기사 모집에 대한 문의는 010-4868-5893으로 연락하도록 안내하세요.
`;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하세요! 달리고 탁송 상담 챗봇입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: userMessage });
      const botText = response.text || `죄송합니다. 답변을 생성하는 중 오류가 발생했습니다. 대표번호(${contactPhone})로 문의해 주세요.`;
      
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `연결이 원활하지 않습니다. 잠시 후 다시 시도하시거나 대표번호(${contactPhone})로 연락 부탁드립니다.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-full max-w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
                  <img 
                    src="https://storage.googleapis.com/static.antigravity.ai/asb/input_file_0.png" 
                    alt="Dalligo Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div translate="no">
                  <h3 className="font-black">달리고 상담 챗봇</h3>
                  <p className="text-[10px] text-blue-100 opacity-80">Dalligo Consignment</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20 group"
              >
                <span className="text-xs font-bold">닫기</span>
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                      {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`} translate="no">
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-slate-400 shadow-sm flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="궁금한 내용을 입력하세요..."
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <PhoneCall className="w-3 h-3" />
                급한 문의는 {contactPhone}로 연락주세요.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
