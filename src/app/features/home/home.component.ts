import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <!-- About Me Section -->
      <section class="about-section">
        <div class="about-content">
          <div class="profile-section">
            <div class="profile-image">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" 
                alt="Professional headshot"
                class="profile-photo"
              />
            </div>
            <div class="profile-info">
              <h1 class="headline">Full Stack Developer & Technical Writer</h1>
              <p class="tagline">Crafting scalable solutions and sharing knowledge through code</p>
            </div>
          </div>
          
          <div class="bio-section">
            <p class="bio-paragraph">
              Welcome to my digital space! I'm a passionate Full Stack Developer with over 5 years of experience building robust web applications using modern technologies like Angular, React, Node.js, Java, Spring Boot and GCP cloud platforms. 
              My journey in software development has taken me through various industries, from online PPC startups to enterprise solutions, where I've honed my skills in creating user-centric applications that solve real-world problems.
            </p>
            
            <p class="bio-paragraph">
              Currently, I'm focused on exploring the intersection of AI and web development, particularly in building 
              intelligent data management systems. When I'm not coding, you'll find me writing technical articles, 
              contributing to open-source projects, or mentoring aspiring developers. I believe in the power of 
              continuous learning and sharing knowledge with the community.
            </p>
            
            <div class="skills-section">
              <h3>Core Expertise</h3>
              <div class="skills-grid">
                <span class="skill-tag">Angular</span>
                <span class="skill-tag">TypeScript</span>
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">PostgreSQL</span>
                <span class="skill-tag">AWS</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">REST APIs</span>
                <span class="skill-tag">Supabase</span>
              </div>
            </div>
            
            <div class="contact-section">
              <div class="social-links">
                <a href="https://github.com" target="_blank" class="social-link">
                  <span class="social-icon">📧</span>
                  Email
                </a>
                <a href="https://linkedin.com" target="_blank" class="social-link">
                  <span class="social-icon">💼</span>
                  LinkedIn
                </a>
                <a href="https://github.com" target="_blank" class="social-link">
                  <span class="social-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://twitter.com" target="_blank" class="social-link">
                  <span class="social-icon">🐦</span>
                  Twitter
                </a>
              </div>
              
              <div class="cta-section">
                <a routerLink="/categories" class="cta-button">
                  Explore My Articles
                </a>
                <a href="mailto:contact@example.com" class="cta-button secondary">
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Articles Section -->
      <section class="articles-section">
        <h2 class="section-title">Latest Articles</h2>
        <div class="articles-grid">
          <article *ngFor="let article of articles.slice(0, 3)" class="card article-card">
            <h3>{{ article.title }}</h3>
            <p class="meta">
              By {{ article.author }} • {{ article.readingTime }} min read • {{ article.createdAt | date }}
            </p>
            <p class="excerpt">{{ article.excerpt }}</p>
            <a [routerLink]="['/articles', article.slug]" class="read-more-btn">Read More</a>
          </article>
        </div>
        
        <div class="view-all-section" *ngIf="articles.length > 3">
          <a routerLink="/categories" class="view-all-btn">View All Articles</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-section {
      background: var(--surface-color);
      border-radius: 1rem;
      padding: 3rem;
      margin-bottom: 4rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .about-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }

    .profile-image {
      flex-shrink: 0;
    }

    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .profile-info {
      flex: 1;
    }

    .headline {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .tagline {
      font-size: 1.2rem;
      color: var(--text-secondary);
      font-weight: 400;
      margin: 0;
    }

    .bio-section {
      margin-bottom: 2rem;
    }

    .bio-paragraph {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-color);
      margin-bottom: 1.5rem;
    }

    .skills-section {
      margin: 2.5rem 0;
    }

    .skills-section h3 {
      font-size: 1.3rem;
      color: var(--text-color);
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      background: linear-gradient(135deg, var(--primary-color), #3b82f6);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.9rem;
      font-weight: 500;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .skill-tag:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }

    .contact-section {
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      color: var(--text-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }

    .social-link:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
    }

    .social-icon {
      font-size: 1.2rem;
    }

    .cta-section {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .cta-button {
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-block;
      text-align: center;
    }

    .cta-button:not(.secondary) {
      background: var(--primary-color);
      color: white;
    }

    .cta-button.secondary {
      background: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .cta-button.secondary:hover {
      background: var(--primary-color);
      color: white;
    }

    .articles-section {
      margin-top: 4rem;
    }

    .section-title {
      font-size: 2rem;
      color: var(--text-color);
      margin-bottom: 2rem;
      text-align: center;
      font-weight: 600;
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .article-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .article-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .article-card h3 {
      color: var(--text-color);
      margin-bottom: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .meta {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .excerpt {
      color: var(--text-color);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .read-more-btn {
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .read-more-btn:hover {
      opacity: 0.8;
    }

    .view-all-section {
      text-align: center;
      margin-top: 3rem;
    }

    .view-all-btn {
      padding: 1rem 2rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .view-all-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .about-section {
        padding: 2rem 1.5rem;
        margin-bottom: 2rem;
      }

      .profile-section {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .profile-photo {
        width: 120px;
        height: 120px;
      }

      .headline {
        font-size: 2rem;
      }

      .tagline {
        font-size: 1.1rem;
      }

      .bio-paragraph {
        font-size: 1rem;
      }

      .social-links {
        flex-wrap: wrap;
        gap: 1rem;
      }

      .social-link {
        flex: 1;
        min-width: 120px;
        justify-content: center;
      }

      .cta-section {
        flex-direction: column;
        gap: 1rem;
      }

      .articles-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .about-section {
        padding: 1.5rem 1rem;
      }

      .headline {
        font-size: 1.75rem;
      }

      .skills-grid {
        justify-content: center;
      }

      .social-links {
        flex-direction: column;
      }

      .social-link {
        min-width: auto;
      }
    }
  `]
})
export class HomeComponent {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {
    this.articleService.getArticles().subscribe(
      articles => this.articles = articles
    );
  }
}