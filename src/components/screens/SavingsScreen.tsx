import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SavingsAccount } from '../../types';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import { Wallet, Plus, Trash2, Repeat, ShieldCheck, Palmtree, Laptop, Sparkles, ArrowRightLeft } from 'lucide-react';

interface SavingsScreenProps {
  accounts: SavingsAccount[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onAddAccount: (acc: SavingsAccount) => void;
  onDeleteAccount: (id: string) => void;
  onOpenTransfer: () => void;
}

export const SavingsScreen: React.FC<SavingsScreenProps> = ({
  accounts,
  currency,
  isDark = false,
  onAddAccount,
  onDeleteAccount,
  onOpenTransfer
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [color, setColor] = useState('#6C4CF5');
  const [notes, setNotes] = useState('');

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAcc: SavingsAccount = {
      id: `acc_${Date.now()}`,
      name: name.trim(),
      balance: parseNumberInput(balance),
      targetAmount: parseNumberInput(targetAmount),
      color: color,
      icon: 'Wallet',
      deadline: '2026-12-31',
      notes: notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddAccount(newAcc);
    setName('');
    setBalance('');
    setTargetAmount('');
    setNotes('');
    setIsAdding(false);
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Palmtree': return <Palmtree className="w-5 h-5 text-amber-500" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-purple-400" />;
      default: return <Wallet className="w-5 h-5 text-[#6C4CF5]" />;
    }
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
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Rekening & Tabungan</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kelola sub-rekening & alokasi dana khusus</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all inline-flex items-center space-x-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekening</span>
        </button>
      </div>

      {/* Total Balance Header Banner */}
      <div className="p-5 bg-gradient-to-r from-[#0B1220] via-[#1E1B4B] to-[#6C4CF5] text-white rounded-[24px] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10 overflow-hidden">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-200 block truncate">Total Kas Terakumulasi</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-0.5 truncate font-mono">
            {formatCurrency(totalBalance, currency)}
          </div>
        </div>

        <button
          onClick={onOpenTransfer}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transfer</span>
        </button>
      </div>

      {/* Add Account Modal Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className={`p-5 border rounded-[24px] shadow-lg space-y-4 ${
          isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Buat Rekening Tabungan Baru</h3>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Rekening</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dana Darurat, Tabungan Rumah"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Saldo Awal (Rp)</label>
              <input
                type="text"
                value={formatNumberInput(balance)}
                onChange={(e) => setBalance(parseNumberInput(e.target.value).toString())}
                placeholder="1.000.000"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] font-mono ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Nominal (Rp)</label>
              <input
                type="text"
                value={formatNumberInput(targetAmount)}
                onChange={(e) => setTargetAmount(parseNumberInput(e.target.value).toString())}
                placeholder="10.000.000"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] font-mono ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Warna Rekening</label>
            <div className="flex space-x-2">
              {['#6C4CF5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-sm' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
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
              Simpan Rekening
            </button>
          </div>
        </form>
      )}

      {/* Account Cards Grid */}
      <div className="space-y-3">
        {accounts.map((acc) => {
          const percent = acc.targetAmount > 0
            ? Math.min(100, Math.round((acc.balance / acc.targetAmount) * 100))
            : 100;

          return (
            <div
              key={acc.id}
              className={`p-5 border rounded-[24px] shadow-xs space-y-3 relative overflow-hidden ${
                isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
              }`}
            >
              <div
                className="absolute top-0 left-0 bottom-0 w-1.5"
                style={{ backgroundColor: acc.color }}
              />

              <div className="flex items-start justify-between pl-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                      isDark ? 'border-slate-700' : 'border-slate-100'
                    }`}
                    style={{ backgroundColor: `${acc.color}20` }}
                  >
                    {getAccountIcon(acc.icon)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.name}</h3>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{acc.notes || 'Rekening aktif'}</p>
                  </div>
                </div>

                {accounts.length > 1 && (
                  <button
                    onClick={() => onDeleteAccount(acc.id)}
                    className={`p-1.5 rounded-xl transition-colors ${
                      isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="pl-2 pt-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Saldo Rekening</span>
                <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatCurrency(acc.balance, currency)}
                </div>
              </div>

              {acc.targetAmount > 0 && (
                <div className="pl-2 space-y-1">
                  <div className={`flex justify-between items-center text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Target: {formatCurrency(acc.targetAmount, currency)}</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{percent}%</span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%`, backgroundColor: acc.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
