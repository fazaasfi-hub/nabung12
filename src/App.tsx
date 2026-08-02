import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { logoutUser, UserCloudProfile } from './services/firebaseAuthService';
import {
  SavingsAccount,
  Transaction,
  Category,
  Goal,
  Wishlist,
  CategoryBudget,
  AppSettings,
  UserProfile,
  ConnectedWallet,
  PendingWalletNotification,
  SyncLogEntry,
  AppNotification
} from './types';
import {
  DEFAULT_CATEGORIES,
  INITIAL_SAVINGS_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_WISHLIST,
  INITIAL_BUDGETS,
  DEFAULT_USER_PROFILE,
  DEFAULT_SETTINGS,
  INITIAL_NOTIFICATIONS
} from './data/mockInitialData';
import {
  INITIAL_CONNECTED_WALLETS,
  INITIAL_PENDING_NOTIFICATIONS,
  INITIAL_SYNC_LOGS
} from './data/mockWalletData';

// App Screens Imports
import { getTranslation } from './utils/translations';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { SavingsScreen } from './components/screens/SavingsScreen';
import { TransactionScreen } from './components/screens/TransactionScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { BudgetPlannerScreen } from './components/screens/BudgetPlannerScreen';
import { WishlistGoalScreen } from './components/screens/WishlistGoalScreen';
import { SettingsProfileScreen } from './components/screens/SettingsProfileScreen';
import { SecurityPinScreen } from './components/screens/SecurityPinScreen';
import { GlobalSearchScreen } from './components/screens/GlobalSearchScreen';
import { WalletIntegrationScreen } from './components/screens/WalletIntegrationScreen';
import { ToolsScreen } from './components/screens/ToolsScreen';
import { AiAdvisorScreen } from './components/screens/AiAdvisorScreen';
import { RecurringRulesScreen } from './components/screens/RecurringRulesScreen';
import { DebtTrackerScreen } from './components/screens/DebtTrackerScreen';
import { ExportReportScreen } from './components/screens/ExportReportScreen';
import { BillSplitterScreen } from './components/screens/BillSplitterScreen';

// Modals
import { ScanQrModal } from './components/modals/ScanQrModal';
import { NotificationsModal } from './components/modals/NotificationsModal';

// Icons
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Target,
  Settings,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Search,
  Lock,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Check
} from 'lucide-react';

