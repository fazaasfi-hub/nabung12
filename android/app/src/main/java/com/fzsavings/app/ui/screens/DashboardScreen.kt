package com.fzsavings.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fzsavings.app.domain.model.*
import com.fzsavings.app.presentation.viewmodel.SavingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(viewModel: SavingsViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    val accounts by viewModel.accounts.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    val deletedTransactions by viewModel.deletedTransactions.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val goals by viewModel.goals.collectAsState()
    val wishlists by viewModel.wishlists.collectAsState()
    val budgets by viewModel.budgets.collectAsState()
    val wallets by viewModel.wallets.collectAsState()
    val pendingNotifs by viewModel.pendingNotifs.collectAsState()
    val syncLogs by viewModel.syncLogs.collectAsState()
    val settings by viewModel.settings.collectAsState()
    val profile by viewModel.profile.collectAsState()

    // Dialog sheets state
    var showAddTxDialog by remember { mutableStateOf(false) }
    var showAddAccDialog by remember { mutableStateOf(false) }
    var showAddGoalDialog by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Text("🏠", fontSize = 20.sp) },
                    label = { Text("Beranda") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Text("💸", fontSize = 20.sp) },
                    label = { Text("Transaksi") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Text("🎯", fontSize = 20.sp) },
                    label = { Text("Target") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Text("📊", fontSize = 20.sp) },
                    label = { Text("Anggaran") }
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Text("🔌", fontSize = 20.sp) },
                    label = { Text("Koneksi") }
                )
            }
        },
        floatingActionButton = {
            if (selectedTab == 0 || selectedTab == 1) {
                FloatingActionButton(
                    onClick = { showAddTxDialog = true },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ) {
                    Text("+", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> BerandaTab(
                    profile = profile,
                    accounts = accounts,
                    transactions = transactions,
                    categories = categories,
                    onAddAccountClick = { showAddAccDialog = true }
                )
                1 -> TransaksiTab(
                    transactions = transactions,
                    deletedTransactions = deletedTransactions,
                    categories = categories,
                    onDeleteTx = { viewModel.softDeleteTransaction(it) },
                    onRestoreTx = { viewModel.restoreTransaction(it) }
                )
                2 -> TargetTab(
                    goals = goals,
                    wishlists = wishlists,
                    onDepositGoal = { id, amt -> viewModel.depositToGoal(id, amt) },
                    onDepositWishlist = { id, amt -> viewModel.depositToWishlist(id, amt) },
                    onAddGoalClick = { showAddGoalDialog = true }
                )
                3 -> AnggaranTab(
                    budgets = budgets,
                    categories = categories,
                    onUpdateBudget = { catId, lim -> viewModel.updateBudget(catId, lim, 0.0) }
                )
                4 -> KoneksiTab(
                    profile = profile,
                    wallets = wallets,
                    pendingNotifs = pendingNotifs,
                    syncLogs = syncLogs,
                    settings = settings,
                    categories = categories,
                    onSyncWallet = { viewModel.syncWallet(it) },
                    onAcceptNotif = { id, cat -> viewModel.acceptNotification(id, cat) },
                    onRejectNotif = { viewModel.rejectNotification(it) },
                    onToggleListener = { id, act -> viewModel.toggleWalletNotification(id, act) },
                    onReset = { viewModel.resetData() }
                )
            }
        }

        // TAMBAH TRANSAKSI DIALOG
        if (showAddTxDialog) {
            AddTransactionDialog(
                accounts = accounts,
                categories = categories,
                onDismiss = { showAddTxDialog = false },
                onAdd = { title, amt, type, catId, accId, targetAcc, notes ->
                    viewModel.addTransaction(title, amt, type, catId, accId, targetAcc, notes)
                    showAddTxDialog = false
                }
            )
        }

        // TAMBAH REKENING DIALOG
        if (showAddAccDialog) {
            AddAccountDialog(
                onDismiss = { showAddAccDialog = false },
                onAdd = { name, bal, color, type, num, bank ->
                    viewModel.addAccount(name, bal, color, type, num, bank)
                    showAddAccDialog = false
                }
            )
        }

        // TAMBAH TARGET DIALOG
        if (showAddGoalDialog) {
            AddGoalDialog(
                onDismiss = { showAddGoalDialog = false },
                onAdd = { title, target, date, color ->
                    viewModel.addGoal(title, target, date, color)
                    showAddGoalDialog = false
                }
            )
        }
    }
}

