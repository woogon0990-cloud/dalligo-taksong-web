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

  // Aligo SMS API
  app.post("/api/notify", async (req, res) => {
    const { type, data } = req.body;
    const apiKey = process.env.ALIGO_API_KEY || "lxuoam6r4qpo2bbgp0le95axqasmpuie";
    const userId = process.env.ALIGO_USER_ID || "mono0990";
    const sender = process.env.ALIGO_SENDER || "01048685893"; // 인증된 발신번호
    const adminPhone = process.env.ADMIN_PHONE || process.env.ALIGO_RECEIVE || "01048685893";
    const customerPhone = data.phone;

    if (!apiKey || !userId) {
      console.warn("Aligo API keys not configured. Skipping notification.");
      return res.json({ success: false, message: "API keys not configured" });
    }

    // Message generation
    let adminMessage = "";
    let customerMessage = "";
    
    if (type === "consignment") {
      adminMessage = `[달리고 탁송 1844-1585] 새로운 탁송 접수\n- 성함: ${data.name}\n- 연락처: ${data.phone}\n- 출발지: ${data.start}\n- 도착지: ${data.end}\n- 차종: ${data.carType}\n- 요금: ${data.proposedPrice || '상담'}`;
      // Customer message removed from submission step as per user request
    } else if (type === "chauffeur") {
      adminMessage = `[달리고 탁송 1844-1585] 새로운 대리운전 접수\n- 연락처: ${data.phone}\n- 출발지: ${data.start}\n- 도착지: ${data.end}\n- 요금: ${data.price}`;
    } else if (type === "accepted") {
      customerMessage = `[달리고 탁송 1844-1585] 안녕하세요 고객님, 신청하신 오더가 최종 접수되었습니다.\n담당 기사님이 배정되는 대로 연락드리겠습니다.\n- 출발: ${data.start}\n- 도착: ${data.end}\n감사합니다.`;
    }

    try {
      console.log(`Sending Aligo SMS. Type: ${type}, Admin: ${!!adminMessage}, Customer: ${!!customerMessage}`);
      
      const params = new URLSearchParams();
      params.append('key', apiKey);
      params.append('user_id', userId);
      params.append('sender', sender || '');
      params.append('msg_type', 'SMS');

      const axiosConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      // Send to Admin (only if adminMessage exists)
      if (adminPhone && adminMessage) {
        const adminParams = new URLSearchParams(params);
        adminParams.append('receiver', adminPhone);
        adminParams.append('msg', adminMessage);
        const adminRes = await axios.post("https://apis.aligo.in/send/", adminParams.toString(), axiosConfig);
        console.log("Aligo Admin Response:", adminRes.data);
      }

      // Send to Customer (only if customerMessage exists)
      if (customerPhone && customerMessage) {
        const customerParams = new URLSearchParams(params);
        customerParams.append('receiver', customerPhone);
        customerParams.append('msg', customerMessage);
        const customerRes = await axios.post("https://apis.aligo.in/send/", customerParams.toString(), axiosConfig);
        console.log("Aligo Customer Response:", customerRes.data);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to send Aligo notification:", error.response?.data || error.message);
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
