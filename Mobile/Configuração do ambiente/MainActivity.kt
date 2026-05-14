package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.myapplication.ui.theme.MyApplicationTheme
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    // Exibindo a tela de Login no lugar do antigo Greeting
                    Column(modifier = Modifier.padding(innerPadding)) {
                        LoginUI()
                    }
                }
            }
        }
    }
}

@Composable
fun LoginUI() {
    // É necessário importar getValue e setValue para usar o 'by'
    var email by remember { mutableStateOf("") }
    var senha by remember { mutableStateOf("") }

    // Layout da tela
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Titulo
        Text(
            text = "Login",
            // Material 3 usa headlineMedium no lugar de h4
            style = MaterialTheme.typography.headlineMedium, 
            modifier = Modifier.padding(bottom = 32.dp)
        )

        // Campo de entrada para email
        TextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            placeholder = { Text("Digite seu email") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        Spacer(modifier = Modifier.height(16.dp))
// Campo de entrada para senha
        TextField(
            value = senha,
            onValueChange = { senha = it },
            label = { Text("Senha") },
            placeholder = { Text("Digite sua senha") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation()
        )
        Spacer(modifier = Modifier.height(32.dp))

        // Botao de login
        Button(
            onClick = { /* Logica de autenticacao */ },
            modifier = Modifier.fillMaxWidth(),
            // Material 3 usa containerColor no lugar de backgroundColor
            colors = ButtonDefaults.buttonColors(containerColor = Color.Blue) 
        ) {
            Text(text = "Entrar")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginPreview() {
    MyApplicationTheme {
        LoginUI()
    }
}