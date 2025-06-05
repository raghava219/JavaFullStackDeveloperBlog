import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1 class="page-title">{{ categoryName }}</h1>
      <div class="articles-grid">
        <article *ngFor="let article of articles" class="card">
          <h2>{{ article.title }}</h2>
          <p class="meta">
            By {{ article.author }} • {{ article.readingTime }} min read • {{ article.createdAt | date }}
          </p>
          <p class="excerpt">{{ article.excerpt }}</p>
          <a [routerLink]="['/articles', article.slug]" class="btn">Read More</a>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-color);
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
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
export class CategoryDetailsComponent implements OnInit {
  categoryName: string = '';
  articles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.categoryName = this.route.snapshot.params['name'];
    this.articleService.getArticles().subscribe(articles => {
      this.articles = articles.filter(article => 
        article.categories.includes(this.categoryName)
      );
    });
  }
}