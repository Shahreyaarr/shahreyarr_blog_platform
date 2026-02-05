import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentSection } from '@/types/content';

interface ContentStore {
  sections: ContentSection[];
  addSection: (section: Omit<ContentSection, 'id' | 'createdAt'>) => void;
  updateSection: (id: string, section: Partial<ContentSection>) => void;
  deleteSection: (id: string) => void;
  getActiveSections: () => ContentSection[];
  getSectionsByType: (type: ContentSection['type']) => ContentSection[];
  reorderSections: (orderedIds: string[]) => void;
}

const defaultSections: ContentSection[] = [
  {
    id: '1',
    title: 'Start Planning Your Trip',
    subtitle: 'Your journey begins here',
    description: 'Get expert tips on planning the perfect adventure. From choosing destinations to packing essentials.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    link: '/blog',
    linkText: 'Read Guide',
    type: 'planning',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Getting Inspired',
    subtitle: 'Stories that move you',
    description: 'Explore travel stories from around the world and find your next destination.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
    link: '/blog',
    linkText: 'Get Inspired',
    type: 'inspiration',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'How to Save for a Trip',
    subtitle: 'Budget travel tips',
    description: 'Learn smart ways to save money for your dream vacation without compromising on experiences.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    link: '/blog',
    linkText: 'Learn More',
    type: 'tips',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Solo Travel Guide',
    subtitle: 'Adventure for one',
    description: 'Everything you need to know about traveling solo - safety tips, destinations, and making friends.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
    link: '/blog',
    linkText: 'Explore Solo',
    type: 'solo',
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Family Travel',
    subtitle: 'Memories together',
    description: 'Tips for traveling with kids and creating unforgettable family memories.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
    link: '/blog',
    linkText: 'Family Tips',
    type: 'family',
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
  },
];

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      sections: defaultSections,
      addSection: (section) => {
        const newSection: ContentSection = {
          ...section,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ sections: [...state.sections, newSection] }));
      },
      updateSection: (id, updates) => {
        set((state) => ({
          sections: state.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },
      deleteSection: (id) => {
        set((state) => ({ sections: state.sections.filter((s) => s.id !== id) }));
      },
      getActiveSections: () => {
        return get()
          .sections.filter((s) => s.isActive)
          .sort((a, b) => a.order - b.order);
      },
      getSectionsByType: (type) => {
        return get().sections.filter((s) => s.type === type && s.isActive);
      },
      reorderSections: (orderedIds) => {
        set((state) => ({
          sections: state.sections.map((s) => ({
            ...s,
            order: orderedIds.indexOf(s.id) + 1,
          })),
        }));
      },
    }),
    {
      name: 'content-store',
    }
  )
);
