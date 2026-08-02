package com.fzsavings.app.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "savings_accounts")
data class SavingsAccount(
    @PrimaryKey val id: String,
    val name: String,
    val balance: Double,
    val colorHex: String,
    val type: String, // e.g. "UTAMA", "DOMPET", "INVESTASI"
    val accountNumber: String,
    val bankName: String
)

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String,
    val title: String,
    val amount: Double,
    val type: String, // "INCOME", "EXPENSE", "TRANSFER"
    val categoryId: String,
    val accountId: String,
    val targetAccountId: String?,
    val date: String,
    val time: String,
    val notes: String?,
    val isDeleted: Boolean = false,
    val deletedAt: String? = null
)

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String, // Lucide icon names equivalent or vector drawables
    val colorHex: String,
    val type: String // "INCOME", "EXPENSE"
)

@Entity(tableName = "goals")
data class Goal(
    @PrimaryKey val id: String,
    val title: String,
    val targetAmount: Double,
    val currentAmount: Double,
    val targetDate: String,
    val status: String, // "BERJALAN", "TERCAPAI", "HAMPIR_SELESAI"
    val colorHex: String
)

@Entity(tableName = "wishlists")
data class Wishlist(
    @PrimaryKey val id: String,
    val title: String,
    val price: Double,
    val savedAmount: Double,
    val url: String?,
    val priority: String // "TINGGI", "SEDANG", "RENDAH"
)

@Entity(tableName = "category_budgets")
data class CategoryBudget(
    @PrimaryKey val id: String,
    val categoryId: String,
    val limitAmount: Double,
    val spentAmount: Double,
    val period: String // "BULANAN", "MINGGUAN"
)

@Entity(tableName = "connected_wallets")
data class ConnectedWallet(
    @PrimaryKey val id: String,
    val name: String,
    val balance: Double,
    val lastSync: String,
    val type: String, // "BANK_API", "E_WALLET"
    val isNotificationListenerActive: Boolean = true
)

@Entity(tableName = "pending_notifications")
data class PendingWalletNotification(
    @PrimaryKey val id: String,
    val walletName: String,
    val merchant: String,
    val amount: Double,
    val type: String, // "EXPENSE", "INCOME"
    val date: String,
    val time: String,
    val suggestedCategoryId: String,
    val status: String // "PENDING", "ACCEPTED", "REJECTED"
)

@Entity(tableName = "sync_logs")
data class SyncLogEntry(
    @PrimaryKey val id: String,
    val walletName: String,
    val timestamp: String,
    val status: String, // "SUCCESS", "FAILED"
    val importedCount: Int,
    val duplicateCount: Int,
    val message: String
)

data class UserProfile(
    val name: String,
    val email: String,
    val avatarUrl: String?,
    val totalSavings: Double
)

data class AppSettings(
    val isDarkMode: Boolean = true,
    val isPasscodeEnabled: Boolean = false,
    val currency: String = "IDR",
    val notificationsEnabled: Boolean = true
)
