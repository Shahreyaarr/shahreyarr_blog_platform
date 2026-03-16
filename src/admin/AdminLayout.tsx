import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store';
import {
  LayoutDashboard, FileText, Image, Video, MapPin, Globe,
  Calendar, ShoppingBag, Mail, MessageCircle, Settings,
  LogOut, Menu, X, Camera, ChevronRight, ExternalLink, Package
} from 'lucide-react';

const nav = [
  { group: 'Content', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/blogs', label: 'Blog & Vlogs', icon: FileText },
    { to: '/admin/gallery', label: 'Gallery', icon: Image },
    { to: '/admin/videos', label: 'Videos', icon: Video },
  ]},
  { group: 'Travel', items: [
    { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { to: '/admin/countries', label: 'Countries', icon: Globe },
    { to: '/admin/journeys', label: 'Journeys', icon: Calendar },
  ]},
  { group: 'Business', items: [
    { to: '/admin/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/messages', label: 'Messages', icon: Mail },
    { to: '/admin/chat', label: 'Live Chat', icon: MessageCircle },
  ]},
  { group: 'System', items: [
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]},
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminStore(s => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + '/');

  const handleLogout = () => { logout(); navigate('/admin-login'); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      <div className="p-5 border-b border-sand/50">
        <Link to="/" target="_blank" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-earth flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display text-base text-charcoal leading-none">Sahr E Yaar</p>
            <p className="text-xs text-muted">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {nav.map(group => (
          <div key={group.group} className="mb-4">
            <p className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-1">{group.group}</p>
            {group.items.map(item => (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                  isActive(item.to, item.exact)
                    ? 'bg-earth/10 text-earth'
                    : 'text-charcoal/70 hover:bg-sand/50 hover:text-charcoal'
                }`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive(item.to, item.exact) && <ChevronRight className="w-3 h-3" />}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sand/50">
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-charcoal hover:bg-sand/50 transition-all mb-1">
          <ExternalLink className="w-4 h-4" /> View Site
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-56 bg-white border-r border-sand/50 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 bg-white flex flex-col shadow-xl">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="lg:ml-56 flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-sand/50 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-charcoal hover:bg-sand/50 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-charcoal">
              {nav.flatMap(g => g.items).find(item => isActive(item.to, item.exact))?.label || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-charcoal transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
