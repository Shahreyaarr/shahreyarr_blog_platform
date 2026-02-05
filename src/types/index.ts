// Blog Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContentBlock[];
  author: string;
  featured_image: string;
  read_time: string;
  is_published: boolean;
  category: string;
  country?: string;
  state?: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogContentBlock {
  type: 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'code' | 'video' | 'spacer';
  content?: string;
  level?: number;
  url?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  items?: string[];
  language?: string;
  height?: number;
  style?: {
    color?: string;
    backgroundColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  state?: string;
  type: 'country' | 'state' | 'city' | 'region';
  description: string;
  images: string[];
  hero_image?: string;
  is_visited: boolean;
  visit_date?: string;
  sections: DestinationSection[];
  places_visited: Place[];
  created_at: string;
  updated_at: string;
}

export interface DestinationSection {
  id: string;
  title: string;
  type: 'treks' | 'markets' | 'nature' | 'villages' | 'experiences' | 'food' | 'custom';
  description: string;
  images: string[];
}

export interface Place {
  id: string;
  name: string;
  description: string;
  images: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

// Gallery Types
export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  caption?: string;
  category: string;
  location?: string;
  is_featured: boolean;
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
}

// Journey Types
export interface UpcomingJourney {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date?: string;
  images: string[];
  description: string;
  itinerary: string;
  available_seats: number;
  price?: number;
  status: 'open' | 'closed' | 'completed';
  registrations: JourneyRegistration[];
  created_at: string;
}

export interface JourneyRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  created_at: string;
}

// Stats Types
export interface TravelStats {
  total_distance_km: number;
  countries_visited: number;
  states_covered: number;
  cities_explored: number;
  total_photos: number;
  total_blogs: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  is_visited: boolean;
  visit_date?: string;
  images: string[];
  description?: string;
  blogs: string[];
  destinations: string[];
}

// Message Types
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  image_url?: string;
  is_read: boolean;
  reply?: string;
  created_at: string;
}

// Product Types (Future E-commerce)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'photo' | 'souvenir' | 'merchandise';
  stock: number;
  is_active: boolean;
  created_at: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  title?: string;
  location?: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

// Site Settings
export interface SiteSettings {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  location: string;
  hero_images: string[];
  hero_slider_enabled: boolean;
}

// Admin Types
export interface AdminSession {
  isLoggedIn: boolean;
  username: string;
  loginTime: string;
}
