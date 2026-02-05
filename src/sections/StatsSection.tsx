import { useEffect, useRef, useState } from 'react';
import { useSettingsStore, useCountryStore } from '@/store';
import { MapPin, Compass, Camera, BookOpen } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon, value, suffix = '', label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const { stats } = useSettingsStore();
  const { getVisitedCountries } = useCountryStore();
  const visitedCountries = getVisitedCountries();

  const statItems = [
    {
      icon: <Compass className="w-7 h-7 text-blue-500" />,
      value: Math.floor(stats.total_distance_km / 1000),
      suffix: 'K+',
      label: 'Kilometers Traveled',
    },
    {
      icon: <MapPin className="w-7 h-7 text-purple-500" />,
      value: visitedCountries.length,
      suffix: '+',
      label: 'Countries Visited',
    },
    {
      icon: <Camera className="w-7 h-7 text-pink-500" />,
      value: stats.total_photos,
      suffix: '+',
      label: 'Photos Captured',
    },
    {
      icon: <BookOpen className="w-7 h-7 text-orange-500" />,
      value: stats.total_blogs,
      suffix: '+',
      label: 'Stories Shared',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <StatItem
              key={item.label}
              icon={item.icon}
              value={item.value}
              suffix={item.suffix}
              label={item.label}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
