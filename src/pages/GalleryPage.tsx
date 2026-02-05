import { Link } from 'react-router-dom';
import { useGalleryStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ArrowRight, Grid3X3, Image as ImageIcon } from 'lucide-react';

const GalleryPage = () => {
  const { categories, getImagesByCategory } = useGalleryStore();

  // Get image count for each category
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    imageCount: getImagesByCategory(cat.name).length,
    coverImage: getImagesByCategory(cat.name)[0]?.url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <Grid3X3 className="w-4 h-4 inline mr-2" />
            Visual Journey
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Capture Moments
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore photography collections organized by theme and experience
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithCount.map((category) => (
              <Link
                key={category.id}
                to={`/gallery/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/3]"
              >
                {/* Background Image */}
                <img
                  src={category.coverImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/70 text-sm line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {category.imageCount} photos
                      </span>
                      <span className="text-white flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Collection
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/30 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Images Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Moments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A curated selection of favorite shots from across the collections
            </p>
          </div>
          
          <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {categoriesWithCount.slice(0, 4).map((category) =>
              getImagesByCategory(category.name)
                .filter((img) => img.is_featured)
                .slice(0, 2)
                .map((image) => (
                  <Link
                    key={image.id}
                    to={`/gallery/${category.slug}`}
                    className="block break-inside-avoid group relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-white/70 text-xs">{category.name}</span>
                        <h4 className="text-white font-medium text-sm">{image.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </section>

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default GalleryPage;
