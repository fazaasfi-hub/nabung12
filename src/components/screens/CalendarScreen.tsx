import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Repeat } from 'lucide-react';
import { translateText } from '../../utils/translations';

interface CalendarScreenProps {
  transactions: Transaction[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  language?: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  transactions,
  currency,
  isDark = false,
  language = 'ID'
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const t = (text: string) => translateText(text, language);

  const validTx = transactions.filter(t => !t.isDeleted);

  // Filter transactions for selected date
  const dayTx = validTx.filter(t => t.date === selectedDate);

  const dayIncome = dayTx.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const dayExpense = dayTx.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

  // Generate calendar days for current month (August 2026)
  const daysInMonth = 31;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const hasTx = validTx.some(t => t.date === dateStr);
    return { dayNum, dateStr, hasTx };
  });

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
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t("Kalender Keuangan")}</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t("Pantau catatan transaksi berdasarkan tanggal")}</p>
        </div>
      </div>

      {/* Calendar Month Header */}
      <div className={`p-4 border rounded-[24px] shadow-xs space-y-4 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CalendarIcon className="w-4 h-4 text-[#6C4CF5]" />
            <span>{t("Agustus 2026")}</span>
          </h3>
          <div className="flex space-x-1">
            <button className={`p-1.5 rounded-xl ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className={`p-1.5 rounded-xl ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className={`grid grid-cols-7 text-center text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{t("Min")}</span>
          <span>{t("Sen")}</span>
          <span>{t("Sel")}</span>
          <span>{t("Rab")}</span>
          <span>{t("Kam")}</span>
          <span>{t("Jum")}</span>
          <span>{t("Sab")}</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {daysArray.map(({ dayNum, dateStr, hasTx }) => {
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-2 rounded-2xl text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#6C4CF5] text-white shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{dayNum}</span>
                {hasTx && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-amber-300' : 'bg-[#6C4CF5]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Summary */}
      <div className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
            {t("Detail Tanggal")} {selectedDate}
          </h3>

          <div className="flex space-x-2 text-[10px] font-bold">
            <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>+{formatCurrency(dayIncome, currency)}</span>
            <span className={isDark ? 'text-rose-400' : 'text-rose-600'}>-{formatCurrency(dayExpense, currency)}</span>
          </div>
        </div>

        <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
          {dayTx.length === 0 ? (
            <p className={`text-xs py-4 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t("Tidak ada transaksi pada tanggal ini.")}</p>
          ) : (
            dayTx.map(tx => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    tx.type === 'INCOME' ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                    tx.type === 'EXPENSE' ? (isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600') : (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-[#6C4CF5]')
                  }`}>
                    {tx.type === 'INCOME' ? <ArrowDownRight className="w-3.5 h-3.5" /> :
                     tx.type === 'EXPENSE' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx.title}</h4>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tx.time}</span>
                  </div>
                </div>

                <div className={`text-xs font-black ${
                  tx.type === 'INCOME' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                  tx.type === 'EXPENSE' ? (isDark ? 'text-rose-400' : 'text-rose-600') : (isDark ? 'text-indigo-400' : 'text-[#6C4CF5]')
                }`}>
                  {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                  {formatCurrency(tx.amount, currency)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
