export const formatCurrency = (amount: number, currency: 'IDR' | 'USD' | 'EUR' = 'IDR'): string => {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  } else if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount / 15500);
  } else {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount / 16800);
  }
};

export const formatNumberInput = (value: string | number): string => {
  const num = typeof value === 'string' ? value.replace(/\D/g, '') : String(value);
  if (!num) return '';
  return Number(num).toLocaleString('id-ID');
};

export const parseNumberInput = (value: string): number => {
  const clean = value.replace(/\D/g, '');
  return clean ? Number(clean) : 0;
};

export const getTimeBasedGreeting = (): { greeting: string; icon: string } => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) {
    return { greeting: 'Selamat Pagi', icon: '🌅' };
  } else if (hour >= 11 && hour < 15) {
    return { greeting: 'Selamat Siang', icon: '☀️' };
  } else if (hour >= 15 && hour < 18) {
    return { greeting: 'Selamat Sore', icon: '🌇' };
  } else {
    return { greeting: 'Selamat Malam', icon: '🌙' };
  }
};

export const calculateDaysRemaining = (deadlineStr: string): number => {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const calculateEstimatedCompletion = (
  currentAmount: number,
  targetAmount: number,
  deadlineStr: string
): string => {
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 'Telah Tercapai 🎉';

  const daysLeft = calculateDaysRemaining(deadlineStr);
  if (daysLeft <= 0) return 'Telah Lewat Target';

  const dailyRequired = remaining / daysLeft;
  return `Butuh ~${formatCurrency(dailyRequired)} / hari lagi (${daysLeft} hari sisa)`;
};

export const getGoalStatusInfo = (current: number, target: number, daysRemaining: number) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  if (percentage >= 100) {
    return { label: 'Tercapai', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (percentage >= 80) {
    return { label: 'Hampir Selesai', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
  } else if (percentage > 0) {
    return { label: 'Berjalan', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  } else {
    return { label: 'Belum Mulai', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  }
};
