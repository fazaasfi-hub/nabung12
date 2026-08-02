import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import { Users, Plus, Trash2, Calculator, Receipt, DollarSign } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  amountToPay: number;
}

interface BillSplitterScreenProps {
  currency: 'IDR' | 'USD' | 'EUR';
  isDark: boolean;
}

export const BillSplitterScreen: React.FC<BillSplitterScreenProps> = ({ currency, isDark }) => {
  const [billName, setBillName] = useState('Makan Bareng Cafe');
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p_1', name: 'Faza', amountToPay: 0 },
    { id: 'p_2', name: 'Andi', amountToPay: 0 },
    { id: 'p_3', name: 'Siti', amountToPay: 0 },
  ]);
  const [newName, setNewName] = useState('');

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setParticipants([...participants, { id: `p_${Date.now()}`, name: newName, amountToPay: 0 }]);
    setNewName('');
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const numericTotal = parseNumberInput(totalAmount);
  const splitAmount = participants.length > 0 ? Math.round(numericTotal / participants.length) : 0;

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
            Kalkulator Split Bill Patungan 🍕
          </h1>
          <p className="text-xs text-slate-400">Bagi rata tagihan makanan atau belanjaan secara adil</p>
        </div>
      </div>

      {/* Bill Inputs */}
      <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Tagihan / Kegiatan</label>
          <input
            type="text"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Tagihan (Rp)</label>
          <input
            type="text"
            value={formatNumberInput(totalAmount)}
            onChange={(e) => setTotalAmount(parseNumberInput(e.target.value).toString())}
            placeholder="Contoh: 450.000"
            className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Participants Management */}
      <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daftar Anggota Patungan ({participants.length})</h3>
        </div>

        <form onSubmit={addParticipant} className="flex gap-2 w-full min-w-0">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama teman..."
            className={`min-w-0 flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 whitespace-nowrap"
          >
            Tambah
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {participants.map(p => (
            <div
              key={p.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatCurrency(splitAmount, currency)}
                </span>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-rose-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-5 rounded-[24px] bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl space-y-2 border border-white/10">
        <span className="text-[10px] uppercase font-bold text-indigo-200">Hasil Kalkulasi Per Orang</span>
        <div className="text-2xl font-black font-mono text-emerald-400">
          {formatCurrency(splitAmount, currency)}
        </div>
        <p className="text-[11px] text-indigo-200">
          Dari total {formatCurrency(numericTotal, currency)} dibagi rata ke {participants.length} orang untuk kegiatan <strong>{billName}</strong>.
        </p>
      </div>
    </motion.div>
  );
};
