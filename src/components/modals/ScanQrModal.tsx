import React, { useState } from 'react';
import { QrCode, X, Camera, Zap, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ScanQrModalProps {
  currency: 'IDR' | 'USD' | 'EUR';
  onClose: () => void;
  onPaySuccess: (title: string, amount: number) => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({ currency, onClose, onPaySuccess }) => {
  const [merchantName, setMerchantName] = useState('Kopi Kenangan - QRIS Stand');
  const [payAmount, setPayAmount] = useState('32000');
  const [isScanning, setIsScanning] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(false);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    onPaySuccess(merchantName, amount);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 text-white rounded-[32px] overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">QRIS Payment</h3>
              <p className="text-[10px] text-slate-400">Scan & Pay Instant Cashback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder simulator */}
        <div className="p-6 text-center space-y-4">
          {isSuccess ? (
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-white">Pembayaran QRIS Berhasil!</h4>
              <p className="text-xs text-slate-300">
                Telah dibayarkan <strong className="text-emerald-400">{formatCurrency(parseFloat(payAmount) || 0, currency)}</strong> ke <span className="text-indigo-300">{merchantName}</span>.
              </p>
            </div>
          ) : isScanning ? (
            <div className="space-y-4">
              <div className="relative w-56 h-56 mx-auto rounded-3xl border-2 border-dashed border-indigo-500/60 bg-slate-950 flex flex-col items-center justify-center overflow-hidden shadow-inner group cursor-pointer" onClick={handleSimulateScan}>
                {/* Laser scan animation line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
                
                <Camera className="w-10 h-10 text-indigo-400/60 mb-2" />
                <span className="text-xs font-semibold text-slate-300">Arahkan kamera ke Kode QRIS</span>
                <span className="text-[10px] text-indigo-400 mt-1 font-mono">(Klik di sini untuk simulasi Scan)</span>
              </div>

              <div className="flex items-center justify-center space-x-3 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors text-slate-200"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Senter ON</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors text-slate-200"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Upload Galeri</span>
                </button>
              </div>
            </div>
          ) : (
            /* Pay Confirmation Step */
            <form onSubmit={handleConfirmPay} className="space-y-4 text-left">
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Merchant Terdeteksi</span>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
                  />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
                >
                  Scan Ulang
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Bayar Sekarang
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
