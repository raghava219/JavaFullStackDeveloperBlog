# Copilot Instructions: Java Full Stack Developer Blog

## Architecture Overview

This is a standalone Angular 18 blog application with Supabase backend integration. The app uses **fully standalone components** with lazy loading—no NgModules anywhere.

### Key Technologies

- **Angular 18**: Standalone components with signals pattern
- **Supabase**: PostgreSQL backend, authentication, and S3-compatible storage
- **NgRx**: State management (configured but minimal usage—most state handled via RxJS BehaviorSubjects in services)
- **Marked.js**: Markdown parsing for article content
- **Prism.js**: Code syntax highlighting

## Project Structure

```
src/app/
├── core/
│   ├── guards/auth.guard.ts       # Route protection for authenticated routes
│   ├── models/article.model.ts    # TypeScript interfaces
│   └── services/                   # All services use providedIn: 'root'
│       ├── article.service.ts     # Main business logic with BehaviorSubject
│       ├── auth.service.ts        # Custom auth (localStorage-based)
│       └── supabase.service.ts    # Supabase client wrapper
├── features/                       # Feature components (all standalone)
│   ├── add/                       # Article creation form (auth-protected)
│   ├── article/                   # Single article view with markdown rendering
│   ├── categories/                # Category browsing
│   ├── home/                      # Landing page with author bio
│   ├── list/                      # Admin article list view
│   └── tags/                      # Tag-based filtering
├── store/
│   └── article.actions.ts         # NgRx actions (store configured but underutilized)
└── environments/                   # Supabase credentials
```

## Critical Patterns

### 1. Component Architecture

All components are **standalone** with explicit imports. Route definitions use `loadComponent()` for lazy loading:

```typescript
{
  path: 'articles/:slug',
  loadComponent: () =>
    import('./app/features/article/article.component').then(m => m.ArticleComponent)
}
```

### 2. Service Layer

Services use `BehaviorSubject` + Observable pattern for reactive state:

```typescript
// ArticleService pattern
private articlesSubject = new BehaviorSubject<Article[]>([]);
public articles$ = this.articlesSubject.asObservable();
```

When adding service methods, follow this RxJS Observable pattern—avoid promises.

### 3. Authentication Flow

- **Custom implementation** (not using Supabase auth fully)
- Uses `localStorage` for session persistence (`currentUser` key)
- `AuthGuard` protects `/add` route
- Auth state managed via `BehaviorSubject` in `AuthService`

### 4. Data Model Mapping

**Important**: Supabase schema uses `categorie` (singular) but TypeScript model uses `category`:

```typescript
// article.model.ts
category: string; // TypeScript interface

// supabase.service.ts Database type
categorie: string; // Database column name
```

Always map between these when reading/writing to Supabase.

### 5. S3 Storage Integration

Articles reference files in Supabase Storage (S3-compatible). The `uploadFile()` method in `ArticleService` uses AWS SDK v3 with hardcoded credentials (see [article.service.ts](src/app/core/services/article.service.ts#L28-L35)).

## Development Commands

```bash
npm run start       # Dev server on port 4200
npm run build       # Production build to dist/demo
ng serve            # Alternative dev server
```

**Build output**: `dist/demo` (configured in [angular.json](angular.json))  
**Deployed static site**: `docs/` folder (production build copied here)

## NgRx State Note

NgRx is **configured but barely used**. Only `article.actions.ts` exists with basic actions. Most state management happens via services with `BehaviorSubject`. When adding features, prefer the existing service pattern over NgRx unless complex state orchestration is needed.

## Common Tasks

### Adding a New Article Field

1. Update `Article` interface in [article.model.ts](src/app/core/models/article.model.ts)
2. Update `Database['public']['Tables']['articles']` type in [supabase.service.ts](src/app/core/services/supabase.service.ts)
3. Update `AddComponent` form in [add.component.ts](src/app/features/add/add.component.ts) and template
4. Run Supabase migration if backend schema changes (see `supabase/migrations/`)

### Creating a New Feature Route

1. Create standalone component in `features/` with `standalone: true` and explicit imports
2. Add lazy-loaded route in [main.ts](src/main.ts) routes array using `loadComponent()`
3. Add navigation link in main App template ([main.ts](src/main.ts#L70-L78))

## External Dependencies

- **Supabase**: Database and storage backend (credentials in `environments/environment.ts`)
- **Auth0**: Configured in bootstrap but not actively used (see [main.ts](src/main.ts#L217-L223))
- **Marked**: Used in `ArticleComponent` to parse markdown content
- **AWS SDK**: Used for S3-compatible storage uploads to Supabase

## Style Patterns

- Global styles: `src/global_styles.css`
- Component styles: Scoped `.css` files with `styleUrl` property
- CSS variables for theming with dark mode toggle
- Inline template styles in [main.ts](src/main.ts#L80-L148) for main app shell
