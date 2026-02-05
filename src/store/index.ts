import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Blog,
  Destination,
  GalleryImage,
  GalleryCategory,
  UpcomingJourney,
  Message,
  Country,
  Product,
  User,
  SiteSettings,
  AdminSession,
  TravelStats
} from '@/types';

// Admin Store
interface AdminStore {
  session: AdminSession | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      session: null,
      login: (username: string, password: string) => {
        if (username === 'admin' && password === 'password') {
          set({
            session: {
              isLoggedIn: true,
              username,
              loginTime: new Date().toISOString(),
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ session: null }),
      isAuthenticated: () => !!get().session?.isLoggedIn,
    }),
    {
      name: 'admin-session',
    }
  )
);

// Blog Store
interface BlogStore {
  blogs: Blog[];
  categories: string[];
  addBlog: (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'slug'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlogBySlug: (slug: string) => Blog | undefined;
  getBlogsByCategory: (category: string) => Blog[];
  getBlogsByCountry: (country: string) => Blog[];
  getRelatedBlogs: (blog: Blog, limit?: number) => Blog[];
}

const defaultBlogs: Blog[] = [
  {
    id: '1',
    title: 'Exploring the Majestic Himalayas',
    slug: 'exploring-the-majestic-himalayas',
    excerpt: 'A journey through the towering peaks and serene valleys of the world\'s highest mountain range.',
    content: [
      { type: 'heading', content: 'The Call of the Mountains', level: 2 },
      { type: 'paragraph', content: 'The Himalayas have always called to me. Towering peaks, ancient monasteries, and the sheer magnitude of nature create an experience unlike any other. As I embarked on this journey, I knew it would change my perspective forever.' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop', caption: 'Sunrise over the Himalayan peaks', alignment: 'center' },
      { type: 'heading', content: 'Manali to Leh', level: 2 },
      { type: 'paragraph', content: 'The road from Manali to Leh is considered one of the most spectacular drives in the world. Crossing high-altitude passes, witnessing dramatic landscapes, and experiencing the raw beauty of Ladakh made every moment unforgettable.' },
    ],
    author: 'Sahr E Yaar',
    featured_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=600&fit=crop',
    read_time: '8 min read',
    is_published: true,
    category: 'Trekking',
    country: 'India',
    state: 'Himachal Pradesh',
    tags: ['himalayas', 'trekking', 'ladakh', 'mountains'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Dubai: Where Tradition Meets Futurism',
    slug: 'dubai-tradition-meets-futurism',
    excerpt: 'From golden dunes to glittering skyscrapers - exploring the city of contrasts.',
    content: [
      { type: 'heading', content: 'A City of Contrasts', level: 2 },
      { type: 'paragraph', content: 'Dubai is a city that defies expectations. Where else can you experience the serenity of the desert at sunrise and the buzz of a futuristic metropolis by night?' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop', caption: 'The Dubai skyline at sunset', alignment: 'center' },
    ],
    author: 'Sahr E Yaar',
    featured_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop',
    read_time: '5 min read',
    is_published: true,
    category: 'City',
    country: 'UAE',
    tags: ['dubai', 'city', 'architecture', 'desert'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Ancient Wonders of Egypt',
    slug: 'ancient-wonders-of-egypt',
    excerpt: 'Walking in the footsteps of pharaohs through the land of pyramids and temples.',
    content: [
      { type: 'heading', content: 'The Land of Pharaohs', level: 2 },
      { type: 'paragraph', content: 'Egypt is a country that lives in two worlds - the ancient and the modern. Standing before the Great Pyramids of Giza, you can\'t help but feel the weight of thousands of years of history.' },
    ],
    author: 'Sahr E Yaar',
    featured_image: 'https://images.unsplash.com/photo-1539650116455-251d9a063595?w=1200&h=600&fit=crop',
    read_time: '6 min read',
    is_published: true,
    category: 'Spiritual',
    country: 'Egypt',
    tags: ['egypt', 'pyramids', 'history', 'ancient'],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      blogs: defaultBlogs,
      categories: ['Trekking', 'Hills', 'Country', 'State', 'City', 'Adventure', 'Food', 'Market', 'Spiritual', 'Culture', 'Wildlife'],
      addBlog: (blog) => {
        const newBlog: Blog = {
          ...blog,
          id: Date.now().toString(),
          slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ blogs: [newBlog, ...state.blogs] }));
      },
      updateBlog: (id, blog) => {
        set((state) => ({
          blogs: state.blogs.map((b) =>
            b.id === id ? { ...b, ...blog, updated_at: new Date().toISOString() } : b
          ),
        }));
      },
      deleteBlog: (id) => {
        set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }));
      },
      getBlogBySlug: (slug) => {
        return get().blogs.find((b) => b.slug === slug);
      },
      getBlogsByCategory: (category) => {
        return get().blogs.filter((b) => b.category === category && b.is_published);
      },
      getBlogsByCountry: (country) => {
        return get().blogs.filter((b) => b.country === country && b.is_published);
      },
      getRelatedBlogs: (blog, limit = 3) => {
        return get()
          .blogs.filter(
            (b) =>
              b.id !== blog.id &&
              b.is_published &&
              (b.category === blog.category || b.country === blog.country)
          )
          .slice(0, limit);
      },
    }),
    {
      name: 'blog-store',
    }
  )
);

