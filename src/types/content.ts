// Content Section Types

export interface ContentSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  linkText?: string;
  type: 'planning' | 'inspiration' | 'tips' | 'solo' | 'family' | 'articles' | 'custom';
  isActive: boolean;
  order: number;
  createdAt: string;
}
