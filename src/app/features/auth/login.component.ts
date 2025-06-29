import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaV3Module],
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
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Execute reCAPTCHA
      const captchaToken = await this.recaptchaV3Service.execute('login').toPromise();
      
      const authObservable = this.isSignUp 
        ? this.authService.signUp(this.email, this.password, captchaToken)
        : this.authService.signIn(this.email, this.password, captchaToken);

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
    } catch (error) {
      this.errorMessage = 'reCAPTCHA verification failed. Please try again.';
      this.isLoading = false;
    }
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }
}