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
  templateURL: article.component.html,
  stylesURL: article.component.css
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