// 1. BERANDA TAB
@Composable
fun BerandaTab(
    profile: UserProfile,
    accounts: List<SavingsAccount>,
    transactions: List<Transaction>,
    categories: List<Category>,
    onAddAccountClick: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcoming Card
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Halo, ${profile.name}",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Ayo kelola tabungan dan impianmu hari ini!",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text("👤", fontSize = 20.sp)
                }
            }
        }

        // Revolut-Style Total Savings Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text(
                        "Total Saldo Tabungan",
                        color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Rp " + String.format("%,.2f", profile.totalSavings),
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${accounts.size} Akun Terhubung",
                            color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.9f),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.15f))
                                .clickable { onAddAccountClick() }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                "+ Tambah",
                                color = MaterialTheme.colorScheme.onPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Savings Accounts horizontal lists
        item {
            Text(
                "Rekening Tabungan",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        items(accounts) { acc ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(android.graphics.Color.parseColor(acc.colorHex))),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("💳", fontSize = 18.sp)
                        }
                        Column {
                            Text(
                                acc.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                "${acc.bankName} • ${acc.accountNumber}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                    Text(
                        text = "Rp " + String.format("%,.0f", acc.balance),
                        fontWeight = FontWeight.Black,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }

        // Recent transactions heading
        item {
            Text(
                "Transaksi Terakhir",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        // Show last 3 transactions
        val recentTxs = transactions.take(3)
        if (recentTxs.isEmpty()) {
            item {
                Text(
                    "Belum ada transaksi terdaftar.",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            items(recentTxs) { tx ->
                TransactionRow(tx = tx, categories = categories)
            }
        }
    }
}

// 2. TRANSAKSI TAB
@Composable
fun TransaksiTab(
    transactions: List<Transaction>,
    deletedTransactions: List<Transaction>,
    categories: List<Category>,
    onDeleteTx: (String) -> Unit,
    onRestoreTx: (String) -> Unit
) {
    var showTrash by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (showTrash) "Riwayat Terhapus (Sampah)" else "Semua Transaksi",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            TextButton(onClick = { showTrash = !showTrash }) {
                Text(if (showTrash) "Lihat Aktif" else "Lihat Sampah (${deletedTransactions.size})")
            }
        }

        val displayList = if (showTrash) deletedTransactions else transactions

        if (displayList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "Kosong",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(displayList) { tx ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                modifier = Modifier.weight(1f),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    if (tx.type == "INCOME") "📈" else "📉",
                                    fontSize = 24.sp
                                )
                                Column {
                                    Text(
                                        tx.title,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        "${tx.date} • ${tx.time}",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = (if (tx.type == "INCOME") "+" else "-") + "Rp " + String.format("%,.0f", tx.amount),
                                    fontWeight = FontWeight.Black,
                                    fontSize = 13.sp,
                                    color = if (tx.type == "INCOME") Color(0xFF10B981) else Color(0xFFEF4444)
                                )
                                if (showTrash) {
                                    Button(
                                        onClick = { onRestoreTx(tx.id) },
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text("Restore", fontSize = 10.sp)
                                    }
                                } else {
                                    IconButton(onClick = { onDeleteTx(tx.id) }) {
                                        Text("🗑️", fontSize = 14.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 3. TARGET TAB
@Composable
fun TargetTab(
    goals: List<Goal>,
    wishlists: List<Wishlist>,
    onDepositGoal: (String, Double) -> Unit,
    onDepositWishlist: (String, Double) -> Unit,
    onAddGoalClick: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Target Tabungan (Goals)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primary)
                    .clickable { onAddGoalClick() }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text(
                    "+ Target",
                    color = MaterialTheme.colorScheme.onPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        if (goals.isEmpty()) {
            item {
                Text("Belum ada target tabungan.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            items(goals) { g ->
                val progress = (g.currentAmount / g.targetAmount).toFloat().coerceIn(0f, 1f)
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(g.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(g.status, color = MaterialTheme.colorScheme.primary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = progress,
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape),
                            color = Color(android.graphics.Color.parseColor(g.colorHex))
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Rp ${String.format("%,.0f", g.currentAmount)} / Rp ${String.format("%,.0f", g.targetAmount)}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(MaterialTheme.colorScheme.primaryContainer)
                                    .clickable { onDepositGoal(g.id, 500000.0) }
                                    .padding(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text("+ Rp 500k", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                            }
                        }
                    }
                }
            }
        }

        // Wishlists
        item {
            Text(
                "Daftar Keinginan (Wishlist)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        if (wishlists.isEmpty()) {
            item {
                Text("Wishlist kosong.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            items(wishlists) { w ->
                val progress = (w.savedAmount / w.price).toFloat().coerceIn(0f, 1f)
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(w.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Prioritas: ${w.priority}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = progress,
                            modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape),
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Terkumpul: Rp ${String.format("%,.0f", w.savedAmount)} / Rp ${String.format("%,.0f", w.price)}",
                                fontSize = 11.sp
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(MaterialTheme.colorScheme.primary)
                                    .clickable { onDepositWishlist(w.id, 100000.0) }
                                    .padding(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text("+ Rp 100k", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimary)
                            }
                        }
                    }
                }
            }
        }
    }
}

// 4. ANGGARAN TAB
@Composable
fun AnggaranTab(
    budgets: List<CategoryBudget>,
    categories: List<Category>,
    onUpdateBudget: (String, Double) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "Batas Anggaran Kategori (Monthly)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        if (budgets.isEmpty()) {
            item {
                Text("Belum ada batas anggaran.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            items(budgets) { b ->
                val cat = categories.find { it.id == b.categoryId }
                val progress = (b.spentAmount / b.limitAmount).toFloat().coerceIn(0f, 1f)
                val alertColor = if (progress > 0.9f) Color(0xFFEF4444) else if (progress > 0.75f) Color(0xFFF59E0B) else Color(0xFF10B981)

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(cat?.name ?: "Kategori", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(
                                "${(progress * 100).toInt()}% Terpakai",
                                color = alertColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = progress,
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape),
                            color = alertColor
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Limit: Rp ${String.format("%,.0f", b.limitAmount)} | Pengeluaran: Rp ${String.format("%,.0f", b.spentAmount)}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

// 5. KONEKSI TAB
@Composable
fun KoneksiTab(
    profile: UserProfile,
    wallets: List<ConnectedWallet>,
    pendingNotifs: List<PendingWalletNotification>,
    syncLogs: List<SyncLogEntry>,
    settings: AppSettings,
    categories: List<Category>,
    onSyncWallet: (String) -> Unit,
    onAcceptNotif: (String, String) -> Unit,
    onRejectNotif: (String) -> Unit,
    onToggleListener: (String, Boolean) -> Unit,
    onReset: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Connected Wallets
        item {
            Text(
                "E-Wallet & Open API Perbankan",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        items(wallets) { w ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(w.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Tipe: ${w.type} • Terkoneksi", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.primary)
                                .clickable { onSyncWallet(w.id) }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("Sync API", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimary)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "Saldo API: Rp ${String.format("%,.0f", w.balance)}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                    Text(
                        "Last Sync: ${w.lastSync}",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // Mock notifications to accept/reject
        item {
            Text(
                "Persetujuan Notifikasi Transaksi",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        if (pendingNotifs.isEmpty()) {
            item {
                Text("Semua notifikasi terproses.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            items(pendingNotifs) { n ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            "Transaksi Baru: ${n.walletName}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            "Merchant: ${n.merchant}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            "Nominal: Rp ${String.format("%,.0f", n.amount)} | ${n.date} ${n.time}",
                            fontSize = 12.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { onAcceptNotif(n.id, n.suggestedCategoryId) },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text("Setujui", fontSize = 11.sp)
                            }
                            OutlinedButton(
                                onClick = { onRejectNotif(n.id) },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text("Abaikan", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }
        }

        // General settings options
        item {
            Text(
                "Pengaturan & Sistem",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        item {
            Button(
                onClick = { onReset() },
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Reset Semua Data Aplikasi", color = MaterialTheme.colorScheme.onError, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// WIDGET COMPONENTS
@Composable
fun TransactionRow(tx: Transaction, categories: List<Category>) {
    val cat = categories.find { it.id == tx.categoryId }
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    if (tx.type == "INCOME") "📈" else "📉",
                    fontSize = 20.sp
                )
                Column {
                    Text(
                        tx.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        cat?.name ?: "Umum",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Text(
                text = (if (tx.type == "INCOME") "+" else "-") + " Rp " + String.format("%,.0f", tx.amount),
                fontWeight = FontWeight.Black,
                fontSize = 13.sp,
                color = if (tx.type == "INCOME") Color(0xFF10B981) else Color(0xFFEF4444)
            )
        }
    }
}

@Composable
fun AddTransactionDialog(
    accounts: List<SavingsAccount>,
    categories: List<Category>,
    onDismiss: () -> Unit,
    onAdd: (String, Double, String, String, String, String?, String?) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("EXPENSE") }
    var catId by remember { mutableStateOf(categories.firstOrNull()?.id ?: "") }
    var accId by remember { mutableStateOf(accounts.firstOrNull()?.id ?: "") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = {
                    val amtVal = amount.toDoubleOrNull() ?: 0.0
                    if (title.isNotBlank() && amtVal > 0.0) {
                        onAdd(title, amtVal, type, catId, accId, null, notes)
                    }
                }
            ) {
                Text("Tambah")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Batal")
            }
        },
        title = { Text("Tambah Transaksi Baru") },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Deskripsi / Judul") },
                    singleLine = true
                )
                OutlinedTextField(
                    value = amount,
                    onValueChange = { amount = it },
                    label = { Text("Nominal (IDR)") },
                    singleLine = true
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { type = "EXPENSE" },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (type == "EXPENSE") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Text("Pengeluaran")
                    }
                    Button(
                        onClick = { type = "INCOME" },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (type == "INCOME") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Text("Pemasukan")
                    }
                }
            }
        }
    )
}

@Composable
fun AddAccountDialog(
    onDismiss: () -> Unit,
    onAdd: (String, Double, String, String, String, String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var balance by remember { mutableStateOf("") }
    var num by remember { mutableStateOf("") }
    var bank by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = {
                    val balVal = balance.toDoubleOrNull() ?: 0.0
                    if (name.isNotBlank() && balVal >= 0.0) {
                        onAdd(name, balVal, "#6C4CF5", "UTAMA", num, bank)
                    }
                }
            ) {
                Text("Simpan")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Batal")
            }
        },
        title = { Text("Tambah Akun Rekening") },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Nama Rekening") })
                OutlinedTextField(value = balance, onValueChange = { balance = it }, label = { Text("Saldo Awal (IDR)") })
                OutlinedTextField(value = bank, onValueChange = { bank = it }, label = { Text("Nama Bank") })
                OutlinedTextField(value = num, onValueChange = { num = it }, label = { Text("Nomor Rekening") })
            }
        }
    )
}

@Composable
fun AddGoalDialog(
    onDismiss: () -> Unit,
    onAdd: (String, Double, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var target by remember { mutableStateOf("") }
    var date by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = {
                    val tgtVal = target.toDoubleOrNull() ?: 0.0
                    if (title.isNotBlank() && tgtVal > 0.0) {
                        onAdd(title, tgtVal, date, "#6C4CF5")
                    }
                }
            ) {
                Text("Tambah")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Batal")
            }
        },
        title = { Text("Buat Target Tabungan Baru") },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Nama Target") })
                OutlinedTextField(value = target, onValueChange = { target = it }, label = { Text("Nominal Target (IDR)") })
                OutlinedTextField(value = date, onValueChange = { date = it }, label = { Text("Tanggal Target (YYYY-MM-DD)") })
            }
        }
    )
}