// Destination Store
interface DestinationStore {
  destinations: Destination[];
  addDestination: (destination: Omit<Destination, 'id' | 'created_at' | 'updated_at' | 'slug'>) => void;
  updateDestination: (id: string, destination: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  getDestinationBySlug: (slug: string) => Destination | undefined;
  getDestinationsByCountry: (country: string) => Destination[];
  getDestinationsByType: (type: Destination['type']) => Destination[];
}

const defaultDestinations: Destination[] = [
  {
    id: '1',
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    country: 'India',
    type: 'state',
    description: 'Majestic mountains and serene valleys of the Himalayas',
    images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop'],
    hero_image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop',
    is_visited: true,
    visit_date: '2024-06-15',
    sections: [
      {
        id: '1',
        title: 'Popular Treks',
        type: 'treks',
        description: 'Experience the thrill of Himalayan trekking',
        images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'],
      },
    ],
    places_visited: [
      { id: '1', name: 'Manali', description: 'A beautiful hill station', images: [] },
      { id: '2', name: 'Shimla', description: 'The Queen of Hills', images: [] },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kuala Lumpur',
    slug: 'kuala-lumpur',
    country: 'Malaysia',
    type: 'city',
    description: 'Modern city with rich cultural heritage',
    images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop'],
    hero_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=600&fit=crop',
    is_visited: true,
    sections: [],
    places_visited: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cairo',
    slug: 'cairo',
    country: 'Egypt',
    type: 'city',
    description: 'Ancient wonders and desert landscapes',
    images: ['https://images.unsplash.com/photo-1539650116455-251d9a063595?w=800&h=600&fit=crop'],
    hero_image: 'https://images.unsplash.com/photo-1539650116455-251d9a063595?w=1200&h=600&fit=crop',
    is_visited: true,
    sections: [],
    places_visited: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useDestinationStore = create<DestinationStore>()(
  persist(
    (set, get) => ({
      destinations: defaultDestinations,
      addDestination: (destination) => {
        const newDestination: Destination = {
          ...destination,
          id: Date.now().toString(),
          slug: destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ destinations: [...state.destinations, newDestination] }));
      },
      updateDestination: (id, destination) => {
        set((state) => ({
          destinations: state.destinations.map((d) =>
            d.id === id ? { ...d, ...destination, updated_at: new Date().toISOString() } : d
          ),
        }));
      },
      deleteDestination: (id) => {
        set((state) => ({ destinations: state.destinations.filter((d) => d.id !== id) }));
      },
      getDestinationBySlug: (slug) => {
        return get().destinations.find((d) => d.slug === slug);
      },
      getDestinationsByCountry: (country) => {
        return get().destinations.filter((d) => d.country === country);
      },
      getDestinationsByType: (type) => {
        return get().destinations.filter((d) => d.type === type);
      },
    }),
    {
      name: 'destination-store',
    }
  )
);

// Gallery Store
interface GalleryStore {
  images: GalleryImage[];
  categories: GalleryCategory[];
  addImage: (image: Omit<GalleryImage, 'id' | 'created_at'>) => void;
  updateImage: (id: string, image: Partial<GalleryImage>) => void;
  deleteImage: (id: string) => void;
  getImagesByCategory: (category: string) => GalleryImage[];
  getFeaturedImages: () => GalleryImage[];
  addCategory: (category: Omit<GalleryCategory, 'id' | 'slug'>) => void;
}

const defaultGalleryImages: GalleryImage[] = [
  { id: '1', title: 'Mountain Sunrise', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop', category: 'Mountains', is_featured: true, created_at: new Date().toISOString() },
  { id: '2', title: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop', category: 'Nature', is_featured: false, created_at: new Date().toISOString() },
  { id: '3', title: 'Lake Reflection', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop', category: 'Nature', is_featured: true, created_at: new Date().toISOString() },
  { id: '4', title: 'Forest Mist', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop', category: 'Nature', is_featured: false, created_at: new Date().toISOString() },
  { id: '5', title: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=800&fit=crop', category: 'Sunset', is_featured: true, created_at: new Date().toISOString() },
  { id: '6', title: 'City Streets', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop', category: 'Streets', is_featured: false, created_at: new Date().toISOString() },
];

const defaultGalleryCategories: GalleryCategory[] = [
  { id: '1', name: 'Mountains', slug: 'mountains', description: 'Majestic mountain landscapes' },
  { id: '2', name: 'Sunrise', slug: 'sunrise', description: 'Beautiful sunrise moments' },
  { id: '3', name: 'Sunset', slug: 'sunset', description: 'Golden hour captures' },
  { id: '4', name: 'Streets', slug: 'streets', description: 'Urban life and street photography' },
  { id: '5', name: 'People', slug: 'people', description: 'Portraits and candid moments' },
  { id: '6', name: 'Wildlife', slug: 'wildlife', description: 'Animals in their natural habitat' },
  { id: '7', name: 'Nature', slug: 'nature', description: 'Natural landscapes and scenery' },
];

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      images: defaultGalleryImages,
      categories: defaultGalleryCategories,
      addImage: (image) => {
        const newImage: GalleryImage = {
          ...image,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ images: [newImage, ...state.images] }));
      },
      updateImage: (id, image) => {
        set((state) => ({
          images: state.images.map((i) => (i.id === id ? { ...i, ...image } : i)),
        }));
      },
      deleteImage: (id) => {
        set((state) => ({ images: state.images.filter((i) => i.id !== id) }));
      },
      getImagesByCategory: (category) => {
        return get().images.filter((i) => i.category === category);
      },
      getFeaturedImages: () => {
        return get().images.filter((i) => i.is_featured);
      },
      addCategory: (category) => {
        const newCategory: GalleryCategory = {
          ...category,
          id: Date.now().toString(),
          slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
    }),
    {
      name: 'gallery-store',
    }
  )
);

// Journey Store
interface JourneyStore {
  journeys: UpcomingJourney[];
  addJourney: (journey: Omit<UpcomingJourney, 'id' | 'created_at' | 'registrations'>) => void;
  updateJourney: (id: string, journey: Partial<UpcomingJourney>) => void;
  deleteJourney: (id: string) => void;
  registerForJourney: (journeyId: string, registration: { name: string; email: string; phone: string; message?: string }) => void;
  getOpenJourneys: () => UpcomingJourney[];
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      journeys: [],
      addJourney: (journey) => {
        const newJourney: UpcomingJourney = {
          ...journey,
          id: Date.now().toString(),
          registrations: [],
          created_at: new Date().toISOString(),
        };
        set((state) => ({ journeys: [...state.journeys, newJourney] }));
      },
      updateJourney: (id, journey) => {
        set((state) => ({
          journeys: state.journeys.map((j) => (j.id === id ? { ...j, ...journey } : j)),
        }));
      },
      deleteJourney: (id) => {
        set((state) => ({ journeys: state.journeys.filter((j) => j.id !== id) }));
      },
      registerForJourney: (journeyId, registration) => {
        const newRegistration = {
          ...registration,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === journeyId
              ? { ...j, registrations: [...j.registrations, newRegistration] }
              : j
          ),
        }));
      },
      getOpenJourneys: () => {
        return get().journeys.filter((j) => j.status === 'open');
      },
    }),
    {
      name: 'journey-store',
    }
  )
);

