import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
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

  private articlesSubject = new BehaviorSubject<Article[]>(this.mockArticles);
  public articles$ = this.articlesSubject.asObservable();

  getArticles(): Observable<Article[]> {
    return this.articles$;
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    return of(this.mockArticles.find((article) => article.slug === slug));
  }

  addArticle(article: Article): void {
    this.mockArticles.push(article);
    this.articlesSubject.next([...this.mockArticles]);
  }

  updateArticle(id: string, updatedArticle: Partial<Article>): void {
    const index = this.mockArticles.findIndex(article => article.id === id);
    if (index !== -1) {
      this.mockArticles[index] = { ...this.mockArticles[index], ...updatedArticle, updatedAt: new Date() };
      this.articlesSubject.next([...this.mockArticles]);
    }
  }

  deleteArticle(id: string): void {
    this.mockArticles = this.mockArticles.filter(article => article.id !== id);
    this.articlesSubject.next([...this.mockArticles]);
  }
}