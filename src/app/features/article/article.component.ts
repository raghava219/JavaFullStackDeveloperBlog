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