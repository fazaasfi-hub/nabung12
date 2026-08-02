package com.fzsavings.app.data.local

import androidx.room.*
import com.fzsavings.app.domain.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface SavingsDao {
    // Accounts
    @Query("SELECT * FROM savings_accounts")
    fun getAllAccounts(): Flow<List<SavingsAccount>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAccount(account: SavingsAccount)

    @Query("DELETE FROM savings_accounts WHERE id = :id")
    suspend fun deleteAccountById(id: String)

    // Transactions
    @Query("SELECT * FROM transactions WHERE isDeleted = 0 ORDER BY date DESC, time DESC")
    fun getAllActiveTransactions(): Flow<List<Transaction>>

    @Query("SELECT * FROM transactions WHERE isDeleted = 1 ORDER BY deletedAt DESC")
    fun getDeletedTransactions(): Flow<List<Transaction>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: Transaction)

    @Query("UPDATE transactions SET isDeleted = 1, deletedAt = :deletedAt WHERE id = :id")
    suspend fun softDeleteTransaction(id: String, deletedAt: String)

    @Query("UPDATE transactions SET isDeleted = 0, deletedAt = NULL WHERE id = :id")
    suspend fun restoreTransaction(id: String)

    // Categories
    @Query("SELECT * FROM categories")
    fun getAllCategories(): Flow<List<Category>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategories(categories: List<Category>)

    // Goals
    @Query("SELECT * FROM goals")
    fun getAllGoals(): Flow<List<Goal>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGoal(goal: Goal)

    @Query("UPDATE goals SET currentAmount = :amount, status = :status WHERE id = :id")
    suspend fun updateGoalProgress(id: String, amount: Double, status: String)

    // Wishlists
    @Query("SELECT * FROM wishlists")
    fun getAllWishlists(): Flow<List<Wishlist>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWishlist(wishlist: Wishlist)

    @Query("DELETE FROM wishlists WHERE id = :id")
    suspend fun deleteWishlistById(id: String)

    @Query("UPDATE wishlists SET savedAmount = :amount WHERE id = :id")
    suspend fun updateWishlistSavedAmount(id: String, amount: Double)

    // Category Budgets
    @Query("SELECT * FROM category_budgets")
    fun getAllBudgets(): Flow<List<CategoryBudget>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBudget(budget: CategoryBudget)

    // Connected Wallets
    @Query("SELECT * FROM connected_wallets")
    fun getAllConnectedWallets(): Flow<List<ConnectedWallet>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertConnectedWallet(wallet: ConnectedWallet)

    @Query("DELETE FROM connected_wallets WHERE id = :id")
    suspend fun deleteConnectedWalletById(id: String)

    @Query("UPDATE connected_wallets SET balance = :balance, lastSync = :lastSync WHERE id = :id")
    suspend fun updateWalletSyncState(id: String, balance: Double, lastSync: String)

    @Query("UPDATE connected_wallets SET isNotificationListenerActive = :active WHERE id = :id")
    suspend fun updateWalletNotificationListener(id: String, active: Boolean)

    // Pending Notifications
    @Query("SELECT * FROM pending_notifications WHERE status = 'PENDING'")
    fun getPendingNotifications(): Flow<List<PendingWalletNotification>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPendingNotification(notification: PendingWalletNotification)

    @Query("UPDATE pending_notifications SET status = :status WHERE id = :id")
    suspend fun updateNotificationStatus(id: String, status: String)

    // Sync Logs
    @Query("SELECT * FROM sync_logs ORDER BY timestamp DESC")
    fun getAllSyncLogs(): Flow<List<SyncLogEntry>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSyncLog(log: SyncLogEntry)

    // Nuke database for reset
    @Query("DELETE FROM savings_accounts")
    suspend fun clearAccounts()

    @Query("DELETE FROM transactions")
    suspend fun clearTransactions()

    @Query("DELETE FROM goals")
    suspend fun clearGoals()

    @Query("DELETE FROM wishlists")
    suspend fun clearWishlists()

    @Query("DELETE FROM category_budgets")
    suspend fun clearBudgets()

    @Query("DELETE FROM connected_wallets")
    suspend fun clearConnectedWallets()

    @Query("DELETE FROM pending_notifications")
    suspend fun clearPendingNotifications()

    @Query("DELETE FROM sync_logs")
    suspend fun clearSyncLogs()
}
