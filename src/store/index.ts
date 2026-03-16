import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';
import { fsAdd, fsUpdate, fsDelete, fsSet, fsSubscribe, fsSubscribeDoc } from '@/lib/firebase';

// ── ADMIN ─────────────────────────────────────────────────
interface AdminStore {
  session: { isLoggedIn: boolean; username: string } | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
}
export const useAdminStore = create<AdminStore>()(persist((set, get) => ({
  session: null,
  login: (u, p) => {
    const adminUser = import.meta.env.VITE_ADMIN_USER;
    const adminPass = import.meta.env.VITE_ADMIN_PASS;
    if (adminUser && adminPass && u === adminUser && p === adminPass) { set({ session: { isLoggedIn: true, username: u } }); return true; }
    return false;
  },
  logout: () => set({ session: null }),
  isAuthenticated: () => !!get().session?.isLoggedIn,
}), { name: 'admin-session' }));

// ── BLOG ──────────────────────────────────────────────────
export interface Blog {
  id: string; title: string; slug: string; excerpt: string;
  content: any[]; author: string; featuredImage: string;
  readTime: string; isPublished: boolean; category: string;
  country?: string; state?: string; tags: string[];
  createdAt: string; updatedAt: string;
  youtubeUrl?: string; isVlog?: boolean;
}
interface BlogStore {
  blogs: Blog[]; loading: boolean;
  setBlogs: (b: Blog[]) => void;
  addBlog: (b: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<any>;
  updateBlog: (id: string, b: Partial<Blog>) => Promise<any>;
  deleteBlog: (id: string) => Promise<any>;
  getBlogBySlug: (slug: string) => Blog | undefined;
  getPublished: () => Blog[];
}
export const useBlogStore = create<BlogStore>()((set, get) => ({
  blogs: [], loading: true,
  setBlogs: (blogs) => set({ blogs, loading: false }),
  addBlog: async (blog) => {
    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await fsAdd('blogs', { ...blog, slug });
  },
  updateBlog: async (id, blog) => fsUpdate('blogs', id, blog),
  deleteBlog: async (id) => fsDelete('blogs', id),
  getBlogBySlug: (slug) => get().blogs.find(b => b.slug === slug),
  getPublished: () => get().blogs.filter(b => b.isPublished),
}));

// ── GALLERY ───────────────────────────────────────────────
export interface GalleryImage {
  id: string; title: string; url: string; caption?: string;
  category: string; location?: string; isFeatured: boolean; createdAt: string;
}
export interface GalleryCategory {
  id: string; name: string; slug: string; description?: string; coverImage?: string;
}
interface GalleryStore {
  images: GalleryImage[]; categories: GalleryCategory[]; loading: boolean;
  setImages: (i: GalleryImage[]) => void;
  setCategories: (c: GalleryCategory[]) => void;
  addImage: (i: Omit<GalleryImage, 'id' | 'createdAt'>) => Promise<any>;
  updateImage: (id: string, i: Partial<GalleryImage>) => Promise<any>;
  deleteImage: (id: string) => Promise<any>;
  addCategory: (c: Omit<GalleryCategory, 'id' | 'slug'>) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;
  getByCategory: (cat: string) => GalleryImage[];
  getFeatured: () => GalleryImage[];
}
export const useGalleryStore = create<GalleryStore>()((set, get) => ({
  images: [], categories: [], loading: true,
  setImages: (images) => set({ images, loading: false }),
  setCategories: (categories) => set({ categories }),
  addImage: async (img) => fsAdd('gallery', img),
  updateImage: async (id, img) => fsUpdate('gallery', id, img),
  deleteImage: async (id) => fsDelete('gallery', id),
  addCategory: async (cat) => fsAdd('gallery_cats', { ...cat, slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }),
  deleteCategory: async (id) => fsDelete('gallery_cats', id),
  getByCategory: (cat) => get().images.filter(i => i.category === cat),
  getFeatured: () => get().images.filter(i => i.isFeatured),
}));

// ── VIDEO ─────────────────────────────────────────────────
export interface Video {
  id: string; title: string; description?: string; youtubeUrl: string;
  embedUrl: string; thumbnail: string; category?: string;
  isFeatured: boolean; order: number; createdAt: string;
}
interface VideoStore {
  videos: Video[]; loading: boolean;
  setVideos: (v: Video[]) => void;
  addVideo: (v: Omit<Video, 'id' | 'createdAt'>) => Promise<any>;
  updateVideo: (id: string, v: Partial<Video>) => Promise<any>;
  deleteVideo: (id: string) => Promise<any>;
}
export const useVideoStore = create<VideoStore>()((set) => ({
  videos: [], loading: true,
  setVideos: (videos) => set({ videos, loading: false }),
  addVideo: async (v) => fsAdd('videos', v),
  updateVideo: async (id, v) => fsUpdate('videos', id, v),
  deleteVideo: async (id) => fsDelete('videos', id),
}));

// ── DESTINATION ───────────────────────────────────────────
export interface Destination {
  id: string; name: string; slug: string; country: string; state?: string;
  type: 'country' | 'state' | 'city' | 'region'; description: string;
  images: string[]; heroImage?: string; isVisited: boolean;
  visitDate?: string; sections: any[]; placesVisited: any[]; createdAt: string;
}
interface DestStore {
  destinations: Destination[]; loading: boolean;
  setDestinations: (d: Destination[]) => void;
  addDestination: (d: Omit<Destination, 'id' | 'createdAt' | 'slug'>) => Promise<any>;
  updateDestination: (id: string, d: Partial<Destination>) => Promise<any>;
  deleteDestination: (id: string) => Promise<any>;
  getBySlug: (slug: string) => Destination | undefined;
}
export const useDestStore = create<DestStore>()((set, get) => ({
  destinations: [], loading: true,
  setDestinations: (destinations) => set({ destinations, loading: false }),
  addDestination: async (dest) => {
    const slug = dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await fsAdd('destinations', { ...dest, slug });
  },
  updateDestination: async (id, dest) => fsUpdate('destinations', id, dest),
  deleteDestination: async (id) => fsDelete('destinations', id),
  getBySlug: (slug) => get().destinations.find(d => d.slug === slug),
}));

// ── COUNTRY ───────────────────────────────────────────────
export interface Country {
  id: string; name: string; code: string; description?: string;
  images: string[]; isVisited: boolean; visitDate?: string;
}
interface CountryStore {
  countries: Country[]; loading: boolean;
  setCountries: (c: Country[]) => void;
  addCountry: (c: Omit<Country, 'id'>) => Promise<any>;
  updateCountry: (id: string, c: Partial<Country>) => Promise<any>;
  deleteCountry: (id: string) => Promise<any>;
  getVisited: () => Country[];
}
export const useCountryStore = create<CountryStore>()((set, get) => ({
  countries: [], loading: true,
  setCountries: (countries) => set({ countries, loading: false }),
  addCountry: async (c) => fsAdd('countries', c),
  updateCountry: async (id, c) => fsUpdate('countries', id, c),
  deleteCountry: async (id) => fsDelete('countries', id),
  getVisited: () => get().countries.filter(c => c.isVisited),
}));

// ── JOURNEY ───────────────────────────────────────────────
export interface Journey {
  id: string; title: string; destination: string; startDate: string;
  endDate?: string; images: string[]; description: string; itinerary?: string;
  availableSeats: number; price?: number; currency?: string;
  status: 'open' | 'closed' | 'completed'; registrations: any[]; createdAt: string;
}
interface JourneyStore {
  journeys: Journey[]; loading: boolean;
  setJourneys: (j: Journey[]) => void;
  addJourney: (j: Omit<Journey, 'id' | 'createdAt' | 'registrations'>) => Promise<any>;
  updateJourney: (id: string, j: Partial<Journey>) => Promise<any>;
  deleteJourney: (id: string) => Promise<any>;
  registerForJourney: (id: string, reg: any) => Promise<any>;
  getOpen: () => Journey[];
}
export const useJourneyStore = create<JourneyStore>()((set, get) => ({
  journeys: [], loading: true,
  setJourneys: (journeys) => set({ journeys, loading: false }),
  addJourney: async (j) => fsAdd('journeys', { ...j, registrations: [] }),
  updateJourney: async (id, j) => fsUpdate('journeys', id, j),
  deleteJourney: async (id) => fsDelete('journeys', id),
  registerForJourney: async (id, reg) => {
    const j = get().journeys.find(j => j.id === id);
    if (!j) return;
    await fsUpdate('journeys', id, { registrations: [...(j.registrations || []), { ...reg, id: Date.now().toString(), createdAt: new Date().toISOString() }] });
  },
  getOpen: () => get().journeys.filter(j => j.status === 'open'),
}));

// ── SETTINGS ──────────────────────────────────────────────
export interface SiteSettings {
  siteName: string; tagline: string; heroTitle: string; heroSubtitle: string;
  heroImages: string[]; aboutText: string; aboutImage: string;
  email: string; location: string; instagram: string; youtube: string; twitter: string;
  statsKm: number; statsCountries: number; statsPhotos: number; statsStories: number; razorpayKey: string;
}
const defaultSettings: SiteSettings = {
  siteName: 'Sahr E Yaar', tagline: 'Travel Photographer & Storyteller',
  heroTitle: 'Capturing the World,\nOne Frame at a Time',
  heroSubtitle: 'From the peaks of the Himalayas to the deserts of Arabia — every journey tells a story.',
  heroImages: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=1080&fit=crop',
  ],
  aboutText: "In the Name of God, the Beneficent, the Merciful.\n\nI'm Shahreyarr — a travel photographer and storyteller based in Jaipur, India. My camera has taken me across continents, through ancient cities and wild landscapes, capturing moments that words alone cannot hold.\n\nEvery photograph is a conversation with the world.",
  aboutImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
  email: 'hello@shahreyarr.com', location: 'Jaipur, India',
  instagram: 'https://instagram.com/shahreyarr._', youtube: '', twitter: '',
  statsKm: 50000, statsCountries: 10, statsPhotos: 208, statsStories: 15,
  razorpayKey: '',
};
interface SettingsStore {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
  updateSettings: (s: Partial<SiteSettings>) => Promise<any>;
}
export const useSettingsStore = create<SettingsStore>()(persist((set, get) => ({
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
  updateSettings: async (s) => {
    const updated = { ...get().settings, ...s };
    set({ settings: updated });
    await fsSet('settings', 'main', updated);
  },
}), { name: 'sey-settings' }));

