import { ConnectedWallet, PendingWalletNotification, SyncLogEntry, WalletProviderType } from '../types';

export const PROVIDER_METADATA: Record<WalletProviderType, { name: string; brandColor: string; bgBadge: string; logoText: string; isBank: boolean }> = {
  GOPAY: { name: 'GoPay', brandColor: '#00AED6', bgBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', logoText: 'G', isBank: false },
  DANA: { name: 'DANA', brandColor: '#118EEA', bgBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', logoText: 'D', isBank: false },
  OVO: { name: 'OVO', brandColor: '#4C2A86', bgBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', logoText: 'O', isBank: false },
  SHOPEEPAY: { name: 'ShopeePay', brandColor: '#EE4D2D', bgBadge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', logoText: 'S', isBank: false },
  LINKAJA: { name: 'LinkAja', brandColor: '#ED1C24', bgBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', logoText: 'L', isBank: false },
  BANK_BCA: { name: 'Bank BCA', brandColor: '#005CA9', bgBadge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', logoText: 'BCA', isBank: true },
  BANK_MANDIRI: { name: 'Bank Mandiri', brandColor: '#003366', bgBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', logoText: 'MDR', isBank: true },
  BANK_BRI: { name: 'Bank BRI', brandColor: '#00529C', bgBadge: 'bg-blue-600/10 text-blue-400 border-blue-600/20', logoText: 'BRI', isBank: true }
};

export const INITIAL_CONNECTED_WALLETS: ConnectedWallet[] = [];

export const INITIAL_PENDING_NOTIFICATIONS: PendingWalletNotification[] = [];

export const INITIAL_SYNC_LOGS: SyncLogEntry[] = [];
