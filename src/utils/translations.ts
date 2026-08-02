export type AppLanguage = 'ID' | 'EN' | 'ES' | 'JA' | 'AR' | 'FR' | 'DE' | 'ZH' | 'KO';

export interface TranslationDictionary {
  appName: string;
  // Dock / Navigation Tabs
  tabDashboard: string;
  tabSavings: string;
  tabTransactions: string;
  tabStats: string;
  tabTools: string;
  tabProfile: string;
  tabTarget: string;

  // Common UI words
  save: string;
  cancel: string;
  add: string;
  delete: string;
  edit: string;
  loading: string;
  search: string;
  all: string;
  active: string;
  filter: string;

  // Settings screen specific
  settingsTitle: string;
  settingsSubtitle: string;
  userProfileCard: string;
  joinedSince: string;
  changePhoto: string;
  changeUsername: string;
  currencyAndDisplay: string;
  mainCurrency: string;
  displayTheme: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  languageSetting: string;
  securitySection: string;
  biometricSecurity: string;
  pinSecurity: string;
  dataBackup: string;
  resetAllData: string;
  logoutFirebase: string;

  // Dashboard specific
  financialOverview: string;
  totalBalance: string;
  totalIncome: string;
  totalExpense: string;
  financialHealth: string;
  recentTransactions: string;
  addTransaction: string;
  emptyTransactions: string;

