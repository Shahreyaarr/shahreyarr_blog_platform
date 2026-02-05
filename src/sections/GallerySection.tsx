import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGalleryStore } from '@/store';
import { ArrowRight } from 'lucide-react';

const GallerySection = () => {
  const { images, getFeaturedImages } = useGalleryStore();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const featuredImages = getFeaturedImages().slice(0, 6);
  const displayImages = featuredImages.length > 0 ? featuredImages : images.slice(0, 6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
            Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Captured Moments
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A curated collection of my favorite shots from around the world
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${index === 0 || index === 3 ? 'md:row-span-2' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(image.url)}
            >
              <div className={`relative ${index === 0 || index === 3 ? 'h-80 md:h-[500px]' : 'h-48 md:h-60'}`}>
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    {image.category && (
                      <span className="text-white/70 text-sm">{image.category}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:gap-4"
          >
            View Full Gallery
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

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
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
