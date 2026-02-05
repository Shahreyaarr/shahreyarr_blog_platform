import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store';
import {
  LayoutDashboard,
  Image,
  MapPin,
  FileText,
  Calendar,
  Globe,
  Settings,
  MessageCircle,
  LogOut,
  Menu,
  ChevronRight,
  ShoppingBag,
  Package,
  CreditCard,
  Layout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminStore((state) => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/chat', label: 'Live Chat', icon: MessageCircle },
    { path: '/admin/blogs', label: 'Blog Posts', icon: FileText },
    { path: '/admin/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { path: '/admin/journeys', label: 'Journeys', icon: Calendar },
    { path: '/admin/countries', label: 'Countries', icon: Globe },
    { path: '/admin/content', label: 'Content Sections', icon: Layout },
  ];

  const shopItems = [
    { path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  ];

  const settingsItems = [
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 lg:relative lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Sahr E Yaar</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Main
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-3">
            Shop
          </div>
          {shopItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-3">
            Settings
          </div>
          {settingsItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                View Site &rarr;
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
