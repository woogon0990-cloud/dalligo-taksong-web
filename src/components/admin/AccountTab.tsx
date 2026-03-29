import React, { useState } from 'react';
import { UserCog, EyeOff, Eye } from 'lucide-react';

interface AccountTabProps {
  user: any;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void;
}

const AccountTab: React.FC<AccountTabProps> = React.memo(({ user, setSaveStatus }) => {
  const [adminEmail, setAdminEmail] = useState(user?.email || '');

  return (
    <div className="space-y-8 max-w-4xl">
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <UserCog className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>관리자 계정 정보</span></h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest"><span>현재 아이디 (이메일)</span></label>
            <div className="w-full bg-slate-50 rounded-xl py-3 px-4 font-bold text-slate-700">
              <span>{user?.email}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            <span>* 계정 정보 변경은 Firebase Console에서 관리하시거나, re-authentication 로직을 추가하여 구현할 수 있습니다.</span>
          </p>
        </div>
      </section>
    </div>
  );
});

export default AccountTab;
