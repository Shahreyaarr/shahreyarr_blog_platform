import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDestinationStore, useCountryStore } from '@/store';
import type { Destination } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { MapPin, Search, Globe, ArrowRight } from 'lucide-react';

const DestinationsPage = () => {
  const { destinations } = useDestinationStore();
  const { countries } = useCountryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedType, setSelectedType] = useState<Destination['type'] | 'All'>('All');

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || dest.country === selectedCountry;
    const matchesType = selectedType === 'All' || dest.type === selectedType;
    return matchesSearch && matchesCountry && matchesType;
  });

  const visitedCountries = countries.filter((c) => c.is_visited);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            Explore the World
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Destinations
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover the places I&apos;ve visited and the stories they hold
          </p>
        </div>
      </section>

      {/* Countries Visited Bar */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              <Globe className="w-4 h-4 inline mr-1" />
              Countries:
            </span>
            {visitedCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.name)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCountry === country.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === 'All'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType('country')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === 'country'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Countries
              </button>
              <button
                onClick={() => setSelectedType('state')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === 'state'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                States
              </button>
              <button
                onClick={() => setSelectedType('city')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === 'city'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination) => (
                <Link
                  key={destination.id}
                  to={`/destinations/${destination.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
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
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 capitalize">
                        {destination.type}
                      </span>
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
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default DestinationsPage;
