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

  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Función para cambiar entre formularios sin salir de la página azul
  toggleView() {
    this.isLoginView = !this.isLoginView;
    this.errorMessage = ''; // Limpiamos errores al cambiar
  }

  onLogin() {
    this.authService.login(this.email, this.password)
      .subscribe(users => {
        if (users && users.length > 0) {
          alert('Login exitoso');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Credenciales incorrectas';
        }
      });
  }
}
