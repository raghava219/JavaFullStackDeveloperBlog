import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';

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
          <a routerLink="/" class="logo">Java Full Stack Developer</a>
          <div class="nav-links">
            <a routerLink="/categories">Categories</a>
            <a routerLink="/tags">Tags</a>
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
        <p>© 2025 DevBlog. All rights reserved.</p>
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
  `]
})
export class App {
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
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