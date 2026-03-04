import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.services';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, SignupComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoginView = true;

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleView() {
    this.isLoginView = !this.isLoginView;
    this.errorMessage = '';
  }

  onLogin() {

    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            alert('Login exitoso 🎉');
            localStorage.setItem('token', response.token);

            // CAMBIA ESTO:
            this.router.navigate(['/simulador']);
          } else {
            this.errorMessage = 'Error: No se recibió el token';
          }
        },
        error: (err) => {
          this.errorMessage = 'Credenciales incorrectas';
          console.error('Fallo de autenticación:', err);
        }
      });
  }
}
