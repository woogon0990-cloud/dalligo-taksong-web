import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ override: true });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function test() {
  console.log('--- Telegram Connection Test ---');
  console.log('Token:', botToken ? 'Present' : 'Missing');
  console.log('Chat ID:', chatId ? chatId : 'Missing');

  if (!botToken || !chatId) {
    console.error('Error: Missing credentials in .env');
    return;
  }

  try {
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: '🚀 [달리고.kr] 서버 내부 테스트 메시지입니다. 이 메시지가 보이면 서버에서 텔레그램으로의 연결이 정상입니다.'
    });
    console.log('Success:', response.data.ok);
  } catch (error: any) {
    console.error('Failed:', error.response?.data || error.message);
  }
}

test();
