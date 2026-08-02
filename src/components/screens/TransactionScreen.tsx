import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction, Category, SavingsAccount } from '../../types';
import { formatCurrency, formatNumberInput, parseNumberInput } from '../../utils/formatters';
import {
  Plus, Search, ArrowUpRight, ArrowDownRight, Repeat, Trash2, RotateCcw, Filter, Calendar as CalendarIcon, Tag, CreditCard, Sparkles, CheckCircle2
} from 'lucide-react';

interface TransactionScreenProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: SavingsAccount[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onAddTransaction: (tx: Transaction) => void;
  onSoftDeleteTransaction: (id: string) => void;
  onRestoreTransaction: (id: string) => void;
}

export const TransactionScreen: React.FC<TransactionScreenProps> = ({
  transactions,
  categories,
  accounts,
  currency,
  isDark = false,
  onAddTransaction,
  onSoftDeleteTransaction,
  onRestoreTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'TRASH'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>('EXPENSE');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [targetAccount, setTargetAccount] = useState(accounts[1]?.id || '');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredTransactions = transactions.filter(t => {
    // Trash tab handles deleted items
    if (activeTab === 'TRASH') {
      return t.isDeleted;
    }
    if (t.isDeleted) return false;

    // Type tab filter
    if (activeTab !== 'ALL' && t.type !== activeTab) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.notes?.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Date filter
    if (dateFilter === 'TODAY' && t.date !== todayStr) return false;

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const parsedAmount = parseNumberInput(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: title.trim(),
      amount: parsedAmount,
      type: txType,
      categoryId: selectedCategory,
      accountId: selectedAccount,
      targetAccountId: txType === 'TRANSFER' ? targetAccount : undefined,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      notes: notes
    };

    onAddTransaction(newTx);
    setTitle('');
    setAmount('');
    setNotes('');
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
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Riwayat Transaksi</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pencatatan arus kas & transfer antar rekening</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all inline-flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'ALL' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'INCOME' ? 'bg-emerald-600 text-white shadow-2xs' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'EXPENSE' ? 'bg-rose-600 text-white shadow-2xs' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setActiveTab('TRANSFER')}
          className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'TRANSFER' ? 'bg-indigo-600 text-white shadow-2xs' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Transfer
        </button>
        <button
          onClick={() => setActiveTab('TRASH')}
          className={`px-3 py-1.5 font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
            activeTab === 'TRASH' ? 'bg-slate-800 text-white shadow-2xs' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Tong Sampah</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari transaksi berdasarkan judul atau catatan..."
          className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] shadow-2xs ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200/80 text-slate-900'
          }`}
        />
      </div>

      {/* Add Transaction Modal / Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 border rounded-[28px] shadow-xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Catat Transaksi Baru</h3>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pencatatan keuangan real-time</p>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Type Selector */}
          <div className={`grid grid-cols-3 gap-1 p-1 rounded-2xl ${isDark ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-slate-100'}`}>
            <button
              type="button"
              onClick={() => setTxType('EXPENSE')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all truncate text-center ${
                txType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-md' : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={() => setTxType('INCOME')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all truncate text-center ${
                txType === 'INCOME' ? 'bg-emerald-600 text-white shadow-md' : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setTxType('TRANSFER')}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all truncate text-center ${
                txType === 'TRANSFER' ? 'bg-[#6C4CF5] text-white shadow-md' : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transfer
            </button>
          </div>

          {/* Amount Input with Quick Buttons */}
          <div className="space-y-1.5">
            <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nominal ({currency})</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-3 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Rp</span>
              <input
                type="text"
                value={formatNumberInput(amount)}
                onChange={(e) => setAmount(parseNumberInput(e.target.value).toString())}
                placeholder="0"
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-base font-extrabold focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] font-mono ${
                  isDark ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
            {/* Quick amount chips */}
            <div className="flex gap-1.5 pt-1 overflow-x-auto pb-1">
              {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all whitespace-nowrap ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  +{val >= 1000000 ? `${val / 1000000}jt` : `${val / 1000}rb`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Transaksi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Makan Siang, Gaji Bulanan, Bensin"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Sumber Rekening</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {txType === 'TRANSFER' ? (
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rekening Tujuan</label>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#6C4CF5] text-white text-xs font-extrabold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </motion.div>
      )}

      {/* Transaction List */}
      <div className={`border rounded-[24px] divide-y overflow-hidden shadow-2xs ${
        isDark ? 'bg-[#1E293B] border-slate-800 divide-slate-800' : 'bg-white border-slate-200/80 divide-slate-100'
      }`}>
        {filteredTransactions.length === 0 ? (
          <div className={`p-8 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {activeTab === 'TRASH' ? 'Tong sampah kosong.' : 'Tidak ada transaksi ditemukan.'}
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const acc = accounts.find(a => a.id === tx.accountId);
            const cat = categories.find(c => c.id === tx.categoryId);

            return (
              <div key={tx.id} className={`p-3.5 flex items-center justify-between transition-colors gap-2 ${
                isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50/80'
              }`}>
                <div className="flex items-center space-x-3 min-w-0 pr-1">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                    tx.type === 'INCOME'
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                      : tx.type === 'EXPENSE'
                      ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200/60'
                      : isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-[#6C4CF5] border-indigo-200/60'
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowDownRight className="w-4 h-4" /> :
                     tx.type === 'EXPENSE' ? <ArrowUpRight className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx.title}</h4>
                    <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className={`font-semibold truncate max-w-[80px] inline-block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{acc?.name || 'Utama'}</span>
                      <span>•</span>
                      <span className="shrink-0">{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="text-right">
                    <div className={`text-xs font-black ${
                      tx.type === 'INCOME' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                      tx.type === 'EXPENSE' ? (isDark ? 'text-rose-400' : 'text-rose-600') : (isDark ? 'text-indigo-400' : 'text-[#6C4CF5]')
                    }`}>
                      {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                      {formatCurrency(tx.amount, currency)}
                    </div>
                    <span className={`text-[9px] font-bold block truncate max-w-[90px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cat?.name || 'Umum'}</span>
                  </div>

                  {activeTab === 'TRASH' ? (
                    <button
                      onClick={() => onRestoreTransaction(tx.id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        isDark ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-indigo-600 hover:bg-indigo-50'
                      }`}
                      title="Pulihkan Transaksi"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSoftDeleteTransaction(tx.id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
