import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {   
  private mockArticles: Article[] = [
    {
      id: '1',
      title: 'Getting Started with Angular 18',
      slug: 'getting-started-with-angular-18',
      content: `Angular 18 introduces several key features including zoneless change detection with Signals, dynamic route redirects, enhanced form control state events, and Firebase app hosting integration.`,
      excerpt: 'Learn about the latest features in Angular 18',
      author: 'John Doe',
      categories: ['Angular'],
      tags: ['angular', 'typescript', 'web-development', 'Java'],
      createdAt: new Date(),
      updatedAt: new Date(),
      readingTime: 5,
      featured: true,
    },
    {
      id: '2',
      title: 'Getting Started with Java 17',
      slug: 'getting-started-with-angular-17',
      content: `Java 17, an LTS release, brings enhanced security, performance improvements, and new language features like Sealed Classes and Pattern Matching for switch, simplifying modern Java development.`,
      excerpt: 'Learn about the latest features in Java 17',
      author: 'Raghava',
      categories: ['Java'],
      tags: ['angular', 'typescript', 'web-development', 'Java'],
      createdAt: new Date(),
      updatedAt: new Date(),
      readingTime: 5,
      featured: true,
    },
  ];

  getArticles(): Observable<Article[]> {
    return of(this.mockArticles);
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    return of(this.mockArticles.find((article) => article.slug === slug));
  }
}
