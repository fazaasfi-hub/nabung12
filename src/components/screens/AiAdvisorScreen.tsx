import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SavingsAccount, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, BrainCircuit, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

interface AiAdvisorScreenProps {
  accounts: SavingsAccount[];
  transactions: Transaction[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark: boolean;
}

export const AiAdvisorScreen: React.FC<AiAdvisorScreenProps> = ({
  accounts,
  transactions,
  currency,
  isDark,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [adviceGenerated, setAdviceGenerated] = useState(false);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Calculate health score (0-100)
  let score = 50;
  if (totalIncome > totalExpense) score += 25;
  if (savingsRate >= 20) score += 15;
  if (accounts.length >= 2) score += 10;
  score = Math.min(100, Math.max(10, score));

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAdviceGenerated(true);
    }, 1200);
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
            AI Financial Health Advisor 🤖
          </h1>
          <p className="text-xs text-slate-400">Analisis cerdas & rekomendasi pengelolaan aset</p>
        </div>
      </div>

      {/* Score Card */}
      <div className={`p-6 rounded-[28px] border shadow-lg relative overflow-hidden transition-colors ${
        isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full">
              Skor Kesehatan Finansial
            </span>
            <div className="text-4xl font-black mt-2 font-mono flex items-baseline gap-2">
              <span className={isDark ? 'text-white' : 'text-slate-900'}>{score}</span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {score >= 80 ? 'Keuangan Anda Sangat Sehat & Stabil! 🎉' : score >= 60 ? 'Keuangan Cukup Baik, Perlu Optimalisasi Tabungan.' : 'Perlu Perhatian Khusus pada Arus Kas Keluar.'}
            </p>
          </div>

          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg text-white">
            <BrainCircuit className="w-9 h-9 animate-pulse" />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-700/30 grid grid-cols-3 gap-2 text-center">
          <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            <span className="text-[10px] text-slate-400 block">Rasio Tabungan</span>
            <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{savingsRate}%</span>
          </div>
          <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            <span className="text-[10px] text-slate-400 block">Total Aset</span>
            <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalBalance, currency)}</span>
          </div>
          <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            <span className="text-[10px] text-slate-400 block">Transaksi</span>
            <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={handleRunAnalysis}
        disabled={analyzing}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all"
      >
        <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
        <span>{analyzing ? 'Menganalisis Data Rekening...' : 'Jalankan Deep AI Audit & Tips'}</span>
      </button>

      {/* AI Insights & Recommendations */}
      <div className="space-y-3">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Rekomendasi Pintar AI Gemini
        </h2>

        {transactions.length === 0 ? (
          <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-[#14182E] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <Lightbulb className="w-8 h-8 mx-auto text-amber-400 mb-2 animate-bounce" />
            <p className="text-xs">Belum ada transaksi tercatat. Tambahkan transaksi atau rekening terlebih dahulu agar AI dapat memberikan audit mendalam.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Diversifikasi Rekening Tabungan</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Anda memiliki {accounts.length} rekening aktif. Pisahkan dana darurat sekurang-kurangnya 6 bulan pengeluaran rutin.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Optimalisasi Anggaran Bulanan</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Rasio pengeluaran saat ini mencapai {100 - savingsRate}% dari total pemasukan. Pertahankan disiplin menabung minimal 20% setiap gajian.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Peluang Investasi Jangka Panjang</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dengan surplus kas yang stabil, pertimbangkan alokasi ke instrumen reksa dana atau SBN untuk mengalahkan inflasi tahunan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
