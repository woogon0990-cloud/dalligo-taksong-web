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

  // Telegram Notification API
  app.post("/api/notify", async (req, res) => {
    const { type, data } = req.body;
    const botToken = "8748254665:AAEzCVgfg9aigHYDBj-0qksOz9JzzicwlO0";
    const chatId = "8786847016";

    // Message generation
    let message = "";
    
    if (type === "consignment") {
      message = `[달리고 탁송접수 알림]\n`
              + `👤 신청인: ${data.user_name} (${data.user_phone})\n`
              + `🚗 차량정보: ${data.car_model} (${data.car_number})\n`
              + `🔑 키위치: ${data.key_location}\n`
              + `⚙️ 상세정보: ${data.transmission} / ${data.fuel_type} / 운행${data.drivable}\n`
              + `🛡️ 상태: 사고${data.accident} / 귀중품${data.valuables}\n`
              + `✨ 컨디션: 실내(${data.interior_condition}) / 외관(${data.exterior_condition})\n`
              + `⛽ 주유량: ${data.current_fuel}\n`
              + `📍 출발지: ${data.start_addr} (${data.start_phone || '연락처 없음'})\n`
              + `🛑 경유지: ${data.via_addr || '없음'} (${data.via_phone || '없음'})\n`
              + `🏁 도착지: ${data.end_addr} (${data.end_phone || '연락처 없음'})\n`
              + `📝 요청사항: ${data.user_memo || '없음'}`;
    } else if (type === "chauffeur") {
      message = `[달리고 대리운전 접수]\n`
              + `👤 신청인: ${data.user_name || '비회원'} (${data.user_phone || data.phone})\n`
              + `📍 출발지: ${data.start_addr || data.start} (${data.start_phone || '연락처 없음'})\n`
              + `🛑 경유지: ${data.via_addr || '없음'} (${data.via_phone || '없음'})\n`
              + `🏁 도착지: ${data.end_addr || data.end} (${data.end_phone || '연락처 없음'})\n`
              + `📝 요청사항: ${data.user_memo || '없음'}`;
    }

    if (!message) {
      return res.json({ success: true, message: "No message to send" });
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message
      });
      
      console.log("Telegram Response:", response.data);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to send Telegram notification:", error.response?.data || error.message);
      res.status(500).json({ success: false, error: "Failed to send notification" });
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
