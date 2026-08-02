package com.fzsavings.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.fzsavings.app.data.local.SavingsDatabase
import com.fzsavings.app.data.repository.SavingsRepositoryImpl
import com.fzsavings.app.presentation.viewmodel.SavingsViewModel
import com.fzsavings.app.ui.navigation.AppNavigation
import com.fzsavings.app.ui.theme.FZSavingsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Local Storage Database
        val database = SavingsDatabase.getInstance(applicationContext)
        val repository = SavingsRepositoryImpl(database.dao)
        val viewModel = SavingsViewModel(repository)

        setContent {
            FZSavingsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavigation(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
            }
        }
    }
}
