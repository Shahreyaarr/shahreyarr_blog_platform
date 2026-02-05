import { Link } from 'react-router-dom';
import { Camera, Instagram, Twitter, Youtube, Mail, MapPin } from 'lucide-react';
import { useSettingsStore } from '@/store';

const Footer = () => {
  const { user, settings } = useSettingsStore();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Sahr E Yaar</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Travel photographer and storyteller capturing moments across the world. 
              Based in Delhi, India.
            </p>
            <div className="flex gap-3">
              {user.social_links.instagram && (
                <a
                  href={user.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {user.social_links.twitter && (
                <a
                  href={user.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {user.social_links.youtube && (
                <a
                  href={user.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Destinations
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/destinations/himachal-pradesh" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Himachal Pradesh
                </Link>
              </li>
              <li>
                <Link to="/destinations/dubai" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dubai
                </Link>
              </li>
              <li>
                <Link to="/destinations/egypt" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Egypt
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white transition-colors text-sm">
                  View All
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-sm">{settings.location}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sahr E Yaar. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with passion for travel and photography
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
