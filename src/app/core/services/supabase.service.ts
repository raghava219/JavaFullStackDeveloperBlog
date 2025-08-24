import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          author: string;
          categories: string[];
          tags: string[];
          created_at: string;
          updated_at: string;
          reading_time: number;
          featured: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          author: string;
          categories: string[];
          tags: string[];
          created_at?: string;
          updated_at?: string;
          reading_time: number;
          featured?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          author?: string;
          categories?: string[];
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          reading_time?: number;
          featured?: boolean;
        };
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    // Validate environment variables
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      console.error('Supabase configuration missing. Please check your environment variables.');
      console.log('Current config:', {
        url: environment.supabaseUrl,
        key: environment.supabaseAnonKey ? 'Present' : 'Missing'
      });
    }

    // Custom storage object that bypasses LockManager API
    const customStorage = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    };

    this.supabase = createClient<Database>(
      environment.supabaseUrl || 'https://placeholder.supabase.co',
      environment.supabaseAnonKey || 'placeholder-key',
      {
        auth: {
          storage: customStorage,
          persistSession: true,
          autoRefreshToken: false
        },
        global: {
          headers: {
            'Content-Type': 'application/json',
          }
        },
        db: {
          schema: 'public'
        }
      }
    );
  }

  get client() {
    return this.supabase;
  }

  // Method to test connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('articles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }
}