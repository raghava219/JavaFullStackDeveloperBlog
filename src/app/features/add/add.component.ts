import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
    featured: false
  };

  tagInput = '';
  isSubmitting = false;
  submitError: string | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter article content...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

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
        featured: this.article.featured!
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
  }

  isFormValid(): boolean {
    return !!(
      this.article.title?.trim() &&
      this.article.URL?.trim() &&
      this.article.content?.trim() &&
      this.article.excerpt?.trim() &&
      this.article.author?.trim() &&
      this.article.category?.trim()  &&
      this.article.tags?.length
    );
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
}