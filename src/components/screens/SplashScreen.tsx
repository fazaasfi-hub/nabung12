import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, CheckCircle2, Database, Lock, Bell, Cpu, Zap, Star } from 'lucide-react';

interface SplashScreenProps {
  onFinishLaunch: (destination: 'ONBOARDING' | 'LOGIN' | 'DASHBOARD') => void;
  isFirstInstall?: boolean;
  isLoggedIn?: boolean;
}

const INITIALIZATION_STEPS = [
  { id: 1, text: 'Menginisialisasi Secure Room Database...', icon: Database, category: 'STORAGE' },
  { id: 2, text: 'Sinkronisasi DataStore & Enkripsi Prefs...', icon: Cpu, category: 'SECURITY' },
  { id: 3, text: 'Verifikasi Autentikasi Biometrik & Sesi...', icon: Lock, category: 'AUTH' },
  { id: 4, text: 'Menyiapkan Notifikasi Real-time & WorkManager...', icon: Bell, category: 'SERVICES' },
  { id: 5, text: 'FZ Savings Premium Siap Digunakan', icon: Zap, category: 'READY' }
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinishLaunch,
  isFirstInstall = false,
  isLoggedIn = true
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < INITIALIZATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (currentStepIndex === INITIALIZATION_STEPS.length - 1) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (isFirstInstall) {
            onFinishLaunch('ONBOARDING');
          } else if (!isLoggedIn) {
            onFinishLaunch('LOGIN');
          } else {
            onFinishLaunch('DASHBOARD');
          }
        }, 400);
      }, 500);

      return () => clearTimeout(exitTimer);
    }
  }, [currentStepIndex, isFirstInstall, isLoggedIn, onFinishLaunch]);

  const progressPercent = Math.round(((currentStepIndex + 1) / INITIALIZATION_STEPS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.98 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="absolute inset-0 z-50 bg-[#090D16] text-white flex flex-col justify-between p-6 overflow-hidden select-none"
    >
      {/* Subtle Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#6C4CF5]/20 via-indigo-600/10 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Header Vault Security Tag */}
      <div className="pt-3 flex justify-between items-center z-10 text-[10px] font-mono tracking-wider text-indigo-300/80">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-[#6C4CF5]" />
          <span className="font-bold text-indigo-200">SECURE VAULT OS</span>
        </div>
        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 font-sans font-bold text-[10px] text-amber-400">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>PRO v2.5</span>
        </div>
      </div>

      {/* Main Center Modern Minimalist Logo */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#6C4CF5] via-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 border border-white/20 mb-6"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-1.5"
        >
          <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase font-sans">
            FZ SAVINGS
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-wider">
            Enterprise Financial Vault
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="z-10 space-y-3 max-w-sm mx-auto w-full pb-4"
      >
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Memuat sistem...</span>
            </span>
            <span className="font-mono font-bold text-cyan-400">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-[#6C4CF5] to-cyan-400 rounded-full"
              initial={{ width: '5%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>

          <div className="pt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/80"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {React.createElement(INITIALIZATION_STEPS[currentStepIndex].icon, {
                    className: 'w-4 h-4 text-cyan-400 shrink-0'
                  })}
                  <span className="font-medium truncate">{INITIALIZATION_STEPS[currentStepIndex].text}</span>
                </div>
                {currentStepIndex === INITIALIZATION_STEPS.length - 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                ) : (
                  <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50 shrink-0">
                    {INITIALIZATION_STEPS[currentStepIndex].category}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
