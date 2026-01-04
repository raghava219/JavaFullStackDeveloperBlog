import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Article } from '../models/article.model';
import { SupabaseService } from './supabase.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'



@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  // Todo: What is BehaviorSubject?
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  // Todo: What is the use of $ in below varaiable
  // Todo: Read Time is found Time Stamp in List View of Articles, instead of number. 
  public articles$ = this.articlesSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.getArticles().subscribe(articles => {
      this.articlesSubject.next(articles);
    });
  }

  public s3Client = new S3Client({
    forcePathStyle: true,
    region: 'ap-southeast-2',
    endpoint: 'https://sfkxqkimfcoajbvbbfoj.storage.supabase.co/storage/v1/s3',
    credentials: {
      accessKeyId: '37b2ac3cca5fbddd735c0abe93e98711',
      secretAccessKey: 'b42b15ca3ed2f916dfabe72da182cd96c08f835525da3d4c307b57468b2027aa',
    }
  })

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
          console.log('Check your Supabase configuration in .env file');
          return [];
        }
        return (data || []).map(this.mapSupabaseToArticle);
      }),
      catchError(error => {
        console.error('Network error in getArticles:', error);
        console.log('This might be a CORS issue or incorrect Supabase URL');
        // Return empty array instead of throwing to prevent app crash
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
      URL: article.URL,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      tags: article.tags,
      reading_time: article.readingTime,
      featured: article.featured,
      fileName: article.fileName
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
    if (updatedArticle.URL) updateData.URL = updatedArticle.URL;
    if (updatedArticle.slug) updateData.slug = updatedArticle.slug;
    if (updatedArticle.content) updateData.content = updatedArticle.content;
    if (updatedArticle.excerpt) updateData.excerpt = updatedArticle.excerpt;
    if (updatedArticle.author) updateData.author = updatedArticle.author;
    if (updatedArticle.category) updateData.category = updatedArticle.category;
    if (updatedArticle.tags) updateData.tags = updatedArticle.tags;
    if (updatedArticle.readingTime) updateData.reading_time = updatedArticle.readingTime;
    if (updatedArticle.featured !== undefined) updateData.featured = updatedArticle.featured;
    if (updatedArticle.fileName !== undefined) updateData.fileName = updatedArticle.fileName;
    
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
      URL: data.URL,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      category: data.category || [],
      tags: data.tags || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      readingTime: data.reading_time,
      featured: data.featured,
      fileName: data.fileName
    };
  }

  

}