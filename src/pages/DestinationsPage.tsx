import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useDestStore, useCountryStore } from '@/store';

export default function DestinationsPage() {
  const { destinations } = useDestStore();
  const { countries } = useCountryStore();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [type, setType] = useState('All');

  const visitedCountries = countries.filter(c => c.isVisited);
  const types = ['All', 'country', 'state', 'city', 'region'];

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCountry = country === 'All' || d.country === country;
    const matchType = type === 'All' || d.type === type;
    return matchSearch && matchCountry && matchType;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-10 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Places</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Destinations</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand bg-cream/50 focus:outline-none focus:border-earth text-sm" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-2 rounded-full text-xs font-medium capitalize transition-colors ${type === t ? 'bg-charcoal text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {visitedCountries.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              <button onClick={() => setCountry('All')} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${country === 'All' ? 'bg-earth text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>All Countries</button>
              {visitedCountries.map(c => (
                <button key={c.id} onClick={() => setCountry(c.name)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${country === c.name ? 'bg-earth text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>{c.name}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><p className="font-display text-2xl text-charcoal/30">No destinations found</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(dest => (
              <Link key={dest.id} to={`/destinations/${dest.slug}`} className="group block">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                  <img src={dest.images[0] || dest.heroImage || ''} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1"><MapPin className="w-3 h-3" />{dest.country}</div>
                    <h3 className="text-white font-display text-xl">{dest.name}</h3>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-xs capitalize">{dest.type}</span>
                </div>
                <p className="text-sm text-muted line-clamp-2 mb-2">{dest.description}</p>
                <div className="flex items-center gap-1 text-xs text-earth font-medium group-hover:gap-2 transition-all">Explore <ArrowRight className="w-3 h-3" /></div>
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
