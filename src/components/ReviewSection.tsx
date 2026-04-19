import React, { useEffect, useState } from 'react';
import { Star, UserCircle2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Review {
  id: string;
  name: string;
  service: string;
  content: string;
  date: string;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Review[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(data);
    });
    return () => unsubscribe();
  }, []);

  const defaultReviews = [
    { id: "r1", name: "고객님 A", service: "전국 탁송", content: "갑작스럽게 제주도 탁송이 필요했는데, 상담부터 도착까지 너무 친절하고 빠르게 진행해주셔서 감동받았습니다. 다음에도 꼭 이용할게요!", date: "2026.04.08" },
    { id: "r2", name: "고객님 B", service: "수입차 탁송", content: "고가의 수입차라 걱정이 많았는데, 베테랑 기사님이 오셔서 꼼꼼하게 체크해주시고 안전하게 운송해주셨습니다. 역시 전문가는 다르네요.", date: "2026.04.07" },
    { id: "r3", name: "고객님 C", service: "당일 급행", content: "급하게 차량을 보내야 했는데 접수하자마자 바로 매칭되어서 놀랐습니다. 가격도 합리적이고 서비스 품질이 정말 높습니다.", date: "2026.04.06" }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <section className="py-32 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-blue-600 font-black tracking-widest uppercase mb-4">Reviews</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            이용 고객 후기
          </h3>
          <p className="text-xl text-slate-500 font-medium">실제 고객님들의 소중한 리뷰입니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              
              <p className="text-slate-700 font-medium leading-relaxed mb-8 h-24 overflow-hidden italic">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <UserCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{review.name}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">
                      {review.service}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-bold">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
