import React from 'react';
import { AppNotification } from '../../types';
import { Bell, X, Check, AlertCircle, CheckCircle2, Info, AlertTriangle, Trash2 } from 'lucide-react';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onClearAll,
  onMarkAsRead
}) => {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-[32px] overflow-hidden shadow-2xl space-y-3 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Notifikasi Smart AI</h3>
              <p className="text-[10px] text-slate-400">Pemberitahuan transaksi & budget alert</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                title="Hapus Semua"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi baru saat ini.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-800/60 border-indigo-500/30 text-slate-100 shadow-md'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/50 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
