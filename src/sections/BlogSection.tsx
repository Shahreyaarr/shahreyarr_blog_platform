import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '@/store';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogSection = () => {
  const { blogs } = useBlogStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const publishedBlogs = blogs.filter((blog) => blog.is_published).slice(0, 3);

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
    <section ref={sectionRef} id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-6">
            Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Blog
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stories, tips, and insights from my adventures around the globe
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map((blog, index) => (
            <article
              key={blog.id}
              className={`group bg-gray-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <Link to={`/blog/${blog.slug}`} className="block relative h-56 overflow-hidden">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.read_time}
                  </span>
                </div>

                {/* Title */}
                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>

                {/* Read More */}
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:gap-4"
          >
            View All Stories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
