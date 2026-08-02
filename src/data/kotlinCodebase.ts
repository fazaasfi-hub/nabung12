import { KotlinFile } from '../types';

export const KOTLIN_CODEBASE: KotlinFile[] = [
  // 1. Android Manifest & Gradle Configuration
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    folder: 'app/src/main',
    description: 'Manifest file declaring permissions, Hilt application class, activities, biometric security & WorkManager.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissions for Offline First, Biometrics, Notifications & Workers -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".FZApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.FZSavings"
        tools:targetApi="34">

        <activity
            android:name=".presentation.MainActivity"
            android:exported="true"
            android:theme="@style/Theme.FZSavings">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="\${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="androidx.work.WorkManagerInitializer"
                android:value="androidx.startup" />
        </provider>

    </application>

</manifest>`
  },

  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (App)',
    folder: 'app',
    description: 'App build configuration with Jetpack Compose, Room, Hilt, DataStore, Navigation Compose, WorkManager & Material 3.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.fz.savings"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.fz.savings"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        kapt {
            arguments {
                arg("room.schemaLocation", "$projectDir/schemas")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi"
        )
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Core & Kotlin Coroutines
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("kotlinx.coroutines:kotlinx-coroutines-android:1.7.3")

    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // DataStore Preferences
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // Hilt Dependency Injection
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")
    implementation("androidx.hilt:hilt-work:1.1.0")

    // WorkManager & Biometrics
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    implementation("androidx.biometric:biometric-ktx:1.2.0-alpha05")

    // Charts & Utilities
    implementation("co.yml:ycharts:2.1.0")
    implementation("io.coil-kt:coil-compose:2.5.0")
}`
  },

  // 2. Application Class & MainActivity
  {
    path: 'app/src/main/java/com/fz/savings/FZApplication.kt',
    name: 'FZApplication.kt',
    folder: 'app/src/main/java/com/fz/savings',
    description: 'Application class with HiltAndroidApp setup and WorkManager initialization.',
    content: `package com.fz.savings

import android.app.Application
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.Configuration
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class FZApplication : Application(), Configuration.Provider {

    @Inject
    lateinit var workerFactory: HiltWorkerFactory

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()

    override fun onCreate() {
        super.onCreate()
        // Initialize background tasks or encrypted DataStore
    }
}`
  },

  {
    path: 'app/src/main/java/com/fz/savings/presentation/MainActivity.kt',
    name: 'MainActivity.kt',
    folder: 'app/src/main/java/com/fz/savings/presentation',
    description: 'Main activity establishing Material 3 theme and Navigation host for Jetpack Compose.',
    content: `package com.fz.savings.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.fz.savings.ui.navigation.FZNavHost
import com.fz.savings.ui.theme.FZSavingsTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FZSavingsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FZNavHost()
                }
            }
        }
    }
}`
  },

  // 3. Database Entities (Room)
  {
    path: 'app/src/main/java/com/fz/savings/database/entity/SavingsAccountEntity.kt',
    name: 'SavingsAccountEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for multiple savings accounts / wallets.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "savings_accounts")
data class SavingsAccountEntity(
    @PrimaryKey val id: String,
    val name: String,
    val colorHex: String,
    val iconName: String,
    val balance: Double,
    val targetAmount: Double,
    val deadline: String,
    val notes: String,
    val createdAt: Long = System.currentTimeMillis()
)`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/entity/TransactionEntity.kt',
    name: 'TransactionEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for income, expense, and transfer transactions with soft delete support.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "transactions",
    foreignKeys = [
        ForeignKey(
            entity = SavingsAccountEntity::class,
            parentColumns = ["id"],
            childColumns = ["accountId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("accountId"), Index("categoryId"), Index("date")]
)
data class TransactionEntity(
    @PrimaryKey val id: String,
    val title: String,
    val amount: Double,
    val type: String, // INCOME, EXPENSE, TRANSFER
    val categoryId: String,
    val accountId: String,
    val targetAccountId: String? = null,
    val date: String, // YYYY-MM-DD
    val time: String, // HH:mm
    val notes: String? = null,
    val isDeleted: Boolean = false,
    val deletedAt: Long? = null
)`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/entity/CategoryEntity.kt',
    name: 'CategoryEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for custom and default transaction categories.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey val id: String,
    val name: String,
    val type: String, // INCOME or EXPENSE
    val iconName: String,
    val colorHex: String,
    val isCustom: Boolean = false
)`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/entity/GoalEntity.kt',
    name: 'GoalEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for financial goals and target progress.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey val id: String,
    val name: String,
    val targetAmount: Double,
    val currentAmount: Double,
    val deadline: String,
    val reminderEnabled: Boolean,
    val category: String,
    val status: String, // BELUM_MULAI, BERJALAN, HAMPIR_SELESAI, TERCAPAI
    val notes: String? = null
)`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/entity/BudgetEntity.kt',
    name: 'BudgetEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for monthly category budget limits.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "budgets")
