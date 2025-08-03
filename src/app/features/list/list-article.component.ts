import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'list-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.css'
})
export class ArticleListComponent {
  
  tags$: Observable<{ name: string; count: number }[]>;

  constructor(private articleService: ArticleService) {
    this.tags$ = this.articleService.getArticles().pipe(
      map(articles => this.getTagCount(articles))
    );
  }

  private getTagCount(articles: Article[]): { name: string; count: number }[] {
    const tagCount = new Map<string, number>();
    
    articles.forEach(article => {
      article.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCount.entries()).map(([name, count]) => ({ name, count }));
  }

  getTagSize(count: number): number {
    // Scale tag size between 1rem and 2rem based on count
    const minSize = 1;
    const maxSize = 2;
    const scale = (count - 1) / 10; // Adjust divisor to control scaling
    return Math.max(minSize, Math.min(maxSize, minSize + scale));
  }
}