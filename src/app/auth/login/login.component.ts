import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf
import { AuthService } from '../services/auth.services';
import { SignupComponent } from '../signup/signup.component'; // Importa tu componente de registro

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
    // Mandamos el username en lugar del email
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            alert('Login exitoso 🎉');
            localStorage.setItem('token', response.token);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Error: No se recibió el token del servidor';
          }
        },
        error: (err) => {
          this.errorMessage = 'Credenciales incorrectas';
          console.error('Fallo de autenticación:', err);
        }
      });
  }
}