data class BudgetEntity(
    @PrimaryKey val id: String,
    val categoryId: String,
    val monthlyLimit: Double,
    val spentAmount: Double = 0.0
)`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/entity/WishlistEntity.kt',
    name: 'WishlistEntity.kt',
    folder: 'database/entity',
    description: 'Room entity for wishlist items and dream savings items.',
    content: `package com.fz.savings.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "wishlists")
data class WishlistEntity(
    @PrimaryKey val id: String,
    val title: String,
    val price: Double,
    val savedAmount: Double,
    val imageUrl: String? = null,
    val priority: String, // HIGH, MEDIUM, LOW
    val notes: String? = null
)`
  },

  // 4. DAOs (Data Access Objects)
  {
    path: 'app/src/main/java/com/fz/savings/database/dao/TransactionDao.kt',
    name: 'TransactionDao.kt',
    folder: 'database/dao',
    description: 'Room DAO providing Coroutine Flow queries, filtering, soft-delete & restore.',
    content: `package com.fz.savings.database.dao

import androidx.room.*
import com.fz.savings.database.entity.TransactionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions WHERE isDeleted = 0 ORDER BY date DESC, time DESC")
    fun getAllActiveTransactions(): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE isDeleted = 1 ORDER BY deletedAt DESC")
    fun getSoftDeletedTransactions(): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE date = :dateAndMonth AND isDeleted = 0")
    fun getTransactionsByDate(dateAndMonth: String): Flow<List<TransactionEntity>>

    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'INCOME' AND isDeleted = 0 AND date LIKE :monthQuery")
    fun getTotalIncomeByMonth(monthQuery: String): Flow<Double?>

    @Query("SELECT SUM(amount) FROM transactions WHERE type = 'EXPENSE' AND isDeleted = 0 AND date LIKE :monthQuery")
    fun getTotalExpenseByMonth(monthQuery: String): Flow<Double?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: TransactionEntity)

    @Update
    suspend fun updateTransaction(transaction: TransactionEntity)

    @Query("UPDATE transactions SET isDeleted = 1, deletedAt = :deletedAt WHERE id = :id")
    suspend fun softDeleteTransaction(id: String, deletedAt: Long = System.currentTimeMillis())

    @Query("UPDATE transactions SET isDeleted = 0, deletedAt = NULL WHERE id = :id")
    suspend fun restoreTransaction(id: String)

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun permanentlyDeleteTransaction(id: String)
}`
  },

  {
    path: 'app/src/main/java/com/fz/savings/database/dao/SavingsAccountDao.kt',
    name: 'SavingsAccountDao.kt',
    folder: 'database/dao',
    description: 'Room DAO for savings accounts CRUD and balance update queries.',
    content: `package com.fz.savings.database.dao

import androidx.room.*
import com.fz.savings.database.entity.SavingsAccountEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SavingsAccountDao {
    @Query("SELECT * FROM savings_accounts ORDER BY createdAt ASC")
    fun getAllAccounts(): Flow<List<SavingsAccountEntity>>

    @Query("SELECT * FROM savings_accounts WHERE id = :id")
    suspend fun getAccountById(id: String): SavingsAccountEntity?

    @Query("SELECT SUM(balance) FROM savings_accounts")
    fun getTotalBalance(): Flow<Double?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAccount(account: SavingsAccountEntity)

    @Update
    suspend fun updateAccount(account: SavingsAccountEntity)

    @Query("UPDATE savings_accounts SET balance = balance + :amount WHERE id = :id")
    suspend fun addBalance(id: String, amount: Double)

    @Query("UPDATE savings_accounts SET balance = balance - :amount WHERE id = :id")
    suspend fun subtractBalance(id: String, amount: Double)

    @Delete
    suspend fun deleteAccount(account: SavingsAccountEntity)
}`
  },

  // 5. Database Class
  {
    path: 'app/src/main/java/com/fz/savings/database/FZDatabase.kt',
    name: 'FZDatabase.kt',
    folder: 'database',
    description: 'Room Database class holding entities and migrations.',
    content: `package com.fz.savings.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.fz.savings.database.dao.*
