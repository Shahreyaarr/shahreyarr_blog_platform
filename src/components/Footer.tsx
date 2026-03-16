import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Mail, MapPin, Camera } from 'lucide-react';
import { useSettingsStore } from '@/store';

export default function Footer() {
  const { settings } = useSettingsStore();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-warm/20 transition-colors">
                <Camera className="w-4 h-4 text-warm" />
              </div>
              <span className="font-display text-xl text-white">{settings.siteName}</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-white/50 max-w-sm">
              {settings.tagline}. Capturing moments across the world — from the Himalayas to Arabia.
            </p>
            <div className="flex gap-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-warm/20 hover:text-warm transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-warm/20 hover:text-warm transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-warm/20 hover:text-warm transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/blog', 'Blog & Vlogs'], ['/gallery', 'Gallery'], ['/destinations', 'Destinations'], ['/countries', 'Countries'], ['/journeys', 'Journeys']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm hover:text-warm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-warm mt-0.5 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-sm hover:text-warm transition-colors">{settings.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-warm mt-0.5 flex-shrink-0" />
                <span className="text-sm">{settings.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">&copy; {year} {settings.siteName}. All rights reserved.</p>
          <p className="text-xs text-white/30">Made with passion for travel and photography</p>
        </div>
      </div>
    </footer>
  );
}
