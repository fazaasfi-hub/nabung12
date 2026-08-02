import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SavingsAccount } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Repeat, Plus, CheckCircle2, Clock, Trash2, ShieldCheck, Zap } from 'lucide-react';

interface RecurringRule {
  id: string;
  title: string;
  amount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  targetAccountId: string;
  isActive: boolean;
  nextDate: string;
}

interface RecurringRulesScreenProps {
  accounts: SavingsAccount[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark: boolean;
}

export const RecurringRulesScreen: React.FC<RecurringRulesScreenProps> = ({
  accounts,
  currency,
  isDark,
}) => {
  const [rules, setRules] = useState<RecurringRule[]>([
    {
      id: 'rec_1',
      title: 'Auto-Save 10% Gajian Bulanan',
      amount: 1250000,
      frequency: 'MONTHLY',
      targetAccountId: accounts[0]?.id || 'acc_1',
      isActive: true,
      nextDate: '2026-09-01'
    },
    {
      id: 'rec_2',
      title: 'Cicilan Dana Darurat Otomatis',
      amount: 500000,
      frequency: 'MONTHLY',
      targetAccountId: accounts[1]?.id || 'acc_2',
      isActive: true,
      nextDate: '2026-09-05'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newRule: RecurringRule = {
      id: `rec_${Date.now()}`,
      title,
      amount: Number(amount),
      frequency,
      targetAccountId: accounts[0]?.id || 'default',
      isActive: true,
      nextDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };

    setRules([newRule, ...rules]);
    setTitle('');
    setAmount('');
    setIsAdding(false);
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
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
          <h1 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Auto-Save & Tagihan Otomatis ⚡
          </h1>
          <p className="text-xs text-slate-400">Jadwalkan transfer rutin & pembayaran tagihan tanpa lupa</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Add Form Modal */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleAddRule}
          className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}
        >
          <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Buat Aturan Otomatis Baru</h3>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Aturan / Tagihan</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Nabung Rutin / Bayar Wifi"
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nominal (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500000"
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Frekuensi</label>
              <select
                value={frequency}
                onChange={(e: any) => setFrequency(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="DAILY">Harian</option>
                <option value="WEEKLY">Mingguan</option>
                <option value="MONTHLY">Bulanan</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#6C4CF5] text-white text-xs font-bold rounded-xl shadow-md"
            >
              Simpan Jadwal
            </button>
          </div>
        </motion.form>
      )}

      {/* List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#14182E] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <Repeat className="w-8 h-8 mx-auto text-indigo-400 mb-2 opacity-60" />
            <p className="text-xs">Belum ada aturan otomatis yang dibuat.</p>
          </div>
        ) : (
          rules.map(rule => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  rule.isActive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h3>
                  <div className="text-[11px] font-mono font-semibold text-[#6C4CF5] mt-0.5">
                    {formatCurrency(rule.amount, currency)} <span className="text-[10px] text-slate-400 font-normal">/ {rule.frequency === 'MONTHLY' ? 'Bulan' : rule.frequency === 'WEEKLY' ? 'Minggu' : 'Hari'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Eksekusi berikutnya: {rule.nextDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-10 h-6 rounded-full transition-colors relative px-0.5 ${
                    rule.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    rule.isActive ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>

                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
