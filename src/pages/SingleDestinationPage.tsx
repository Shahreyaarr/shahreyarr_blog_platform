import { useParams, Link, Navigate } from 'react-router-dom';
import { useDestinationStore, useBlogStore } from '@/store';
import type { DestinationSection } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { MapPin, ArrowLeft, Calendar, Mountain, Store, TreePine, Home, Sparkles } from 'lucide-react';

const SingleDestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getDestinationBySlug } = useDestinationStore();
  const { getBlogsByCountry } = useBlogStore();

  const destination = slug ? getDestinationBySlug(slug) : undefined;

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const relatedBlogs = destination.country
    ? getBlogsByCountry(destination.country).slice(0, 3)
    : [];

  const getSectionIcon = (type: DestinationSection['type']) => {
    switch (type) {
      case 'treks':
        return <Mountain className="w-5 h-5" />;
      case 'markets':
        return <Store className="w-5 h-5" />;
      case 'nature':
        return <TreePine className="w-5 h-5" />;
      case 'villages':
        return <Home className="w-5 h-5" />;
      case 'experiences':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0">
          <img
            src={destination.hero_image || destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </Link>

          <div className="flex items-center gap-2 text-white/80 mb-4">
            <MapPin className="w-5 h-5" />
            <span>{destination.country}</span>
            {destination.state && (
              <>
                <span className="mx-2">/</span>
                <span>{destination.state}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {destination.name}
          </h1>

          <p className="text-xl text-white/80 max-w-2xl">{destination.description}</p>

          {destination.is_visited && destination.visit_date && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Visited in {new Date(destination.visit_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Image Gallery */}
      {destination.images.length > 1 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destination.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${destination.name} - ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sections */}
      {destination.sections.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">What to Explore</h2>
            <div className="space-y-12">
              {destination.sections.map((section) => (
                <div key={section.id} className="bg-gray-50 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      {getSectionIcon(section.type)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  {section.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {section.images.map((image, index) => (
                        <div key={index} className="relative h-48 rounded-xl overflow-hidden">
                          <img
                            src={image}
                            alt={`${section.title} - ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Places Visited */}
      {destination.places_visited.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Places Visited</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.places_visited.map((place) => (
                <div key={place.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{place.name}</h3>
                  <p className="text-gray-600 text-sm">{place.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Stories from {destination.country}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-blue-600 font-medium">{blog.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <Chatbot />
    </div>
  );
};

export default SingleDestinationPage;
