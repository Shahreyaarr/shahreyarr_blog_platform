import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContentStore } from '@/store/contentStore';
import { ArrowRight, Compass, Lightbulb, PiggyBank, User, Users, BookOpen } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  planning: Compass,
  inspiration: Lightbulb,
  tips: PiggyBank,
  solo: User,
  family: Users,
  articles: BookOpen,
  custom: Compass,
};

const ContentSections = () => {
  const { getActiveSections } = useContentStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sections = getActiveSections();

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

  if (sections.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
            Travel Resources
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Next Adventure
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Guides, tips, and inspiration to help you travel better
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = iconMap[section.type] || Compass;
            return (
              <div
                key={section.id}
                className={`group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {section.subtitle && (
                        <span className="text-white/80 text-sm">{section.subtitle}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {section.description}
                    </p>
                    {section.link && (
                      <Link
                        to={section.link}
                        className="inline-flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {section.linkText || 'Learn More'}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContentSections;
