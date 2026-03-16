import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useGalleryStore } from '@/store';

export default function GalleryPage() {
  const { categories, getByCategory } = useGalleryStore();
  const cats = categories.map(c => ({ ...c, count: getByCategory(c.name).length, cover: getByCategory(c.name)[0]?.url || '' }));

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-12 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Portfolio</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Gallery</h1>
          <p className="text-muted">Explore photography collections organized by theme and destination.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {cats.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-12 h-12 text-muted mx-auto mb-4 opacity-40" />
            <p className="font-display text-2xl text-charcoal/30">No collections yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map(cat => (
              <Link key={cat.id} to={`/gallery/${cat.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  {cat.cover ? (
                    <img src={cat.cover} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-sand flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-display text-xl">{cat.name}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{cat.count} photo{cat.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {cat.description && <p className="text-xs text-muted line-clamp-2">{cat.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Chat />
    </div>
  );
}
