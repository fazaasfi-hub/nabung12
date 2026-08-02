import { Category, SavingsAccount, Transaction, Goal, Wishlist, CategoryBudget, AppSettings, UserProfile } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'cat_gaji', name: 'Gaji', type: 'INCOME', icon: 'Briefcase', color: '#10B981' },
  { id: 'cat_bonus', name: 'Bonus', type: 'INCOME', icon: 'Award', color: '#059669' },
  { id: 'cat_freelance', name: 'Freelance', type: 'INCOME', icon: 'Laptop', color: '#3B82F6' },
  { id: 'cat_hadiah', name: 'Hadiah', type: 'INCOME', icon: 'Gift', color: '#8B5CF6' },
  { id: 'cat_income_lain', name: 'Lainnya', type: 'INCOME', icon: 'PlusCircle', color: '#6B7280' },

  // Expense
  { id: 'cat_makan', name: 'Makan', type: 'EXPENSE', icon: 'Utensils', color: '#EF4444' },
  { id: 'cat_minum', name: 'Minum', type: 'EXPENSE', icon: 'Coffee', color: '#F97316' },
  { id: 'cat_transport', name: 'Transportasi', type: 'EXPENSE', icon: 'Car', color: '#F59E0B' },
  { id: 'cat_belanja', name: 'Belanja', type: 'EXPENSE', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat_pendidikan', name: 'Pendidikan', type: 'EXPENSE', icon: 'BookOpen', color: '#6366F1' },
  { id: 'cat_hiburan', name: 'Hiburan', type: 'EXPENSE', icon: 'Film', color: '#8B5CF6' },
  { id: 'cat_kesehatan', name: 'Kesehatan', type: 'EXPENSE', icon: 'Activity', color: '#06B6D4' },
  { id: 'cat_tagihan', name: 'Tagihan', type: 'EXPENSE', icon: 'Receipt', color: '#14B8A6' },
  { id: 'cat_internet', name: 'Internet', type: 'EXPENSE', icon: 'Wifi', color: '#3B82F6' },
  { id: 'cat_pulsa', name: 'Pulsa', type: 'EXPENSE', icon: 'Smartphone', color: '#64748B' },
  { id: 'cat_expense_lain', name: 'Lainnya', type: 'EXPENSE', icon: 'MoreHorizontal', color: '#94A3B8' },
];

export const INITIAL_SAVINGS_ACCOUNTS: SavingsAccount[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_WISHLIST: Wishlist[] = [];

export const INITIAL_BUDGETS: CategoryBudget[] = [];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Faza Asfi',
  email: 'fazaasfi@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
  monthlyTarget: 10000000,
  joinedDate: 'Januari 2026'
};

export const DEFAULT_SETTINGS: AppSettings = {
  pin: '123456',
  isPinEnabled: false,
  isBiometricsEnabled: false,
  isAutoLockEnabled: false,
  theme: 'SYSTEM',
  language: 'ID',
  currency: 'IDR',
  dateFormat: 'DD/MM/YYYY',
  autoBackup: true
};

export const INITIAL_NOTIFICATIONS: any[] = [];
