import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// .env 파일 로드 (절대 경로 사용 및 기존 환경 변수 덮어쓰기)
dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 텔레그램 알림 API (010-2461-1614 전용)
  app.post("/api/notify", async (req, res) => {
    const { type, data } = req.body;
    
    // 환경 변수에서 텔레그램 정보 가져오기
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log(`[Notify] 요청 수신 - 유형: ${type}`);

    if (!botToken || !chatId) {
      const errorMsg = "텔레그램 설정 오류: TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않았습니다.";
      console.error(`[Notify] ${errorMsg}`);
      return res.status(500).json({ 
        success: false, 
        error: "서버 설정 오류", 
        details: "환경 변수가 비어있습니다. Settings 메뉴에서 토큰과 ID를 확인해 주세요." 
      });
    }

    const typeName = type === "consignment" ? "탁송" : "대리";
    const userName = data.user_name || '비회원';
    const userPhone = data.user_phone || data.phone || '연락처 없음';
    const startAddr = data.start_addr || data.start || '미입력';
    const startPhone = data.start_phone || '미입력';
    const viaAddr = data.via_addr || '';
    const viaPhone = data.via_phone || '';
    const endAddr = data.end_addr || data.end || '미입력';
    const endPhone = data.end_phone || '미입력';
    const paymentMethod = data.payment_method || '후불';

    let message = `[달리고.kr 신규 접수]\n\n`
                + `📌 신청유형: ${typeName}\n`
                + `👤 고객명: ${userName}\n`
                + `📞 연락처: ${userPhone}\n`
                + `📍 출발지: ${startAddr} (${startPhone})\n`;

    if (viaAddr) {
      message += `🔄 경유지: ${viaAddr} (${viaPhone || '연락처 없음'})\n`;
    }

    message += `🏁 도착지: ${endAddr} (${endPhone})\n`
             + `💰 결제방식: ${paymentMethod}\n`;

    if (type === "consignment") {
      message += `\n🚗 [차량 상세 정보]\n`
               + `- 모델: ${data.car_model || '미입력'}\n`
               + `- 번호: ${data.car_number || '미입력'}\n`
               + `- 키위치: ${data.key_location || '미입력'}\n`
               + `- 운행가능: ${data.drivable || '미입력'}\n`
               + `- 유종: ${data.fuel_type || '미입력'}\n`
               + `- 변속기: ${data.transmission || '미입력'}\n`
               + `- 사고유무: ${data.accident || '미입력'}\n`
               + `- 귀중품: ${data.valuables || '미입력'}\n`
               + `- 실내상태: ${data.interior_condition || '미입력'}\n`
               + `- 외관상태: ${data.exterior_condition || '미입력'}\n`
               + `- 현재주유: ${data.current_fuel || '미입력'}\n`;
    } else if (type === "chauffeur") {
      message += `\n🚗 [차량 정보]\n`
               + `- 모델: ${data.car_model || '미입력'}\n`
               + `- 변속기: ${data.transmission || '오토'}\n`;
    }

    message += `\n📝 요청사항: ${data.user_memo || '없음'}`;

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message
      });
      console.log(`${typeName} 알림 전송 성공! Telegram Response:`, response.data);
      res.json({ success: true });
    } catch (error: any) {
      console.error("알림 전송 실패 상세:", error.response?.data || error.message);
      res.status(500).json({ success: false, error: "전송 실패", details: error.response?.data });
    }
  });

  // 텔레그램 설정 테스트 API
  app.get("/api/test-telegram", async (req, res) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ 
        success: false, 
        error: "설정 누락", 
        details: "TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않았습니다. Settings 메뉴에서 설정해 주세요." 
      });
    }

    try {
      // 1. 봇 정보 확인 (getMe)
      const meUrl = `https://api.telegram.org/bot${botToken}/getMe`;
      const meResponse = await axios.get(meUrl);
      
      // 2. 테스트 메시지 전송
      const sendUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const sendResponse = await axios.post(sendUrl, {
        chat_id: chatId,
        text: "✅ [달리고.kr] 텔레그램 알림 테스트 성공!\n설정이 정상적으로 완료되었습니다."
      });

      res.json({ 
        success: true, 
        botInfo: meResponse.data.result,
        messageStatus: "전송 성공"
      });
    } catch (error: any) {
      console.error("테스트 전송 실패:", error.response?.data || error.message);
      res.status(500).json({ 
        success: false, 
        error: "연결 실패", 
        details: error.response?.data || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();