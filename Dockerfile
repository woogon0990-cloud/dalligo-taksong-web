# Google Cloud Run용 Dockerfile
FROM node:20-slim

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Cloud Run 및 AI Studio 표준 포트인 3000 노출
EXPOSE 3000

# 환경 변수 설정
ENV PORT=3000
ENV NODE_ENV=production

# 서버 실행
CMD ["npm", "start"]