// ── MESSAGES ──────────────────────────────────────────────
export interface Message {
  id: string; name: string; email: string; subject: string;
  message: string; isRead: boolean; reply?: string; createdAt: string;
}
interface MessageStore {
  messages: Message[]; loading: boolean;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => Promise<any>;
  markRead: (id: string) => Promise<any>;
  replyMessage: (id: string, reply: string) => Promise<any>;
  deleteMessage: (id: string) => Promise<any>;
  getUnread: () => number;
}
export const useMessageStore = create<MessageStore>()((set, get) => ({
  messages: [], loading: true,
  setMessages: (messages) => set({ messages, loading: false }),
  addMessage: async (m) => fsAdd('messages', { ...m, isRead: false }),
  markRead: async (id) => fsUpdate('messages', id, { isRead: true }),
  replyMessage: async (id, reply) => fsUpdate('messages', id, { reply }),
  deleteMessage: async (id) => fsDelete('messages', id),
  getUnread: () => get().messages.filter(m => !m.isRead).length,
}));

// ── SHOP ──────────────────────────────────────────────────
export interface Product {
  id: string; name: string; description: string; price: number;
  originalPrice?: number; images: string[]; category: 'photo' | 'print' | 'merch';
  stock: number; isActive: boolean; size?: string; material?: string;
  tags: string[]; createdAt: string;
}
export interface CartItem { product: Product; quantity: number; }
interface ShopStore {
  products: Product[]; cart: CartItem[]; loading: boolean;
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Promise<any>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  getActive: () => Product[];
}
export const useShopStore = create<ShopStore>()(persist((set, get) => ({
  products: [], cart: [], loading: true,
  setProducts: (products) => set({ products, loading: false }),
  addProduct: async (p) => fsAdd('products', p),
  updateProduct: async (id, p) => fsUpdate('products', id, p),
  deleteProduct: async (id) => fsDelete('products', id),
  addToCart: (product, qty = 1) => {
    const exists = get().cart.find(i => i.product.id === product.id);
    if (exists) { set({ cart: get().cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i) }); }
    else { set({ cart: [...get().cart, { product, quantity: qty }] }); }
  },
  removeFromCart: (id) => set({ cart: get().cart.filter(i => i.product.id !== id) }),
  updateQty: (id, qty) => { if (qty <= 0) { get().removeFromCart(id); return; } set({ cart: get().cart.map(i => i.product.id === id ? { ...i, quantity: qty } : i) }); },
  clearCart: () => set({ cart: [] }),
  getTotal: () => get().cart.reduce((t, i) => t + i.product.price * i.quantity, 0),
  getCount: () => get().cart.reduce((t, i) => t + i.quantity, 0),
  getActive: () => get().products.filter(p => p.isActive && p.stock > 0),
}), { name: 'sey-cart', partialize: (state) => ({ cart: state.cart }) }));

