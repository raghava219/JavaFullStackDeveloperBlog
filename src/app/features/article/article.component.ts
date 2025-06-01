import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="article">
      <article class="article-content">
        <h1>{{ article.title }}</h1>
        <div class="meta">
          <span>By {{ article.author }}</span>
          <span>{{ article.readingTime }} min read</span>
          <span>{{ article.createdAt | date }}</span>
        </div>
        <div class="tags">
          <span class="tag" *ngFor="let tag of article.tags">{{ tag }}</span>
        </div>
        <div class="content" [innerHTML]="renderedContent"></div>
      </article>
    </div>
  `,
  styles: [`
    .article-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .meta {
      color: var(--text-secondary);
      margin: 1rem 0;
      display: flex;
      gap: 1rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .content {
      line-height: 1.7;
    }

    .content :deep(h2) {
      margin: 2rem 0 1rem;
    }

    .content :deep(p) {
      margin: 1rem 0;
    }

    .content :deep(pre) {
      background: var(--surface-color);
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
    }
  `]
})
export class ArticleComponent implements OnInit {
  article?: Article;
  renderedContent = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      const slug = params['slug'];
      this.articleService.getArticleBySlug(slug).subscribe(async article => {
        if (article) {
          this.article = article;
          this.renderedContent = await marked.parse(article.content);
        }
      });
    });
  }
}