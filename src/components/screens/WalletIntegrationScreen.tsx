import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  Smartphone,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Upload,
  Trash2,
  Check,
  X,
  FileText,
  Search,
  Zap,
  Building2,
  HelpCircle,
  Copy,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import {
  ConnectedWallet,
  PendingWalletNotification,
  SyncLogEntry,
  WalletProviderType,
  Transaction,
  Category
} from '../../types';
import { PROVIDER_METADATA } from '../../data/mockWalletData';
import { formatCurrency } from '../../utils/formatters';

interface WalletIntegrationScreenProps {
  wallets: ConnectedWallet[];
  pendingNotifs: PendingWalletNotification[];
  syncLogs: SyncLogEntry[];
  categories: Category[];
  currency: 'IDR' | 'USD' | 'EUR';
  isDark?: boolean;
  onConnectWallet: (wallet: ConnectedWallet) => void;
  onDisconnectWallet: (walletId: string) => void;
  onSyncWallet: (walletId?: string) => void;
  onAcceptNotification: (notifId: string, categoryId: string) => void;
  onRejectNotification: (notifId: string) => void;
  onManualImportTransactions: (importedTxs: Partial<Transaction>[]) => void;
  onToggleNotificationListener: (walletId: string, enabled: boolean) => void;
}

export const WalletIntegrationScreen: React.FC<WalletIntegrationScreenProps> = ({
  wallets,
  pendingNotifs,
  syncLogs,
  categories,
  currency,
  isDark = false,
  onConnectWallet,
  onDisconnectWallet,
  onSyncWallet,
  onAcceptNotification,
  onRejectNotification,
  onManualImportTransactions,
  onToggleNotificationListener
}) => {
  const [activeTab, setActiveTab] = useState<'WALLETS' | 'NOTIFICATIONS' | 'IMPORT' | 'SYNC_CENTER'>('WALLETS');
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // New Wallet Form State
  const [selectedProvider, setSelectedProvider] = useState<WalletProviderType>('GOPAY');
  const [accountAlias, setAccountAlias] = useState('');
  const [phoneOrAccountNum, setPhoneOrAccountNum] = useState('');
  const [initialBalance, setInitialBalance] = useState('500000');
  const [enableAutoSync, setEnableAutoSync] = useState(true);

  // Manual Import CSV State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Array<{
    date: string;
    merchant: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
    category: string;
    categoryId: string;
    isDuplicate: boolean;
  }>>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Total Wallet Balance
  const totalWalletBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const pendingNotifCount = pendingNotifs.filter(p => p.status === 'PENDING').length;

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = PROVIDER_METADATA[selectedProvider];
    const newW: ConnectedWallet = {
      id: `w_${Date.now()}`,
      provider: selectedProvider,
      name: meta.name,
      accountAlias: accountAlias || `${meta.name} Akun`,
      phoneOrAccountNum: phoneOrAccountNum || '0812-****-0000',
      status: 'CONNECTED',
      balance: parseFloat(initialBalance) || 0,
      lastSync: 'Baru saja',
      isAutoSync: enableAutoSync,
      isNotificationListenerActive: true,
      color: meta.brandColor,
      iconName: meta.isBank ? 'Building2' : 'Wallet'
    };
    onConnectWallet(newW);
    setIsAddingWallet(false);
    setAccountAlias('');
    setPhoneOrAccountNum('');
  };

  const handleSyncAllClick = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      onSyncWallet();
      setIsSyncingAll(false);
    }, 1200);
  };

  // Simulate file upload & auto-categorization duplicate check
  const handleSimulateFileUpload = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sampleImportData = [
      {
        date: todayStr,
        merchant: 'Indomaret Point Sudirman',
        amount: 28500,
        type: 'EXPENSE' as const,
        category: 'Belanja',
        categoryId: 'cat_belanja',
        isDuplicate: false
      },
      {
        date: todayStr,
        merchant: 'Kopi Kenangan (QRIS DANA)',
        amount: 45000,
        type: 'EXPENSE' as const,
        category: 'Minum',
        categoryId: 'cat_minum',
        isDuplicate: true // Flagged duplicate
      },
      {
        date: todayStr,
        merchant: 'Gojek Ride - GoPay',
        amount: 18000,
        type: 'EXPENSE' as const,
        category: 'Transportasi',
        categoryId: 'cat_transport',
        isDuplicate: false
      },
      {
        date: todayStr,
        merchant: 'Transfer Cashback Shopee',
        amount: 50000,
        type: 'INCOME' as const,
        category: 'Hadiah',
        categoryId: 'cat_hadiah',
        isDuplicate: false
      }
    ];

    setParsedPreview(sampleImportData);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "\uFEFFTanggal,Keterangan,Nominal,Jenis,Kategori\n" +
      "2026-08-01,Gaji Bulanan Utama,12000000,INCOME,Gaji\n" +
      "2026-08-01,Belanja Bulanan Indomaret,350000,EXPENSE,Belanja\n" +
      "2026-08-02,Kopi Kenangan QRIS DANA,45000,EXPENSE,Minum\n" +
      "2026-08-02,Gojek Ride Ke Kantor,18000,EXPENSE,Transportasi\n" +
      "2026-08-02,Cashback ShopeePay,50000,INCOME,Hadiah\n" +
      "2026-08-03,Makan Siang Nasi Padang,35000,EXPENSE,Makan\n" +
      "2026-08-03,Langganan Internet Biznet,375000,EXPENSE,Internet\n" +
      "2026-08-04,Beli Pulsa Telkomsel,100000,EXPENSE,Pulsa\n" +
      "2026-08-05,Freelance Web Design,2500000,INCOME,Freelance\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_transaksi_fzsavings.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    const validItems = parsedPreview.filter(p => !p.isDuplicate);
    const txsToImport: Partial<Transaction>[] = validItems.map((item, idx) => ({
      id: `imp_${Date.now()}_${idx}`,
      title: item.merchant,
      amount: item.amount,
      type: item.type,
      categoryId: item.categoryId,
      accountId: wallets[0]?.id || 'acc_utama',
      date: item.date,
      time: '12:00',
      notes: `Imported via CSV/Statement`
    }));

    onManualImportTransactions(txsToImport);
    setImportSuccessMsg(`Berhasil mengimpor ${validItems.length} transaksi! (${parsedPreview.length - validItems.length} duplikat diabaikan)`);
    setParsedPreview([]);
    setTimeout(() => setImportSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-br from-indigo-900 via-[#1E1B4B] to-[#6C4CF5] text-white rounded-[28px] shadow-xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-extrabold tracking-wider text-indigo-200 border border-white/10 mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>OFFICIAL OPEN API INTEGRATION</span>
              </div>
              <h2 className="text-xl font-black tracking-tight">E-Wallet & Bank Sync</h2>
              <p className="text-xs text-indigo-200/80">Integrasi e-wallet resmi, import statement, & listener notifikasi otomatis</p>
            </div>

            <button
              onClick={handleSyncAllClick}
              disabled={isSyncingAll}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl border border-white/20 text-white transition-all flex items-center justify-center shadow-sm"
              title="Sync Semua Wallet"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin text-amber-300' : ''}`} />
            </button>
          </div>

          {/* Balance Breakdown Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <div>
              <span className="text-[10px] font-semibold text-indigo-200">Total Saldo Terintegrasi</span>
              <div className="text-lg font-black tracking-tight text-white">
                {formatCurrency(totalWalletBalance, currency)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-indigo-200">Wallet Terhubung</span>
              <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{wallets.filter(w => w.status === 'CONNECTED').length} / {wallets.length} Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-indigo-500/30 blur-2xl pointer-events-none" />
      </div>

      {/* Tabs Navigation */}
      <div className={`grid grid-cols-4 p-1 rounded-2xl text-[11px] font-extrabold ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <button
          onClick={() => setActiveTab('WALLETS')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'WALLETS' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 relative ${
            activeTab === 'NOTIFICATIONS' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notif</span>
          {pendingNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {pendingNotifCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('IMPORT')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'IMPORT' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Import</span>
        </button>

        <button
          onClick={() => setActiveTab('SYNC_CENTER')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeTab === 'SYNC_CENTER' ? 'bg-[#6C4CF5] text-white shadow-2xs' : isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Logs</span>
        </button>
      </div>

      {/* TAB 1: WALLET MANAGER */}
      {activeTab === 'WALLETS' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Daftar Wallet & Rekening Terhubung ({wallets.length})
            </h3>

            <button
              onClick={() => setIsAddingWallet(true)}
              className="px-3 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tautkan</span>
            </button>
          </div>

          {/* Add Wallet Modal Form */}
          {isAddingWallet && (
            <form onSubmit={handleConnectSubmit} className={`p-4 border rounded-[24px] shadow-lg space-y-3 ${
              isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
            }`}>
              <div className="flex justify-between items-center border-b pb-2 border-slate-700/40">
                <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tautkan E-Wallet / Rekening Resmi</span>
                </h4>
                <button type="button" onClick={() => setIsAddingWallet(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Provider E-Wallet / Bank</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(PROVIDER_METADATA) as WalletProviderType[]).map((pKey) => {
                    const meta = PROVIDER_METADATA[pKey];
                    const isSel = selectedProvider === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setSelectedProvider(pKey)}
                        className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                          isSel
                            ? 'bg-[#6C4CF5]/20 border-[#6C4CF5] text-white ring-1 ring-[#6C4CF5]'
                            : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg text-xs font-black text-white flex items-center justify-center shadow-xs" style={{ backgroundColor: meta.brandColor }}>
                          {meta.logoText}
                        </span>
                        <span className="text-[10px] font-bold truncate w-full">{meta.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Alias Akun</label>
                  <input
                    type="text"
                    value={accountAlias}
                    onChange={(e) => setAccountAlias(e.target.value)}
                    placeholder="Contoh: GoPay Utama / BCA Tahapan"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No. HP / No. Rekening</label>
                  <input
                    type="text"
                    value={phoneOrAccountNum}
                    onChange={(e) => setPhoneOrAccountNum(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4CF5] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#6C4CF5]" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Sinkronisasi API Otomatis</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableAutoSync}
                  onChange={(e) => setEnableAutoSync(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6C4CF5]"
                />
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl text-[10px] text-slate-400 space-y-1 border border-slate-700/50">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Jaminan Keamanan & Privasi FZ Savings</span>
                </div>
                <p>
                  Aplikasi TIDAK PERNAH menyimpan password, PIN, atau melakukan scraping privat data. Koneksi menggunakan protokol Open API resmi OAuth 2.0 / Token Terenkripsi lokal.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingWallet(false)}
                  className={`px-3 py-1.5 text-xs font-semibold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#6C4CF5] hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
                >
                  Simpan & Tautkan
                </button>
              </div>
            </form>
          )}

          {/* Connected Wallets List Cards */}
          <div className="space-y-3">
            {wallets.map((w) => {
              const meta = PROVIDER_METADATA[w.provider] || { name: w.name, brandColor: w.color, bgBadge: 'bg-slate-800 text-slate-300', logoText: 'W' };
              return (
                <div
                  key={w.id}
                  className={`p-4 border rounded-[24px] shadow-xs space-y-3 transition-all ${
                    isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                        style={{ backgroundColor: meta.brandColor }}
                      >
                        {meta.logoText}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{w.name}</h4>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border ${meta.bgBadge}`}>
                            {w.status}
                          </span>
                        </div>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {w.accountAlias} • {w.phoneOrAccountNum}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-[#6C4CF5] dark:text-[#A78BFA]">
                        {formatCurrency(w.balance, currency)}
                      </div>
                      <span className={`text-[9px] flex items-center justify-end gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>Sync: {w.lastSync}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Toggles bar */}
                  <div className={`pt-2.5 border-t flex items-center justify-between text-[10px] ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
                  }`}>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={w.isNotificationListenerActive}
                        onChange={(e) => onToggleNotificationListener(w.id, e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#6C4CF5]"
                      />
                      <span className="font-semibold">Android Notification Listener</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSyncWallet(w.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold transition-all flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sync Now</span>
                      </button>

                      <button
                        onClick={() => onDeleteWalletConfirm(w.id)}
                        className="p-1 hover:text-rose-400 rounded-lg transition-colors"
                        title="Tutup / Putuskan Tautan"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATION LISTENER REVIEW QUEUE */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start space-x-2 text-xs">
            <Bell className="w-4 h-4 text-[#6C4CF5] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-indigo-300">Android Notification Listener Active</h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Sistem mendeteksi notifikasi pembayaran dari e-wallet & e-banking. Tinjau & simpan transaksi di bawah sebelum masuk ke pembukuan.
              </p>
            </div>
          </div>

          {pendingNotifs.filter(p => p.status === 'PENDING').length === 0 ? (
            <div className={`text-center py-12 border rounded-[24px] space-y-2 ${
              isDark ? 'bg-[#1E293B] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-xs font-bold">Semua Notifikasi Telah Ditinjau!</h4>
              <p className="text-[10px]">Belum ada notifikasi pembayaran baru terdeteksi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingNotifs.filter(p => p.status === 'PENDING').map((pn) => {
                const meta = PROVIDER_METADATA[pn.provider];
                return (
                  <div
                    key={pn.id}
                    className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
                      isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs" style={{ backgroundColor: meta?.brandColor || '#6C4CF5' }}>
                          {meta?.logoText || 'N'}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-extrabold">{pn.merchant}</h4>
                            <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 text-[9px] font-bold rounded-md border border-amber-500/20">
                              Saran Notifikasi
                            </span>
                          </div>
                          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {pn.walletName} • {pn.time}
                          </span>
                        </div>
                      </div>

                      <div className={`text-xs font-black ${pn.type === 'EXPENSE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {pn.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(pn.amount, currency)}
                      </div>
                    </div>

                    {/* Raw Notification Text caught from Android */}
                    <div className={`p-2.5 rounded-xl text-[10px] font-mono leading-relaxed border ${
                      isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <span className="text-indigo-400 font-bold">[Android Listener Raw]: </span>
                      "{pn.rawText}"
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => onRejectNotification(pn.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:bg-rose-500/10 transition-all flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Abaikan</span>
                      </button>

                      <button
                        onClick={() => onAcceptNotification(pn.id, pn.suggestedCategoryId)}
                        className="px-4 py-1.5 bg-[#6C4CF5] hover:bg-indigo-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Konfirmasi & Simpan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANUAL FILE IMPORT (CSV / EXCEL / STATEMENT) */}
      {activeTab === 'IMPORT' && (
        <div className="space-y-4">
          <div className={`p-6 border rounded-[28px] shadow-lg text-center space-y-4 relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-slate-800 text-white' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/80 text-slate-900'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-inner">
              <FileText className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-extrabold">Spreadsheet & Bank Statement Importer</h3>
              <p className={`text-[11px] max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Format Excel (.xlsx), CSV, atau Rekening Koran Digital (GoPay, DANA, OVO, BCA, Mandiri)
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={handleSimulateFileUpload}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah & Analisis Spreadsheet (Excel / CSV)</span>
              </button>

              <button
                onClick={handleDownloadTemplate}
                className={`px-5 py-3 text-xs font-extrabold rounded-2xl border transition-all inline-flex items-center space-x-2 w-full sm:w-auto justify-center ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-emerald-400' 
                    : 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-100/50 text-emerald-700'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Template Excel (.csv)</span>
              </button>
            </div>
          </div>

          {importSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs font-bold text-emerald-400 flex items-center space-x-2.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{importSuccessMsg}</span>
            </motion.div>
          )}

          {/* Parsed Spreadsheet Preview Table */}
          {parsedPreview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-[28px] shadow-xl overflow-hidden ${
                isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
              }`}
            >
              {/* Spreadsheet Header Bar */}
              <div className={`p-4 border-b flex flex-wrap justify-between items-center gap-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-wider">Pratinjau Tabel Excel / Statement</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sistem mendeteksi kolom otomatis & verifikasi duplikat 4-titik</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-xl border border-emerald-500/20">
                    {parsedPreview.length} Baris Data
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-xl border border-indigo-500/20">
                    {parsedPreview.filter(p => !p.isDuplicate).length} Valid
                  </span>
                </div>
              </div>

              {/* Spreadsheet Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'
                    }`}>
                      <th className="p-3 text-center w-12">No</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Keterangan / Merchant</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Jenis</th>
                      <th className="p-3 text-right">Nominal</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {parsedPreview.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          item.isDuplicate
                            ? 'bg-rose-500/10 hover:bg-rose-500/15'
                            : isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 text-center font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="p-3 font-mono text-[11px] whitespace-nowrap">{item.date}</td>
                        <td className="p-3">
                          <div className="font-extrabold">{item.merchant}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            item.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {item.type === 'INCOME' ? 'Masuk' : 'Keluar'}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-mono font-black ${item.type === 'EXPENSE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {item.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(item.amount, currency)}
                        </td>
                        <td className="p-3 text-center">
                          {item.isDuplicate ? (
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[9px] font-black rounded-lg uppercase border border-rose-500/30">
                              Duplikat
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg uppercase border border-emerald-500/30">
                              Siap Impor
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Spreadsheet Footer Actions */}
              <div className={`p-4 border-t flex justify-between items-center ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="text-[10px] text-slate-400">Baris duplikat akan dilewati secara otomatis saat konfirmasi.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setParsedPreview([])}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                      isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Konfirmasi & Impor {parsedPreview.filter(p => !p.isDuplicate).length} Data</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 4: SYNC CENTER & LOGS */}
      {activeTab === 'SYNC_CENTER' && (
        <div className="space-y-3">
          {/* Health & Status Widget */}
          <div className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
            isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Status Sinkronisasi & Anti-Duplikasi</h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold">Mesin Anti-Duplikasi</span>
                <div className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktif (Hash 4-Point)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold">Keamanan Kredensial</span>
                <div className="text-indigo-400 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AES-256 Token</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Logs Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Riwayat Log Sinkronisasi</h4>

            <div className="space-y-2">
              {syncLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 border rounded-xl text-xs space-y-1 ${
                    isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-400">{log.walletName}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' :
                      log.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">{log.message}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Impor: {log.importedCount} | Duplikat: {log.duplicateCount}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function onDeleteWalletConfirm(walletId: string) {
    if (confirm('Apakah Anda yakin ingin memutuskan tautan wallet ini?')) {
      onDisconnectWallet(walletId);
    }
  }
};
