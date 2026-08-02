import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wallet, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onFinishOnboarding: () => void;
}

const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Smart Personal Finance',
    subtitle: 'Kelola Seluruh Tabungan & Rekening Bank',
    description: 'Catat transaksi, transfer antar rekening, dan pantau arus kas Anda secara real-time dengan tampilan Revolut & Material 3 modern.',
    icon: Wallet,
    color: 'from-[#6C4CF5] to-indigo-600',
    badge: 'Fintech Material 3'
  },
  {
    id: 2,
    title: 'Target Tabungan & Wishlist',
    subtitle: 'Wujudkan Impian Finansial Anda',
    description: 'Set target tabungan dengan deadline, alokasikan dana secara berkala, dan lacak progres barang impian dengan sistem alokasi otomatis.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600',
    badge: 'Target & Wishlist'
  },
  {
    id: 3,
    title: 'Aman & Offline First',
    subtitle: 'Data Pribadi Tetap Terenkripsi di Perangkat',
    description: 'Seluruh data keuangan tersimpan aman secara offline di Room Database lokal dengan proteksi PIN 6-digit & Biometrik FaceID.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600',
    badge: 'Privasi Terjamin'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinishOnboarding }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onFinishOnboarding();
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <div className="absolute inset-0 z-40 bg-[#0E1022] text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Top Bar Skip */}
      <div className="pt-3 flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-indigo-400">FZ SAVINGS</span>
        <button
          onClick={onFinishOnboarding}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50"
        >
          Lewati
        </button>
      </div>

      {/* Main Slide Carousel Content */}
      <div className="my-auto space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center space-y-5"
          >
            {/* Visual Icon Illustration Card */}
            <div className={`w-28 h-28 rounded-[32px] bg-gradient-to-tr ${slide.color} flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/20 p-5 relative`}>
              <slide.icon className="w-14 h-14 text-white" />
              <span className="absolute -bottom-2 px-2.5 py-0.5 bg-slate-900 border border-slate-700 rounded-full text-[9px] font-extrabold text-indigo-300 uppercase tracking-wider shadow-md">
                {slide.badge}
              </span>
            </div>

            {/* Typography */}
            <div className="space-y-2 max-w-xs">
              <h2 className="text-xl font-black text-white tracking-tight">{slide.title}</h2>
              <h3 className="text-xs font-bold text-indigo-300">{slide.subtitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation & Indicator Controls */}
      <div className="space-y-5 pb-4">
        {/* Dots Indicator */}
        <div className="flex justify-center items-center space-x-2">
          {ONBOARDING_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#6C4CF5]' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-[#6C4CF5] hover:bg-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center space-x-2"
        >
          <span>{currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Mulai FZ Savings Sekarang' : 'Lanjutkan'}</span>
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? (
            <Check className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
