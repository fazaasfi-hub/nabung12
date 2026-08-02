package com.fzsavings.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fzsavings.app.domain.model.*
import com.fzsavings.app.domain.repository.SavingsRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class SavingsViewModel(
    private val repository: SavingsRepository
) : ViewModel() {

    // UI state flows
    val accounts: StateFlow<List<SavingsAccount>> = repository.getAccounts()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<Transaction>> = repository.getTransactions()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val deletedTransactions: StateFlow<List<Transaction>> = repository.getDeletedTransactions()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val categories: StateFlow<List<Category>> = repository.getCategories()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val goals: StateFlow<List<Goal>> = repository.getGoals()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val wishlists: StateFlow<List<Wishlist>> = repository.getWishlists()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val budgets: StateFlow<List<CategoryBudget>> = repository.getBudgets()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val wallets: StateFlow<List<ConnectedWallet>> = repository.getConnectedWallets()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val pendingNotifs: StateFlow<List<PendingWalletNotification>> = repository.getPendingNotifications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val syncLogs: StateFlow<List<SyncLogEntry>> = repository.getSyncLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Settings State
    private val _settings = MutableStateFlow(AppSettings())
    val settings: StateFlow<AppSettings> = _settings.asStateFlow()

    // Profile State
    private val _profile = MutableStateFlow(UserProfile("Faza Asfi", "fazaasfi@gmail.com", null, 0.0))
    val profile: StateFlow<UserProfile> = _profile.asStateFlow()

    init {
        // Seed default database if empty
        viewModelScope.launch {
            categories.first().let { list ->
                if (list.isEmpty()) {
                    seedDefaultData()
                }
            }
        }
    }

    private suspend fun seedDefaultData() {
        val defaultCats = listOf(
            Category("cat_belanja", "Belanja", "shopping-bag", "#FF6B6B", "EXPENSE"),
            Category("cat_makanan", "Makanan", "utensils", "#4DABF7", "EXPENSE"),
            Category("cat_transport", "Transport", "car", "#51CF66", "EXPENSE"),
            Category("cat_gaji", "Gaji", "briefcase", "#FCC419", "INCOME"),
            Category("cat_investasi", "Investasi", "trending-up", "#6C4CF5", "EXPENSE")
        )
        repository.seedCategories(defaultCats)

        val defaultAccs = listOf(
            SavingsAccount("acc_utama", "Rekening Utama BCA", 15450000.00, "#0D47A1", "UTAMA", "801234991", "BCA"),
            SavingsAccount("acc_gopay", "Kantong GoPay", 450000.00, "#00E676", "DOMPET", "08129990112", "Gojek"),
            SavingsAccount("acc_saham", "Investasi Stockbit", 25000000.00, "#6C4CF5", "INVESTASI", "SB-991202", "Stockbit")
        )
        for (acc in defaultAccs) {
            repository.addAccount(acc)
        }

        val defaultTxs = listOf(
            Transaction("tx_1", "Gaji Pokok", 15000000.00, "INCOME", "cat_gaji", "acc_utama", null, "2026-08-01", "09:00", "Gaji bulan Agustus"),
            Transaction("tx_2", "Soto Betawi H. Mamat", 45000.00, "EXPENSE", "cat_makanan", "acc_utama", null, "2026-08-01", "13:00", "Makan siang dengan tim"),
            Transaction("tx_3", "Top Up GoPay", 300000.00, "TRANSFER", "cat_belanja", "acc_utama", "acc_gopay", "2026-08-01", "15:00", "Top up bulanan"),
            Transaction("tx_4", "KRL Commuterline", 12000.00, "EXPENSE", "cat_transport", "acc_gopay", null, "2026-08-02", "08:15", "Ongkos kantor")
        )
        for (tx in defaultTxs) {
            repository.addTransaction(tx)
        }

        val defaultGoals = listOf(
            Goal("goal_1", "Beli MacBook M4 Pro", 32000000.0, 12000000.0, "2026-12-31", "BERJALAN", "#6C4CF5"),
            Goal("goal_2", "Dana Darurat 6 Bulan", 15000000.0, 15000000.0, "2026-07-31", "TERCAPAI", "#51CF66")
        )
        for (g in defaultGoals) {
            repository.addGoal(g)
        }

        val defaultWishlist = listOf(
            Wishlist("wish_1", "Keychron K2 Keyboard", 1200000.0, 300000.0, "https://keychron.com", "SEDANG"),
            Wishlist("wish_2", "Sony WH-1000XM5", 4599000.0, 4599000.0, "https://sony.co.id", "TINGGI")
        )
        for (w in defaultWishlist) {
            repository.addWishlist(w)
        }

        val defaultBudgets = listOf(
            CategoryBudget("b_makanan", "cat_makanan", 3000000.0, 45000.0, "BULANAN"),
            CategoryBudget("b_transport", "cat_transport", 1000000.0, 12000.0, "BULANAN")
        )
        for (b in defaultBudgets) {
            repository.addOrUpdateBudget(b)
        }

        val defaultWallets = listOf(
            ConnectedWallet("wal_bca", "BCA Mobile Open API", 15450000.00, "Hari ini, 09:30", "BANK_API", true),
            ConnectedWallet("wal_gopay", "GoPay Partner API", 450000.00, "Hari ini, 09:32", "E_WALLET", true)
        )
        for (w in defaultWallets) {
            repository.connectWallet(w)
        }

        val defaultNotifs = listOf(
            PendingWalletNotification("notif_1", "BCA Mobile", "Starbucks Grand Indonesia", 58000.0, "EXPENSE", "2026-08-02", "10:15", "cat_makanan", "PENDING"),
            PendingWalletNotification("notif_2", "GoPay", "Gojek Ride", 22000.0, "EXPENSE", "2026-08-02", "10:30", "cat_transport", "PENDING")
        )
        for (n in defaultNotifs) {
            repository.addPendingNotification(n)
        }

        updateTotalSavings()
    }

    private fun updateTotalSavings() {
        viewModelScope.launch {
            accounts.collect { list ->
                val total = list.sumOf { it.balance }
                _profile.value = _profile.value.copy(totalSavings = total)
            }
        }
    }

    // Mutator functions for UI
    fun addAccount(name: String, balance: Double, colorHex: String, type: String, accountNumber: String, bankName: String) {
        viewModelScope.launch {
            val acc = SavingsAccount(
                id = "acc_${UUID.randomUUID()}",
                name = name,
                balance = balance,
                colorHex = colorHex,
                type = type,
                accountNumber = accountNumber,
                bankName = bankName
            )
            repository.addAccount(acc)
        }
    }

    fun deleteAccount(id: String) {
        viewModelScope.launch {
            repository.deleteAccount(id)
        }
    }

    fun addTransaction(title: String, amount: Double, type: String, categoryId: String, accountId: String, targetAccountId: String?, notes: String?) {
        viewModelScope.launch {
            val sdfDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val sdfTime = SimpleDateFormat("HH:mm", Locale.getDefault())
            val date = sdfDate.format(Date())
            val time = sdfTime.format(Date())

            val tx = Transaction(
                id = "tx_${UUID.randomUUID()}",
                title = title,
                amount = amount,
                type = type,
                categoryId = categoryId,
                accountId = accountId,
                targetAccountId = targetAccountId,
                date = date,
                time = time,
                notes = notes
            )
            repository.addTransaction(tx)

            // Adjust accounts balance
            val currentAccs = accounts.value
            if (type == "INCOME") {
                currentAccs.find { it.id == accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = acc.balance + amount))
                }
            } else if (type == "EXPENSE") {
                currentAccs.find { it.id == accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = maxOf(0.0, acc.balance - amount)))
                }
            } else if (type == "TRANSFER" && targetAccountId != null) {
                currentAccs.find { it.id == accountId }?.let { fromAcc ->
                    repository.addAccount(fromAcc.copy(balance = maxOf(0.0, fromAcc.balance - amount)))
                }
                currentAccs.find { it.id == targetAccountId }?.let { toAcc ->
                    repository.addAccount(toAcc.copy(balance = toAcc.balance + amount))
                }
            }
        }
    }

    fun softDeleteTransaction(id: String) {
        viewModelScope.launch {
            val target = transactions.value.find { t -> t.id == id } ?: return@launch
            val deletedAt = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
            repository.softDeleteTransaction(id, deletedAt)

            // Refund balance on soft delete
            val currentAccs = accounts.value
            if (target.type == "EXPENSE") {
                currentAccs.find { it.id == target.accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = acc.balance + target.amount))
                }
            } else if (target.type == "INCOME") {
                currentAccs.find { it.id == target.accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = maxOf(0.0, acc.balance - target.amount)))
                }
            }
        }
    }

    fun restoreTransaction(id: String) {
        viewModelScope.launch {
            val target = deletedTransactions.value.find { t -> t.id == id } ?: return@launch
            repository.restoreTransaction(id)

            // Deduct balance again on restore
            val currentAccs = accounts.value
            if (target.type == "EXPENSE") {
                currentAccs.find { it.id == target.accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = maxOf(0.0, acc.balance - target.amount)))
                }
            } else if (target.type == "INCOME") {
                currentAccs.find { it.id == target.accountId }?.let { acc ->
                    repository.addAccount(acc.copy(balance = acc.balance + target.amount))
                }
            }
        }
    }

    fun addGoal(title: String, targetAmount: Double, targetDate: String, colorHex: String) {
        viewModelScope.launch {
            val goal = Goal(
                id = "goal_${UUID.randomUUID()}",
                title = title,
                targetAmount = targetAmount,
                currentAmount = 0.0,
                targetDate = targetDate,
                status = "BERJALAN",
                colorHex = colorHex
            )
            repository.addGoal(goal)
        }
    }

    fun depositToGoal(id: String, amount: Double) {
        viewModelScope.launch {
            goals.value.find { it.id == id }?.let { g ->
                val newAmount = g.currentAmount + amount
                val status = if (newAmount >= g.targetAmount) "TERCAPAI" else if (newAmount >= g.targetAmount * 0.8) "HAMPIR_SELESAI" else "BERJALAN"
                repository.depositToGoal(id, newAmount, status)
            }
        }
    }

    fun addWishlist(title: String, price: Double, url: String?, priority: String) {
        viewModelScope.launch {
            val wish = Wishlist(
                id = "wish_${UUID.randomUUID()}",
                title = title,
                price = price,
                savedAmount = 0.0,
                url = url,
                priority = priority
            )
            repository.addWishlist(wish)
        }
    }

    fun deleteWishlist(id: String) {
        viewModelScope.launch {
            repository.deleteWishlist(id)
        }
    }

    fun depositToWishlist(id: String, amount: Double) {
        viewModelScope.launch {
            wishlists.value.find { it.id == id }?.let { w ->
                val newAmount = w.savedAmount + amount
                repository.depositToWishlist(id, newAmount)
            }
        }
    }

    fun updateBudget(categoryId: String, limitAmount: Double, spentAmount: Double) {
        viewModelScope.launch {
            val budget = CategoryBudget(
                id = "b_$categoryId",
                categoryId = categoryId,
                limitAmount = limitAmount,
                spentAmount = spentAmount,
                period = "BULANAN"
            )
            repository.addOrUpdateBudget(budget)
        }
    }

    fun connectWallet(name: String, balance: Double, type: String) {
        viewModelScope.launch {
            val wallet = ConnectedWallet(
                id = "wal_${UUID.randomUUID()}",
                name = name,
                balance = balance,
                lastSync = "Baru saja",
                type = type
            )
            repository.connectWallet(wallet)

            val log = SyncLogEntry(
                id = "log_${UUID.randomUUID()}",
                walletName = name,
                timestamp = "Baru saja",
                status = "SUCCESS",
                importedCount = 0,
                duplicateCount = 0,
                message = "Berhasil menautkan $name API resmi."
            )
            repository.addSyncLog(log)
        }
    }

    fun disconnectWallet(id: String) {
        viewModelScope.launch {
            repository.disconnectWallet(id)
        }
    }

    fun syncWallet(id: String) {
        viewModelScope.launch {
            val nowStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
            wallets.value.find { it.id == id }?.let { w ->
                repository.updateWalletSync(id, w.balance, "Hari ini, $nowStr")
                val log = SyncLogEntry(
                    id = "log_${UUID.randomUUID()}",
                    walletName = w.name,
                    timestamp = "Hari ini, $nowStr",
                    status = "SUCCESS",
                    importedCount = 2,
                    duplicateCount = 0,
                    message = "Sinkronisasi selesai tanpa kendala."
                )
                repository.addSyncLog(log)
            }
        }
    }

    fun acceptNotification(notifId: String, categoryId: String) {
        viewModelScope.launch {
            val target = pendingNotifs.value.find { it.id == notifId } ?: return@launch
            repository.updateNotificationStatus(notifId, "ACCEPTED")

            val acc = accounts.value.firstOrNull() ?: return@launch
            addTransaction(
                title = target.merchant,
                amount = target.amount,
                type = target.type,
                categoryId = categoryId,
                accountId = acc.id,
                targetAccountId = null,
                notes = "Disetujui dari Notifikasi ${target.walletName}"
            )
        }
    }

    fun rejectNotification(notifId: String) {
        viewModelScope.launch {
            repository.updateNotificationStatus(notifId, "REJECTED")
        }
    }

    fun toggleWalletNotification(id: String, enabled: Boolean) {
        viewModelScope.launch {
            repository.toggleWalletNotificationListener(id, enabled)
        }
    }

    fun updateSettings(isDarkMode: Boolean, isPasscodeEnabled: Boolean, currency: String, notificationsEnabled: Boolean) {
        _settings.value = AppSettings(isDarkMode, isPasscodeEnabled, currency, notificationsEnabled)
    }

    fun updateProfile(name: String, email: String, avatarUrl: String?) {
        _profile.value = _profile.value.copy(name = name, email = email, avatarUrl = avatarUrl)
    }

    fun resetData() {
        viewModelScope.launch {
            repository.resetAllData()
            seedDefaultData()
        }
    }
}
