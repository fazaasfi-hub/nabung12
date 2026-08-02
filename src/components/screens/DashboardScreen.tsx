import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SavingsAccount, Transaction, Goal, UserProfile } from '../../types';
import { formatCurrency, getTimeBasedGreeting } from '../../utils/formatters';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PlusCircle,
  MinusCircle,
  Repeat,
  Target,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Palmtree,
  Laptop,
  Eye,
  EyeOff,
  QrCode,
  CreditCard,
  Zap,
  Search,
  Bell,
  Smartphone,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

import { getTranslation } from '../../utils/translations';

interface DashboardScreenProps {
  userProfile: UserProfile;
  accounts: SavingsAccount[];
  transactions: Transaction[];
  goals: Goal[];
  currency: 'IDR' | 'USD' | 'EUR';
  theme?: 'LIGHT' | 'DARK' | 'SYSTEM';
  language?: string;
  onNavigate: (screen: string) => void;
  onOpenQuickAction: (action: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'TARGET' | 'SCAN_QR') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userProfile,
  accounts,
  transactions,
  goals,
  currency,
  theme = 'DARK',
  language = 'ID',
  onNavigate,
  onOpenQuickAction
}) => {
  const t = getTranslation(language);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const greetingInfo = getTimeBasedGreeting();

  const isDark = theme === 'DARK';
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  // Current Month calculations
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(
    t => !t.isDeleted && t.date.startsWith(currentMonthStr)
  );

  const totalIncomeMonth = monthlyTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenseMonth = monthlyTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsRate = totalIncomeMonth > 0
    ? Math.max(0, Math.round(((totalIncomeMonth - totalExpenseMonth) / totalIncomeMonth) * 100))
    : 76;

  const recentTransactions = transactions
    .filter(t => !t.isDeleted)
    .slice(0, 5);

  const netWorthData = [
    { month: 'Mei', value: 28000000 },
    { month: 'Jun', value: 33500000 },
    { month: 'Jul', value: 39000000 },
    { month: 'Agu', value: totalBalance }
  ];

  return (
    <div className={`space-y-4 pb-20 select-none ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
      {/* 1. CLEAN HEADER (Google Wallet / Revolut Style) */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 cursor-pointer shrink-0"
            onClick={() => onNavigate('settings')}
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className={`text-[11px] font-medium flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <span>{greetingInfo.greeting}</span>
            </div>
            <h2 className={`text-sm font-bold tracking-tight truncate max-w-[150px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {userProfile.name}
            </h2>
          </div>
        </div>

        {/* Clean Controls: Search & Notifications */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('globalSearch')}
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300 transition-colors"
            title={t.searchTooltip}
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300 transition-colors relative"
            title={t.settingsTooltip}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. REFINED BALANCE CARD */}
      <div className="p-4 sm:p-5 rounded-2xl fintech-accent-card space-y-3 overflow-hidden">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase truncate">
              {t.totalBalance}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded-full border border-emerald-500/20">
              <ArrowUp className="w-3 h-3" />
              <span>{savingsRate}% {t.savedRateSuffix}</span>
            </span>

            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-1.5 bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg text-zinc-300 transition-colors border border-zinc-700/50"
              title={hideBalance ? t.showBalance : t.hideBalance}
            >
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="pt-0.5">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono truncate">
            {hideBalance ? 'Rp •••••••••' : formatCurrency(totalBalance, currency)}
          </div>
        </div>

        {/* Income & Expense Metrics */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400 block">{t.totalIncome}</span>
              <span className="text-xs font-bold text-emerald-400 font-mono truncate block">
                {hideBalance ? '••••••••' : `+${formatCurrency(totalIncomeMonth, currency)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-400 block">{t.totalExpense}</span>
              <span className="text-xs font-bold text-rose-400 font-mono truncate block">
                {hideBalance ? '••••••••' : `-${formatCurrency(totalExpenseMonth, currency)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS (EXACTLY 4 EQUAL BUTTONS PER ROW) */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1">
          {t.quickActions}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onOpenQuickAction('INCOME')}
            className="p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center space-y-1.5 text-center transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-200 truncate w-full">{t.depositCash}</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('EXPENSE')}
            className="p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center space-y-1.5 text-center transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <MinusCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-200 truncate w-full">{t.withdrawCash}</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('TRANSFER')}
            className="p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center space-y-1.5 text-center transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-200 truncate w-full">{t.transfer}</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('SCAN_QR')}
            className="p-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center space-y-1.5 text-center transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-zinc-200 truncate w-full">{t.scanQris}</span>
          </button>
        </div>
      </div>

      {/* 4. ACCOUNTS VAULT (CLEAN SWIPEABLE CARDS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {t.yourAccounts} ({accounts.length})
          </h3>
          <span
            className="text-[10px] font-semibold text-indigo-400 flex items-center gap-0.5 cursor-pointer hover:text-indigo-300"
            onClick={() => onNavigate('savings')}
          >
            <span>{t.manage}</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="flex space-x-2.5 overflow-x-auto no-scrollbar py-0.5">
          {accounts.map((acc, idx) => (
            <div
              key={acc.id}
              onClick={() => setActiveAccountIndex(idx)}
              className={`min-w-[220px] p-4 rounded-2xl fintech-card shrink-0 cursor-pointer transition-all ${
                activeAccountIndex === idx ? 'border-indigo-500/60 ring-1 ring-indigo-500/40' : 'opacity-85'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-zinc-800 text-[9px] font-semibold rounded text-zinc-300 border border-zinc-700/50">
                    {acc.type === 'EMERGENCY' ? t.emergency : acc.type === 'INVESTMENT' ? t.investment : t.main}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono">{acc.accountNumber || '5270••8812'}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate">{acc.name}</h4>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {hideBalance ? '••••••••' : formatCurrency(acc.balance, currency)}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px]">
                  <span className="text-zinc-400">{t.annualInterest}</span>
                  <span className="text-emerald-400 font-bold">{acc.interestRate}% p.a.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. NET WORTH CHART CARD */}
      <div className="p-4 rounded-2xl fintech-card space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">{t.netWorthGrowth}</span>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <span className="text-white font-mono">{formatCurrency(totalBalance, currency)}</span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +18.4%
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('statistics')}
            className="px-2.5 py-1 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 border border-indigo-500/20"
          >
            <TrendingUp className="w-3 h-3" />
            <span>{t.detail}</span>
          </button>
        </div>

        <div className="h-20 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthData}>
              <defs>
                <linearGradient id="netWorthGradClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C4CF5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6C4CF5" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6C4CF5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#netWorthGradClean)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. RECENT TRANSACTIONS LIST */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {t.recentTransactions}
          </h3>
          <span
            className="text-[10px] font-semibold text-indigo-400 flex items-center gap-0.5 cursor-pointer hover:text-indigo-300"
            onClick={() => onNavigate('transactions')}
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="space-y-1.5">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl fintech-card flex items-center justify-between transition-colors hover:bg-zinc-800/50"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  tx.type === 'INCOME'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {tx.type === 'INCOME' ? '+' : '-'}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{tx.title}</h4>
                  <p className="text-[10px] text-zinc-400">{tx.date} • {tx.time || '12:00'}</p>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <span className={`text-xs font-bold block ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </span>
                <span className="text-[9px] text-zinc-400 font-medium block">{tx.notes || t.cashFlow}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
