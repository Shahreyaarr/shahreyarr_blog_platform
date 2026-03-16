import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Check, MapPin, BookOpen, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useCountryStore, useBlogStore, useDestStore } from '@/store';

export default function CountriesPage() {
  const { countries, getVisited } = useCountryStore();
  const { blogs } = useBlogStore();
  const { destinations } = useDestStore();
  const [filter, setFilter] = useState<'all' | 'visited'>('all');
  const [search, setSearch] = useState('');

  const list = countries.filter(c => {
    const matchFilter = filter === 'all' || c.isVisited;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-10 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">World</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-2">Countries</h1>
          <p className="text-muted">Exploring the world one country at a time.</p>
          <div className="flex items-center gap-8 mt-6">
            <div><span className="font-display text-4xl text-earth">{getVisited().length}</span><p className="text-xs text-muted mt-0.5 uppercase tracking-widest">Visited</p></div>
            <div className="w-px h-10 bg-sand" />
            <div><span className="font-display text-4xl text-charcoal/30">{countries.length}</span><p className="text-xs text-muted mt-0.5 uppercase tracking-widest">On list</p></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand bg-cream/50 focus:outline-none focus:border-earth text-sm" />
            </div>
            <div className="flex gap-2">
              {(['all', 'visited'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${filter === f ? 'bg-charcoal text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>
                  {f === 'all' ? 'All Countries' : 'Visited Only'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(country => {
            const countryBlogs = blogs.filter(b => b.isPublished && b.country === country.name);
            const countryDests = destinations.filter(d => d.country === country.name);
            return (
              <div key={country.id} className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${country.isVisited ? 'ring-1 ring-earth/30' : 'opacity-70'}`}>
                <div className="relative h-36">
                  {country.images?.[0] ? (
                    <img src={country.images[0]} alt={country.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${country.isVisited ? 'bg-earth/10' : 'bg-sand/50'}`}>
                      <span className="font-display text-5xl text-charcoal/10">{country.code}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {country.isVisited && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-earth flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-medium text-sm">{country.name}</p>
                    <p className="text-white/60 text-xs">{country.code}</p>
                  </div>
                </div>
                <div className="p-3">
                  {country.description && <p className="text-xs text-muted line-clamp-2 mb-3">{country.description}</p>}
                  <div className="flex gap-3 text-xs text-muted mb-3">
                    {countryDests.length > 0 && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{countryDests.length}</span>}
                    {countryBlogs.length > 0 && <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{countryBlogs.length}</span>}
                  </div>
                  <div className="flex gap-2">
                    {countryDests.length > 0 && (
                      <Link to={`/destinations?country=${country.name}`} className="flex-1 py-1.5 text-xs text-center rounded-lg bg-cream hover:bg-sand transition-colors text-charcoal/70 font-medium">Places</Link>
                    )}
                    {countryBlogs.length > 0 && (
                      <Link to={`/blog?country=${country.name}`} className="flex-1 py-1.5 text-xs text-center rounded-lg bg-earth/10 hover:bg-earth/20 transition-colors text-earth font-medium">Stories</Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
      <Chat />
    </div>
  );
}
