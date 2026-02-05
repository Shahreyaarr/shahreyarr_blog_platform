import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store';
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const { user } = useSettingsStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full -z-10 opacity-60" />
              
              {/* Experience Badge */}
              <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  5+
                </div>
                <div className="text-gray-500 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
              About Me
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {user.name} — <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user.title}
              </span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
              {user.bio?.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-8">
              {user.social_links.instagram && (
                <a
                  href={user.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all group"
                >
                  <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
              )}
              {user.social_links.twitter && (
                <a
                  href={user.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all group"
                >
                  <Twitter className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
              )}
              {user.social_links.youtube && (
                <a
                  href={user.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group"
                >
                  <Youtube className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
              )}
            </div>

            {/* CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all hover:gap-4"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
