import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Mountain, Store, TreePine, Home, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useDestStore, useBlogStore } from '@/store';

export default function SingleDestinationPage() {
  const { slug } = useParams();
  const { getBySlug } = useDestStore();
  const { blogs } = useBlogStore();
  const dest = slug ? getBySlug(slug) : undefined;
  if (!dest) return <Navigate to="/destinations" replace />;

  const related = blogs.filter(b => b.isPublished && b.country === dest.country).slice(0, 3);
  const sectionIcon = (type: string) => {
    const icons: Record<string, any> = { treks: Mountain, markets: Store, nature: TreePine, villages: Home, experiences: Sparkles };
    const Icon = icons[type] || MapPin;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="relative pt-20">
        <div className="h-[55vh] relative overflow-hidden">
          <img src={dest.heroImage || dest.images[0] || ''} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-black/40" />
          <div className="absolute top-8 left-0 right-0">
            <div className="max-w-5xl mx-auto px-6">
              <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Destinations
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-8">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <MapPin className="w-4 h-4 text-earth" />{dest.country}{dest.state ? `, ${dest.state}` : ''}
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal leading-tight">{dest.name}</h1>
          <p className="text-muted mt-3 text-lg max-w-2xl">{dest.description}</p>
          {dest.isVisited && dest.visitDate && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth/10 text-earth text-sm mt-4">
              <Calendar className="w-4 h-4" /> Visited {new Date(dest.visitDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
      </section>

      {dest.images.length > 1 && (
        <section className="py-10 bg-cream">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl text-charcoal mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dest.images.map((img, i) => (
                <div key={i} className={`overflow-hidden rounded-lg ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                  <img src={img} alt={`${dest.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {dest.sections.length > 0 && (
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl text-charcoal mb-8">What to Explore</h2>
            <div className="space-y-8">
              {dest.sections.map((s: any) => (
                <div key={s.id} className="bg-cream rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-earth/10 flex items-center justify-center text-earth">{sectionIcon(s.type)}</div>
                    <h3 className="font-display text-xl text-charcoal">{s.title}</h3>
                  </div>
                  <p className="text-muted text-sm mb-4">{s.description}</p>
                  {s.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {s.images.map((img: string, j: number) => (
                        <div key={j} className="aspect-square rounded-lg overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {dest.placesVisited?.length > 0 && (
        <section className="py-10 bg-cream">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl text-charcoal mb-6">Places Visited</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dest.placesVisited.map((place: any) => (
                <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-medium text-charcoal">{place.name}</h3>
                  {place.description && <p className="text-xs text-muted mt-1">{place.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl text-charcoal mb-6">Stories from {dest.country}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(b => (
                <Link key={b.id} to={`/blog/${b.slug}`} className="group block bg-cream rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden"><img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-4"><span className="text-xs text-earth">{b.category}</span><h3 className="font-display text-lg text-charcoal group-hover:text-earth transition-colors line-clamp-2 mt-1">{b.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <Chat />
    </div>
  );
}
