import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDestinationStore } from '@/store';
import { MapPin, ArrowRight } from 'lucide-react';

const DestinationsSection = () => {
  const { destinations } = useDestinationStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const featuredDestinations = destinations.slice(0, 3);

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
    <section ref={sectionRef} id="destinations" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-6">
            Places
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Destinations Explored
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Countries and cities I&apos;ve had the privilege to visit and document
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.slug}`}
              className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destination.images[0] || destination.hero_image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{destination.country}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {destination.description}
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:gap-4"
          >
            View All Destinations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
