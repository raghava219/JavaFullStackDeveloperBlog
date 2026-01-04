import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

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
    private router: Router
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
      
      const detectedType = mimeTypes[extension || ''] || file.type || 'application/octet-stream';
      
      // Create a new File object with the correct type if needed
      if (!file.type || file.type !== detectedType) {
        this.selectedFile = new File([file], file.name, { type: detectedType });
      } else {
        this.selectedFile = file;
      }
      
      this.article.fileName = this.selectedFile.name;
      console.log('File selected:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
        originalType: file.type,
        extension: extension,
        detectedType: detectedType
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

      // Upload file first if selected
      if (this.selectedFile) {
        this.articleService.uploadFile(this.selectedFile).subscribe({
          next: (fileName) => {
            console.log('File uploaded successfully:', fileName);
            this.article.fileName = fileName;
            this.createArticle();
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.submitError = 'Failed to upload file. Please try again.';
            this.isSubmitting = false;
          }
        });
      } else {
        this.createArticle();
      }
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