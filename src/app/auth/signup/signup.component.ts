import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../services/auth.services';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  @Output() cancel = new EventEmitter<void>();

  user: User = {
    name: '',
    dni: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}


  goBack() {
    this.cancel.emit();
  }

  onSignup() {
    this.authService.signup(this.user).subscribe({
      next: (response) => {
        alert('¡Usuario creado con éxito! 🎉');
        console.log('Datos guardados en db.json:', response);

        this.user = { name: '', dni: '', email: '', password: '' };


        this.goBack();
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert('Hubo un error al crear la cuenta. Revisa si el json-server está encendido.');
      }
    });
  }
}