// ── FIRESTORE SYNC HOOK ───────────────────────────────────
export const useFirestoreSync = () => {
  const { setBlogs } = useBlogStore();
  const { setImages, setCategories } = useGalleryStore();
  const { setVideos } = useVideoStore();
  const { setDestinations } = useDestStore();
  const { setCountries } = useCountryStore();
  const { setJourneys } = useJourneyStore();
  const { setMessages } = useMessageStore();
  const { setSettings } = useSettingsStore();
  const { setProducts } = useShopStore();

  useEffect(() => {
    const subs = [
      fsSubscribe('blogs', setBlogs),
      fsSubscribe('gallery', setImages),
      fsSubscribe('gallery_cats', (cats) => setCategories(cats), 'name'),
      fsSubscribe('videos', (vids) => setVideos(vids.sort((a,b) => (a.order||0)-(b.order||0)))),
      fsSubscribe('destinations', setDestinations),
      fsSubscribe('countries', (c) => setCountries(c), 'name'),
      fsSubscribe('journeys', setJourneys),
      fsSubscribe('messages', setMessages),
      fsSubscribe('products', setProducts),
      fsSubscribeDoc('settings', 'main', (data) => setSettings(data as SiteSettings)),
    ];
    return () => subs.forEach(u => u());
  }, []);
};
