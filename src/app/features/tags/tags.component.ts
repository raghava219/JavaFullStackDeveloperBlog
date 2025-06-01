import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="page-title">Tags</h1>
      <div class="tags-cloud">
        <span *ngFor="let tag of tags$ | async" 
              class="tag"
              [style.fontSize.rem]="getTagSize(tag.count)">
          {{ tag.name }}
          <span class="tag-count">({{ tag.count }})</span>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-color);
    }

    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 2rem;
      background: var(--surface-color);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .tag {
      color: var(--primary-color);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      background: var(--background-color);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .tag:hover {
      transform: scale(1.05);
    }

    .tag-count {
      color: var(--text-secondary);
      font-size: 0.8em;
    }
  `]
})
export class TagsComponent {
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