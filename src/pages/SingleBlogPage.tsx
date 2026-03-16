import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Tag, Share2, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useBlogStore } from '@/store';

export default function SingleBlogPage() {
  const { slug } = useParams();
  const { blogs, getBlogBySlug } = useBlogStore();
  const blog = slug ? getBlogBySlug(slug) : undefined;
  if (!blog) return <Navigate to="/blog" replace />;

  const related = blogs.filter(b => b.isPublished && b.id !== blog.id && (b.category === blog.category || b.country === blog.country)).slice(0, 3);

  const renderBlock = (block: any, i: number) => {
    switch (block.type) {
      case 'heading': {
        const Tag = `h${block.level || 2}` as any;
        const sizes: Record<number, string> = { 1: 'font-display text-4xl', 2: 'font-display text-3xl', 3: 'font-display text-2xl', 4: 'font-display text-xl' };
        return <Tag key={i} className={`${sizes[block.level || 2]} text-charcoal mt-10 mb-4`}>{block.content}</Tag>;
      }
      case 'paragraph':
        return <p key={i} className="text-charcoal/80 leading-relaxed mb-5 text-base md:text-lg">{block.content}</p>;
      case 'image':
        return (
          <figure key={i} className="my-8">
            <img src={block.url} alt={block.caption || ''} className="w-full rounded-xl" />
            {block.caption && <figcaption className="text-center text-sm text-muted mt-2 italic">{block.caption}</figcaption>}
          </figure>
        );
      case 'quote':
        return <blockquote key={i} className="border-l-4 border-earth pl-6 my-6 py-2"><p className="font-display text-xl text-charcoal/80 italic">{block.content}</p></blockquote>;
      case 'video':
        return <div key={i} className="my-8 aspect-video rounded-xl overflow-hidden"><iframe src={block.url} className="w-full h-full" allowFullScreen /></div>;
      case 'list':
        return <ul key={i} className="list-disc list-inside my-4 space-y-2">{(block.items || []).map((item: string, j: number) => <li key={j} className="text-charcoal/80">{item}</li>)}</ul>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20">
        <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
          <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-black/40" />
          <div className="absolute top-8 left-0 right-0">
            <div className="max-w-4xl mx-auto px-6">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-earth/10 text-earth text-xs font-medium">{blog.category}</span>
            {blog.isVlog && <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs flex items-center gap-1"><Play className="w-3 h-3" />Vlog</span>}
            {blog.country && <span className="text-sm text-muted flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{blog.country}{blog.state ? `, ${blog.state}` : ''}</span>}
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal leading-tight mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted border-b border-sand pb-6">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.readTime}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>By {blog.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <p className="text-xl text-charcoal/70 leading-relaxed mb-8 font-light">{blog.excerpt}</p>
        {blog.content.map((block, i) => renderBlock(block, i))}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-sand flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream text-charcoal/60 text-xs"><Tag className="w-3 h-3" />{tag}</span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-muted">Share:</span>
          <button onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
            className="p-2 rounded-full bg-sand hover:bg-sand/70 transition-colors">
            <Share2 className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-3xl text-charcoal mb-8">Related Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(b => (
                <Link key={b.id} to={`/blog/${b.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-earth font-medium">{b.category}</span>
                    <h3 className="font-display text-lg text-charcoal group-hover:text-earth transition-colors line-clamp-2 mt-1">{b.title}</h3>
                  </div>
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
