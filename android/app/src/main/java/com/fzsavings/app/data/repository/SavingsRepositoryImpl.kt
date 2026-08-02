package com.fzsavings.app.data.repository

import com.fzsavings.app.data.local.SavingsDao
import com.fzsavings.app.domain.model.*
import com.fzsavings.app.domain.repository.SavingsRepository
import kotlinx.coroutines.flow.Flow

class SavingsRepositoryImpl(
    private val dao: SavingsDao
) : SavingsRepository {

    override fun getAccounts(): Flow<List<SavingsAccount>> = dao.getAllAccounts()
    override suspend fun addAccount(account: SavingsAccount) = dao.insertAccount(account)
    override suspend fun deleteAccount(id: String) = dao.deleteAccountById(id)

    override fun getTransactions(): Flow<List<Transaction>> = dao.getAllActiveTransactions()
    override fun getDeletedTransactions(): Flow<List<Transaction>> = dao.getDeletedTransactions()
    override suspend fun addTransaction(transaction: Transaction) = dao.insertTransaction(transaction)
    override suspend fun softDeleteTransaction(id: String, deletedAt: String) = dao.softDeleteTransaction(id, deletedAt)
    override suspend fun restoreTransaction(id: String) = dao.restoreTransaction(id)

    override fun getCategories(): Flow<List<Category>> = dao.getAllCategories()
    override suspend fun seedCategories(categories: List<Category>) = dao.insertCategories(categories)

    override fun getGoals(): Flow<List<Goal>> = dao.getAllGoals()
    override suspend fun addGoal(goal: Goal) = dao.insertGoal(goal)
    override suspend fun depositToGoal(id: String, currentAmount: Double, status: String) = dao.updateGoalProgress(id, currentAmount, status)

    override fun getWishlists(): Flow<List<Wishlist>> = dao.getAllWishlists()
    override suspend fun addWishlist(wishlist: Wishlist) = dao.insertWishlist(wishlist)
    override suspend fun deleteWishlist(id: String) = dao.deleteWishlistById(id)
    override suspend fun depositToWishlist(id: String, savedAmount: Double) = dao.updateWishlistSavedAmount(id, savedAmount)

    override fun getBudgets(): Flow<List<CategoryBudget>> = dao.getAllBudgets()
    override suspend fun addOrUpdateBudget(budget: CategoryBudget) = dao.insertBudget(budget)

    override fun getConnectedWallets(): Flow<List<ConnectedWallet>> = dao.getAllConnectedWallets()
    override suspend fun connectWallet(wallet: ConnectedWallet) = dao.insertConnectedWallet(wallet)
    override suspend fun disconnectWallet(id: String) = dao.deleteConnectedWalletById(id)
    override suspend fun updateWalletSync(id: String, balance: Double, lastSync: String) = dao.updateWalletSyncState(id, balance, lastSync)
    override suspend fun toggleWalletNotificationListener(id: String, enabled: Boolean) = dao.updateWalletNotificationListener(id, enabled)

    override fun getPendingNotifications(): Flow<List<PendingWalletNotification>> = dao.getPendingNotifications()
    override suspend fun addPendingNotification(notification: PendingWalletNotification) = dao.insertPendingNotification(notification)
    override suspend fun updateNotificationStatus(id: String, status: String) = dao.updateNotificationStatus(id, status)

    override fun getSyncLogs(): Flow<List<SyncLogEntry>> = dao.getAllSyncLogs()
    override suspend fun addSyncLog(log: SyncLogEntry) = dao.insertSyncLog(log)

    override suspend fun resetAllData() {
        dao.clearAccounts()
        dao.clearTransactions()
        dao.clearGoals()
        dao.clearWishlists()
        dao.clearBudgets()
        dao.clearConnectedWallets()
        dao.clearPendingNotifications()
        dao.clearSyncLogs()
    }
}
