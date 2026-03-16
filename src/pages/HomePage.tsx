import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, MapPin, Camera, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useSettingsStore, useBlogStore, useGalleryStore, useVideoStore, useDestStore } from '@/store';

const useVisible = (threshold = 0.15) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

// ── Hero ──
const Hero = () => {
  const { settings } = useSettingsStore();
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);
  useEffect(() => {
    if (settings.heroImages.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % settings.heroImages.length), 6000);
    return () => clearInterval(t);
  }, [settings.heroImages.length]);
  const titleLines = settings.heroTitle.split('\n');

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {settings.heroImages.map((src, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Available for collaborations
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            {titleLines.map((line, i) => <span key={i} className="block">{line}</span>)}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">{settings.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/gallery" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-charcoal font-medium text-sm hover:bg-cream transition-colors shadow-lg">
              <Camera className="w-4 h-4" /> View Gallery
            </Link>
            <Link to="/blog" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-sm border border-white/30 hover:bg-white/20 transition-colors">
              Read Stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      {settings.heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {settings.heroImages.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`transition-all duration-300 rounded-full ${i === idx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      )}
    </section>
  );
};

// ── Stats ──
const Stats = () => {
  const { settings } = useSettingsStore();
  const { ref, visible } = useVisible();
  const items = [
    { value: Math.round(settings.statsKm / 1000), suffix: 'K+', label: 'Km Traveled' },
    { value: settings.statsCountries, suffix: '+', label: 'Countries' },
    { value: settings.statsPhotos, suffix: '+', label: 'Photos' },
    { value: settings.statsStories, suffix: '+', label: 'Stories' },
  ];
  return (
    <section ref={ref as any} className="py-16 bg-white border-b border-sand/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-sand">
          {items.map((item, i) => (
            <div key={i} className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="font-display text-4xl md:text-5xl text-earth mb-1">{item.value}{item.suffix}</div>
              <p className="text-xs text-muted uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── About ──
const About = () => {
  const { settings } = useSettingsStore();
  const { ref, visible } = useVisible();
  const paragraphs = settings.aboutText.split('\n\n').filter(Boolean);
  return (
    <section ref={ref as any} className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative">
              <img src={settings.aboutImage} alt={settings.siteName} className="w-full aspect-[3/4] object-cover rounded-2xl shadow-xl" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-sand rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-warm/20 rounded-2xl -z-10" />
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <span className="text-xs font-medium text-earth uppercase tracking-widest">About Me</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-3 mb-6 leading-tight">{settings.siteName}</h2>
            <div className="space-y-4">
              {paragraphs.map((p, i) => <p key={i} className="text-charcoal/70 leading-relaxed text-sm md:text-base">{p}</p>)}
            </div>
            <div className="flex gap-4 mt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-earth hover:gap-3 transition-all">
                Read My Stories <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Gallery Preview ──
const GalleryPreview = () => {
  const { images } = useGalleryStore();
  const { ref, visible } = useVisible();
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const featured = images.filter(i => i.isFeatured).slice(0, 6);
  const display = featured.length >= 4 ? featured : images.slice(0, 6);

  return (
    <section ref={ref as any} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <span className="text-xs font-medium text-earth uppercase tracking-widest">Portfolio</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-2">Captured Moments</h2>
            <p className="text-muted mt-2 text-sm">A curated collection of my favorite shots from around the world</p>
          </div>
          <Link to="/gallery" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors hover:gap-3">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {display.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`bg-sand/30 rounded-xl animate-pulse ${i===1 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-square'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {display.map((img, i) => (
              <div key={img.id} onClick={() => setLightbox({ url: img.url, title: img.title })}
                className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                  i === 0 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-square'
                } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                  {img.location && <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{img.location}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-charcoal border border-sand rounded-full px-6 py-2.5 hover:bg-cream transition-colors">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          <p className="absolute bottom-6 text-white/60 text-sm">{lightbox.title}</p>
        </div>
      )}
    </section>
  );
};

// ── Videos ──
const Videos = () => {
  const { videos } = useVideoStore();
  const { ref, visible } = useVisible();
  const [playing, setPlaying] = useState<typeof videos[0] | null>(null);
  const display = [...videos].sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 3);

  return (
    <section ref={ref as any} className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Watch</span>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-2">Travel Videos</h2>
        </div>

        {display.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i}>
                <div className="aspect-video rounded-xl bg-sand/30 animate-pulse mb-3" />
                <div className="h-4 bg-sand/30 rounded w-3/4 animate-pulse mb-2" />
                <div className="h-3 bg-sand/20 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {display.map((video, i) => (
              <div key={video.id} onClick={() => setPlaying(video)}
                className={`group cursor-pointer transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-charcoal fill-charcoal ml-0.5" />
                    </div>
                  </div>
                  {video.category && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium text-charcoal">{video.category}</span>}
                </div>
                <h3 className="font-medium text-charcoal text-sm group-hover:text-earth transition-colors line-clamp-2">{video.title}</h3>
                {video.description && <p className="text-xs text-muted mt-1 line-clamp-2">{video.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4" onClick={() => setPlaying(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe src={`${playing.embedUrl}?autoplay=1&rel=0`} title={playing.title} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
            <p className="mt-4 text-center text-white font-medium">{playing.title}</p>
          </div>
        </div>
      )}
    </section>
  );
};

// ── Destinations Preview ──
const DestinationsPreview = () => {
  const { destinations } = useDestStore();
  const { ref, visible } = useVisible();
  const display = destinations.slice(0, 3);

  return (
    <section ref={ref as any} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <span className="text-xs font-medium text-earth uppercase tracking-widest">Places</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-2">Destinations Explored</h2>
            <p className="text-muted mt-2 text-sm">Countries and cities I've had the privilege to visit and document</p>
          </div>
          <Link to="/destinations" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors hover:gap-3">
            All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {display.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="aspect-[4/5] rounded-xl bg-sand/30 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {display.map((dest, i) => (
              <Link key={dest.id} to={`/destinations/${dest.slug}`}
                className={`group block transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                  <img src={dest.images[0] || dest.heroImage || ''} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1"><MapPin className="w-3 h-3" />{dest.country}</div>
                    <h3 className="text-white font-display text-xl">{dest.name}</h3>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-xs capitalize">{dest.type}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ── Blog Preview ──
const BlogPreview = () => {
  const { blogs } = useBlogStore();
  const { ref, visible } = useVisible();
  const published = blogs.filter(b => b.isPublished).slice(0, 3);

  return (
    <section ref={ref as any} className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-end justify-between mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <span className="text-xs font-medium text-earth uppercase tracking-widest">Stories</span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-2">From the Journal</h2>
            <p className="text-muted mt-2 text-sm">Stories, tips and insights from my adventures around the globe</p>
          </div>
          <Link to="/blog" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors hover:gap-3">
            All Stories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {published.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i}>
                <div className="aspect-video rounded-xl bg-sand/30 animate-pulse mb-4" />
                <div className="h-4 bg-sand/30 rounded w-1/3 animate-pulse mb-2" />
                <div className="h-5 bg-sand/20 rounded w-full animate-pulse mb-2" />
                <div className="h-3 bg-sand/20 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {published.map((blog, i) => (
              <Link key={blog.id} to={`/blog/${blog.slug}`}
                className={`group block transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-earth font-medium">{blog.category}</span>
                  {blog.country && <><span className="text-muted text-xs">·</span><span className="text-xs text-muted">{blog.country}</span></>}
                </div>
                <h3 className="font-display text-xl text-charcoal group-hover:text-earth transition-colors leading-snug mb-2">{blog.title}</h3>
                <p className="text-sm text-muted line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-earth font-medium group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ── CTA ──
const CTA = () => {
  const { ref, visible } = useVisible();
  return (
    <section ref={ref as any} className="py-20 bg-charcoal text-white">
      <div className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-xs font-medium text-warm uppercase tracking-widest">Journeys</span>
        <h2 className="font-display text-4xl md:text-5xl mt-3 mb-4">Join Me on the Road</h2>
        <p className="text-white/50 mb-8">Limited spots available for exclusive travel experiences.</p>
        <Link to="/journeys" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-warm text-charcoal font-medium text-sm hover:bg-warm/90 transition-colors">
          Explore Journeys <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <GalleryPreview />
      <Videos />
      <DestinationsPreview />
      <BlogPreview />
      <CTA />
      <Footer />
      <Chat />
    </div>
  );
}
