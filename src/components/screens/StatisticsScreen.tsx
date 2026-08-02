import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, PieChart as PieIcon, BarChart3, ArrowDownRight, ArrowUpRight, Sparkles, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface StatisticsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  transactions,
  categories,
  currency,
  isDark = false
}) => {
  const [chartType, setChartType] = useState<'BAR' | 'PIE'>('BAR');

  const validTx = transactions.filter(t => !t.isDeleted);

  const totalIncome = validTx
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = validTx
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Monthly breakdown bar chart data
  const monthlyData = [
    { name: 'Mei', Income: 11000000, Expense: 6500000 },
    { name: 'Jun', Income: 12000000, Expense: 7200000 },
    { name: 'Jul', Income: 14500000, Expense: 8100000 },
    { name: 'Agu', Income: totalIncome || 12500000, Expense: totalExpense || 2965000 }
  ];

  // Category expense pie chart data
  const categoryExpenses = categories
    .filter(c => c.type === 'EXPENSE')
    .map(cat => {
      const spent = validTx
        .filter(t => t.categoryId === cat.id && t.type === 'EXPENSE')
        .reduce((acc, t) => acc + t.amount, 0);
      return {
        name: cat.name,
        value: spent,
        color: cat.color
      };
    })
    .filter(item => item.value > 0);

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
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Statistik & Analisis</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Visualisasi arus kas & pola pengeluaran</p>
        </div>

        <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            onClick={() => setChartType('BAR')}
            className={`p-1.5 rounded-xl transition-all ${chartType === 'BAR' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('PIE')}
            className={`p-1.5 rounded-xl transition-all ${chartType === 'PIE' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            <PieIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial Health Scorecard Banner */}
      <div className="p-5 bg-gradient-to-r from-[#0B1220] via-[#1E1B4B] to-[#6C4CF5] text-white rounded-[24px] shadow-xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Financial Health Score</span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-full border border-emerald-500/30">
            A+ Excellent
          </span>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-black text-white">88</span>
          <span className="text-xs text-indigo-200">/ 100 poin</span>
        </div>

        <p className="text-[11px] text-slate-200 leading-snug">
          Arus kas Anda berada pada kondisi sangat sehat dengan rasio tabungan di atas 30%.
        </p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-4 border rounded-[20px] shadow-2xs space-y-1 ${
          isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <div className="flex items-center space-x-1.5 text-emerald-500 text-[11px] font-bold">
            <ArrowDownRight className="w-4 h-4" />
            <span>Total Pemasukan</span>
          </div>
          <div className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>

        <div className={`p-4 border rounded-[20px] shadow-2xs space-y-1 ${
          isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <div className="flex items-center space-x-1.5 text-rose-500 text-[11px] font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Total Pengeluaran</span>
          </div>
          <div className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatCurrency(totalExpense, currency)}
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className={`p-5 border rounded-[24px] shadow-xs space-y-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
          {chartType === 'BAR' ? 'Arus Kas Bulanan' : 'Distribusi Pengeluaran'}
        </h3>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'BAR' ? (
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={10} />
                <YAxis stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={10} tickFormatter={(v) => `${v/1000000}M`} />
                <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
                <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={categoryExpenses.length > 0 ? categoryExpenses : [{ name: 'Lainnya', value: 100000, color: '#6C4CF5' }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={35}
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className={`p-4 border rounded-[24px] space-y-2 ${
        isDark ? 'bg-[#6C4CF5]/10 border-[#6C4CF5]/30 text-white' : 'bg-indigo-50/70 border-indigo-200/80 text-slate-900'
      }`}>
        <div className="flex items-center space-x-2 text-[#6C4CF5] dark:text-[#A78BFA] text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Saran Hemat AI FZ Savings</span>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Pengeluaran untuk kategori <strong>Makan & Minum</strong> merupakan yang terbesar bulan ini. Jika dialokasikan 15% lebih hemat, Anda bisa mempercepat pencapaian target tabungan Anda hingga 2 minggu lebih awal.
        </p>
      </div>
    </motion.div>
  );
};
