package com.fzsavings.app.domain.repository

import com.fzsavings.app.domain.model.*
import kotlinx.coroutines.flow.Flow

interface SavingsRepository {
    fun getAccounts(): Flow<List<SavingsAccount>>
    suspend fun addAccount(account: SavingsAccount)
    suspend fun deleteAccount(id: String)

    fun getTransactions(): Flow<List<Transaction>>
    fun getDeletedTransactions(): Flow<List<Transaction>>
    suspend fun addTransaction(transaction: Transaction)
    suspend fun softDeleteTransaction(id: String, deletedAt: String)
    suspend fun restoreTransaction(id: String)

    fun getCategories(): Flow<List<Category>>
    suspend fun seedCategories(categories: List<Category>)

    fun getGoals(): Flow<List<Goal>>
    suspend fun addGoal(goal: Goal)
    suspend fun depositToGoal(id: String, currentAmount: Double, status: String)

    fun getWishlists(): Flow<List<Wishlist>>
    suspend fun addWishlist(wishlist: Wishlist)
    suspend fun deleteWishlist(id: String)
    suspend fun depositToWishlist(id: String, savedAmount: Double)

    fun getBudgets(): Flow<List<CategoryBudget>>
    suspend fun addOrUpdateBudget(budget: CategoryBudget)

    fun getConnectedWallets(): Flow<List<ConnectedWallet>>
    suspend fun connectWallet(wallet: ConnectedWallet)
    suspend fun disconnectWallet(id: String)
    suspend fun updateWalletSync(id: String, balance: Double, lastSync: String)
    suspend fun toggleWalletNotificationListener(id: String, enabled: Boolean)

    fun getPendingNotifications(): Flow<List<PendingWalletNotification>>
    suspend fun addPendingNotification(notification: PendingWalletNotification)
    suspend fun updateNotificationStatus(id: String, status: String)

    fun getSyncLogs(): Flow<List<SyncLogEntry>>
    suspend fun addSyncLog(log: SyncLogEntry)

    suspend fun resetAllData()
}
