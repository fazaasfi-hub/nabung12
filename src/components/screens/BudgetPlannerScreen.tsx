import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CategoryBudget, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Plus, AlertTriangle, CheckCircle2, AlertCircle, PieChart } from 'lucide-react';

interface BudgetPlannerScreenProps {
  budgets: CategoryBudget[];
  categories: Category[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onUpdateBudget: (budget: CategoryBudget) => void;
}

export const BudgetPlannerScreen: React.FC<BudgetPlannerScreenProps> = ({
  budgets,
  categories,
  currency,
  isDark = false,
  onUpdateBudget
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [limit, setLimit] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !limit) return;

    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;

    const existing = budgets.find(b => b.categoryId === selectedCatId);
    const updated: CategoryBudget = {
      id: existing ? existing.id : `b_${Date.now()}`,
      categoryId: selectedCatId,
      monthlyLimit: parsedLimit,
      spentAmount: existing ? existing.spentAmount : 0
    };

    onUpdateBudget(updated);
    setLimit('');
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5 pb-20 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Perencana Anggaran</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kendalikan batas pengeluaran kategori setiap bulan</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all inline-flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Atur Anggaran</span>
        </button>
      </div>

      {/* Add/Edit Budget Form */}
      {isAdding && (
        <form onSubmit={handleSave} className={`p-5 border rounded-[24px] shadow-lg space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Set Batas Anggaran Kategori</h3>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kategori Pengeluaran</label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {categories.filter(c => c.type === 'EXPENSE').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Batas Maksimal Bulanan (Rp)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="2500000"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={`px-3.5 py-2 text-xs font-semibold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6C4CF5] text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md"
            >
              Simpan Batas
            </button>
          </div>
        </form>
      )}

      {/* Budgets List */}
      <div className="space-y-3">
        {budgets.map((b) => {
          const cat = categories.find(c => c.id === b.categoryId);
          const percent = Math.min(100, Math.round((b.spentAmount / b.monthlyLimit) * 100));
          const isOver = b.spentAmount > b.monthlyLimit;
          const isWarning = percent >= 80 && !isOver;

          return (
            <div key={b.id} className={`p-4 border rounded-[24px] shadow-xs space-y-2.5 ${
              isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <PieChart className="w-4 h-4 text-[#6C4CF5]" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat?.name || 'Kategori'}</h3>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Batas: {formatCurrency(b.monthlyLimit, currency)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {isOver ? (
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Over Budget</span>
                    </span>
                  ) : isWarning ? (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Mendekati Batas</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Aman</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-semibold mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Terpakai: {formatCurrency(b.spentAmount, currency)}</span>
                  <span className={`font-bold ${isOver ? 'text-rose-500' : isWarning ? 'text-amber-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {percent}%
                  </span>
                </div>

                <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