// Message Store
interface MessageStore {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'created_at' | 'is_read'>) => void;
  markAsRead: (id: string) => void;
  replyToMessage: (id: string, reply: string) => void;
  deleteMessage: (id: string) => void;
  getUnreadCount: () => number;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: [],
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          is_read: false,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ messages: [newMessage, ...state.messages] }));
      },
      markAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
        }));
      },
      replyToMessage: (id, reply) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, reply } : m)),
        }));
      },
      deleteMessage: (id) => {
        set((state) => ({ messages: state.messages.filter((m) => m.id !== id) }));
      },
      getUnreadCount: () => {
        return get().messages.filter((m) => !m.is_read).length;
      },
    }),
    {
      name: 'message-store',
    }
  )
);

// Country Store
interface CountryStore {
  countries: Country[];
  addCountry: (country: Omit<Country, 'id'>) => void;
  updateCountry: (id: string, country: Partial<Country>) => void;
  markAsVisited: (id: string, visitDate?: string) => void;
  getVisitedCountries: () => Country[];
  getCountryByCode: (code: string) => Country | undefined;
}

const defaultCountries: Country[] = [
  { id: '1', name: 'India', code: 'IN', is_visited: true, images: [], blogs: [], destinations: [] },
  { id: '2', name: 'United Arab Emirates', code: 'AE', is_visited: true, images: [], blogs: [], destinations: [] },
  { id: '3', name: 'Egypt', code: 'EG', is_visited: true, images: [], blogs: [], destinations: [] },
  { id: '4', name: 'Malaysia', code: 'MY', is_visited: true, images: [], blogs: [], destinations: [] },
  { id: '5', name: 'Thailand', code: 'TH', is_visited: false, images: [], blogs: [], destinations: [] },
  { id: '6', name: 'Nepal', code: 'NP', is_visited: true, images: [], blogs: [], destinations: [] },
  { id: '7', name: 'Bhutan', code: 'BT', is_visited: false, images: [], blogs: [], destinations: [] },
  { id: '8', name: 'Sri Lanka', code: 'LK', is_visited: false, images: [], blogs: [], destinations: [] },
  { id: '9', name: 'Turkey', code: 'TR', is_visited: false, images: [], blogs: [], destinations: [] },
  { id: '10', name: 'Jordan', code: 'JO', is_visited: false, images: [], blogs: [], destinations: [] },
];

