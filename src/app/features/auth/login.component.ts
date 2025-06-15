import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isSignUp = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const authObservable = this.isSignUp 
      ? this.authService.signUp(this.email, this.password)
      : this.authService.signIn(this.email, this.password);

    authObservable.subscribe({
      next: ({ user, error }) => {
        if (error) {
          this.errorMessage = error.message || 'Authentication failed';
        } else if (user) {
          this.router.navigate(['/add']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'An unexpected error occurred';
        this.isLoading = false;
      }
    });
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }
}