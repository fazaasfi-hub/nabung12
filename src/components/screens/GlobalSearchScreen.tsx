import React, { useState } from 'react';
import { Transaction, SavingsAccount, Goal } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Search, ArrowDownRight, ArrowUpRight, Repeat, Wallet, Target, X } from 'lucide-react';

interface GlobalSearchScreenProps {
  transactions: Transaction[];
  accounts: SavingsAccount[];
  goals: Goal[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onNavigate: (screen: string) => void;
}

export const GlobalSearchScreen: React.FC<GlobalSearchScreenProps> = ({
  transactions,
  accounts,
  goals,
  currency,
  isDark = false,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedTx = q ? transactions.filter(t => !t.isDeleted && (t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q))) : [];
  const matchedAcc = q ? accounts.filter(a => a.name.toLowerCase().includes(q)) : [];
  const matchedGoal = q ? goals.filter(g => g.name.toLowerCase().includes(q)) : [];

  return (
    <div className="space-y-4 pb-20">
      {/* Search Bar */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute left-3.5 top-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari transaksi, rekening, atau target..."
          className={`w-full pl-10 pr-10 py-3 border rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] shadow-xs ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200/80 text-slate-900'
          }`}
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className={`absolute right-3 top-3 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!query ? (
        <div className={`text-center py-12 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Ketik kata kunci untuk mencari seluruh data FZ Savings.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Accounts match */}
          {matchedAcc.length > 0 && (
            <div>
              <h3 className={`text-[10px] font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rekening Terkait</h3>
              <div className="space-y-2">
                {matchedAcc.map(a => (
                  <div
                    key={a.id}
                    onClick={() => onNavigate('savings')}
                    className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center ${
                      isDark ? 'bg-[#1E293B] border-slate-800 text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{a.name}</span>
                    <span className={`text-xs font-black ${isDark ? 'text-indigo-400' : 'text-slate-900'}`}>{formatCurrency(a.balance, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions match */}
          {matchedTx.length > 0 && (
            <div>
              <h3 className={`text-[10px] font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Transaksi Terkait</h3>
              <div className={`border rounded-2xl divide-y ${
                isDark ? 'bg-[#1E293B] border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
              }`}>
                {matchedTx.map(tx => (
                  <div key={tx.id} className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx.title}</h4>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tx.date}</span>
                    </div>
                    <div className={`text-xs font-black ${isDark ? 'text-indigo-400' : 'text-[#6C4CF5]'}`}>
                      {formatCurrency(tx.amount, currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
