import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 텔레그램 알림 API (새로운 번호 010-2461-1614 전용)
  app.post("/api/notify", async (req, res) => {
    const { type, data } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 환경 변수 체크 (보안)
    if (!botToken || !chatId) {
      console.error("텔레그램 설정(Secrets)이 누락되었습니다.");
      return res.status(500).json({ success: false, error: "설정 오류" });
    }

    // 메시지 포맷 구성 (요청하신 형식 적용)
    const typeName = type === "consignment" ? "탁송" : "대리";
    const userName = data.user_name || '비회원';
    const userPhone = data.user_phone || data.phone || '연락처 없음';
    const startAddr = data.start_addr || data.start || '미입력';
    const endAddr = data.end_addr || data.end || '미입력';

    const message = `[달리고.kr 신규 접수]\n\n`
                  + `📌 신청유형: ${typeName}\n`
                  + `👤 고객명: ${userName}\n`
                  + `📞 연락처: ${userPhone}\n`
                  + `📍 출발지: ${startAddr}\n`
                  + `🏁 도착지: ${endAddr}\n`
                  + `📝 요청사항: ${data.user_memo || '없음'}`;

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text: message
      });
      console.log(`${typeName} 알림 전송 성공!`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("알림 전송 실패:", error.response?.data || error.message);
      res.status(500).json({ success: false, error: "전송 실패" });
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
