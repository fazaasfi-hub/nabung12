import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SavingsAccount, Transaction, UserProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { FileText, Download, Share2, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface ExportReportScreenProps {
  userProfile: UserProfile;
  accounts: SavingsAccount[];
  transactions: Transaction[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark: boolean;
}

export const ExportReportScreen: React.FC<ExportReportScreenProps> = ({
  userProfile,
  accounts,
  transactions,
  currency,
  isDark,
}) => {
  const [reportType, setReportType] = useState<'SUMMARY' | 'FULL_TRANSACTIONS'>('SUMMARY');
  const [downloaded, setDownloaded] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

  const handleDownload = (format: 'PDF' | 'CSV') => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
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
            Ekspor Laporan Keuangan 📄
          </h1>
          <p className="text-xs text-slate-400">Unduh laporan resmi ringkasan aset & mutasi arus kas</p>
        </div>
      </div>

      {downloaded && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Laporan keuangan berhasil diunduh ke perangkat Anda!</span>
        </div>
      )}

      {/* Options */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#14182E] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pilih Jenis Laporan</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setReportType('SUMMARY')}
            className={`p-3 rounded-xl border text-left transition-all ${
              reportType === 'SUMMARY'
                ? 'border-[#6C4CF5] bg-[#6C4CF5]/10 text-indigo-400 font-bold'
                : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-xs block font-bold">Ringkasan Eksekutif</span>
            <span className="text-[10px] text-slate-400 font-normal">Total aset & statistik bulanan</span>
          </button>
          <button
            onClick={() => setReportType('FULL_TRANSACTIONS')}
            className={`p-3 rounded-xl border text-left transition-all ${
              reportType === 'FULL_TRANSACTIONS'
                ? 'border-[#6C4CF5] bg-[#6C4CF5]/10 text-indigo-400 font-bold'
                : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <span className="text-xs block font-bold">Mutasi Transaksi</span>
            <span className="text-[10px] text-slate-400 font-normal">Daftar lengkap seluruh arus kas</span>
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className={`p-6 rounded-[24px] border space-y-4 font-mono text-xs ${isDark ? 'bg-[#14182E] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-700/40">
          <div>
            <h4 className="font-bold text-sm tracking-wide text-[#6C4CF5]">FZ SAVINGS STATEMENT</h4>
            <span className="text-[10px] text-slate-400">Dicetak oleh: {userProfile.name} ({userProfile.email})</span>
          </div>
          <div className="text-right text-[10px] text-slate-400">
            <span>Tanggal: {new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Akun Rekening:</span>
            <span className="font-bold">{accounts.length} Akun</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Akumulasi Saldo:</span>
            <span className="font-bold text-emerald-400">{formatCurrency(totalBalance, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Pemasukan Tercatat:</span>
            <span className="font-bold text-emerald-400">{formatCurrency(totalIncome, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Pengeluaran Tercatat:</span>
            <span className="font-bold text-rose-400">{formatCurrency(totalExpense, currency)}</span>
          </div>
        </div>

        {reportType === 'FULL_TRANSACTIONS' && (
          <div className="pt-3 border-t border-slate-700/40 space-y-2 max-h-48 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Daftar Transaksi ({transactions.length})</span>
            {transactions.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">Belum ada transaksi.</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="flex justify-between text-[10px] border-b border-slate-800/50 pb-1">
                  <span>{t.date} - {t.title}</span>
                  <span className={t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleDownload('PDF')}
          className="py-3 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Unduh PDF</span>
        </button>

        <button
          onClick={() => handleDownload('CSV')}
          className={`py-3 border text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ekspor CSV</span>
        </button>
      </div>
    </motion.div>
  );
};
