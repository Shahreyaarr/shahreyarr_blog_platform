import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, X, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useGalleryStore } from '@/store';

export default function GalleryCategoryPage() {
  const { slug } = useParams();
  const { categories, getByCategory } = useGalleryStore();
  const [lightbox, setLightbox] = useState<any>(null);
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return <Navigate to="/gallery" replace />;
  const images = getByCategory(cat.name);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-10 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> All Collections
          </Link>
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Gallery</span>
          <h1 className="font-display text-5xl text-charcoal mt-2">{cat.name}</h1>
          {cat.description && <p className="text-muted mt-2">{cat.description}</p>}
          <p className="text-xs text-muted mt-2">{images.length} photo{images.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {images.length === 0 ? (
          <div className="text-center py-20"><p className="font-display text-2xl text-charcoal/30">No photos yet</p></div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map(img => (
              <div key={img.id} onClick={() => setLightbox(img)} className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl">
                <img src={img.url} alt={img.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                  {img.location && <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{img.location}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-5xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-3 text-center">
              <p className="text-white font-medium">{lightbox.title}</p>
              {lightbox.caption && <p className="text-white/50 text-sm mt-1 italic">{lightbox.caption}</p>}
              {lightbox.location && <p className="text-white/40 text-xs flex items-center justify-center gap-1 mt-1"><MapPin className="w-3 h-3" />{lightbox.location}</p>}
            </div>
          </div>
        </div>
      )}
      <Footer />
      <Chat />
    </div>
  );
}