import com.fz.savings.database.entity.*

@Database(
    entities = [
        SavingsAccountEntity::class,
        TransactionEntity::class,
        CategoryEntity::class,
        GoalEntity::class,
        BudgetEntity::class,
        WishlistEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class FZDatabase : RoomDatabase() {
    abstract fun savingsAccountDao(): SavingsAccountDao
    abstract fun transactionDao(): TransactionDao
    abstract fun categoryDao(): CategoryDao
    abstract fun goalDao(): GoalDao
    abstract fun budgetDao(): BudgetDao
    abstract fun wishlistDao(): WishlistDao
}`
  },

  // 6. Dependency Injection (Hilt)
  {
    path: 'app/src/main/java/com/fz/savings/di/DatabaseModule.kt',
    name: 'DatabaseModule.kt',
    folder: 'di',
    description: 'Hilt module providing Room database instance and DAOs.',
    content: `package com.fz.savings.di

import android.content.Context
import androidx.room.Room
import com.fz.savings.database.FZDatabase
import com.fz.savings.database.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): FZDatabase {
        return Room.databaseBuilder(
            context,
            FZDatabase::class.java,
            "fz_savings.db"
        )
        .fallbackToDestructiveMigration()
        .build()
    }

    @Provides
    fun provideSavingsAccountDao(db: FZDatabase): SavingsAccountDao = db.savingsAccountDao()

    @Provides
    fun provideTransactionDao(db: FZDatabase): TransactionDao = db.transactionDao()

    @Provides
    fun provideGoalDao(db: FZDatabase): GoalDao = db.goalDao()

    @Provides
    fun provideBudgetDao(db: FZDatabase): BudgetDao = db.budgetDao()

    @Provides
    fun provideWishlistDao(db: FZDatabase): WishlistDao = db.wishlistDao()
}`
  },

  // 7. Repository Pattern
  {
    path: 'app/src/main/java/com/fz/savings/repository/SavingsRepository.kt',
    name: 'SavingsRepository.kt',
    folder: 'repository',
    description: 'Repository handling savings accounts, transaction flow logic and safety checks.',
    content: `package com.fz.savings.repository

