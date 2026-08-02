import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatCurrency } from '../../utils/formatters';
import { Users, Plus, ArrowUpRight, ArrowDownRight, CheckCircle2, Trash2, Calendar } from 'lucide-react';

interface DebtItem {
  id: string;
  personName: string;
  amount: number;
  type: 'PIUTANG' | 'HUTANG'; // Piutang = orang ngutang ke kita, Hutang = kita ngutang
  dueDate: string;
  notes: string;
  isPaid: boolean;
}

interface DebtTrackerScreenProps {
  currency: 'IDR' | 'USD' | 'EUR';
  isDark: boolean;
}

export const DebtTrackerScreen: React.FC<DebtTrackerScreenProps> = ({ currency, isDark }) => {
  const [debts, setDebts] = useState<DebtItem[]>([
    {
      id: 'debt_1',
      personName: 'Budi Santoso',
      amount: 350000,
      type: 'PIUTANG',
      dueDate: '2026-08-15',
      notes: 'Pinjam uang makan proyek',
      isPaid: false
    },
    {
      id: 'debt_2',
      personName: 'Andi Pratama',
      amount: 1200000,
      type: 'HUTANG',
      dueDate: '2026-08-25',
      notes: 'Titip beli tiket konser',
      isPaid: false
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'PIUTANG' | 'HUTANG'>('PIUTANG');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const totalPiutang = debts.filter(d => d.type === 'PIUTANG' && !d.isPaid).reduce((s, d) => s + d.amount, 0);
  const totalHutang = debts.filter(d => d.type === 'HUTANG' && !d.isPaid).reduce((s, d) => s + d.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !amount) return;

    const newItem: DebtItem = {
      id: `debt_${Date.now()}`,
      personName,
      amount: Number(amount),
      type,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      notes,
      isPaid: false
    };

    setDebts([newItem, ...debts]);
    setPersonName('');
    setAmount('');
    setDueDate('');
    setNotes('');
    setIsAdding(false);
  };

  const togglePaid = (id: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d));
  };

  const deleteItem = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
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
            Pencatat Hutang & Piutang 🤝
          </h1>
          <p className="text-xs text-slate-400">Pantau uang yang dipinjamkan atau yang harus dibayar</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Catatan</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold mb-1">
            <ArrowDownRight className="w-4 h-4" />
            <span>Piutang (Orang Lain)</span>
          </div>
          <div className={`text-base font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatCurrency(totalPiutang, currency)}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold mb-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>Hutang (Kita)</span>
          </div>
          <div className={`text-base font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatCurrency(totalHutang, currency)}
          </div>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleAdd}
          className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}
        >
          <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tambah Catatan Hutang / Piutang</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tipe</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="PIUTANG">Piutang (Orang Hutang ke Kita)</option>
                <option value="HUTANG">Hutang (Kita Hutang)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Orang</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Nama rekan..."
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nominal (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250000"
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Jatuh Tempo</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Catatan / Keterangan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Untuk keperluan darurat"
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
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
              Simpan
            </button>
          </div>
        </motion.form>
      )}

      {/* List */}
      <div className="space-y-3">
        {debts.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#14182E] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <Users className="w-8 h-8 mx-auto text-indigo-400 mb-2 opacity-60" />
            <p className="text-xs">Belum ada catatan hutang atau piutang.</p>
          </div>
        ) : (
          debts.map(d => (
            <div
              key={d.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-opacity ${
                d.isPaid ? 'opacity-50' : 'opacity-100'
              } ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                  d.type === 'PIUTANG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {d.type === 'PIUTANG' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{d.personName}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      d.type === 'PIUTANG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {d.type}
                    </span>
                  </div>
                  <div className={`text-xs font-bold font-mono mt-0.5 ${d.isPaid ? 'line-through text-slate-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(d.amount, currency)}
                  </div>
                  {d.notes && <p className="text-[11px] text-slate-400 mt-0.5">{d.notes}</p>}
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> Jatuh Tempo: {d.dueDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePaid(d.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    d.isPaid ? 'bg-emerald-500 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={d.isPaid ? 'Tandai Belum Lunas' : 'Tandai Lunas'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteItem(d.id)}
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
