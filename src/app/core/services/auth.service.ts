import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private supabase: SupabaseService, private router: Router) {
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


/*  signUp(email: string, password: string): Observable<{ user: User | null; error: any }> {
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
*/

  
  signIn(email: string, password: string): Observable<{ user: User | null; error: any }> {
    console.log('Starting signIn with:', { email, password });
    
    return from(
      this.supabase.client
        .from('login_table')
        .select('*')
        .eq('user_name', email)
        .eq('password', password)
        .limit(1)
    ).pipe(
      map(({ data, error }) => {
        console.log('Raw Supabase response:', { data, error, count: data?.length });
        
        // Log the actual query being executed
        console.log('Query details:', {
          table: 'login_table',
          filters: { user_name: email, password: password }
        });
        
        if (error) {
          console.error('Supabase query error:', error);
          return {
            user: null,
            error: error
          };
        }

        console.log('Query successful - data:', data);
        console.log('Data length:', data?.length || 0);
        
        if (data == null || data.length === 0) {
          console.log('No matching user found - checking if table has any data...');
          return {
            user: null,
            error: { message: 'username or password is invalid' }
          };
        }
        
        // Get the first (and should be only) user record
        const userRecord = data[0];
        
        // Create a mock user object since we're not using Supabase auth
        const mockUser = {
          id: userRecord.id.toString(),
          email: userRecord.user_name,
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
        return of({ user: null, error: { message: 'Login failed. Please check your credentials.' }            });
      })
    );
  }

  signOut(): Observable<{ error: any }> {
    // Clear user session from localStorage and current user subject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
    
    return of({ error: null });
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}