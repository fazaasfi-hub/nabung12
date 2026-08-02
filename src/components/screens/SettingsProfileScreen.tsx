import React, { useState, useRef } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { User, Shield, Lock, Smartphone, Moon, Sun, Globe, Download, Database, RefreshCw, Sparkles, ChevronRight, Check, Camera, Edit2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface SettingsProfileScreenProps {
  userProfile: UserProfile;
  settings: AppSettings;
  isDark?: boolean;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportBackup: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export const SettingsProfileScreen: React.FC<SettingsProfileScreenProps> = ({
  userProfile,
  settings,
  isDark = false,
  onUpdateProfile,
  onUpdateSettings,
  onExportBackup,
  onExportCsv,
  onResetData,
  onLogout
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    onUpdateProfile({
      ...userProfile,
      name: tempName.trim()
    });
    setIsEditingName(false);
    setToastMsg('Username berhasil diperbarui!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onUpdateProfile({
            ...userProfile,
            avatarUrl: dataUrl
          });
          setToastMsg('Foto profil berhasil diunggah dari galeri!');
          setTimeout(() => setToastMsg(null), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Hidden File Input for Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Profil & Pengaturan</h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Personalisasi akun & keamanan biometrik</p>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-5 bg-gradient-to-br from-[#0B1220] via-[#1E1B4B] to-[#6C4CF5] text-white rounded-[28px] shadow-xl space-y-4 border border-white/10 relative overflow-hidden">
        <div className="flex items-center space-x-4">
          {/* Avatar with Gallery Upload Overlay */}
          <div className="relative group shrink-0">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-md"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg border border-indigo-400/50 transition-transform active:scale-95"
              title="Pilih foto dari galeri"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Info & Username Edit */}
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Masukkan Username"
                  className="px-2.5 py-1 bg-zinc-900/90 border border-indigo-400/50 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shrink-0"
                  title="Simpan Username"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setTempName(userProfile.name);
                  }}
                  className="p-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors shrink-0"
                  title="Batal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-base font-black text-white truncate max-w-[150px]">{userProfile.name}</h3>
                  <button
                    onClick={() => {
                      setTempName(userProfile.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded-lg text-indigo-200 transition-colors shrink-0"
                    title="Ubah Username"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                </div>
                <p className="text-xs text-indigo-200 truncate">{userProfile.email}</p>
                <span className="inline-block px-2.5 py-0.5 mt-1 bg-white/10 text-[10px] font-bold rounded-full text-indigo-200">
                  Anggota Sejak {userProfile.joinedDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Ubah Foto dari Galeri */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white text-[11px] flex items-center justify-center space-x-2 transition-colors border border-white/10"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ubah Foto dari Galeri</span>
          </button>
          
          <button
            onClick={() => {
              setTempName(userProfile.name);
              setIsEditingName(true);
            }}
            className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white text-[11px] flex items-center justify-center space-x-1.5 transition-colors border border-white/10 shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ubah USN</span>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Mata Uang & Tampilan</h3>

        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
            <div className="flex items-center space-x-2.5">
              <Globe className="w-4 h-4 text-[#6C4CF5] dark:text-[#A78BFA]" />
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Mata Uang Utama</span>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => onUpdateSettings({ ...settings, currency: e.target.value as any })}
              className={`text-xs font-bold px-2.5 py-1 rounded-xl focus:outline-none ${
                isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <option value="IDR">IDR (Rupiah)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
            <div className="flex items-center space-x-2.5">
              <Moon className="w-4 h-4 text-[#6C4CF5] dark:text-[#A78BFA]" />
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Tema Tampilan</span>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => onUpdateSettings({ ...settings, theme: e.target.value as any })}
              className={`text-xs font-bold px-2.5 py-1 rounded-xl focus:outline-none ${
                isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <option value="LIGHT">Terang (Light)</option>
              <option value="DARK">Gelap (Dark)</option>
              <option value="SYSTEM">Sistem</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Keamanan & Proteksi PIN</h3>

        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
            <div className="flex items-center space-x-2.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Keamanan Biometrik / FaceID</span>
            </div>
            <input
              type="checkbox"
              checked={settings.isBiometricsEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, isBiometricsEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#6C4CF5] rounded cursor-pointer"
            />
          </div>

          <div className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
            <div className="flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Proteksi PIN 6-Digit</span>
            </div>
            <input
              type="checkbox"
              checked={settings.isPinEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, isPinEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#6C4CF5] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className={`p-4 border rounded-[24px] shadow-xs space-y-3 ${
        isDark ? 'bg-[#1E293B] border-slate-800 text-white' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Cadangkan Data (Offline First)</h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportBackup}
            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-[#6C4CF5] dark:text-[#A78BFA]" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={onExportCsv}
            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Export Laporan CSV</span>
          </button>
        </div>

        <button
          onClick={onResetData}
          className={`w-full py-2.5 text-rose-500 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center space-x-1.5 border ${
            isDark ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-200/60 hover:bg-rose-100'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Semua Data Aplikasi</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 border border-rose-400/30"
          >
            <span>Keluar Sesi (Logout Firebase)</span>
          </button>
        )}
      </div>
    </div>
  );
};
