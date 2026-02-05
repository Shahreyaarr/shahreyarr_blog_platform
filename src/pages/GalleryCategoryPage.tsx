import { useParams, Link, Navigate } from 'react-router-dom';
import { useGalleryStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ArrowLeft, Grid3X3, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const GalleryCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, getImagesByCategory } = useGalleryStore();
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; caption?: string } | null>(null);

  const category = categories.find((c) => c.slug === slug);
  const images = slug ? getImagesByCategory(category?.name || '') : [];

  if (!category) {
    return <Navigate to="/gallery" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            {category.description || `A collection of ${category.name.toLowerCase()} photography`}
          </p>
          <div className="mt-6 flex items-center gap-4 text-white/60">
            <Grid3X3 className="w-5 h-5" />
            <span>{images.length} photos</span>
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-500">Check back soon for new additions</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage({ url: image.url, title: image.title, caption: image.caption })}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      {image.location && (
                        <p className="text-white/70 text-sm">{image.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.caption && (
                <p className="text-white/70 mt-1">{selectedImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default GalleryCategoryPage;
