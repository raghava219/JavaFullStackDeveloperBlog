import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    // Check for existing session on initialization
    this.checkCustomSession();
  }

  private checkCustomSession() {
    // Check for stored user session in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }


  signUp(email: string, password: string): Observable<{ user: User | null; error: any }> {
    return from(
      this.supabase.client.auth.signUp({
        email,
        password
      })
    ).pipe(
      map(({ data, error }) => ({
        user: data.user,
        error
      })),
      tap(({ user }) => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      }),
      catchError(error => {
        console.error('Sign up error:', error);
        return of({ user: null, error });
      })
    );
  }


  
  
  signIn(email: string, password: string): Observable<{ user: User | null; error: any }> {
    return from(
      this.supabase.client
        .from('login_table')
        .select('*')
        .eq('user_name', email)
        .eq('password', password)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return {
            user: null,
            error: error || { message: 'Invalid username or password' }
          };
        }
        
        // Create a mock user object since we're not using Supabase auth
        const mockUser = {
          id: data.id.toString(),
          email: data.user_name,
          user_metadata: {},
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated'
        } as User;
        
        return {
          user: mockUser,
          error: null
        };
      }),
      tap(({ user }) => {
        if (user) {
          this.currentUserSubject.next(user);
          // Store user session in localStorage for persistence
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(error => {
        console.error('Sign in error:', error);
        return of({ user: null, error: { message: 'Login failed. Please check your credentials.' } });
      })
    );
  }

  signOut(): Observable<{ error: any }> {
    // Clear user session from localStorage and current user subject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    return of({ error: null });
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}