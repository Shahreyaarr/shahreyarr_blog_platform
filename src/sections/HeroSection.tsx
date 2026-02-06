import { useState, useEffect } from 'react';
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          {settings.hero_title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          {settings.hero_subtitle}
        </p>

        {/* Author Info */}
        <div className="mt-16 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
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
    </section>
  );
};

export default HeroSection;
