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
    content: '',
    excerpt: '',
    author: '',
    categories: [],
    tags: [],
    featured: false
  };

  categoryInput = '';
  tagInput = '';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  addCategory() {
    if (this.categoryInput.trim() && !this.article.categories?.includes(this.categoryInput.trim())) {
      this.article.categories = [...(this.article.categories || []), this.categoryInput.trim()];
      this.categoryInput = '';
    }
  }

  removeCategory(category: string) {
    this.article.categories = this.article.categories?.filter(c => c !== category) || [];
  }

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
    if (this.isFormValid()) {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: this.article.title!,
        slug: this.generateSlug(this.article.title!),
        content: this.article.content!,
        excerpt: this.article.excerpt!,
        author: this.article.author!,
        categories: this.article.categories!,
        tags: this.article.tags!,
        createdAt: new Date(),
        updatedAt: new Date(),
        readingTime: this.calculateReadingTime(this.article.content!),
        featured: this.article.featured!
      };

      // Note: You'll need to implement addArticle method in ArticleService
      console.log('New article to be added:', newArticle);
      
      // For now, just navigate back to categories
      // this.articleService.addArticle(newArticle);
      this.router.navigate(['/categories']);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.article.title?.trim() &&
      this.article.content?.trim() &&
      this.article.excerpt?.trim() &&
      this.article.author?.trim() &&
      this.article.categories?.length &&
      this.article.tags?.length
    );
  }

  onCancel() {
    this.router.navigate(['/categories']);
  }
}