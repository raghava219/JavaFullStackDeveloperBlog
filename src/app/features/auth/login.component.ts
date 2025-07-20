import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

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
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.authService.signIn(this.email, this.password).subscribe({
        next: ({ user, error }: { user: User | null; error: any }) => {
          if (error) {
            this.errorMessage = error.message || 'Authentication failed';
          } else if (user) {
            this.router.navigate(['/add']);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'An unexpected error occurred';
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.errorMessage = 'Verification failed. Please try again.';
      this.isLoading = false;
    }
  }
}