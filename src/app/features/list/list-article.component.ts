import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'list-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.css'
})
export class ArticleListComponent implements OnInit {
  
  articles$: Observable<Article[]>;
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {
    this.articles$ = this.articleService.getArticles();
  }

  ngOnInit() {
    this.articles$.subscribe(articles => {
      this.articles = articles;
    });
  }
}