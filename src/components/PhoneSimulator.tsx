import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { logoutUser, UserCloudProfile } from '../services/firebaseAuthService';
import { SavingsAccount, Transaction, Goal, Wishlist, CategoryBudget, AppSettings, UserProfile, Category, AppNotification, ConnectedWallet, PendingWalletNotification, SyncLogEntry } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockInitialData';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SavingsScreen } from './screens/SavingsScreen';
import { TransactionScreen } from './screens/TransactionScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { BudgetPlannerScreen } from './screens/BudgetPlannerScreen';
import { WishlistGoalScreen } from './screens/WishlistGoalScreen';
import { SettingsProfileScreen } from './screens/SettingsProfileScreen';
import { SecurityPinScreen } from './screens/SecurityPinScreen';
import { GlobalSearchScreen } from './screens/GlobalSearchScreen';
import { WalletIntegrationScreen } from './screens/WalletIntegrationScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { AiAdvisorScreen } from './screens/AiAdvisorScreen';
import { RecurringRulesScreen } from './screens/RecurringRulesScreen';
import { DebtTrackerScreen } from './screens/DebtTrackerScreen';
import { ExportReportScreen } from './screens/ExportReportScreen';
import { BillSplitterScreen } from './screens/BillSplitterScreen';
import { ScanQrModal } from './modals/ScanQrModal';
import { NotificationsModal } from './modals/NotificationsModal';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  CalendarDays,
  BarChart3,
  PieChart,
  Target,
  Settings,
  Search,
  Lock,
  Wifi,
  Battery,
  Signal,
  Bell,
  Sun,
  Moon,
  QrCode,
  RotateCcw,
  Zap,
  Smartphone,
  Sparkles
} from 'lucide-react';

