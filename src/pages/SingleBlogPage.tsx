import { useParams, Link, Navigate } from 'react-router-dom';
import { useBlogStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Calendar, Clock, User, ArrowLeft, Share2, Tag } from 'lucide-react';

const SingleBlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogBySlug, getRelatedBlogs } = useBlogStore();

  const blog = slug ? getBlogBySlug(slug) : undefined;

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  const relatedBlogs = getRelatedBlogs(blog, 3);

  const renderContentBlock = (block: typeof blog.content[0], index: number) => {
    switch (block.type) {
      case 'heading': {
        const level = block.level || 2;
        const className = level === 1 ? 'text-4xl md:text-5xl' : level === 2 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl';
        return (
          <div
            key={index}
            className={`${className} font-bold text-gray-900 mt-12 mb-6`}
            style={{ color: block.style?.color }}
          >
            {block.content}
          </div>
        );
      }
      case 'paragraph':
        return (
          <p
            key={index}
            className="text-gray-600 leading-relaxed mb-6"
            style={{
              color: block.style?.color,
              backgroundColor: block.style?.backgroundColor,
              fontWeight: block.style?.bold ? 'bold' : undefined,
              fontStyle: block.style?.italic ? 'italic' : undefined,
              textDecoration: block.style?.underline ? 'underline' : undefined,
            }}
          >
            {block.content}
          </p>
        );
      case 'image':
        return (
          <figure
            key={index}
            className={`my-8 ${
              block.alignment === 'center'
                ? 'text-center'
                : block.alignment === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <img
              src={block.url}
              alt={block.caption || 'Blog image'}
              className="rounded-2xl max-w-full inline-block"
            />
            {block.caption && (
              <figcaption className="text-gray-500 text-sm mt-3 italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-6 my-8 py-2 bg-blue-50 rounded-r-xl"
          >
            <p className="text-lg text-gray-700 italic">{block.content}</p>
          </blockquote>
        );
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside my-6 space-y-2">
            {block.items?.map((item, i) => (
              <li key={i} className="text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        );
      case 'video':
        return (
          <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden">
            <iframe
              src={block.url}
              title="Embedded video"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        );
      case 'spacer':
        return <div key={index} style={{ height: `${block.height || 20}px` }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
            {blog.category}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blog.read_time}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-12 font-medium">
            {blog.excerpt}
          </p>

          {/* Content Blocks */}
          <div className="prose prose-lg max-w-none">
            {blog.content.map((block, index) => renderContentBlock(block, index))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-gray-500 text-sm">Share this story:</span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    url: window.location.href,
                  });
                }
              }}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedBlog.featured_image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-blue-600 font-medium">{relatedBlog.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedBlog.title}
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

export default SingleBlogPage;
