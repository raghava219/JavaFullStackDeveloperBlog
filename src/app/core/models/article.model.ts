export interface Article {
  id: string;
  URL: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  categorie: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  featured: boolean;
}