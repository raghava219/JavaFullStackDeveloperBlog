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
    // Custom storage object that bypasses LockManager API
    const customStorage = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    };

    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
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
        }
      }
    );
  }

  get client() {
    return this.supabase;
  }
}