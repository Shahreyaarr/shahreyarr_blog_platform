import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Camera } from 'lucide-react';
import { useShopStore } from '@/store';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/countries', label: 'Countries' },
  { to: '/journeys', label: 'Journeys' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useShopStore(s => s.getCount)();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (to: string) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : isHome ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              scrolled || !isHome ? 'bg-charcoal' : 'bg-white/20 backdrop-blur-sm border border-white/30'
            }`}>
              <Camera className={`w-4 h-4 ${scrolled || !isHome ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`font-display text-lg font-medium tracking-wide transition-colors ${
              scrolled || !isHome ? 'text-charcoal' : 'text-white'
            }`}>
              Sahr E Yaar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 text-sm font-body font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? scrolled || !isHome ? 'text-earth bg-sand/50' : 'text-white bg-white/15'
                    : scrolled || !isHome ? 'text-charcoal/70 hover:text-charcoal hover:bg-sand/30' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className={`relative p-2 rounded-lg transition-colors ${
              scrolled || !isHome ? 'text-charcoal hover:bg-sand/50' : 'text-white hover:bg-white/10'
            }`}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-earth text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled || !isHome ? 'text-charcoal hover:bg-sand/50' : 'text-white hover:bg-white/10'
              }`}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-sand px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-sand text-earth' : 'text-charcoal hover:bg-cream'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
