import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Goal, Wishlist } from '../../types';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import { Target, Heart, Plus, CheckCircle2, Sparkles, ChevronRight, Gift, Clock, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WishlistGoalScreenProps {
  goals: Goal[];
  wishlists: Wishlist[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onAddGoal: (goal: Goal) => void;
  onDepositGoal: (goalId: string, amount: number) => void;
  onAddWishlist: (wish: Wishlist) => void;
  onDeleteWishlist: (id: string) => void;
}

export const WishlistGoalScreen: React.FC<WishlistGoalScreenProps> = ({
  goals,
  wishlists,
  currency,
  isDark = false,
  onAddGoal,
  onDepositGoal,
  onAddWishlist,
  onDeleteWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'GOALS' | 'WISHLIST'>('GOALS');
  const [isAdding, setIsAdding] = useState(false);

  // Goal Form States
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('2026-12-31');
  const [goalCategory, setGoalCategory] = useState('Elektronik');

  // Deposit Modal State
  const [selectedDepositGoalId, setSelectedDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget) return;

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      name: goalName.trim(),
      targetAmount: parseNumberInput(goalTarget),
      currentAmount: 0,
      deadline: goalDeadline,
      reminderEnabled: true,
      category: goalCategory,
      status: 'BERJALAN'
    };

    onAddGoal(newGoal);
    setGoalName('');
    setGoalTarget('');
    setIsAdding(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepositGoalId || !depositAmount) return;

    const amt = parseNumberInput(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    onDepositGoal(selectedDepositGoalId, amt);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSelectedDepositGoalId(null);
    setDepositAmount('');
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
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Target & Wishlist</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rencanakan impian & alokasi dana secara konsisten</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all inline-flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Tabs */}
      <div className={`grid grid-cols-2 p-1 rounded-2xl text-xs font-bold ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <button
          onClick={() => setActiveTab('GOALS')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'GOALS' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Target Tabungan ({goals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('WISHLIST')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'WISHLIST' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist Impian ({wishlists.length})</span>
        </button>
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <form onSubmit={handleCreateGoal} className={`p-5 border rounded-[24px] shadow-lg space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Buat Target Tabungan Baru</h3>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Target</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Contoh: Dana Darurat, Liburan Bali"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Nominal (Rp)</label>
              <input
                type="text"
                value={formatNumberInput(goalTarget)}
                onChange={(e) => setGoalTarget(parseNumberInput(e.target.value).toString())}
                placeholder="10.000.000"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] font-mono ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tenggat Waktu</label>
              <input
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
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
              Simpan Target
            </button>
          </div>
        </form>
      )}

      {/* Deposit Modal */}
      {selectedDepositGoalId && (
        <form onSubmit={handleDepositSubmit} className="p-5 bg-indigo-950 text-white rounded-[28px] shadow-2xl space-y-4 border border-indigo-500/40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Setor Dana ke Target Tabungan</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedDepositGoalId(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-200 mb-1">Nominal Setoran (Rp)</label>
            <input
              type="text"
              value={formatNumberInput(depositAmount)}
              onChange={(e) => setDepositAmount(parseNumberInput(e.target.value).toString())}
              placeholder="500.000"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#6C4CF5] hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Konfirmasi Setor
          </button>
        </form>
      )}

      {/* Content Body */}
      {activeTab === 'GOALS' ? (
        <div className="space-y-3">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

            return (
              <div key={g.id} className={`p-5 border rounded-[24px] shadow-xs space-y-3 ${
                isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm border ${
                      isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-[#6C4CF5] border-indigo-200/60'
                    }`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{g.name}</h3>
                      <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {g.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDepositGoalId(g.id)}
                    className="px-3 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    + Setor
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progres Terkumpul</span>
                    <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{percent}%</span>
                  </div>

                  <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div
                      className="bg-gradient-to-r from-[#6C4CF5] to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className={`flex justify-between items-center text-[10px] font-medium mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Terkumpul: <strong className={isDark ? 'text-white' : 'text-slate-800'}>{formatCurrency(g.currentAmount, currency)}</strong></span>
                    <span>Target: <strong className={isDark ? 'text-white' : 'text-slate-800'}>{formatCurrency(g.targetAmount, currency)}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {wishlists.map((w) => (
            <div key={w.id} className={`p-4 border rounded-[24px] shadow-xs flex items-center justify-between ${
              isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
            }`}>
              <div className="flex items-center space-x-3">
                {w.imageUrl ? (
                  <img src={w.imageUrl} alt={w.title} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                ) : (
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                    isDark ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-50 text-pink-600'
                  }`}>
                    <Gift className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <h4 className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{w.title}</h4>
                  <div className="text-xs font-black text-[#6C4CF5] dark:text-[#A78BFA] mt-0.5">
                    {formatCurrency(w.price, currency)}
                  </div>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{w.notes}</p>
                </div>
              </div>

              <button
                onClick={() => onDeleteWishlist(w.id)}
                className={`p-2 rounded-xl ${isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-300 hover:text-rose-500'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
