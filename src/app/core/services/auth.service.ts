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
    this.checkSession();
  }

  private async checkSession() {
    const { data: { session } } = await this.supabase.client.auth.getSession();
    this.currentUserSubject.next(session?.user || null);
  }

  signUp(email: string, password: string): Observable<{ user: User | null; error: any }> {

    console.log("email "+email);
    console.log("password "+password);

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
      this.supabase.client.auth.signInWithPassword({
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
        console.error('Sign in error:', error);
        return of({ user: null, error });
      })
    );
  }

  signOut(): Observable<{ error: any }> {
    return from(this.supabase.client.auth.signOut()).pipe(
      map(({ error }) => ({ error })),
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError(error => {
        console.error('Sign out error:', error);
        return [{ error }];
      })
    );
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}