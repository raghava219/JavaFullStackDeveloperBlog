import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { AuthGuard } from './app/core/guards/auth.guard';
import { AuthService } from './app/core/services/auth.service';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./app/features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'articles/:slug',
    loadComponent: () => 
      import('./app/features/article/article.component').then(m => m.ArticleComponent)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./app/features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'categories/:name',
    loadComponent: () =>
      import('./app/features/categories/category-details.component').then(m => m.CategoryDetailsComponent)
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('./app/features/list/list-article.component').then(m => m.ArticleListComponent)
  }, 
  {
    path: 'login',
    loadComponent: () =>
      import('./app/features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./app/features/add/add.component').then(m => m.AddComponent),
    canActivate: [AuthGuard]
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header class="header">
        <nav>
          <a routerLink="/" class="logo">Data Management Blog</a>
          <div class="nav-links">
            <a routerLink="/categories">Categories</a>
            <a routerLink="/tags">Tags</a>
            <a routerLink="/add" class="add-btn">Add Article</a>
            <button *ngIf="authService.isAuthenticated" (click)="signOut()" class="auth-btn">
              Sign Out
            </button>
            <a *ngIf="!authService.isAuthenticated" routerLink="/login" class="auth-btn">
              Sign In
            </a>
            <button class="theme-toggle" (click)="toggleTheme()">
              {{ isDarkMode ? '🌞' : '🌙' }}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>© 2025 Data Management Blog All rights reserved.</p>
      </footer>
    </div>
  `,
  styleUrl: './global_styles.css'
})
export class App {
  isDarkMode = false;

  constructor(public authService: AuthService) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  signOut() {
    this.authService.signOut().subscribe({
      next: ({ error }) => {
        if (error) {
          console.error('Sign out error:', error);
        }
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideStore(),
    provideStoreDevtools(),
    provideEffects(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));