  // New Dashboard & general UI additions
  searchTooltip?: string;
  settingsTooltip?: string;
  savedRateSuffix?: string;
  showBalance?: string;
  hideBalance?: string;
  quickActions?: string;
  depositCash?: string;
  withdrawCash?: string;
  transfer?: string;
  scanQris?: string;
  yourAccounts?: string;
  manage?: string;
  emergency?: string;
  investment?: string;
  main?: string;
  annualInterest?: string;
  netWorthGrowth?: string;
  detail?: string;
  viewAll?: string;
  cashFlow?: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  ID: {
    appName: "FZ Savings",
    tabDashboard: "Dasbor",
    tabSavings: "Tabungan",
    tabTransactions: "Riwayat",
    tabStats: "Statistik",
    tabTools: "Fitur",
    tabProfile: "Profil",
    tabTarget: "Target",
    save: "Simpan",
    cancel: "Batal",
    add: "Tambah",
    delete: "Hapus",
    edit: "Ubah",
    loading: "Memuat...",
    search: "Cari...",
    all: "Semua",
    active: "Aktif",
    filter: "Saring",
    settingsTitle: "Profil & Pengaturan",
    settingsSubtitle: "Personalisasi akun & keamanan biometrik",
    userProfileCard: "Kartu Profil Pengguna",
    joinedSince: "Anggota Sejak",
    changePhoto: "Ubah Foto dari Galeri",
    changeUsername: "Ubah USN",
    currencyAndDisplay: "Mata Uang & Tampilan",
    mainCurrency: "Mata Uang Utama",
    displayTheme: "Tema Tampilan",
    lightTheme: "Terang (Light)",
    darkTheme: "Gelap (Dark)",
    systemTheme: "Sistem (System)",
    languageSetting: "Bahasa Aplikasi",
    securitySection: "Keamanan & Proteksi PIN",
    biometricSecurity: "Keamanan Biometrik / FaceID",
    pinSecurity: "Proteksi PIN 6-Digit",
    dataBackup: "Cadangkan Data (Offline First)",
    resetAllData: "Reset Semua Data Aplikasi",
    logoutFirebase: "Keluar Sesi (Logout Firebase)",
    financialOverview: "Ikhtisar Finansial",
    totalBalance: "Total Saldo",
    totalIncome: "Total Pemasukan",
    totalExpense: "Total Pengeluaran",
    financialHealth: "Kesehatan Finansial",
    recentTransactions: "Transaksi Terbaru",
    addTransaction: "Tambah Transaksi",
    emptyTransactions: "Belum ada transaksi tercatat.",
    searchTooltip: "Cari Transaksi",
    settingsTooltip: "Pengaturan",
    savedRateSuffix: "Terhemat",
    showBalance: "Tampilkan Saldo",
    hideBalance: "Sembunyikan Saldo",
    quickActions: "Aksi Cepat",
    depositCash: "Setor Kas",
    withdrawCash: "Tarik Kas",
    transfer: "Transfer",
    scanQris: "Scan QRIS",
    yourAccounts: "Rekening Anda",
    manage: "Kelola",
    emergency: "Darurat",
    investment: "Investasi",
    main: "Utama",
    annualInterest: "Bunga Tahunan",
    netWorthGrowth: "Pertumbuhan Net Worth",
    detail: "Detail",
    viewAll: "Lihat Semua",
    cashFlow: "Arus Kas"
  },
  EN: {
    appName: "FZ Savings",
    tabDashboard: "Dashboard",
    tabSavings: "Savings",
    tabTransactions: "History",
    tabStats: "Statistics",
    tabTools: "Tools",
    tabProfile: "Profile",
    tabTarget: "Goals",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    search: "Search...",
    all: "All",
    active: "Active",
    filter: "Filter",
    settingsTitle: "Profile & Settings",
    settingsSubtitle: "Account personalization & biometric security",
    userProfileCard: "User Profile Card",
    joinedSince: "Member Since",
    changePhoto: "Change Photo from Gallery",
    changeUsername: "Edit Username",
    currencyAndDisplay: "Currency & Display",
    mainCurrency: "Main Currency",
    displayTheme: "Display Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    languageSetting: "App Language",
    securitySection: "Security & PIN Protection",
    biometricSecurity: "Biometric Security / FaceID",
    pinSecurity: "6-Digit PIN Protection",
    dataBackup: "Data Backup (Offline First)",
    resetAllData: "Reset All Application Data",
    logoutFirebase: "Logout Sesi (Firebase Logout)",
    financialOverview: "Financial Overview",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpense: "Total Expenses",
    financialHealth: "Financial Health",
    recentTransactions: "Recent Transactions",
    addTransaction: "Add Transaction",
    emptyTransactions: "No transactions recorded yet.",
    searchTooltip: "Search Transactions",
    settingsTooltip: "Settings",
    savedRateSuffix: "Saved",
    showBalance: "Show Balance",
    hideBalance: "Hide Balance",
    quickActions: "Quick Actions",
    depositCash: "Deposit Cash",
    withdrawCash: "Withdraw Cash",
    transfer: "Transfer",
    scanQris: "Scan QRIS",
    yourAccounts: "Your Accounts",
    manage: "Manage",
    emergency: "Emergency",
    investment: "Investment",
    main: "Main",
    annualInterest: "Annual Interest",
    netWorthGrowth: "Net Worth Growth",
    detail: "Detail",
    viewAll: "View All",
    cashFlow: "Cash Flow"
  },
  ES: {
    appName: "FZ Savings",
    tabDashboard: "Tablero",
    tabSavings: "Ahorros",
    tabTransactions: "Historial",
    tabStats: "Estadísticas",
    tabTools: "Herramientas",
    tabProfile: "Perfil",
    tabTarget: "Metas",
    save: "Guardar",
    cancel: "Cancelar",
    add: "Añadir",
    delete: "Eliminar",
    edit: "Editar",
    loading: "Cargando...",
    search: "Buscar...",
    all: "Todo",
    active: "Activo",
    filter: "Filtrar",
    settingsTitle: "Perfil y Configuración",
    settingsSubtitle: "Personalización de cuenta y seguridad biométrica",
    userProfileCard: "Tarjeta de perfil de usuario",
    joinedSince: "Miembro desde",
    changePhoto: "Cambiar foto de la galería",
    changeUsername: "Editar nombre",
    currencyAndDisplay: "Moneda y Pantalla",
    mainCurrency: "Moneda Principal",
    displayTheme: "Tema de Pantalla",
    lightTheme: "Claro",
    darkTheme: "Oscuro",
    systemTheme: "Sistema",
    languageSetting: "Idioma de la aplicación",
    securitySection: "Seguridad y Protección PIN",
    biometricSecurity: "Seguridad biométrica / FaceID",
    pinSecurity: "Protección PIN de 6 dígitos",
    dataBackup: "Copia de seguridad (Offline First)",
    resetAllData: "Restablecer todos los datos",
    logoutFirebase: "Cerrar sesión de Firebase",
    financialOverview: "Resumen Financiero",
    totalBalance: "Saldo Total",
    totalIncome: "Ingresos Totales",
    totalExpense: "Gastos Totales",
    financialHealth: "Salud Financiera",
    recentTransactions: "Transacciones Recientes",
    addTransaction: "Añadir Transacción",
    emptyTransactions: "Aún no hay transacciones registradas."
  },
  JA: {
    appName: "FZ Savings",
    tabDashboard: "ダッシュボード",
    tabSavings: "貯金目標",
    tabTransactions: "履歴",
    tabStats: "統計",
    tabTools: "機能",
    tabProfile: "プロフィール",
    tabTarget: "目標",
    save: "保存",
    cancel: "キャンセル",
    add: "追加",
    delete: "削除",
    edit: "編集",
    loading: "読み込み中...",
    search: "検索...",
    all: "すべて",
    active: "有効",
    filter: "フィルター",
    settingsTitle: "設定とプロフィール",
    settingsSubtitle: "アカウントのカスタマイズと生体認証セキュリティ",
    userProfileCard: "ユーザープロフィール",
    joinedSince: "登録日",
    changePhoto: "ギャラリーから写真を変更",
    changeUsername: "名前を編集",
    currencyAndDisplay: "通貨とディスプレイ",
    mainCurrency: "基準通貨",
    displayTheme: "表示テーマ",
    lightTheme: "ライト",
    darkTheme: "ダーク",
    systemTheme: "システム",
    languageSetting: "アプリ言語",
    securitySection: "セキュリティとPIN保護",
    biometricSecurity: "生体認証 / FaceID",
    pinSecurity: "6桁のPINコード保護",
    dataBackup: "バックアップ (オフラインファースト)",
    resetAllData: "全データの初期化",
    logoutFirebase: "ログアウト (Firebase)",
    financialOverview: "財務概要",
    totalBalance: "総残高",
    totalIncome: "総収入",
    totalExpense: "総支出",
    financialHealth: "財務の健全性",
    recentTransactions: "最近の取引履歴",
    addTransaction: "取引を追加",
    emptyTransactions: "取引履歴はまだありません。"
  },
  AR: {
    appName: "FZ Savings",
    tabDashboard: "لوحة التحكم",
    tabSavings: "المدخرات",
    tabTransactions: "السجل",
    tabStats: "الإحصائيات",
    tabTools: "الأدوات",
    tabProfile: "الملف الشخصي",
    tabTarget: "الأهداف",
    save: "حفظ",
    cancel: "إلغاء",
    add: "إضافة",
    delete: "حذف",
    edit: "تعديل",
    loading: "جارٍ التحميل...",
    search: "بحث...",
    all: "الكل",
    active: "نشط",
    filter: "تصفية",
    settingsTitle: "الملف الشخصي والإعدادات",
    settingsSubtitle: "تخصيص الحساب والأمان الحيوي",
    userProfileCard: "بطاقة الملف الشخصي",
    joinedSince: "عضو منذ",
    changePhoto: "تغيير الصورة من المعرض",
    changeUsername: "تعديل الاسم",
    currencyAndDisplay: "العملة والعرض",
    mainCurrency: "العملة الرئيسية",
    displayTheme: "مظهر الشاشة",
    lightTheme: "فاتح",
    darkTheme: "داكن",
    systemTheme: "النظام",
    languageSetting: "لغة التطبيق",
    securitySection: "الأمان وحماية PIN",
    biometricSecurity: "الأمان الحيوي / FaceID",
    pinSecurity: "حماية PIN المكون من 6 أرقام",
    dataBackup: "نسخ احتياطي للبيانات (أولاً دون اتصال)",
    resetAllData: "إعادة تعيين جميع البيانات",
    logoutFirebase: "تسجيل الخروج من Firebase",
    financialOverview: "النظرة المالية العامة",
    totalBalance: "إجمالي الرصيد",
    totalIncome: "إجمالي الدخل",
    totalExpense: "إجمالي المصروفات",
    financialHealth: "الصحة المالية",
    recentTransactions: "أحدث المعاملات",
    addTransaction: "إضافة معاملة",
    emptyTransactions: "لا توجد معاملات مسجلة بعد."
  },
  FR: {
    appName: "FZ Savings",
    tabDashboard: "Tableau",
    tabSavings: "Épargne",
    tabTransactions: "Historique",
    tabStats: "Statistiques",
    tabTools: "Outils",
    tabProfile: "Profil",
    tabTarget: "Objectifs",
    save: "Enregistrer",
    cancel: "Annuler",
    add: "Ajouter",
    delete: "Supprimer",
    edit: "Modifier",
    loading: "Chargement...",
    search: "Rechercher...",
    all: "Tout",
    active: "Actif",
    filter: "Filtrer",
    settingsTitle: "Profil & Paramètres",
    settingsSubtitle: "Personnalisation du compte & sécurité biométrique",
    userProfileCard: "Carte de profil de l'utilisateur",
    joinedSince: "Membre depuis",
    changePhoto: "Changer la photo de la galerie",
    changeUsername: "Modifier le pseudo",
    currencyAndDisplay: "Devise & Affichage",
    mainCurrency: "Devise Principale",
    displayTheme: "Thème d'affichage",
    lightTheme: "Clair",
    darkTheme: "Sombre",
    systemTheme: "Système",
    languageSetting: "Langue de l'application",
    securitySection: "Sécurité & Code PIN",
    biometricSecurity: "Sécurité biométrique / FaceID",
    pinSecurity: "Protection par PIN à 6 chiffres",
    dataBackup: "Sauvegarde des données (Offline First)",
    resetAllData: "Réinitialiser toutes les données",
    logoutFirebase: "Déconnexion de Firebase",
    financialOverview: "Aperçu Financier",
    totalBalance: "Solde Total",
    totalIncome: "Revenu Total",
    totalExpense: "Dépenses Totales",
    financialHealth: "Santé Financière",
    recentTransactions: "Transactions Récentes",
    addTransaction: "Ajouter une Transaction",
    emptyTransactions: "Aucune transaction enregistrée."
  },
  DE: {
    appName: "FZ Savings",
    tabDashboard: "Dashboard",
    tabSavings: "Sparen",
    tabTransactions: "Verlauf",
    tabStats: "Statistiken",
    tabTools: "Tools",
    tabProfile: "Profil",
    tabTarget: "Ziele",
    save: "Speichern",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    delete: "Löschen",
    edit: "Bearbeiten",
    loading: "Laden...",
    search: "Suchen...",
    all: "Alle",
    active: "Aktiv",
    filter: "Filtern",
    settingsTitle: "Profil & Einstellungen",
    settingsSubtitle: "Personalisierung & Biometrische Sicherheit",
    userProfileCard: "Benutzerprofilkarte",
    joinedSince: "Mitglied seit",
    changePhoto: "Foto aus Galerie ändern",
    changeUsername: "Benutzername ändern",
    currencyAndDisplay: "Währung & Anzeige",
    mainCurrency: "Hauptwährung",
    displayTheme: "Anzeigemodus",
    lightTheme: "Hell",
    darkTheme: "Dunkel",
    systemTheme: "System",
    languageSetting: "App-Sprache",
    securitySection: "Sicherheit & PIN-Schutz",
    biometricSecurity: "Biometrischer Schutz / FaceID",
    pinSecurity: "6-Stelliger PIN-Schutz",
    dataBackup: "Daten-Backup (Offline zuerst)",
    resetAllData: "Alle App-Daten zurücksetzen",
    logoutFirebase: "Firebase-Sitzung abmelden",
    financialOverview: "Finanzübersicht",
    totalBalance: "Gesamtguthaben",
    totalIncome: "Gesamteinnahmen",
    totalExpense: "Gesamtausgaben",
    financialHealth: "Finanzielle Gesundheit",
    recentTransactions: "Letzte Transaktionen",
    addTransaction: "Transaktion hinzufügen",
    emptyTransactions: "Noch keine Transaktionen erfasst."
  },
  ZH: {
    appName: "FZ Savings",
    tabDashboard: "仪表盘",
    tabSavings: "储蓄",
    tabTransactions: "明细",
    tabStats: "统计",
    tabTools: "功能",
    tabProfile: "我的",
    tabTarget: "目标",
    save: "保存",
    cancel: "取消",
    add: "添加",
    delete: "删除",
    edit: "编辑",
    loading: "加载中...",
    search: "搜索...",
    all: "全部",
    active: "活跃",
    filter: "筛选",
    settingsTitle: "个人中心与设置",
    settingsSubtitle: "账户个性化与生物识别安全保护",
    userProfileCard: "用户卡片",
    joinedSince: "加入时间",
    changePhoto: "从相册更换头像",
    changeUsername: "修改用户名",
    currencyAndDisplay: "货币与显示",
    mainCurrency: "主货币",
    displayTheme: "显示主题",
    lightTheme: "浅色模式",
    darkTheme: "深色模式",
    systemTheme: "系统默认",
    languageSetting: "应用语言",
    securitySection: "安全与PIN码保护",
    biometricSecurity: "指纹/人脸识别安全",
    pinSecurity: "开启6位安全密码",
    dataBackup: "数据备份 (离线优先)",
    resetAllData: "重置所有应用数据",
    logoutFirebase: "退出Firebase登录",
    financialOverview: "财务概览",
    totalBalance: "总余额",
    totalIncome: "总收入",
    totalExpense: "总支出",
    financialHealth: "财务健康度",
    recentTransactions: "最近交易明细",
    addTransaction: "新增收支",
    emptyTransactions: "暂无交易记录。"
  },
  KO: {
    appName: "FZ Savings",
    tabDashboard: "대시보드",
    tabSavings: "저금목표",
    tabTransactions: "거래내역",
    tabStats: "통계분석",
    tabTools: "유용한기능",
    tabProfile: "프로필설정",
    tabTarget: "목표",
    save: "저장하기",
    cancel: "취소",
    add: "추가",
    delete: "삭제",
    edit: "수정",
    loading: "로딩 중...",
    search: "검색...",
    all: "전체",
    active: "활성",
    filter: "필터",
    settingsTitle: "프로필 및 설정",
    settingsSubtitle: "계정 개인화 및 바이오 보안 설정",
    userProfileCard: "사용자 프로필",
    joinedSince: "가입일",
    changePhoto: "갤러리에서 사진 변경",
    changeUsername: "이름 편집",
    currencyAndDisplay: "화폐 및 디스플레이",
    mainCurrency: "기준 화폐",
    displayTheme: "화면 테마",
    lightTheme: "라이트 모드",
    darkTheme: "다크 모드",
    systemTheme: "시스템 기본값",
    languageSetting: "앱 언어 설정",
    securitySection: "보안 및 PIN 번호 보호",
    biometricSecurity: "생체 인식 / FaceID 보안",
    pinSecurity: "6자리 PIN 번호 설정",
    dataBackup: "데이터 백업 (오프라인 우선)",
    resetAllData: "모든 앱 데이터 초기화",
    logoutFirebase: "Firebase 로그아웃",
    financialOverview: "자산 현황 요약",
    totalBalance: "총 잔액",
    totalIncome: "총 수입",
    totalExpense: "총 지출",
    financialHealth: "재정 건강 상태",
    recentTransactions: "최근 거래 내역",
    addTransaction: "거래 내역 추가",
    emptyTransactions: "등록된 거래 내역이 없습니다."
  }
};

