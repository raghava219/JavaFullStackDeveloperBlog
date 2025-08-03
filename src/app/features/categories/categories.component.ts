import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categeories.component.html' ,
  styleUrl: './categories.component.css'
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