export default function App() {
  // Refs and states for smooth horizontal sliding liquid glass dock
  const dockContainerRef = useRef<HTMLDivElement>(null);
  const dockTrackRef = useRef<HTMLDivElement>(null);
  const [dragConstraintsLeft, setDragConstraintsLeft] = useState(0);

  // Navigation & Core flows
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'login' | 'dashboard' | string>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScanQrOpen, setIsScanQrOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // LocalStorage state persistence
  const [accounts, setAccounts] = useState<SavingsAccount[]>(() => {
    const saved = localStorage.getItem('fz_accounts');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAVINGS_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fz_transactions');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fz_categories');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('fz_goals');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_GOALS;
  });

  const [wishlists, setWishlists] = useState<Wishlist[]>(() => {
    const saved = localStorage.getItem('fz_wishlists');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WISHLIST;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem('fz_budgets');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUDGETS;
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

  // Calculate dynamic bottom dock drag bounds
  useEffect(() => {
    const updateConstraints = () => {
      if (dockContainerRef.current && dockTrackRef.current) {
        const containerWidth = dockContainerRef.current.offsetWidth;
        const trackWidth = dockTrackRef.current.scrollWidth;
        const maxDrag = Math.min(0, containerWidth - trackWidth - 12);
        setDragConstraintsLeft(maxDrag);
      }
    };

    updateConstraints();
    const timer = setTimeout(updateConstraints, 250);

    window.addEventListener('resize', updateConstraints);
    return () => {
      window.removeEventListener('resize', updateConstraints);
      clearTimeout(timer);
    };
  }, [currentScreen, isLocked]);

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setAuthUser(user);
        // Save auth state
        localStorage.setItem('fz_is_authenticated', 'true');
      } else {
        const localAuth = localStorage.getItem('fz_is_authenticated') === 'true';
        setIsAuthenticated(localAuth);
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  // Flow handlers
  const handleFinishLaunch = (dest: 'ONBOARDING' | 'LOGIN' | 'DASHBOARD') => {
    const isFirstInstall = localStorage.getItem('fz_first_install') !== 'false';

    if (isFirstInstall) {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('fz_first_install', 'false');
    setCurrentScreen('dashboard');
  };

  const handleAuthSuccess = (cloudProf: UserCloudProfile, isNewUser: boolean) => {
    setIsAuthenticated(true);
    localStorage.setItem('fz_is_authenticated', 'true');
    setProfile({
      ...profile,
      name: cloudProf.displayName || 'Faza Asfi',
      email: cloudProf.email
    });
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    await logoutUser();
    setAuthUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fz_is_authenticated');
    setCurrentScreen('dashboard');
  };

  // State modification Handlers
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
    localStorage.setItem('fz_first_install', 'true');
    localStorage.removeItem('fz_is_authenticated');
    setCurrentScreen('splash');
  };

  // Wallet Sync Handlers
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

  const handleOpenQuickAction = (action: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'TARGET' | 'SCAN_QR') => {
    if (action === 'TARGET') {
      setCurrentScreen('wishlist');
    } else if (action === 'TRANSFER') {
      setCurrentScreen('savings');
    } else if (action === 'SCAN_QR') {
      setIsScanQrOpen(true);
    } else {
      setCurrentScreen('transactions');
    }
  };

  const handleQrPaySuccess = (merchant: string, amount: number) => {
    const newTx: Transaction = {
      id: `tx_qr_${Date.now()}`,
      title: `QRIS: ${merchant}`,
      amount: amount,
      type: 'EXPENSE',
      categoryId: 'cat_makan',
      accountId: accounts[0]?.id || 'acc_utama',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      notes: 'Pembayaran Instan via QRIS Scan'
    };
    handleAddTransaction(newTx);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Pembayaran QRIS Berhasil ⚡',
      message: `Telah dibayar Rp ${amount.toLocaleString('id-ID')} ke ${merchant}`,
      time: 'Baru saja',
      type: 'SUCCESS',
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const isDark = settings.theme === 'DARK';
  const t = getTranslation(settings.language);

  // Navigation tabs config
  const navTabs = [
    { id: 'dashboard', label: t.tabDashboard, icon: LayoutDashboard },
    { id: 'savings', label: t.tabSavings, icon: Wallet },
    { id: 'transactions', label: t.tabTransactions, icon: Receipt },
    { id: 'wishlist', label: t.tabTarget, icon: Target },
    { id: 'tools', label: t.tabTools, icon: Sparkles },
    { id: 'settings', label: t.tabProfile, icon: Settings }
  ];

  const isFullAppView = currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isLocked;

  return (
    <div className={`min-h-screen flex flex-col w-full relative transition-colors duration-300 font-sans antialiased selection:bg-[#6C4CF5] selection:text-white ${
      isDark ? 'bg-[#0E1022] text-slate-100' : 'bg-[#F6F7FB] text-slate-800'
    }`}>
      


      {/* 2. Top Navigation Bar (Only for main screens) */}
      {isFullAppView && (
        <div className={`px-5 py-3 border-b flex items-center justify-between z-30 transition-colors ${
          isDark ? 'bg-[#0E1022]/90 border-slate-800/80' : 'bg-white/90 border-slate-200/80'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#6C4CF5] shadow-xs shadow-purple-500/50" />
            <span className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              FZ SAVINGS
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Replay App Splash Screen */}
            <button
              onClick={() => setCurrentScreen('splash')}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-slate-100'
              }`}
              title="Mulai Ulang Splash Screen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Global Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-xl transition-colors ${
                isSearchOpen
                  ? 'bg-[#6C4CF5] text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cari Data"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className={`p-1.5 rounded-xl transition-colors relative ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Dark/Light Switcher */}
            <button
              onClick={() => setSettings({ ...settings, theme: isDark ? 'LIGHT' : 'DARK' })}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Lock Device */}
            <button
              onClick={() => setIsLocked(true)}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Kunci Layar"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Screen Viewport */}
      <div className="flex-1 w-full max-w-full relative flex flex-col min-h-0">
        
        {/* Splash Screen */}
        {currentScreen === 'splash' && (
          <SplashScreen
            onFinishLaunch={handleFinishLaunch}
            isFirstInstall={localStorage.getItem('fz_first_install') !== 'false'}
            isLoggedIn={localStorage.getItem('fz_is_authenticated') === 'true'}
          />
        )}

        {/* Onboarding Screen */}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            onFinishOnboarding={handleFinishOnboarding}
          />
        )}

        {/* Authentication / Login-Register Screen */}
        {currentScreen === 'login' && (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* Secure Screen Lock */}
        {isLocked && (
          <SecurityPinScreen
            correctPin={settings.pin}
            isBiometricsEnabled={settings.isBiometricsEnabled}
            onSuccess={() => setIsLocked(false)}
          />
        )}

        {/* Global Search Screen overlay */}
        {isSearchOpen && isFullAppView && (
          <GlobalSearchScreen
            transactions={transactions}
            accounts={accounts}
            goals={goals}
            currency={settings.currency}
            isDark={isDark}
            onNavigate={(scr) => {
              setCurrentScreen(scr);
              setIsSearchOpen(false);
            }}
          />
        )}

        {/* Regular Application Screens */}
        {isFullAppView && !isSearchOpen && (
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 w-full box-border">
            
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                userProfile={profile}
                accounts={accounts}
                transactions={transactions}
                goals={goals}
                currency={settings.currency}
                theme={settings.theme}
                language={settings.language}
                onNavigate={(scr) => setCurrentScreen(scr)}
                onOpenQuickAction={handleOpenQuickAction}
              />
            )}

            {currentScreen === 'savings' && (
              <SavingsScreen
                accounts={accounts}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
                onAddAccount={handleAddAccount}
                onDeleteAccount={handleDeleteAccount}
                onOpenTransfer={() => setCurrentScreen('transactions')}
              />
            )}

            {currentScreen === 'transactions' && (
              <TransactionScreen
                transactions={transactions}
                categories={categories}
                accounts={accounts}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
                onAddTransaction={handleAddTransaction}
                onSoftDeleteTransaction={handleSoftDeleteTransaction}
                onRestoreTransaction={handleRestoreTransaction}
                onNavigateToSavings={() => setCurrentScreen('savings')}
              />
            )}

            {currentScreen === 'calendar' && (
              <CalendarScreen
                transactions={transactions}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'statistics' && (
              <StatisticsScreen
                transactions={transactions}
                categories={categories}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'budget' && (
              <BudgetPlannerScreen
                budgets={budgets}
                categories={categories}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
                onUpdateBudget={handleUpdateBudget}
              />
            )}

            {currentScreen === 'wishlist' && (
              <WishlistGoalScreen
                goals={goals}
                wishlists={wishlists}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
                onAddGoal={handleAddGoal}
                onDepositGoal={handleDepositGoal}
                onAddWishlist={handleAddWishlist}
                onDeleteWishlist={handleDeleteWishlist}
              />
            )}

            {currentScreen === 'walletSync' && (
              <WalletIntegrationScreen
                wallets={wallets}
                pendingNotifs={pendingNotifs}
                syncLogs={syncLogs}
                categories={categories}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
                onConnectWallet={handleConnectWallet}
                onDisconnectWallet={handleDisconnectWallet}
                onSyncWallet={handleSyncWallet}
                onAcceptNotification={handleAcceptNotification}
                onRejectNotification={handleRejectNotification}
                onManualImportTransactions={handleManualImportTransactions}
                onToggleNotificationListener={handleToggleNotificationListener}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsProfileScreen
                userProfile={profile}
                settings={settings}
                isDark={isDark}
                onUpdateProfile={setProfile}
                onUpdateSettings={setSettings}
                onExportBackup={handleExportBackup}
                onExportCsv={handleExportCsv}
                onResetData={handleResetData}
              />
            )}

            {currentScreen === 'tools' && (
              <ToolsScreen
                onNavigateTool={(tool) => setCurrentScreen(tool)}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'aiAdvisor' && (
              <AiAdvisorScreen
                accounts={accounts}
                transactions={transactions}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'recurring' && (
              <RecurringRulesScreen
                accounts={accounts}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'debt' && (
              <DebtTrackerScreen
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'export' && (
              <ExportReportScreen
                userProfile={profile}
                accounts={accounts}
                transactions={transactions}
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}

            {currentScreen === 'splitBill' && (
              <BillSplitterScreen
                currency={settings.currency}
                isDark={isDark}
                language={settings.language}
              />
            )}
          </div>
        )}
      </div>

      {/* 4. Elegant Floating Liquid Glass Bottom Navigation Dock */}
      {isFullAppView && (
        <div 
          ref={dockContainerRef}
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40 p-1.5 rounded-3xl backdrop-blur-xl border transition-all duration-300 select-none overflow-hidden ${
            isDark 
              ? 'bg-[#0E1022]/45 border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.1)]' 
              : 'bg-white/40 border-white/50 shadow-[0_20px_50px_rgba(108,76,245,0.12),inset_0_1px_2px_rgba(255,255,255,0.8)]'
          }`}
          style={{ touchAction: 'pan-x' }}
        >
          <motion.div
            ref={dockTrackRef}
            drag="x"
            dragConstraints={{ left: dragConstraintsLeft, right: 0 }}
            dragElastic={0.2}
            dragTransition={{ power: 0.2, timeConstant: 250 }}
            className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing w-max min-w-full px-1 py-0.5 no-scrollbar overflow-x-visible"
          >
            {navTabs.map((tab) => {
              const isActive = currentScreen === tab.id || (tab.id === 'tools' && ['tools', 'aiAdvisor', 'recurring', 'debt', 'export', 'splitBill'].includes(currentScreen));
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentScreen(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-2.5 px-4 min-w-[78px] rounded-2xl transition-all duration-300 flex-1 ${
                    isActive 
                      ? isDark ? 'text-white' : 'text-white'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={tab.label}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-[#6C4CF5] rounded-2xl -z-10 shadow-[0_8px_20px_rgba(108,76,245,0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    />
                  )}
                  <tab.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                  <span className={`text-[10px] font-semibold mt-1 truncate tracking-tight text-center w-full transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'opacity-85'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* QRIS Scanner Modal */}
      {isScanQrOpen && (
        <ScanQrModal
          currency={settings.currency}
          onClose={() => setIsScanQrOpen(false)}
          onPaySuccess={handleQrPaySuccess}
        />
      )}

      {/* Notifications Drawer Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onClearAll={handleClearNotifications}
          onMarkAsRead={handleMarkNotifRead}
        />
      )}

    </div>
  );
}
