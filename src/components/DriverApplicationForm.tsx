/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Phone, User, Calendar, ShieldAlert, CreditCard } from 'lucide-react';
import axios from 'axios';

export default function DriverApplicationForm() {
  const [formData, setFormData] = useState({
    phone: '',
    age: '',
    gender: '남성',
    accidentHistory: '무사고',
    licenseType: '1종 보통'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `
👷 <b>[기사 지원 접수]</b>

📱 <b>연락처:</b> ${formData.phone}
🎂 <b>나이:</b> ${formData.age}세
👤 <b>성별:</b> ${formData.gender}
🚗 <b>사고유무:</b> ${formData.accidentHistory}
💳 <b>면허종류:</b> ${formData.licenseType}

---
🕒 접수시간: ${new Date().toLocaleString('ko-KR')}
    `.trim();

    try {
      await axios.post('/api/send-telegram', { message });
      setIsSuccess(true);
      setFormData({
        phone: '',
        age: '',
        gender: '남성',
        accidentHistory: '무사고',
        licenseType: '1종 보통'
      });
    } catch (error) {
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-blue-50 p-10 rounded-3xl text-center border border-blue-100">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
          <Send size={32} />
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-2">신청 완료!</h4>
        <p className="text-slate-600 font-bold">담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-blue-600 font-black underline"
        >
          추가 신청하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 ml-2">연락처</label>
        <div className="relative">
          <Phone className="absolute left-4 top-4 w-5 h-5 text-blue-500" />
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-0000-0000" 
            required
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 ml-2">나이</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-4 w-5 h-5 text-blue-500" />
            <input 
              type="number" 
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="세" 
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 ml-2">성별</label>
          <div className="relative">
            <User className="absolute left-4 top-4 w-5 h-5 text-blue-500" />
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 ml-2">최근 10년 내 사고 유무</label>
        <div className="relative">
          <ShieldAlert className="absolute left-4 top-4 w-5 h-5 text-blue-500" />
          <select 
            name="accidentHistory"
            value={formData.accidentHistory}
            onChange={handleChange}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option>무사고</option>
            <option>1회</option>
            <option>2회 이상</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 ml-2">면허 종류</label>
        <div className="relative">
          <CreditCard className="absolute left-4 top-4 w-5 h-5 text-blue-500" />
          <select 
            name="licenseType"
            value={formData.licenseType}
            onChange={handleChange}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option>1종 보통</option>
            <option>2종 보통</option>
            <option>1종 대형</option>
            <option>특수 면허</option>
          </select>
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 mt-4 rounded-2xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {isSubmitting ? '접수 중...' : '접수 신청'}
      </button>
    </form>
  );
}
