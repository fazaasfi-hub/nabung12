package com.fzsavings.app.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.fzsavings.app.ui.navigation.Screen
import kotlinx.coroutines.launch

data class OnboardingPage(
    val title: String,
    val description: String,
    val bgChar: String
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun OnboardingScreen(navController: NavController) {
    val pages = listOf(
        OnboardingPage(
            "Kelola Tabungan Praktis",
            "Atur rekening tabungan, dompet digital, dan portofolio investasi dalam satu dashboard modern dan terintegrasi.",
            "💰"
        ),
        OnboardingPage(
            "Pantau Target & Impian",
            "Buat target tabungan (Goals) dan daftar keinginan (Wishlist). Setor berkala dan raih semua barang impianmu.",
            "🎯"
        ),
        OnboardingPage(
            "Koneksi Resmi Bank API",
            "Tautkan akun e-wallet & bank dengan API resmi yang aman. Sinkronisasi mutasi dan terima notifikasi transaksi instan.",
            "⚡"
        )
    )

    val pagerState = rememberPagerState(pageCount = { pages.size })
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Indicator dots
                Row(
                    modifier = Modifier.padding(bottom = 24.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    repeat(pages.size) { index ->
                        val isSelected = pagerState.currentPage == index
                        Box(
                            modifier = Modifier
                                .size(if (isSelected) 12.dp else 8.dp)
                                .clip(CircleShape)
                                .background(
                                    if (isSelected) MaterialTheme.colorScheme.primary
                                    else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
                                )
                        )
                    }
                }

                // CTA Button
                Button(
                    onClick = {
                        if (pagerState.currentPage < pages.size - 1) {
                            coroutineScope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage + 1)
                            }
                        } else {
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Onboarding.route) { inclusive = true }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    ),
                    shape = MaterialTheme.shapes.large
                ) {
                    Text(
                        text = if (pagerState.currentPage == pages.size - 1) "Mulai Sekarang" else "Lanjutkan",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                }

                if (pagerState.currentPage < pages.size - 1) {
                    TextButton(
                        onClick = {
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Onboarding.route) { inclusive = true }
                            }
                        },
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text(
                            "Lewati",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                } else {
                    Spacer(modifier = Modifier.height(48.dp))
                }
            }
        }
    ) { padding ->
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) { position ->
            val page = pages[position]
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Illustrated Emoji circle
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .background(
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = page.bgChar,
                        fontSize = 72.sp
                    )
                }

                Spacer(modifier = Modifier.height(48.dp))

                Text(
                    text = page.title,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = page.description,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp
                )
            }
        }
    }
}
