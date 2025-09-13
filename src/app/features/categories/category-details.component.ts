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
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
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