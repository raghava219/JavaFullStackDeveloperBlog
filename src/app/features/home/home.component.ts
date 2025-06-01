import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Latest Articles</h1>
      <div class="articles-grid">
        <article *ngFor="let article of articles" class="card">
          <h2>{{ article.title }}</h2>
          <p class="meta">
            By {{ article.author }} • {{ article.readingTime }} min read {{ article.createdAt | date  }}
          </p>
          <p class="excerpt">{{ article.excerpt }}</p>
          <a [routerLink]="['/articles', article.slug]" class="btn">Read More</a>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .meta {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .excerpt {
      margin: 1rem 0;
      color: var(--text-color);
    }
  `]
})
export class HomeComponent {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {
    this.articleService.getArticles().subscribe(
      articles => this.articles = articles
    );
  }
}