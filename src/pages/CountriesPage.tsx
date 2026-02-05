import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountryStore, useBlogStore, useDestinationStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Globe, Check, MapPin, BookOpen, ArrowRight } from 'lucide-react';

const CountriesPage = () => {
  const { countries } = useCountryStore();
  const { getBlogsByCountry } = useBlogStore();
  const { getDestinationsByCountry } = useDestinationStore();
  const [filter, setFilter] = useState<'all' | 'visited'>('all');

  const filteredCountries =
    filter === 'visited' ? countries.filter((c) => c.is_visited) : countries;

  const visitedCount = countries.filter((c) => c.is_visited).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <Globe className="w-4 h-4 inline mr-2" />
            World Travel
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Countries Visited
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Exploring the world one country at a time
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{visitedCount}</div>
              <div className="text-white/60 text-sm">Countries Visited</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{countries.length}</div>
              <div className="text-white/60 text-sm">On My List</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Countries
            </button>
            <button
              onClick={() => setFilter('visited')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'visited'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Visited Only
            </button>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country) => {
              const countryBlogs = getBlogsByCountry(country.name);
              const countryDestinations = getDestinationsByCountry(country.name);

              return (
                <div
                  key={country.id}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${
                    country.is_visited ? 'ring-2 ring-yellow-400' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    {country.images[0] ? (
                      <img
                        src={country.images[0]}
                        alt={country.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-white/30">{country.code}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Visited Badge */}
                    {country.is_visited && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Check className="w-5 h-5 text-yellow-900" />
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{country.name}</h3>
                      <p className="text-white/70 text-sm">{country.code}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {country.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {country.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 mb-4">
                      {countryDestinations.length > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{countryDestinations.length} destinations</span>
                        </div>
                      )}
                      {countryBlogs.length > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <BookOpen className="w-4 h-4" />
                          <span>{countryBlogs.length} stories</span>
                        </div>
                      )}
                    </div>

                    {/* Visit Date */}
                    {country.is_visited && country.visit_date && (
                      <div className="text-sm text-gray-500 mb-4">
                        Visited: {new Date(country.visit_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {countryDestinations.length > 0 && (
                        <Link
                          to={`/destinations?country=${country.name}`}
                          className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium text-center hover:bg-gray-200 transition-colors"
                        >
                          View Destinations
                        </Link>
                      )}
                      {countryBlogs.length > 0 && (
                        <Link
                          to={`/blog?country=${country.name}`}
                          className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                        >
                          Read Stories
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default CountriesPage;
