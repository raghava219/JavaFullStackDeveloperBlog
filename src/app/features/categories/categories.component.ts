import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="page-title">Categories</h1>
      <div class="categories-grid">
        <div *ngFor="let category of categories$ | async" class="category-card">
          <h2>{{ category.name }}</h2>
          <p>{{ category.count }} articles</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-color);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: var(--surface-color);
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .category-card h2 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .category-card p {
      color: var(--text-secondary);
    }
  `]
})
export class CategoriesComponent {
  categories$: Observable<{ name: string; count: number }[]>;

  constructor(private articleService: ArticleService) {
    this.categories$ = this.articleService.getArticles().pipe(
      map(articles => this.getCategoryCount(articles))
    );
  }

  private getCategoryCount(articles: Article[]): { name: string; count: number }[] {
    const categoryCount = new Map<string, number>();
    
    articles.forEach(article => {
      article.categories.forEach(category => {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryCount.entries()).map(([name, count]) => ({ name, count }));
  }
}