export const useCountryStore = create<CountryStore>()(
  persist(
    (set, get) => ({
      countries: defaultCountries,
      addCountry: (country) => {
        set((state) => ({ countries: [...state.countries, { ...country, id: Date.now().toString() }] }));
      },
      updateCountry: (id, country) => {
        set((state) => ({
          countries: state.countries.map((c) => (c.id === id ? { ...c, ...country } : c)),
        }));
      },
      markAsVisited: (id, visitDate) => {
        set((state) => ({
          countries: state.countries.map((c) =>
            c.id === id ? { ...c, is_visited: true, visit_date: visitDate || new Date().toISOString() } : c
          ),
        }));
      },
      getVisitedCountries: () => {
        return get().countries.filter((c) => c.is_visited);
      },
      getCountryByCode: (code) => {
        return get().countries.find((c) => c.code === code);
      },
    }),
    {
      name: 'country-store',
    }
  )
);

// Product Store (Future E-commerce)
interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      getActiveProducts: () => {
        return get().products.filter((p) => p.is_active && p.stock > 0);
      },
    }),
    {
      name: 'product-store',
    }
  )
);

// Settings Store
interface SettingsStore {
  settings: SiteSettings;
  user: User;
  stats: TravelStats;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateUser: (user: Partial<User>) => void;
  updateStats: (stats: Partial<TravelStats>) => void;
}

const defaultSettings: SiteSettings = {
  site_title: 'Sahr E Yaar | Travel Photography',
  site_description: 'Capturing moments across the world',
  hero_title: 'Capturing Moments Across the World',
  hero_subtitle: 'From the Himalayas to the Pyramids — documenting the beauty of our planet',
  contact_email: 'hello@shahreyarr.com',
  location: 'Delhi, India',
  hero_images: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop',
  ],
  hero_slider_enabled: true,
};

const defaultUser: User = {
  id: '1',
  name: 'Sahr E Yaar',
  email: 'hello@shahreyarr.com',
  title: 'Travel Photographer & Storyteller',
  bio: "In the Name of God, the Beneficent, the Merciful. I'm a passionate travel photographer based in Delhi, India, with a deep love for capturing the beauty of our world. My journey has taken me from the majestic Himalayas to the ancient pyramids of Egypt, from the bustling streets of Kuala Lumpur to the golden deserts of Dubai.",
  location: 'Delhi, India',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  social_links: {
    instagram: 'https://instagram.com/shahreyarr._',
    twitter: '#',
    youtube: '#',
  },
};

const defaultStats: TravelStats = {
  total_distance_km: 50000,
  countries_visited: 10,
  states_covered: 15,
  cities_explored: 25,
  total_photos: 208,
  total_blogs: 15,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      user: defaultUser,
      stats: defaultStats,
      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
      },
      updateUser: (newUser) => {
        set((state) => ({ user: { ...state.user, ...newUser } }));
      },
      updateStats: (newStats) => {
        set((state) => ({ stats: { ...state.stats, ...newStats } }));
      },
    }),
    {
      name: 'settings-store',
    }
  )
);

// Re-export shop store
export { useShopStore } from './shopStore';

// Re-export content store
export { useContentStore } from './contentStore';
