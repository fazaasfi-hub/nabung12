package com.fzsavings.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.fzsavings.app.presentation.viewmodel.SavingsViewModel
import com.fzsavings.app.ui.screens.*

@Composable
fun AppNavigation(
    navController: NavHostController,
    viewModel: SavingsViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(navController = navController)
        }
        composable(Screen.Onboarding.route) {
            OnboardingScreen(navController = navController)
        }
        composable(Screen.Login.route) {
            LoginRegisterScreen(navController = navController)
        }
        composable(Screen.Dashboard.route) {
            DashboardScreen(viewModel = viewModel)
        }
    }
}