export const uiTranslations: Record<string, Record<string, string>> = {
  "Rekening & Tabungan": {
    EN: "Accounts & Savings",
    ES: "Cuentas y Ahorros",
    JA: "口座と貯金",
    ZH: "账户与储蓄",
    KO: "계좌 및 저축",
    FR: "Comptes et Épargne",
    DE: "Konten & Sparen",
    AR: "الحسابات والمدخرات"
  },
  "Kelola sub-rekening & alokasi dana khusus": {
    EN: "Manage sub-accounts & custom allocations",
    ES: "Administrar subcuentas y asignaciones",
    JA: "サブアカウントとカスタム割り当ての管理",
    ZH: "管理子账户和自定义分配",
    KO: "하위 계좌 및 맞춤 배정 관리"
  },
  "Tambah Rekening": {
    EN: "Add Account",
    ES: "Añadir Cuenta",
    JA: "口座を追加",
    ZH: "添加账户",
    KO: "계좌 추가"
  },
  "Total Kas Terakumulasi": {
    EN: "Total Accumulated Cash",
    ES: "Efectivo Acumulado Total",
    JA: "累積キャッシュ合計",
    ZH: "累计总现金",
    KO: "누적 총 자산"
  },
  "Buat Rekening Tabungan Baru": {
    EN: "Create New Savings Account",
    ES: "Crear Nueva Cuenta de Ahorro",
    JA: "新規貯金口座の作成",
    ZH: "创建新储蓄账户",
    KO: "새 저축 계좌 개설"
  },
  "Nama Rekening": {
    EN: "Account Name",
    ES: "Nombre de la Cuenta",
    JA: "口座名",
    ZH: "账户名称",
    KO: "계좌 이름"
  },
  "Contoh: Dana Darurat, Tabungan Rumah": {
    EN: "e.g., Emergency Fund, House Savings",
    ES: "Ej: Fondo de Emergencia, Ahorro para Casa",
    JA: "例：緊急資金、住宅貯金",
    ZH: "例如：紧急基金、购房储蓄",
    KO: "예: 비상금, 주택 저축"
  },
  "Saldo Awal (Rp)": {
    EN: "Initial Balance",
    ES: "Saldo Inicial",
    JA: "初期残高",
    ZH: "初始余额",
    KO: "초기 잔액"
  },
  "Target Nominal (Rp)": {
    EN: "Target Amount",
    ES: "Monto Objetivo",
    JA: "目標金額",
    ZH: "目标金额",
    KO: "목표 금액"
  },
  "Pilih Warna Rekening": {
    EN: "Choose Account Color",
    ES: "Elegir Color de la Cuenta",
    JA: "口座カラーを選択",
    ZH: "选择账户颜色",
    KO: "계좌 색상 선택"
  },
  "Simpan Rekening": {
    EN: "Save Account",
    ES: "Guardar Cuenta",
    JA: "口座を保存",
    ZH: "保存账户",
    KO: "계좌 저장"
  },
  "Batal": {
    EN: "Cancel",
    ES: "Cancelar",
    JA: "キャンセル",
    ZH: "取消",
    KO: "취소"
  },
  "Riwayat Transaksi": {
    EN: "Transaction History",
    ES: "Historial de Transacciones",
    JA: "取引履歴",
    ZH: "交易历史",
    KO: "거래 내역"
  },
  "Pencatatan arus kas & transfer antar rekening": {
    EN: "Cash flow tracking & account transfers",
    ES: "Seguimiento de flujo de caja y transferencias",
    JA: "キャッシュフロー追跡と口座間送金",
    ZH: "现金流跟踪与账户转账",
    KO: "현금 흐름 추적 및 계좌 이체"
  },
  "Pencatatan arus kas & transfer antar rekening...": {
    EN: "Cash flow tracking & account transfers...",
    ES: "Seguimiento de flujo de caja y transferencias...",
    JA: "キャッシュフロー追跡と口座間送金...",
    ZH: "现金流跟踪与账户转账...",
    KO: "현금 흐름 추적 및 계좌 이체..."
  },
  "Tambah Transaksi": {
    EN: "Add Transaction",
    ES: "Añadir Transacción",
    JA: "取引の追加",
    ZH: "添加交易",
    KO: "거래 내역 추가"
  },
  "Semua": {
    EN: "All",
    ES: "Todo",
    JA: "すべて",
    ZH: "全部",
    KO: "전체"
  },
  "Pemasukan": {
    EN: "Income",
    ES: "Ingresos",
    JA: "収入",
    ZH: "收入",
    KO: "수입"
  },
  "Pengeluaran": {
    EN: "Expense",
    ES: "Gastos",
    JA: "支出",
    ZH: "支出",
    KO: "지출"
  },
  "Transfer": {
    EN: "Transfer",
    ES: "Transferencia",
    JA: "振込",
    ZH: "转账",
    KO: "이체"
  },
  "Sampah": {
    EN: "Trash",
    ES: "Papelera",
    JA: "ゴミ箱",
    ZH: "回收站",
    KO: "휴지통"
  },
  "Kalender Kas": {
    EN: "Cash Calendar",
    ES: "Calendario de Caja",
    JA: "キャッシュカレンダー",
    ZH: "现金日历",
    KO: "자산 캘린더"
  },
  "Lihat arus kas masuk & keluar secara harian": {
    EN: "View daily cash inflows and outflows",
    ES: "Ver entradas y salidas diarias de efectivo",
    JA: "毎日のキャッシュイン・アウトを表示",
    ZH: "查看每日现金流入和流出",
    KO: "일일 현금 유입 및 유출 보기"
  },
  "Analisis & Statistik": {
    EN: "Analysis & Statistics",
    ES: "Análisis y Estadísticas",
    JA: "分析と統計",
    ZH: "分析与统计",
    KO: "분석 및 통계"
  },
  "Grafik pengeluaran & distribusi alokasi kas": {
    EN: "Expense charts & cash allocation distribution",
    ES: "Gráficos de gastos y distribución de efectivo",
    JA: "支出グラフとキャッシュ配分",
    ZH: "支出图表与现金分配",
    KO: "지출 차트 및 현금 배분 통계"
  },
  "Perencana Anggaran": {
    EN: "Budget Planner",
    ES: "Planificador de Presupuesto",
    JA: "予算プランナー",
    ZH: "预算规划",
    KO: "예산 계획"
  },
  "Kendalikan pengeluaran dengan batas anggaran bulanan": {
    EN: "Control spending with monthly budget limits",
    ES: "Controlar gastos con límites mensuales",
    JA: "月間予算制限で支出を管理",
    ZH: "通过每月预算限制控制支出",
    KO: "월간 예산 한도로 지출 통제"
  },
  "Wishlist & Target Impian": {
    EN: "Wishlist & Dream Targets",
    ES: "Lista de Deseos y Metas",
    JA: "ウィッシュリストと夢の目標",
    ZH: "愿望清单与梦想目标",
    KO: "위시리스트 및 드림 타겟"
  },
  "Rencanakan pembelian barang impian Anda": {
    EN: "Plan your dream item purchases",
    ES: "Planifica tus compras deseadas",
    JA: "夢の商品の購入計画",
    ZH: "规划您的梦想物品购买",
    KO: "위시리스트 구매 계획 수립"
  },
  "Sinkronisasi Wallet & SMS": {
    EN: "Wallet & SMS Sync",
    ES: "Sincronización de Billetera y SMS",
    JA: "ウォレットとSMS同期",
    ZH: "钱包与短信同步",
    KO: "지갑 및 SMS 동기화"
  },
  "Hubungkan wallet digital & baca SMS transaksi otomatis": {
    EN: "Connect digital wallets & read SMS automatically",
    ES: "Conectar billeteras y leer SMS automáticamente",
    JA: "ウォレット連携とSMS自動読み込み",
    ZH: "连接数字钱包并自动读取短信",
    KO: "디지털 지갑 연결 및 SMS 자동 읽기"
  },
  "Fitur Cerdas Tambahan": {
    EN: "Additional Smart Features",
    ES: "Características Inteligentes Adicionales",
    JA: "追加のスマート機能",
    ZH: "更多智能功能",
    KO: "추가 스마트 기능"
  },
  "Alat pendukung manajemen keuangan mandiri": {
    EN: "Supporting tools for financial management",
    ES: "Herramientas de apoyo financiero",
    JA: "自律的な財務管理のサポートツール",
    ZH: "自主财务管理支持工具",
    KO: "독립적 자산 관리를 위한 보조 도구"
  },
  "Split Bill (Bagi Tagihan)": {
    EN: "Split Bill",
    ES: "Dividir Cuenta",
    JA: "割り勘 (Split Bill)",
    ZH: "AA付款 / 分账",
    KO: "더치페이 (정산)"
  },
  "Pengingat Tagihan & Berulang": {
    EN: "Recurring & Bill Reminders",
    ES: "Recordatorios de Facturas",
    JA: "自動振替と請求書リマインダー",
    ZH: "账单 and 周期提醒",
    KO: "주기적 지출 및 공과금 알림"
  },
  "Pencatat Utang & Piutang": {
    EN: "Debt & Receivable Tracker",
    ES: "Seguimiento de Deudas",
    JA: "借入・貸出管理",
    ZH: "债务与应收款跟踪",
    KO: "빚 및 채권 추적기"
  },
  "Ekspor Laporan": {
    EN: "Export Reports",
    ES: "Exportar Informes",
    JA: "レポートのエクスポート",
    ZH: "导出报告",
    KO: "보고서 내보내기"
  },
  "Cari Transaksi, Akun, atau Target...": {
    EN: "Search transactions, accounts, or goals...",
    ES: "Buscar transacciones, cuentas o metas...",
    JA: "取引、口座、目標を検索...",
    ZH: "搜索交易、账户或目标...",
    KO: "거래, 계좌, 목표 검색..."
  },
  "Bagi Tagihan Cepat": {
    EN: "Quick Bill Splitter",
    ES: "Divisor de Facturas Rápido",
    JA: "クイック割り勘",
    ZH: "快速分账",
    KO: "빠른 더치페이 정산"
  },
  "Bagi pengeluaran bersama teman secara adil & instan": {
    EN: "Split joint expenses with friends fairly & instantly",
    ES: "Divide gastos compartidos de forma justa e instantánea",
    JA: "友達と共同の支出を公平に即座に割り勘",
    ZH: "与朋友公平且即时地分摊共同支出",
    KO: "친구들과 공동 지출을 공정하고 즉시 정산"
  },
  "Tagihan Berulang & Pengingat": {
    EN: "Recurring Bills & Reminders",
    ES: "Facturas Recurrentes y Recordatorios",
    JA: "定期請求とリマインダー",
    ZH: "周期性账单与提醒",
    KO: "주기적 공과금 및 알림"
  },
  "Kelola pengeluaran berulang bulanan & langganan aktif": {
    EN: "Manage recurring monthly expenses & active subscriptions",
    ES: "Administrar gastos recurrentes y suscripciones activas",
    JA: "毎月の定期支出と有効なサブスクの管理",
    ZH: "管理每月周期性支出和活动订阅",
    KO: "월간 반복 지출 및 구독 서비스 관리"
  },
  "Utang & Piutang": {
    EN: "Debt & Receivables",
    ES: "Deudas y Cobros",
    JA: "借入と貸出",
    ZH: "债务与应收款",
    KO: "빌린 돈과 빌려준 돈"
  },
  "Pantau saldo utang ke teman atau piutang yang belum dibayar": {
    EN: "Monitor debt to friends or unpaid receivables",
    ES: "Controla deudas a amigos o cobros pendientes",
    JA: "友達への借入金や未回収の貸出金を追跡",
    ZH: "监控对朋友的债务或未收回应收款",
    KO: "친구에게 빌린 돈 또는 받지 못한 돈 추적"
  },
  "Ekspor Laporan & Cadangan": {
    EN: "Export Reports & Backups",
    ES: "Exportar Informes y Copias",
    JA: "レポートとバックアップのエクスポート",
    ZH: "导出报告与备份",
    KO: "보고서 및 백업 내보내기"
  },
  "Unduh rekaman transaksi dalam format CSV atau file JSON cadangan": {
    EN: "Download transaction records in CSV format or JSON backup files",
    ES: "Descarga transacciones en CSV o copias en JSON",
    JA: "CSV形式の取引記録またはJSONバックアップのダウンロード",
    ZH: "下载CSV格式的交易记录或JSON备份文件",
    KO: "거래 내역 CSV 다운로드 또는 JSON 백업 파일 생성"
  },
  "Fitur Unggulan Pro ⚡": {
    EN: "Featured Pro Tools ⚡",
    ES: "Herramientas Pro Destacadas ⚡",
    JA: "プロの機能 ⚡",
    ZH: "专业特色功能 ⚡",
    KO: "프로 프리미엄 기능 ⚡"
  },
  "5 alat finansial canggih untuk mengoptimalkan kekayaan Anda": {
    EN: "5 advanced financial tools to optimize your wealth",
    ES: "5 herramientas financieras avanzadas para optimizar tu riqueza",
    JA: "資産を最適化する5つの高度な財務ツール",
    ZH: "5个先进的财务工具来优化您的财富",
    KO: "자산 관리를 최적화하기 위한 5가지 고급 금융 도구"
  },
  "AI Financial Advisor": {
    EN: "AI Financial Advisor",
    ES: "Asesor Financiero de IA",
    JA: "AI財務アドバイザー",
    ZH: "AI财务顾问",
    KO: "AI 자산 관리 조언가"
  },
  "Audit kesehatan keuangan, skor 0-100 & rekomendasi Gemini AI": {
    EN: "Financial health audit, 0-100 score & Gemini AI recommendations",
    ES: "Auditoría de salud financiera, puntuación 0-100 y recomendaciones de IA",
    JA: "財務健康診断、0〜100のスコア、Gemini AIの推奨事項",
    ZH: "财务健康审计、0-100评分和Gemini AI建议",
    KO: "재정 건강 상태 진단, 0-100 점수 및 Gemini AI 권장안"
  },
  "Auto-Save & Tagihan": {
    EN: "Auto-Save & Bills",
    ES: "Ahorro Automático y Facturas",
    JA: "自動保存と請求書",
    ZH: "自动保存与账单",
    KO: "자동 저축 및 공과금"
  },
  "Jadwalkan transfer rutin & pembayaran tagihan otomatis": {
    EN: "Schedule regular transfers & automatic bill payments",
    ES: "Programa transferencias regulares y pagos automáticos",
    JA: "定期的な振込と自動引き落としのスケジュール",
    ZH: "安排定期转账和自动账单支付",
    KO: "정기 이체 및 공과금 자동 납부 예약"
  },
  "Hutang & Piutang": {
    EN: "Debt & Receivables",
    ES: "Deudas y Cobros",
    JA: "借入と貸出",
    ZH: "债务与应收款",
    KO: "빌린 돈과 빌려준 돈"
  },
  "Pantau uang yang dipinjamkan dan jatuh tempo rekan": {
    EN: "Monitor money lent and friend due dates",
    ES: "Controla dinero prestado y fechas de vencimiento de amigos",
    JA: "貸し出したお金と友人の返済期日を追跡",
    ZH: "监控借出的资金 and 朋友的还款截止日期",
    KO: "빌려준 돈 및 친구와의 정산 기일 추적"
  },
  "Ekspor Laporan PDF/CSV": {
    EN: "Export PDF/CSV Reports",
    ES: "Exportar Informes PDF/CSV",
    JA: "PDF/CSVレポートのエクスポート",
    ZH: "导出PDF/CSV报告",
    KO: "PDF/CSV 보고서 내보내기"
  },
  "Unduh laporan resmi ringkasan aset & mutasi arus kas": {
    EN: "Download official asset summaries & cash flow mutations",
    ES: "Descarga resúmenes de activos oficiales y variaciones de efectivo",
    JA: "公式な資産サマリーとキャッシュフローの変動履歴をダウンロード",
    ZH: "下载官方资产摘要和现金流变动记录",
    KO: "공식 자산 요약 및 현금 흐름 변동 내역서 다운로드"
  },
  "Kalkulator Split Bill": {
    EN: "Split Bill Calculator",
    ES: "Calculadora de Dividir Cuentas",
    JA: "割り勘電卓",
    ZH: "分账计算器",
    KO: "더치페이 계산기"
  },
  "Bagi rata tagihan makanan & patungan bersama teman": {
    EN: "Split food bills and share joint costs with friends",
    ES: "Divide facturas de comida y comparte costos con amigos",
    JA: "食事代を割り勘し、友達と共同でコストを分担",
    ZH: "分摊餐费并与朋友共同分担费用",
    KO: "식사 비용을 공평하게 분할하고 친구들과 공동 정산"
  },
  "AI Powered": {
    EN: "AI Powered",
    ES: "Con IA",
    JA: "AI搭載",
    ZH: "AI驱动",
    KO: "AI 탑재"
  },
  "Otomatis": {
    EN: "Automatic",
    ES: "Automático",
    JA: "自動",
    ZH: "自动",
    KO: "자동화"
  },
  "Praktis": {
    EN: "Practical",
    ES: "Práctico",
    JA: "実用的",
    ZH: "实用",
    KO: "실용적"
  },
  "Dokumen": {
    EN: "Document",
    ES: "Documento",
    JA: "書類",
    ZH: "文档",
    KO: "문서"
  },
  "Grup": {
    EN: "Group",
    ES: "Grupo",
    JA: "グループ",
    ZH: "群组",
    KO: "그룹"
  },
  "Cari transaksi berdasarkan judul atau catatan...": {
    EN: "Search transactions by title or notes...",
    ES: "Buscar transacciones por título o notas...",
    JA: "取引のタイトルまたはメモで検索...",
    ZH: "根据标题或备注搜索交易...",
    KO: "제목 또는 메모로 거래 내역 검색..."
  },
  "Catat Transaksi Baru": {
    EN: "Record New Transaction",
    ES: "Registrar Nueva Transacción",
    JA: "新しい取引を記録",
    ZH: "记录新交易",
    KO: "새로운 거래 내역 기록"
  },
  "Pencatatan keuangan real-time": {
    EN: "Real-time financial tracking",
    ES: "Seguimiento financiero en tiempo real",
    JA: "リアルタイム財務追跡",
    ZH: "实时财务记录",
    KO: "실시간 재정 모니터링"
  },
  "Keluar": {
    EN: "Expense",
    ES: "Gastos",
    JA: "支出",
    ZH: "支出",
    KO: "지출"
  },
  "Masuk": {
    EN: "Income",
    ES: "Ingresos",
    JA: "収入",
    ZH: "收入",
    KO: "수입"
  },
  "Nominal": {
    EN: "Amount",
    ES: "Monto",
    JA: "金額",
    ZH: "金额",
    KO: "금액"
  },
  "Nominal ({currency})": {
    EN: "Amount ({currency})",
    ES: "Monto ({currency})",
    JA: "金額 ({currency})",
    ZH: "金额 ({currency})",
    KO: "금액 ({currency})"
  },
  "Judul Transaksi": {
    EN: "Transaction Title",
    ES: "Título de la Transacción",
    JA: "取引のタイトル",
    ZH: "交易标题",
    KO: "거래 제목"
  },
  "Contoh: Makan Siang, Gaji Bulanan, Bensin": {
    EN: "e.g., Lunch, Monthly Salary, Fuel",
    ES: "Ej: Almuerzo, Salario Mensual, Gasolina",
    JA: "例：昼食、毎月の給与、ガソリン",
    ZH: "例如：午餐、月薪、汽油",
    KO: "예: 점심 식사, 월급, 주유비"
  },
  "Sumber Rekening": {
    EN: "Source Account",
    ES: "Cuenta de Origen",
    JA: "振込元口座",
    ZH: "来源账户",
    KO: "출금 계좌"
  },
  "Rekening Tujuan": {
    EN: "Target Account",
    ES: "Cuenta de Destino",
    JA: "振込先口座",
    ZH: "目标账户",
    KO: "입금 계좌"
  },
  "Kategori": {
    EN: "Category",
    ES: "Categoría",
    JA: "カテゴリー",
    ZH: "分类",
    KO: "카테고리"
  },
  "Simpan Transaksi": {
    EN: "Save Transaction",
    ES: "Guardar Transacción",
    JA: "取引を保存",
    ZH: "保存交易",
    KO: "거래 저장"
  },
  "Tong Sampah": {
    EN: "Trash Bin",
    ES: "Papelera de Reciclaje",
    JA: "ゴミ箱",
    ZH: "回收站",
    KO: "휴지통"
  },
  "Tong sampah kosong.": {
    EN: "Trash is empty.",
    ES: "La papelera está vacía.",
    JA: "ゴミ箱は空です。",
    ZH: "回收站为空。",
    KO: "휴지통이 비어 있습니다."
  },
  "Tidak ada transaksi ditemukan.": {
    EN: "No transactions found.",
    ES: "No se encontraron transacciones.",
    JA: "取引が見つかりませんでした。",
    ZH: "未找到任何交易记录。",
    KO: "거래 내역이 없습니다."
  },
  "Hapus Transaksi": {
    EN: "Delete Transaction",
    ES: "Eliminar Transacción",
    JA: "取引を削除",
    ZH: "删除交易",
    KO: "거래 내역 삭제"
  },
  "Pulihkan Transaksi": {
    EN: "Restore Transaction",
    ES: "Restaurar Transacción",
    JA: "取引を復원",
    ZH: "还原交易",
    KO: "거래 내역 복원"
  },
  "Kalender Keuangan": {
    EN: "Financial Calendar",
    ES: "Calendario Financiero",
    JA: "財務カレンダー",
    ZH: "财务日历",
    KO: "재정 캘린der"
  },
  "Pantau catatan transaksi berdasarkan tanggal": {
    EN: "Monitor transaction records by date",
    ES: "Monitorear registros de transacciones por fecha",
    JA: "日付ごとに取引記録を追跡します",
    ZH: "按日期监控交易记录",
    KO: "날짜별 거래 내역 모니터링"
  },
  "Agustus 2026": {
    EN: "August 2026",
    ES: "Agosto 2026",
    JA: "2026年8月",
    ZH: "2026年8月",
    KO: "2026년 8월"
  },
  "Min": {
    EN: "Sun",
    ES: "Dom",
    JA: "日",
    ZH: "日",
    KO: "일"
  },
  "Sen": {
    EN: "Mon",
    ES: "Lun",
    JA: "月",
    ZH: "一",
    KO: "월"
  },
  "Sel": {
    EN: "Tue",
    ES: "Mar",
    JA: "火",
    ZH: "二",
    KO: "화"
  },
  "Rab": {
    EN: "Wed",
    ES: "Mié",
    JA: "水",
    ZH: "三",
    KO: "수"
  },
  "Kam": {
    EN: "Thu",
    ES: "Jue",
    JA: "木",
    ZH: "四",
    KO: "목"
  },
  "Jum": {
    EN: "Fri",
    ES: "Vie",
    JA: "金",
    ZH: "五",
    KO: "금"
  },
  "Sab": {
    EN: "Sat",
    ES: "Sáb",
    JA: "土",
    ZH: "六",
    KO: "토"
  },
  "Detail Tanggal": {
    EN: "Details for Date",
    ES: "Detalles para la Fecha",
    JA: "日付の詳細",
    ZH: "日期详情",
    KO: "날짜 상세"
  },
  "Tidak ada transaksi pada tanggal ini.": {
    EN: "No transactions on this date.",
    ES: "No hay transacciones en esta fecha.",
    JA: "この日付の取引はありません。",
    ZH: "该日期无交易记录。",
    KO: "해당 날짜에 거래 내역이 없습니다."
  }
};

export const translateText = (text: string, lang?: string): string => {
  const code = (lang || 'ID').toUpperCase();
  if (code === 'ID') return text;
  
  const translationsForText = uiTranslations[text];
  if (translationsForText) {
    return translationsForText[code] || translationsForText['EN'] || text;
  }
  return text;
};

export const getTranslation = (lang?: string) => {
  const code = (lang || 'ID').toUpperCase();
  const dict = translations[code as AppLanguage] || translations['ID'];
  const fallbackEN = translations['EN'] || dict;
  const fallbackID = translations['ID'] || dict;

  return new Proxy(dict, {
    get(target, prop) {
      if (prop in target) {
        const val = (target as any)[prop];
        if (val !== undefined && val !== null) {
          return val;
        }
      }
      if (prop in fallbackEN) {
        const val = (fallbackEN as any)[prop];
        if (val !== undefined && val !== null) {
          return val;
        }
      }
      return (fallbackID as any)[prop];
    }
  }) as TranslationDictionary & Record<string, string>;
};