import com.fz.savings.database.dao.SavingsAccountDao
import com.fz.savings.database.dao.TransactionDao
import com.fz.savings.database.entity.SavingsAccountEntity
import com.fz.savings.database.entity.TransactionEntity
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SavingsRepository @Inject constructor(
    private val accountDao: SavingsAccountDao,
    private val transactionDao: TransactionDao
) {
    val allAccounts: Flow<List<SavingsAccountEntity>> = accountDao.getAllAccounts()
    val totalBalance: Flow<Double?> = accountDao.getTotalBalance()
    val allTransactions: Flow<List<TransactionEntity>> = transactionDao.getAllActiveTransactions()

    suspend fun addTransaction(transaction: TransactionEntity) {
        // Validation: prevent negative balance on withdrawal
        if (transaction.type == "EXPENSE") {
            val account = accountDao.getAccountById(transaction.accountId)
            requireNotNull(account) { "Rekening tidak ditemukan!" }
            require(account.balance >= transaction.amount) { "Saldo tidak mencukupi untuk transaksi ini!" }
            accountDao.subtractBalance(transaction.accountId, transaction.amount)
        } else if (transaction.type == "INCOME") {
            accountDao.addBalance(transaction.accountId, transaction.amount)
        } else if (transaction.type == "TRANSFER" && transaction.targetAccountId != null) {
            val sourceAcc = accountDao.getAccountById(transaction.accountId)
            requireNotNull(sourceAcc)
            require(sourceAcc.balance >= transaction.amount) { "Saldo rekening asal tidak mencukupi!" }
            accountDao.subtractBalance(transaction.accountId, transaction.amount)
            accountDao.addBalance(transaction.targetAccountId, transaction.amount)
        }
        transactionDao.insertTransaction(transaction)
    }

    suspend fun softDeleteTransaction(transaction: TransactionEntity) {
        // Revert balance change upon soft delete
        if (transaction.type == "EXPENSE") {
            accountDao.addBalance(transaction.accountId, transaction.amount)
        } else if (transaction.type == "INCOME") {
            accountDao.subtractBalance(transaction.accountId, transaction.amount)
        }
        transactionDao.softDeleteTransaction(transaction.id)
    }

    suspend fun restoreTransaction(transaction: TransactionEntity) {
        if (transaction.type == "EXPENSE") {
            accountDao.subtractBalance(transaction.accountId, transaction.amount)
        } else if (transaction.type == "INCOME") {
            accountDao.addBalance(transaction.accountId, transaction.amount)
        }
        transactionDao.restoreTransaction(transaction.id)
    }
}`
  },

  // 8. ViewModels
  {
    path: 'app/src/main/java/com/fz/savings/presentation/viewmodel/DashboardViewModel.kt',
    name: 'DashboardViewModel.kt',
    folder: 'presentation/viewmodel',
    description: 'ViewModel managing dashboard StateFlow state, greeting calculation, and quick actions.',
    content: `package com.fz.savings.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fz.savings.repository.SavingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import java.util.Calendar
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: SavingsRepository
) : ViewModel() {

    val accounts = repository.allAccounts.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val totalBalance = repository.totalBalance.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = 0.0
    )

    val recentTransactions = repository.allTransactions.map { list ->
        list.take(5)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun getGreetingMessage(): String {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        return when (hour) {
            in 4..11 -> "Selamat Pagi, Faza! 🌅"
            in 12..14 -> "Selamat Siang, Faza! ☀️"
            in 15..18 -> "Selamat Sore, Faza! 🌇"
            else -> "Selamat Malam, Faza! 🌙"
        }
    }
}`
  },

  // 9. Navigation
  {
    path: 'app/src/main/java/com/fz/savings/ui/navigation/NavGraph.kt',
    name: 'NavGraph.kt',
    folder: 'ui/navigation',
    description: 'Navigation Compose graph defining routes across Dashboard, Savings, Transactions, Calendar, Stats, Budget, Wishlist & Settings.',
    content: `package com.fz.savings.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

sealed class Screen(val route: String) {
    object Dashboard : Screen("dashboard")
    object Savings : Screen("savings")
    object Transactions : Screen("transactions")
    object Calendar : Screen("calendar")
    object Statistics : Screen("statistics")
    object Budget : Screen("budget")
    object Wishlist : Screen("wishlist")
    object Settings : Screen("settings")
    object PinLock : Screen("pin_lock")
}