interface PhoneSimulatorProps {
  accounts: SavingsAccount[];
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  wishlists: Wishlist[];
  budgets: CategoryBudget[];
  settings: AppSettings;
  profile: UserProfile;
  wallets: ConnectedWallet[];
  pendingNotifs: PendingWalletNotification[];
  syncLogs: SyncLogEntry[];
  onAddAccount: (acc: SavingsAccount) => void;
  onDeleteAccount: (id: string) => void;
  onAddTransaction: (tx: Transaction) => void;
  onSoftDeleteTransaction: (id: string) => void;
  onRestoreTransaction: (id: string) => void;
  onAddGoal: (g: Goal) => void;
  onAddWishlist: (w: Wishlist) => void;
  onDeleteWishlist: (id: string) => void;
  onDepositGoal: (goalId: string, amount: number) => void;
  onDepositWishlist: (wishId: string, amount: number) => void;
  onUpdateBudget: (b: CategoryBudget) => void;
  onUpdateSettings: (s: AppSettings) => void;
  onUpdateProfile: (p: UserProfile) => void;
  onExportBackup: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  onConnectWallet: (w: ConnectedWallet) => void;
  onDisconnectWallet: (id: string) => void;
  onSyncWallet: (id?: string) => void;
  onAcceptNotification: (id: string, catId: string) => void;
  onRejectNotification: (id: string) => void;
  onManualImportTransactions: (txs: Partial<Transaction>[]) => void;
  onToggleNotificationListener: (id: string, enabled: boolean) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = (props) => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isShowingSplash, setIsShowingSplash] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScanQrOpen, setIsScanQrOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Monitor Firebase Auth State without forcing lock
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setAuthUser(user);
      } else {
        setIsAuthenticated(true);
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (cloudProf: UserCloudProfile, isNewUser: boolean) => {
    setIsAuthenticated(true);
    props.onUpdateProfile({
      ...props.profile,
      name: cloudProf.displayName || 'Faza Asfi',
      email: cloudProf.email
    });

    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    await logoutUser();
    setAuthUser(null);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (scr: string) => {
    if (!auth.currentUser && scr !== 'login' && scr !== 'onboarding') {
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen(scr);
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

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
    // Add transaction automatically for QR payment
    const newTx: Transaction = {
      id: `tx_qr_${Date.now()}`,
      title: `QRIS: ${merchant}`,
      amount: amount,
      type: 'EXPENSE',
      categoryId: 'cat_makan',
      accountId: props.accounts[0]?.id || 'acc_utama',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      notes: 'Pembayaran Instan via QRIS Scan'
    };
    props.onAddTransaction(newTx);

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

  const isDark = props.settings.theme === 'DARK';

  return (
    <div className="w-full flex justify-center py-2">
      {/* Outer Phone Shell */}
      <div className="w-full max-w-[410px] h-[830px] bg-slate-950 rounded-[50px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-purple-900/60" />
        </div>

        {/* Android Status Bar */}
        <div className="pt-2 px-6 pb-2 flex items-center justify-between text-slate-400 text-[11px] font-mono z-40">
          <span className="font-bold text-slate-300">09:41</span>
          <div className="flex items-center space-x-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Phone Main Screen Surface */}
        <div className={`flex-1 rounded-[40px] overflow-hidden flex flex-col relative transition-colors duration-300 ${
          isDark ? 'bg-[#0E1022] text-slate-100' : 'bg-[#F6F7FB] text-slate-800'
        }`}>
          
          {/* Top App Bar Header */}
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
              {/* Replay App Launch Splash Screen */}
              <button
                onClick={() => setIsShowingSplash(true)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isShowingSplash
                    ? 'bg-[#6C4CF5] text-white shadow-xs'
                    : isDark ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-slate-100'
                }`}
                title="Replay FZ App Launch Animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Global Search Button */}
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

              {/* Notifications Button */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className={`p-1.5 rounded-xl transition-colors relative ${
                  isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Theme Switcher Toggle */}
              <button
                onClick={() => props.onUpdateSettings({ ...props.settings, theme: isDark ? 'LIGHT' : 'DARK' })}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Ganti Tema"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Lock PIN Toggle */}
              <button
                onClick={() => setIsLocked(true)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Kunci Aplikasi"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Screen Overlay Splash Screen */}
          {isShowingSplash && (
            <SplashScreen
              onFinishLaunch={(dest) => {
                setIsShowingSplash(false);
                if (dest === 'ONBOARDING') {
                  setCurrentScreen('onboarding');
                } else if (dest === 'LOGIN') {
                  setCurrentScreen('login');
                } else {
                  setCurrentScreen('dashboard');
                }
              }}
              isFirstInstall={false}
              isLoggedIn={true}
            />
          )}

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full box-border p-4 space-y-4 relative">
            {isLocked ? (
              <SecurityPinScreen
                correctPin={props.settings.pin}
                isBiometricsEnabled={props.settings.isBiometricsEnabled}
                onSuccess={() => setIsLocked(false)}
              />
            ) : isSearchOpen ? (
              <GlobalSearchScreen
                transactions={props.transactions}
                accounts={props.accounts}
                goals={props.goals}
                currency={props.settings.currency}
                isDark={isDark}
                onNavigate={(scr) => {
                  setCurrentScreen(scr);
                  setIsSearchOpen(false);
                }}
              />
            ) : currentScreen === 'onboarding' ? (
              <OnboardingScreen
                onFinishOnboarding={() => setCurrentScreen('dashboard')}
              />
            ) : currentScreen === 'login' ? (
              <AuthScreen
                onAuthSuccess={handleAuthSuccess}
              />
            ) : (
              <>
                {currentScreen === 'dashboard' && (
                  <DashboardScreen
                    userProfile={props.profile}
                    accounts={props.accounts}
                    transactions={props.transactions}
                    goals={props.goals}
                    currency={props.settings.currency}
                    theme={props.settings.theme}
                    onNavigate={(scr) => setCurrentScreen(scr)}
                    onOpenQuickAction={handleOpenQuickAction}
                  />
                )}

                {currentScreen === 'savings' && (
                  <SavingsScreen
                    accounts={props.accounts}
                    currency={props.settings.currency}
                    isDark={isDark}
                    onAddAccount={props.onAddAccount}
                    onDeleteAccount={props.onDeleteAccount}
                    onOpenTransfer={() => setCurrentScreen('transactions')}
                  />
                )}

                {currentScreen === 'transactions' && (
                  <TransactionScreen
                    transactions={props.transactions}
                    categories={props.categories}
                    accounts={props.accounts}
                    currency={props.settings.currency}
                    isDark={isDark}
                    onAddTransaction={props.onAddTransaction}
                    onSoftDeleteTransaction={props.onSoftDeleteTransaction}
                    onRestoreTransaction={props.onRestoreTransaction}
                  />
                )}

                {currentScreen === 'calendar' && (
                  <CalendarScreen
                    transactions={props.transactions}
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'statistics' && (
                  <StatisticsScreen
                    transactions={props.transactions}
                    categories={props.categories}
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'budget' && (
                  <BudgetPlannerScreen
                    budgets={props.budgets}
                    categories={props.categories}
                    currency={props.settings.currency}
                    isDark={isDark}
                    onUpdateBudget={props.onUpdateBudget}
                  />
                )}

                {currentScreen === 'wishlist' && (
                  <WishlistGoalScreen
                    goals={props.goals}
                    wishlists={props.wishlists}
                    currency={props.settings.currency}
                    isDark={isDark}
                    onAddGoal={props.onAddGoal}
                    onDepositGoal={props.onDepositGoal}
                    onAddWishlist={props.onAddWishlist}
                    onDeleteWishlist={props.onDeleteWishlist}
                  />
                )}

                {/* Wallet Integration Screen */}
                {currentScreen === 'walletSync' && (
                  <WalletIntegrationScreen
                    wallets={props.wallets}
                    pendingNotifs={props.pendingNotifs}
                    syncLogs={props.syncLogs}
                    categories={props.categories}
                    currency={props.settings.currency}
                    isDark={isDark}
                    onConnectWallet={props.onConnectWallet}
                    onDisconnectWallet={props.onDisconnectWallet}
                    onSyncWallet={props.onSyncWallet}
                    onAcceptNotification={props.onAcceptNotification}
                    onRejectNotification={props.onRejectNotification}
                    onManualImportTransactions={props.onManualImportTransactions}
                    onToggleNotificationListener={props.onToggleNotificationListener}
                  />
                )}

                {currentScreen === 'settings' && (
                  <SettingsProfileScreen
                    userProfile={props.profile}
                    settings={props.settings}
                    isDark={isDark}
                    onUpdateProfile={props.onUpdateProfile}
                    onUpdateSettings={props.onUpdateSettings}
                    onExportBackup={props.onExportBackup}
                    onExportCsv={props.onExportCsv}
                    onResetData={props.onResetData}
                    onLogout={handleLogout}
                  />
                )}

                {currentScreen === 'tools' && (
                  <ToolsScreen
                    onNavigateTool={(tool) => setCurrentScreen(tool)}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'aiAdvisor' && (
                  <AiAdvisorScreen
                    accounts={props.accounts}
                    transactions={props.transactions}
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'recurring' && (
                  <RecurringRulesScreen
                    accounts={props.accounts}
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'debt' && (
                  <DebtTrackerScreen
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'export' && (
                  <ExportReportScreen
                    userProfile={props.profile}
                    accounts={props.accounts}
                    transactions={props.transactions}
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}

                {currentScreen === 'splitBill' && (
                  <BillSplitterScreen
                    currency={props.settings.currency}
                    isDark={isDark}
                  />
                )}
              </>
            )}
          </div>

          {/* Clean Bottom Navigation Bar (Google Wallet / Revolut Style) */}
          {!isLocked && !isShowingSplash && currentScreen !== 'onboarding' && currentScreen !== 'login' && (
            <div className="absolute bottom-2 inset-x-2 z-40 max-w-full overflow-hidden pointer-events-auto">
              <div className="px-1 py-1 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-xl flex items-center justify-between relative w-full overflow-hidden">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    currentScreen === 'dashboard' ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Beranda"
                >
                  {currentScreen === 'dashboard' && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Beranda</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('savings')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    currentScreen === 'savings' ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Rekening"
                >
                  {currentScreen === 'savings' && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Rekening</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('transactions')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    currentScreen === 'transactions' ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Transaksi"
                >
                  {currentScreen === 'transactions' && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Receipt className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Arus Kas</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('wishlist')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    currentScreen === 'wishlist' ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Target"
                >
                  {currentScreen === 'wishlist' && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Target className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Target</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('tools')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    ['tools', 'aiAdvisor', 'recurring', 'debt', 'export', 'splitBill'].includes(currentScreen) ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Alat & Fitur"
                >
                  {['tools', 'aiAdvisor', 'recurring', 'debt', 'export', 'splitBill'].includes(currentScreen) && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Alat</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('settings')}
                  className={`flex-1 min-w-0 px-0.5 py-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    currentScreen === 'settings' ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Profil"
                >
                  {currentScreen === 'settings' && (
                    <motion.div
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-semibold mt-0.5 truncate w-full text-center">Profil</span>
                </button>
              </div>
            </div>
          )}

          {/* QRIS Scanner Modal */}
          {isScanQrOpen && (
            <ScanQrModal
              currency={props.settings.currency}
              onClose={() => setIsScanQrOpen(false)}
              onPaySuccess={handleQrPaySuccess}
            />
          )}

          {/* Notifications Modal */}
          {isNotificationsOpen && (
            <NotificationsModal
              notifications={notifications}
              onClose={() => setIsNotificationsOpen(false)}
              onClearAll={handleClearNotifications}
              onMarkAsRead={handleMarkNotifRead}
            />
          )}

        </div>
      </div>
    </div>
  );
};
