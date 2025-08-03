import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'list-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.css'
})
export class ArticleListComponent implements OnInit {
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