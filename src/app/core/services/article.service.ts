import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Article } from '../models/article.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.getArticles().subscribe(articles => {
      this.articlesSubject.next(articles);
    });
  }

  getArticles(): Observable<Article[]> {
    return from(
      this.supabase.client
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching articles:', error);
          return [];
        }
        return (data || []).map(this.mapSupabaseToArticle);
      }),
      catchError(error => {
        console.error('Error in getArticles:', error);
        return [];
      })
    );
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    return from(
      this.supabase.client
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching article by slug:', error);
          return undefined;
        }
        return data ? this.mapSupabaseToArticle(data) : undefined;
      }),
      catchError(error => {
        console.error('Error in getArticleBySlug:', error);
        return [undefined];
      })
    );
  }

  addArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Observable<Article | null> {
    const articleData = {
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      categories: article.categories,
      tags: article.tags,
      reading_time: article.readingTime,
      featured: article.featured
    };

    return from(
      this.supabase.client
        .from('articles')
        .insert(articleData)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error adding article:', error);
          throw error;
        }
        const newArticle = data ? this.mapSupabaseToArticle(data) : null;
        if (newArticle) {
          // Update local state
          const currentArticles = this.articlesSubject.value;
          this.articlesSubject.next([newArticle, ...currentArticles]);
        }
        return newArticle;
      }),
      catchError(error => {
        console.error('Error in addArticle:', error);
        throw error;
      })
    );
  }

  updateArticle(id: string, updatedArticle: Partial<Article>): Observable<Article | null> {
    const updateData: any = {};
    
    if (updatedArticle.title) updateData.title = updatedArticle.title;
    if (updatedArticle.slug) updateData.slug = updatedArticle.slug;
    if (updatedArticle.content) updateData.content = updatedArticle.content;
    if (updatedArticle.excerpt) updateData.excerpt = updatedArticle.excerpt;
    if (updatedArticle.author) updateData.author = updatedArticle.author;
    if (updatedArticle.categories) updateData.categories = updatedArticle.categories;
    if (updatedArticle.tags) updateData.tags = updatedArticle.tags;
    if (updatedArticle.readingTime) updateData.reading_time = updatedArticle.readingTime;
    if (updatedArticle.featured !== undefined) updateData.featured = updatedArticle.featured;
    
    updateData.updated_at = new Date().toISOString();

    return from(
      this.supabase.client
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error updating article:', error);
          throw error;
        }
        const article = data ? this.mapSupabaseToArticle(data) : null;
        if (article) {
          // Update local state
          const currentArticles = this.articlesSubject.value;
          const updatedArticles = currentArticles.map(a => a.id === id ? article : a);
          this.articlesSubject.next(updatedArticles);
        }
        return article;
      }),
      catchError(error => {
        console.error('Error in updateArticle:', error);
        throw error;
      })
    );
  }

  deleteArticle(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('articles')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          console.error('Error deleting article:', error);
          throw error;
        }
        // Update local state
        const currentArticles = this.articlesSubject.value;
        const filteredArticles = currentArticles.filter(a => a.id !== id);
        this.articlesSubject.next(filteredArticles);
        return true;
      }),
      catchError(error => {
        console.error('Error in deleteArticle:', error);
        throw error;
      })
    );
  }

  private mapSupabaseToArticle(data: any): Article {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      categories: data.categories || [],
      tags: data.tags || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      readingTime: data.reading_time,
      featured: data.featured
    };
  }
}