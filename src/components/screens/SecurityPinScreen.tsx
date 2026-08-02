import React, { useState } from 'react';
import { Lock, Fingerprint, ShieldCheck } from 'lucide-react';

interface SecurityPinScreenProps {
  correctPin: string;
  isBiometricsEnabled: boolean;
  onSuccess: () => void;
}

export const SecurityPinScreen: React.FC<SecurityPinScreenProps> = ({
  correctPin,
  isBiometricsEnabled,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 6) {
        if (newPin === correctPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="min-h-[620px] bg-gradient-to-b from-slate-950 via-[#0E1022] to-slate-900 text-white p-6 flex flex-col justify-between items-center text-center">
      {/* Top Lock Badge */}
      <div className="pt-8 space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-[#6C4CF5] to-indigo-700 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-white">FZ Savings Security</h2>
          <p className="text-xs text-slate-400 mt-0.5">Masukkan PIN 6-digit akun Anda</p>
        </div>
      </div>

      {/* Pin Dots */}
      <div className="space-y-2">
        <div className="flex space-x-3 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? 'bg-[#6C4CF5] border-[#6C4CF5] scale-110 shadow-md shadow-indigo-500/50'
                  : 'bg-transparent border-slate-700'
              } ${error ? 'animate-bounce border-rose-500 bg-rose-500' : ''}`}
            />
          ))}
        </div>
        {error && <p className="text-xs font-bold text-rose-400">PIN Salah. Coba Lagi!</p>}
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 mx-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl border border-slate-800 transition-all active:scale-95 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          {isBiometricsEnabled ? (
            <button
              onClick={onSuccess}
              className="w-14 h-14 mx-auto bg-indigo-950 hover:bg-indigo-900 text-indigo-400 rounded-2xl border border-indigo-500/30 flex items-center justify-center"
            >
              <Fingerprint className="w-6 h-6" />
            </button>
          ) : <div />}

          <button
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 mx-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl border border-slate-800 transition-all active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="w-14 h-14 mx-auto bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-sm rounded-2xl border border-slate-800 transition-all active:scale-95 flex items-center justify-center"
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
};