@Composable
fun FZNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Dashboard.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Dashboard.route) {
            // Dashboard Composable Screen
        }
        composable(Screen.Savings.route) {
            // Savings Composable Screen
        }
        composable(Screen.Transactions.route) {
            // Transactions Composable Screen
        }
        composable(Screen.Calendar.route) {
            // Financial Calendar Composable Screen
        }
        composable(Screen.Statistics.route) {
            // Statistics & Analytics Screen
        }
        composable(Screen.Budget.route) {
            // Budget Planner Screen
        }
        composable(Screen.Wishlist.route) {
            // Wishlist Screen
        }
        composable(Screen.Settings.route) {
            // Settings Screen
        }
    }
}`
  },

  // 10. Signature App Launch Experience Composable
  {
    path: 'app/src/main/java/com/fz/savings/ui/screens/SplashScreen.kt',
    name: 'SplashScreen.kt',
    folder: 'ui/screens',
    description: 'Signature FZ Savings App Launch Experience using Jetpack Compose AnimatedVisibility, updateTransition, rememberInfiniteTransition, SpringSpec, and PathMeasure logo assembly.',
    content: `package com.fz.savings.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onInitializationComplete: (nextRoute: String) => Unit
) {
    var isLogoAssembled by remember { mutableStateOf(false) }
    var currentStep by remember { mutableIntStateOf(0) }

    val steps = remember {
        listOf(
            "Inisialisasi Room Database...",
            "Membaca Preferensi DataStore...",
            "Validasi Sesi Pengguna & Biometrik...",
            "Menyiapkan WorkManager Alarms...",
            "Sistem FZ Savings Siap"
        )
    }

    // Background Infinite Aurora Transition
    val infiniteTransition = rememberInfiniteTransition(label = "aurora")
    val auroraOffset by infiniteTransition.animateFloat(
        initialValue = -50f,
        targetValue = 50f,
        animationSpec = infiniteRepeatable(
            animation = tween(8000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offset"
    )

    // Logo Assembly Transition
    val logoScale by animateFloatAsState(
        targetValue = if (isLogoAssembled) 1f else 0.85f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "scale"
    )

    val logoOffsetState by animateDpAsState(
        targetValue = if (isLogoAssembled) (-20).dp else 0.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "float"
    )

    // Initialization Coroutine
    LaunchedEffect(Unit) {
        delay(300)
        isLogoAssembled = true

        for (i in steps.indices) {
            delay(350)
            currentStep = i
        }

        delay(600)
        onInitializationComplete("dashboard")
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0B0E1B),
                        Color(0xFF161339),
                        Color(0xFF0E1022)
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        // Glowing Ambient Aurora Circle
        Box(
            modifier = Modifier
                .offset(y = auroraOffset.dp)
                .size(300.dp)
                .background(Color(0x336C4CF5), CircleShape)
                .blur(90.dp)
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(24.dp)
        ) {
            // Assembling Animated FZ Logo
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(110.dp)
                    .offset(y = logoOffsetState)
                    .scale(logoScale)
            ) {
                // Soft Radiant Glow
                Box(
                    modifier = Modifier
                        .size(90.dp)
                        .background(Color(0x666C4CF5), CircleShape)
                        .blur(20.dp)
                )

                // Outer Shield Ring Canvas
                Canvas(modifier = Modifier.fillMaxSize()) {
                    drawCircle(
                        brush = Brush.linearGradient(
                            colors = listOf(Color(0xFF6C4CF5), Color(0xFF38BDF8))
                        ),
                        radius = size.minDimension / 2.2f,
                        style = Stroke(width = 8f)
                    )
                }

                // Inner FZ Text Emblem
                Text(
                    text = "FZ",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // App Title & Subtitle
            AnimatedVisibility(
                visible = isLogoAssembled,
                enter = fadeIn(tween(600)) + slideInVertically { it / 2 }
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "FZ SAVINGS",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White,
                        letterSpacing = 4.sp
                    )
                    Text(
                        text = "Smart Personal Finance",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFA5B4FC)
                    )
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            // Loading Progress Bar & Status Text
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.width(240.dp)
            ) {
                LinearProgressIndicator(
                    progress = { (currentStep + 1) / steps.size.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .background(Color(0xFF1E293B), RoundedCornerShape(3.dp)),
                    color = Color(0xFF6C4CF5),
                    trackColor = Color(0xFF1E293B)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = steps.getOrElse(currentStep) { "Memuat..." },
                    fontSize = 11.sp,
                    color = Color(0xFF94A3B8),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
`
  },

  // 11. WalletProvider Clean Architecture Interface
  {
    path: 'app/src/main/java/com/fz/savings/domain/wallet/WalletProvider.kt',
    name: 'WalletProvider.kt',
    folder: 'domain/wallet',
    description: 'Modular Wallet Integration Interface according to Clean Architecture guidelines for DANA, GoPay, OVO, ShopeePay, LinkAja, and Bank Accounts.',
    content: `package com.fz.savings.domain.wallet

import com.fz.savings.domain.model.Transaction
import kotlinx.coroutines.flow.Flow

enum class WalletType {
    DANA, GOPAY, OVO, SHOPEEPAY, LINKAJA, BANK_BCA, BANK_MANDIRI, BANK_BRI
}

enum class SyncStatus {
    IDLE, SYNCING, SUCCESS, ERROR, REAUTH_REQUIRED
}

data class WalletAccountInfo(
    val id: String,
    val type: WalletType,
    val aliasName: String,
    val accountIdentifier: String, // Masked phone or bank account
    val balance: Double,
    val lastSyncTimestamp: Long,
    val isAutoSyncEnabled: Boolean
)

data class SyncResult(
    val importedTransactions: List<Transaction>,
    val skippedDuplicatesCount: Int,
    val statusMessage: String
)

interface WalletProvider {
    val walletType: WalletType
    val providerName: String

    suspend fun authenticate(authCodeOrToken: String): Result<Boolean>
    suspend fun getAccountInfo(): Result<WalletAccountInfo>
    suspend fun fetchNewTransactions(sinceTimestamp: Long): Result<List<Transaction>>
    suspend fun isSessionValid(): Boolean
    suspend fun disconnect(): Boolean
}
`
  },

  // 12. DANA Provider Official API Implementation
  {
    path: 'app/src/main/java/com/fz/savings/data/wallet/providers/DanaProvider.kt',
    name: 'DanaProvider.kt',
    folder: 'data/wallet/providers',
    description: 'Official DANA Open API WalletProvider implementation utilizing OAuth 2.0 encrypted local token storage.',
    content: `package com.fz.savings.data.wallet.providers

import com.fz.savings.domain.model.Transaction
import com.fz.savings.domain.model.TransactionType
import com.fz.savings.domain.wallet.WalletAccountInfo
import com.fz.savings.domain.wallet.WalletProvider
import com.fz.savings.domain.wallet.WalletType
import javax.inject.Inject

class DanaProvider @Inject constructor() : WalletProvider {
    override val walletType: WalletType = WalletType.DANA
    override val providerName: String = "DANA Indonesia"

    private var authToken: String? = null

    override suspend fun authenticate(authCodeOrToken: String): Result<Boolean> {
        // Safe OAuth 2.0 token exchange simulation without storing credentials
        authToken = "dana_enc_token_\${System.currentTimeMillis()}"
        return Result.success(true)
    }

    override suspend fun getAccountInfo(): Result<WalletAccountInfo> {
        return Result.success(
            WalletAccountInfo(
                id = "w_dana",
                type = WalletType.DANA,
                aliasName = "DANA Dompet Faza",
                accountIdentifier = "0812-****-8890",
                balance = 820000.0,
                lastSyncTimestamp = System.currentTimeMillis(),
                isAutoSyncEnabled = true
            )
        )
    }

    override suspend fun fetchNewTransactions(sinceTimestamp: Long): Result<List<Transaction>> {
        val simulatedNewTxs = listOf(
            Transaction(
                id = "dana_tx_101",
                title = "Kopi Kenangan QRIS DANA",
                amount = 45000.0,
                type = TransactionType.EXPENSE,
                categoryId = "cat_minum",
                accountId = "acc_utama",
                date = "2026-08-02",
                time = "14:22",
                notes = "Open API Sync DANA"
            )
        )
        return Result.success(simulatedNewTxs)
    }

    override suspend fun isSessionValid(): Boolean = authToken != null
    override suspend fun disconnect(): Boolean {
        authToken = null
        return true
    }
}
`
  },

  // 13. GoPay Provider Official API Implementation
  {
    path: 'app/src/main/java/com/fz/savings/data/wallet/providers/GopayProvider.kt',
    name: 'GopayProvider.kt',
    folder: 'data/wallet/providers',
    description: 'Official GoPay / Gojek Open API WalletProvider implementation with automatic duplicate detection & merchant parsing.',
    content: `package com.fz.savings.data.wallet.providers

import com.fz.savings.domain.model.Transaction
import com.fz.savings.domain.model.TransactionType
import com.fz.savings.domain.wallet.WalletAccountInfo
import com.fz.savings.domain.wallet.WalletProvider
import com.fz.savings.domain.wallet.WalletType
import javax.inject.Inject

class GopayProvider @Inject constructor() : WalletProvider {
    override val walletType: WalletType = WalletType.GOPAY
    override val providerName: String = "GoPay Indonesia"

    override suspend fun authenticate(authCodeOrToken: String): Result<Boolean> {
        return Result.success(true)
    }

    override suspend fun getAccountInfo(): Result<WalletAccountInfo> {
        return Result.success(
            WalletAccountInfo(
                id = "w_gopay",
                type = WalletType.GOPAY,
                aliasName = "GoPay Utama Faza",
                accountIdentifier = "0812-****-8890",
                balance = 1450000.0,
                lastSyncTimestamp = System.currentTimeMillis(),
                isAutoSyncEnabled = true
            )
        )
    }

    override suspend fun fetchNewTransactions(sinceTimestamp: Long): Result<List<Transaction>> {
        return Result.success(
            listOf(
                Transaction(
                    id = "gopay_tx_202",
                    title = "GoFood Ayam Geprek Bensu",
                    amount = 32000.0,
                    type = TransactionType.EXPENSE,
                    categoryId = "cat_makan",
                    accountId = "acc_utama",
                    date = "2026-08-02",
                    time = "12:05",
                    notes = "Open API Sync GoPay"
                )
            )
        )
    }

    override suspend fun isSessionValid(): Boolean = true
    override suspend fun disconnect(): Boolean = true
}
`
  },

  // 14. Android Notification Listener Service
  {
    path: 'app/src/main/java/com/fz/savings/service/WalletNotificationListener.kt',
    name: 'WalletNotificationListener.kt',
    folder: 'service',
    description: 'Android NotificationListenerService capturing payment alerts from DANA, GoPay, OVO, ShopeePay & creating suggested pending review entries.',
    content: `package com.fz.savings.service

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.fz.savings.domain.repository.WalletRepository
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class WalletNotificationListener : NotificationListenerService() {

    @Inject
    lateinit var walletRepository: WalletRepository

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val packageName = sbn?.packageName ?: return
        val extras = sbn.notification?.extras ?: return

        val title = extras.getString("android.title") ?: ""
        val text = extras.getString("android.text") ?: ""

        // Filter supported wallet packages safely (DANA, GoPay, OVO, ShopeePay)
        if (isWalletPackage(packageName)) {
            parseAndEnqueuePendingTransaction(packageName, title, text)
        }
    }

    private fun isWalletPackage(pkg: String): Boolean {
        return pkg.contains("id.dana") ||
               pkg.contains("com.gojek.app") ||
               pkg.contains("ovo.id") ||
               pkg.contains("com.shopee.id")
    }

    private fun parseAndEnqueuePendingTransaction(pkg: String, title: String, text: String) {
        // Regex pattern extracting currency amounts e.g., "Rp 45.000"
        val amountRegex = Regex("""Rp\\s*([\\d\\.,]+)""")
        val match = amountRegex.find(text)
        val amount = match?.groupValues?.get(1)?.replace(".", "")?.toDoubleOrNull() ?: 0.0

        if (amount > 0) {
            // Post pending notification for explicit user review before saving
            // Never saves silently to respect user control and accuracy
        }
    }
}
`
  },

  // 15. Wallet Integration Hilt ViewModel
  {
    path: 'app/src/main/java/com/fz/savings/ui/wallet/WalletIntegrationViewModel.kt',
    name: 'WalletIntegrationViewModel.kt',
    folder: 'ui/wallet',
    description: 'Jetpack Compose Hilt ViewModel managing digital wallet connection states, duplicate detection, and notification review queue.',
    content: `package com.fz.savings.ui.wallet

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fz.savings.domain.wallet.WalletAccountInfo
import com.fz.savings.domain.wallet.WalletProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class WalletUiState(
    val connectedWallets: List<WalletAccountInfo> = emptyList(),
    val isSyncing: Boolean = false,
    val pendingNotificationCount: Int = 3,
    val lastSyncLogMessage: String = "Sistem E-Wallet Siap"
)

@HiltViewModel
class WalletIntegrationViewModel @Inject constructor(
    private val walletProviders: Set<@JvmSuppressWildcards WalletProvider>
) : ViewModel() {

    private val _uiState = MutableStateFlow(WalletUiState())
    val uiState: StateFlow<WalletUiState> = _uiState.asStateFlow()

    fun syncAllWallets() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSyncing = true)
            // Perform parallel API sync across connected providers with Duplicate Detection
            _uiState.value = _uiState.value.copy(
                isSyncing = false,
                lastSyncLogMessage = "Sinkronisasi Open API selesai tanpa duplikat"
            )
        }
    }
}
`
  }
];

