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
      import('./app/features/categories/categories.component').then(m => m.CategoriesComponent)
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
      import('./app/features/tags/tags.component').then(m => m.TagsComponent)
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
          <a routerLink="/" class="logo">Data Management System Pvt. Ltd.</a>
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
        <p>© 2025 Data Management Systems Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: var(--surface-color);
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    nav {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-links a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--primary-color);
    }

    .add-btn {
      background: var(--primary-color);
      color: white !important;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
    }

    .add-btn:hover {
      opacity: 0.9;
    }

    .auth-btn {
      background: var(--border-color);
      color: var(--text-color) !important;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .auth-btn:hover {
      opacity: 0.9;
    }

    .theme-toggle {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
    }

    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      width: 100%;
    }

    .footer {
      background: var(--surface-color);
      padding: 1rem;
      text-align: center;
      color: var(--text-color);
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
      }
      
      .nav-links a, .auth-btn {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
      }
    }
  `]
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