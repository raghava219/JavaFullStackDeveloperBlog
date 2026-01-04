import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  article: Partial<Article> = {
    title: '',
    URL: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: [],
    featured: false,
    fileName: ''
  };

  tagInput = '';
  selectedFile: File | null = null;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private supabase: SupabaseService
  ) {}



  addTag() {
    if (this.tagInput.trim() && !this.article.tags?.includes(this.tagInput.trim())) {
      this.article.tags = [...(this.article.tags || []), this.tagInput.trim()];
      this.tagInput = '';
    }
  }

  removeTag(tag: string) {
    this.article.tags = this.article.tags?.filter(t => t !== tag) || [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Get file extension to determine MIME type
      const extension = file.name.split('.').pop()?.toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'md': 'text/markdown'
      };
      
      // Always prioritize extension-based detection over browser's file.type
      const contentType = mimeTypes[extension || ''] || file.type || 'application/octet-stream';

      console.log('Detected file type for upload:', contentType);
      
      // Create a new File object with the correct type
      this.selectedFile = new File([file], file.name, { type: contentType });
      
      console.log('File selected:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
        originalType: file.type,
        extension: extension,
        detectedType: contentType
      });

      // Upload file immediately using Blob with explicit content type
      console.log('Uploading file:', this.selectedFile.name, 
        'Size:', this.selectedFile.size, 
        'Type:', contentType);
      
      // Create a Blob with the correct MIME type
      const blob = new Blob([file], { type: contentType });
      
      this.supabase.client.storage
        .from('dms-global-files')
        .upload(file.name, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Supabase upload error:', error);
            this.submitError = 'Failed to upload file. Please try again.';
            this.selectedFile = null;
          } else {
            console.log('File uploaded successfully:', data);
            this.article.fileName = file.name;
          }
        })
        .catch(error => {
          console.error('Upload error:', error);
          this.submitError = 'Failed to upload file. Please try again.';
          this.selectedFile = null;
        });
    }
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  onSubmit() {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;

      // File already uploaded in onFileSelected, just create the article
      this.createArticle();
    }
  }

  private createArticle() {
    const newArticle: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> = {
      title: this.article.title!,
      URL: this.article.URL!,
      slug: this.generateSlug(this.article.title!),
      content: this.article.content!,
      excerpt: this.article.excerpt!,
      author: this.article.author!,
      category: this.article.category!,
      tags: this.article.tags!,
      readingTime: this.calculateReadingTime(this.article.content!),
      featured: this.article.featured!,
      fileName: this.article.fileName!,
    };

    this.articleService.addArticle(newArticle).subscribe({
      next: (article) => {
        console.log('Article added successfully:', article);
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error adding article:', error);
        this.submitError = 'Failed to add article. Please try again.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.article.title?.trim() &&
      this.article.URL?.trim() &&
      this.article.content?.trim() &&
      this.article.excerpt?.trim() &&
      this.article.author?.trim() &&
      this.article.category?.trim() &&
      this.article.tags?.length
    );
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
}