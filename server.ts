import express from "express";
import path from "path";
import axios from "axios";
import fs from "fs";

async function startServer() {
  const app = express();
  app.use(express.json());
  
  const PORT = 3000; 
  console.log(`[Critical] Server must listen on port: ${PORT} for Cloud Run Probe`);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 1. 구글 서치 콘솔 소유권 인증 (이걸로 구글 인증 통과!)
  app.get("/googlec882e292798d1492.html", (req, res) => {
    res.send("google-site-verification: googlec882e292798d1492.html");
  });

  // 2. RSS Feed 핸들러 (네이버/구글 공통 최적화)
  const rssHandler = (req, res) => {
    res.set("Content-Type", "application/xml; charset=utf-8");
    const hostname = req.hostname;
    const protocol = req.protocol === 'https' ? 'https' : 'http';
    const siteUrl = `${protocol}://${hostname}`;
    const isIlryu = hostname.includes('ilryu') || hostname.includes('1ryu');
    const brandName = isIlryu ? "일류전국탁송" : "달리고 탁송";

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${brandName}</title>
    <link>${siteUrl}/</link>
    <description>전국 신속 안전 차량 탁송 서비스</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>${brandName} - 전국 24시간 신속 안전 차량 탁송</title>
      <link>${siteUrl}/</link>
      <description>전국 어디서나 24시간 신속하게 배차되는 ${brandName} 서비스입니다. 일반 탁송, 캐리어 탁송, 제주도 탁송 전문.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${siteUrl}/</guid>
    </item>
  </channel>
</rss>`;
    res.send(rssFeed);
  };

  // 다양한 RSS 경로 한 번에 등록
  ["/rss.xml", "/rss", "/feed.xml", "/feed", "/index.xml", "/rss2.0.xml"].forEach(p => {
    app.get(p, rssHandler);
  });

  // 3. Sitemap 엔드포인트
  app.get("/sitemap.xml", (req, res) => {
    res.set("Content-Type", "application/xml");
    const hostname = req.hostname;
    const protocol = req.protocol === 'https' ? 'https' : 'http';
    const siteUrl = `${protocol}://${hostname}`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    res.send(sitemap);
  });

  // 4. robots.txt 엔드포인트
  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    const hostname = req.hostname;
    const protocol = req.protocol === 'https' ? 'https' : 'http';
    const siteUrl = `${protocol}://${hostname}`;
    const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml`;
    res.send(robots);
  });

  // 5. 텔레그램 전송 API
  app.post("/api/send-telegram", async (req, res) => {
    const { message } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "Telegram configuration missing" });
    }

    try {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML"
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to send telegram message" });
    }
  });

  // 6. Vite / Static 정적 파일 처리
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Development mode dynamic meta injection
    app.use(async (req, res, next) => {
      if (req.path.includes('.') || req.path.startsWith('/api')) return next();
      
      const hostname = req.hostname;
      const isIlryu = hostname.includes('ilryu') || hostname.includes('1ryu');
      const siteTitle = isIlryu ? "일류전국탁송" : "달리고 탁송";
      const siteDescription = isIlryu 
        ? "일류전국탁송 - 전국 24시간 신속 안전 차량 탁송 & 대리운전 전문 서비스" 
        : "달리고 탁송 - 전국 24시간 신속 안전 차량 탁송 & 대리운전 전문 서비스";

      try {
        let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        html = await vite.transformIndexHtml(req.url, html);
        html = html.replace(/__TITLE__/g, siteTitle);
        html = html.replace(/__DESCRIPTION__/g, siteDescription);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files but skip index.html
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const hostname = req.hostname;
      const isIlryu = hostname.includes('ilryu') || hostname.includes('1ryu');
      
      const siteTitle = isIlryu ? "일류전국탁송" : "달리고 탁송";
      const siteDescription = isIlryu 
        ? "일류전국탁송 - 전국 24시간 신속 안전 차량 탁송 & 대리운전 전문 서비스" 
        : "달리고 탁송 - 전국 24시간 신속 안전 차량 탁송 & 대리운전 전문 서비스";

      try {
        let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        html = html.replace(/__TITLE__/g, siteTitle);
        html = html.replace(/__DESCRIPTION__/g, siteDescription);
        res.set('Content-Type', 'text/html').send(html);
      } catch (e) {
        res.status(500).send("Error loading index.html");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();