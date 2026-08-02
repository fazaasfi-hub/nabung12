import React, { useState, useEffect } from 'react';
import {
  SavingsAccount,
  Transaction,
  Category,
  Goal,
  Wishlist,
  CategoryBudget,
  AppSettings,
  UserProfile
} from './types';
import {
  DEFAULT_CATEGORIES,
  INITIAL_SAVINGS_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_WISHLIST,
  INITIAL_BUDGETS,
  DEFAULT_USER_PROFILE,
  DEFAULT_SETTINGS
} from './data/mockInitialData';
import {
  INITIAL_CONNECTED_WALLETS,
  INITIAL_PENDING_NOTIFICATIONS,
  INITIAL_SYNC_LOGS
} from './data/mockWalletData';
import { ConnectedWallet, PendingWalletNotification, SyncLogEntry } from './types';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { Smartphone, Code2, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'SIMULATOR' | 'CODEBASE'>('SIMULATOR');

  // LocalStorage state persistence
  const [accounts, setAccounts] = useState<SavingsAccount[]>(() => {
    const saved = localStorage.getItem('fz_accounts');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fz_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fz_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('fz_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [wishlists, setWishlists] = useState<Wishlist[]>(() => {
    const saved = localStorage.getItem('fz_wishlists');
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem('fz_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('fz_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fz_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  const [wallets, setWallets] = useState<ConnectedWallet[]>(() => {
    const saved = localStorage.getItem('fz_wallets');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTED_WALLETS;
  });

  const [pendingNotifs, setPendingNotifs] = useState<PendingWalletNotification[]>(() => {
    const saved = localStorage.getItem('fz_pendingNotifs');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_NOTIFICATIONS;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(() => {
    const saved = localStorage.getItem('fz_syncLogs');
    return saved ? JSON.parse(saved) : INITIAL_SYNC_LOGS;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('fz_accounts', JSON.stringify(accounts));
    localStorage.setItem('fz_transactions', JSON.stringify(transactions));
    localStorage.setItem('fz_categories', JSON.stringify(categories));
    localStorage.setItem('fz_goals', JSON.stringify(goals));
    localStorage.setItem('fz_wishlists', JSON.stringify(wishlists));
    localStorage.setItem('fz_budgets', JSON.stringify(budgets));
    localStorage.setItem('fz_settings', JSON.stringify(settings));
    localStorage.setItem('fz_profile', JSON.stringify(profile));
    localStorage.setItem('fz_wallets', JSON.stringify(wallets));
    localStorage.setItem('fz_pendingNotifs', JSON.stringify(pendingNotifs));
    localStorage.setItem('fz_syncLogs', JSON.stringify(syncLogs));
  }, [accounts, transactions, categories, goals, wishlists, budgets, settings, profile, wallets, pendingNotifs, syncLogs]);

  // Handlers
  const handleAddAccount = (acc: SavingsAccount) => {
    setAccounts([acc, ...accounts]);
  };

  const handleDeleteAccount = (id: string) => {
    if (accounts.length <= 1) return;
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions([tx, ...transactions]);

    // Update account balances
    if (tx.type === 'INCOME') {
      setAccounts(prev => prev.map(a => a.id === tx.accountId ? { ...a, balance: a.balance + tx.amount } : a));
    } else if (tx.type === 'EXPENSE') {
      setAccounts(prev => prev.map(a => a.id === tx.accountId ? { ...a, balance: Math.max(0, a.balance - tx.amount) } : a));
    } else if (tx.type === 'TRANSFER' && tx.targetAccountId) {
      setAccounts(prev => prev.map(a => {
        if (a.id === tx.accountId) return { ...a, balance: Math.max(0, a.balance - tx.amount) };
        if (a.id === tx.targetAccountId) return { ...a, balance: a.balance + tx.amount };
        return a;
      }));
    }
  };

  const handleSoftDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, isDeleted: true, deletedAt: new Date().toISOString() } : t));

    if (target.type === 'EXPENSE') {
      setAccounts(prev => prev.map(a => a.id === target.accountId ? { ...a, balance: a.balance + target.amount } : a));
    } else if (target.type === 'INCOME') {
      setAccounts(prev => prev.map(a => a.id === target.accountId ? { ...a, balance: Math.max(0, a.balance - target.amount) } : a));
    }
  };

  const handleRestoreTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, isDeleted: false, deletedAt: undefined } : t));

    if (target.type === 'EXPENSE') {
      setAccounts(prev => prev.map(a => a.id === target.accountId ? { ...a, balance: Math.max(0, a.balance - target.amount) } : a));
    } else if (target.type === 'INCOME') {
      setAccounts(prev => prev.map(a => a.id === target.accountId ? { ...a, balance: a.balance + target.amount } : a));
    }
  };

  const handleAddGoal = (g: Goal) => {
    setGoals([g, ...goals]);
  };

  const handleAddWishlist = (w: Wishlist) => {
    setWishlists([w, ...wishlists]);
  };

  const handleDeleteWishlist = (id: string) => {
    setWishlists(wishlists.filter(w => w.id !== id));
  };

  const handleDepositGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const updated = g.currentAmount + amount;
        return {
          ...g,
          currentAmount: updated,
          status: updated >= g.targetAmount ? 'TERCAPAI' : updated >= g.targetAmount * 0.8 ? 'HAMPIR_SELESAI' : 'BERJALAN'
        };
      }
      return g;
    }));
  };

  const handleDepositWishlist = (wishId: string, amount: number) => {
    setWishlists(prev => prev.map(w => w.id === wishId ? { ...w, savedAmount: w.savedAmount + amount } : w));
  };

  const handleUpdateBudget = (b: CategoryBudget) => {
    const exists = budgets.some(item => item.id === b.id);
    if (exists) {
      setBudgets(budgets.map(item => item.id === b.id ? b : item));
    } else {
      setBudgets([b, ...budgets]);
    }
  };

  const handleExportBackup = () => {
    const data = { accounts, transactions, categories, goals, wishlists, budgets, settings, profile };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FZ_Savings_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = ['ID,Judul,Tipe,Nominal,Tanggal,Waktu,Catatan\n'];
    const rows = transactions.map(t => `${t.id},"${t.title}",${t.type},${t.amount},${t.date},${t.time},"${t.notes || ''}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FZ_Savings_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    localStorage.clear();
    setAccounts(INITIAL_SAVINGS_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setGoals(INITIAL_GOALS);
    setWishlists(INITIAL_WISHLIST);
    setBudgets(INITIAL_BUDGETS);
    setSettings(DEFAULT_SETTINGS);
    setProfile(DEFAULT_USER_PROFILE);
    setWallets(INITIAL_CONNECTED_WALLETS);
    setPendingNotifs(INITIAL_PENDING_NOTIFICATIONS);
    setSyncLogs(INITIAL_SYNC_LOGS);
  };

  // Wallet Handlers
  const handleConnectWallet = (newWallet: ConnectedWallet) => {
    setWallets(prev => [newWallet, ...prev]);
    const newLog: SyncLogEntry = {
      id: `slog_${Date.now()}`,
      walletName: newWallet.name,
      timestamp: 'Baru saja',
      status: 'SUCCESS',
      importedCount: 0,
      duplicateCount: 0,
      message: 'Berhasil menautkan wallet & otentikasi API resmi.'
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const handleDisconnectWallet = (walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
  };

  const handleSyncWallet = (walletId?: string) => {
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (walletId) {
      setWallets(prev => prev.map(w => w.id === walletId ? { ...w, lastSync: `Hari ini, ${nowTimeStr}` } : w));
    } else {
      setWallets(prev => prev.map(w => ({ ...w, lastSync: `Hari ini, ${nowTimeStr}` })));
    }

    const newLog: SyncLogEntry = {
      id: `slog_${Date.now()}`,
      walletName: walletId ? (wallets.find(w => w.id === walletId)?.name || 'Wallet') : 'Semua Wallet',
      timestamp: `Hari ini, ${nowTimeStr}`,
      status: 'SUCCESS',
      importedCount: 2,
      duplicateCount: 0,
      message: 'Sinkronisasi Open API selesai tanpa kendala.'
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const handleAcceptNotification = (notifId: string, categoryId: string) => {
    const targetNotif = pendingNotifs.find(p => p.id === notifId);
    if (!targetNotif) return;

    setPendingNotifs(prev => prev.map(p => p.id === notifId ? { ...p, status: 'ACCEPTED' as const } : p));

    // Create new transaction
    const newTx: Transaction = {
      id: `tx_notif_${Date.now()}`,
      title: targetNotif.merchant,
      amount: targetNotif.amount,
      type: targetNotif.type,
      categoryId: categoryId || targetNotif.suggestedCategoryId,
      accountId: accounts[0]?.id || 'acc_utama',
      date: targetNotif.date,
      time: targetNotif.time,
      notes: `Disetujui dari Notifikasi ${targetNotif.walletName}`
    };

    handleAddTransaction(newTx);
  };

  const handleRejectNotification = (notifId: string) => {
    setPendingNotifs(prev => prev.map(p => p.id === notifId ? { ...p, status: 'REJECTED' as const } : p));
  };

  const handleManualImportTransactions = (importedTxs: Partial<Transaction>[]) => {
    const createdList: Transaction[] = importedTxs.map((t, idx) => ({
      id: t.id || `imp_${Date.now()}_${idx}`,
      title: t.title || 'Transaksi Impor Statement',
      amount: t.amount || 0,
      type: t.type || 'EXPENSE',
      categoryId: t.categoryId || 'cat_belanja',
      accountId: t.accountId || accounts[0]?.id || 'acc_utama',
      date: t.date || new Date().toISOString().split('T')[0],
      time: t.time || '12:00',
      notes: t.notes || 'Diimpor dari file statement'
    }));

    setTransactions(prev => [...createdList, ...prev]);
  };

  const handleToggleNotificationListener = (walletId: string, enabled: boolean) => {
    setWallets(prev => prev.map(w => w.id === walletId ? { ...w, isNotificationListenerActive: enabled } : w));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-[#6C4CF5] selection:text-white">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C4CF5] text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>FZ Savings</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Material 3 Fintech Redesign
                </span>
              </h1>
              <p className="text-xs text-slate-400">Jetpack Compose, MVVM, Clean Architecture, Room & Hilt</p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setViewMode('SIMULATOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'SIMULATOR'
                  ? 'bg-[#6C4CF5] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>App Simulator</span>
            </button>

            <button
              onClick={() => setViewMode('CODEBASE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'CODEBASE'
                  ? 'bg-[#6C4CF5] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Android Studio Code & ZIP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {viewMode === 'SIMULATOR' ? (
          <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h2 className="text-xl font-black text-white">Live Premium Fintech App Simulator</h2>
              <p className="text-xs text-slate-400">
                Uji coba langsung semua fitur FZ Savings: Revolut-style Card, QRIS Payment, Dark Mode, Analytics, E-Wallet Integration, Kalender & Target Tabungan.
              </p>
            </div>

            <PhoneSimulator
              accounts={accounts}
              transactions={transactions}
              categories={categories}
              goals={goals}
              wishlists={wishlists}
              budgets={budgets}
              settings={settings}
              profile={profile}
              wallets={wallets}
              pendingNotifs={pendingNotifs}
              syncLogs={syncLogs}
              onAddAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
              onAddTransaction={handleAddTransaction}
              onSoftDeleteTransaction={handleSoftDeleteTransaction}
              onRestoreTransaction={handleRestoreTransaction}
              onAddGoal={handleAddGoal}
              onAddWishlist={handleAddWishlist}
              onDeleteWishlist={handleDeleteWishlist}
              onDepositGoal={handleDepositGoal}
              onDepositWishlist={handleDepositWishlist}
              onUpdateBudget={handleUpdateBudget}
              onUpdateSettings={setSettings}
              onUpdateProfile={setProfile}
              onExportBackup={handleExportBackup}
              onExportCsv={handleExportCsv}
              onResetData={handleResetData}
              onConnectWallet={handleConnectWallet}
              onDisconnectWallet={handleDisconnectWallet}
              onSyncWallet={handleSyncWallet}
              onAcceptNotification={handleAcceptNotification}
              onRejectNotification={handleRejectNotification}
              onManualImportTransactions={handleManualImportTransactions}
              onToggleNotificationListener={handleToggleNotificationListener}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h2 className="text-xl font-black text-white">Android Studio Source Code Explorer</h2>
              <p className="text-xs text-slate-400">
                Source code Kotlin Clean Architecture lengkap (Room, Hilt, StateFlow, Material 3 Composables, ViewModels).
              </p>
            </div>

            <CodeExplorer />
          </div>
        )}
      </main>
    </div>
  );
}
