package com.fzsavings.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.fzsavings.app.domain.model.*

@Database(
    entities = [
        SavingsAccount::class,
        Transaction::class,
        Category::class,
        Goal::class,
        Wishlist::class,
        CategoryBudget::class,
        ConnectedWallet::class,
        PendingWalletNotification::class,
        SyncLogEntry::class
    ],
    version = 1,
    exportSchema = false
)
abstract class SavingsDatabase : RoomDatabase() {
    abstract val dao: SavingsDao

    companion object {
        @Volatile
        private var INSTANCE: SavingsDatabase? = null

        fun getInstance(context: Context): SavingsDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    SavingsDatabase::class.java,
                    "fz_savings_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
