import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Clock, MapPin, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useBlogStore } from '@/store';

export default function BlogPage() {
  const { blogs } = useBlogStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState<'all' | 'blog' | 'vlog'>('all');

  const published = blogs.filter(b => b.isPublished);
  const categories = ['All', ...Array.from(new Set(published.map(b => b.category)))];

  const filtered = published.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()) || (b.country || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || b.category === category;
    const matchType = type === 'all' || (type === 'vlog' ? b.isVlog : !b.isVlog);
    return matchSearch && matchCat && matchType;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="text-xs font-medium text-earth uppercase tracking-widest">Journal</span>
            <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Blog & Vlogs</h1>
            <p className="text-muted">Stories, reflections and visual diaries from every corner of the world.</p>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand bg-cream/50 focus:outline-none focus:border-earth text-sm transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'blog', 'vlog'].map(t => (
                <button key={t} onClick={() => setType(t as any)}
                  className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wide transition-colors ${type === t ? 'bg-charcoal text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>
                  {t === 'all' ? 'All' : t === 'blog' ? 'Articles' : 'Vlogs'}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mt-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === cat ? 'bg-earth text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl text-charcoal/30">No stories found</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group block mb-12">
                <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video md:aspect-auto md:h-80 overflow-hidden">
                    <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {featured.isVlog && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-charcoal fill-charcoal ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-earth font-medium">{featured.category}</span>
                      {featured.isVlog && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs">Vlog</span>}
                      {featured.country && <span className="text-xs text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{featured.country}</span>}
                    </div>
                    <h2 className="font-display text-3xl text-charcoal group-hover:text-earth transition-colors mb-3 leading-tight">{featured.title}</h2>
                    <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                      <span>{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map(blog => (
                <Link key={blog.id} to={`/blog/${blog.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {blog.isVlog && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-4 h-4 text-charcoal fill-charcoal ml-0.5" />
                        </div>
                      </div>
                    )}
                    {blog.category && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium">{blog.category}</span>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted mb-2">
                      {blog.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{blog.country}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl text-charcoal group-hover:text-earth transition-colors line-clamp-2 leading-snug mb-2">{blog.title}</h3>
                    <p className="text-xs text-muted line-clamp-2 mb-3">{blog.excerpt}</p>
                    <div className="flex items-center gap-1 text-xs text-earth font-medium group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
      <Chat />
    </div>
  );
}
