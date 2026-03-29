import React from 'react';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface PricingTabProps {
  localContent: any;
  updateLocalField: (fields: any) => void;
  setIsDirty: (dirty: boolean) => void;
}

const PricingTab: React.FC<PricingTabProps> = React.memo(({ localContent, updateLocalField, setIsDirty }) => {
  // Local state for immediate input feedback without triggering parent re-renders on every keystroke
  const [formData, setFormData] = React.useState(localContent);

  // Sync local state when parent state changes (e.g. on reset or save)
  React.useEffect(() => {
    setFormData(localContent);
  }, [localContent]);

  const handleTableChange = (idx: number, field: string, value: any) => {
    const newTable = [...formData.pricingTable];
    newTable[idx] = { ...newTable[idx], [field]: value };
    setFormData((prev: any) => ({ ...prev, pricingTable: newTable }));
    setIsDirty(true);
  };

  const handleTableBlur = () => {
    updateLocalField({ pricingTable: formData.pricingTable });
  };

  const handleAddRow = () => {
    const newTable = [...formData.pricingTable, { dist: "새 구간", price: "0원", type: "구분" }];
    setFormData((prev: any) => ({ ...prev, pricingTable: newTable }));
    updateLocalField({ pricingTable: newTable });
  };

  const handleDeleteRow = (idx: number) => {
    const newTable = formData.pricingTable.filter((_: any, i: number) => i !== idx);
    setFormData((prev: any) => ({ ...prev, pricingTable: newTable }));
    updateLocalField({ pricingTable: newTable });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>전국 탁송 요율표 관리</span></h3>
        </div>
        
        <div className="overflow-hidden border border-slate-100 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"><span>거리 구간</span></th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"><span>예상 요금</span></th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"><span>탁송 구분</span></th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"><span>관리</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {formData.pricingTable.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={item.dist}
                      onChange={(e) => handleTableChange(idx, 'dist', e.target.value)}
                      onBlur={handleTableBlur}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-700"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={item.price}
                      onChange={(e) => handleTableChange(idx, 'price', e.target.value)}
                      onBlur={handleTableBlur}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-blue-600"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={item.type}
                      onChange={(e) => handleTableChange(idx, 'type', e.target.value)}
                      onBlur={handleTableBlur}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <button 
                      onClick={() => handleDeleteRow(idx)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button 
          onClick={handleAddRow}
          className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>새 요금 구간 추가</span>
        </button>
      </section>

      {/* Pricing Conditions */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>요금 산정 조건 관리</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(formData.pricingConditions || []).map((condition: any, idx: number) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <input 
                type="text" 
                value={condition.title}
                onChange={(e) => {
                  const newConditions = [...formData.pricingConditions];
                  newConditions[idx] = { ...newConditions[idx], title: e.target.value };
                  setFormData((prev: any) => ({ ...prev, pricingConditions: newConditions }));
                  setIsDirty(true);
                }}
                onBlur={() => updateLocalField({ pricingConditions: formData.pricingConditions })}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 font-bold text-sm"
              />
              <textarea 
                rows={3}
                value={condition.description}
                onChange={(e) => {
                  const newConditions = [...formData.pricingConditions];
                  newConditions[idx] = { ...newConditions[idx], description: e.target.value };
                  setFormData((prev: any) => ({ ...prev, pricingConditions: newConditions }));
                  setIsDirty(true);
                }}
                onBlur={() => updateLocalField({ pricingConditions: formData.pricingConditions })}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 outline-none focus:border-blue-500 text-xs text-slate-500 leading-relaxed resize-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900"><span>취소 및 환불 규정 관리</span></h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(formData.cancellationPolicy || []).map((item: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <input 
                type="text" 
                value={item.time}
                onChange={(e) => {
                  const newPolicy = [...formData.cancellationPolicy];
                  newPolicy[idx] = { ...newPolicy[idx], time: e.target.value };
                  setFormData((prev: any) => ({ ...prev, cancellationPolicy: newPolicy }));
                  setIsDirty(true);
                }}
                onBlur={() => updateLocalField({ cancellationPolicy: formData.cancellationPolicy })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 outline-none focus:border-blue-500 font-bold text-[10px]"
              />
              <input 
                type="text" 
                value={item.policy}
                onChange={(e) => {
                  const newPolicy = [...formData.cancellationPolicy];
                  newPolicy[idx] = { ...newPolicy[idx], policy: e.target.value };
                  setFormData((prev: any) => ({ ...prev, cancellationPolicy: newPolicy }));
                  setIsDirty(true);
                }}
                onBlur={() => updateLocalField({ cancellationPolicy: formData.cancellationPolicy })}
                className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 outline-none focus:border-blue-500 font-black text-xs text-blue-600"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export default PricingTab;
