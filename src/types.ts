export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface SavingsAccount {
  id: string;
  name: string;
  color: string;
  icon: string;
  balance: number;
  targetAmount: number;
  deadline: string;
  notes: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  targetAccountId?: string; // For transfer
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  reminderEnabled: boolean;
  category: string;
  status: 'BELUM_MULAI' | 'BERJALAN' | 'HAMPIR_SELESAI' | 'TERCAPAI';
  notes?: string;
}

export interface Wishlist {
  id: string;
  title: string;
  price: number;
  savedAmount: number;
  imageUrl?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
}

export interface CategoryBudget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  spentAmount: number;
}

export interface AppReminder {
  id: string;
  title: string;
  type: 'DAILY_SAVING' | 'WEEKLY_SAVING' | 'MONTHLY_SAVING' | 'TARGET_DUE' | 'BUDGET_WARNING';
  time: string;
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  monthlyTarget: number;
  joinedDate: string;
}

export interface AppSettings {
  pin: string;
  isPinEnabled: boolean;
  isBiometricsEnabled: boolean;
  isAutoLockEnabled: boolean;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  language: 'ID' | 'EN' | 'ES' | 'JA' | 'AR' | 'FR' | 'DE' | 'ZH' | 'KO';
  currency: 'IDR' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY';
  autoBackup: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
}

export type WalletProviderType = 'DANA' | 'GOPAY' | 'OVO' | 'SHOPEEPAY' | 'LINKAJA' | 'BANK_BCA' | 'BANK_MANDIRI' | 'BANK_BRI';

export type WalletConnectionStatus = 'CONNECTED' | 'SYNCING' | 'MANUAL' | 'DISCONNECTED' | 'ERROR';

export interface ConnectedWallet {
  id: string;
  provider: WalletProviderType;
  name: string;
  accountAlias: string;
  phoneOrAccountNum: string;
  status: WalletConnectionStatus;
  balance: number;
  lastSync: string;
  isAutoSync: boolean;
  isNotificationListenerActive: boolean;
  color: string;
  iconName: string;
}

export interface PendingWalletNotification {
  id: string;
  walletId: string;
  walletName: string;
  provider: WalletProviderType;
  merchant: string;
  amount: number;
  type: TransactionType;
  date: string;
  time: string;
  rawText: string;
  suggestedCategoryId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface SyncLogEntry {
  id: string;
  walletName: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  importedCount: number;
  duplicateCount: number;
  message: string;
}

export interface KotlinFile {
  path: string;
  name: string;
  folder: string;
  description: string;
  content: string;
}
