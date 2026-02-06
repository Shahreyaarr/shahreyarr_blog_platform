import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MapPin } from 'lucide-react';
import { useSettingsStore } from '@/store';

const HeroSection = () => {
  const { settings, user } = useSettingsStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!settings.hero_slider_enabled || settings.hero_images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % settings.hero_images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [settings.hero_slider_enabled, settings.hero_images.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Slider */}
      {settings.hero_images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Hero background ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
   {/* Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Available for collaborations</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          {settings.hero_title}
        </h1>

        
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all hover:scale-105"
          >
            <MapPin className="w-5 h-5" />
            Explore Destinations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Author Info */}
        <div className="mt-16 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full border-2 border-white/30 object-cover"
          />
          <div className="text-left">
            <p className="text-white font-semibold">{user.name}</p>
            <p className="text-white/70 text-sm">{user.title}</p>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      {settings.hero_slider_enabled && settings.hero_images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {settings.hero_images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden lg:block z-10">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
