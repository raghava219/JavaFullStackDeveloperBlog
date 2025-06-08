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
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  get client() {
    return this.supabase;
  }
}