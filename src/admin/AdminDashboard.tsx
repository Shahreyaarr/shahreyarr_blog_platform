import { Link } from 'react-router-dom';
import { FileText, Image, Video, MapPin, Globe, Calendar, ShoppingBag, Mail, MessageCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useBlogStore, useGalleryStore, useVideoStore, useDestStore, useCountryStore, useJourneyStore, useShopStore, useMessageStore } from '@/store';

export default function AdminDashboard() {
  const { blogs } = useBlogStore();
  const { images } = useGalleryStore();
  const { videos } = useVideoStore();
  const { destinations } = useDestStore();
  const { countries, getVisited } = useCountryStore();
  const { journeys, getOpen } = useJourneyStore();
  const { products } = useShopStore();
  const { messages, getUnread } = useMessageStore();

  const stats = [
    { label: 'Blog Posts', value: blogs.filter(b => b.isPublished).length, total: blogs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', to: '/admin/blogs' },
    { label: 'Gallery Photos', value: images.length, icon: Image, color: 'text-purple-600', bg: 'bg-purple-50', to: '/admin/gallery' },
    { label: 'Videos', value: videos.length, icon: Video, color: 'text-red-600', bg: 'bg-red-50', to: '/admin/videos' },
    { label: 'Destinations', value: destinations.length, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50', to: '/admin/destinations' },
    { label: 'Countries', value: getVisited().length, total: countries.length, icon: Globe, color: 'text-green-600', bg: 'bg-green-50', to: '/admin/countries' },
    { label: 'Open Journeys', value: getOpen().length, total: journeys.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', to: '/admin/journeys' },
    { label: 'Products', value: products.filter(p => p.isActive).length, total: products.length, icon: ShoppingBag, color: 'text-yellow-600', bg: 'bg-yellow-50', to: '/admin/shop' },
    { label: 'Unread Messages', value: getUnread(), total: messages.length, icon: Mail, color: 'text-pink-600', bg: 'bg-pink-50', to: '/admin/messages' },
  ];

  const quickActions = [
    { label: 'New Blog Post', to: '/admin/blogs', icon: FileText },
    { label: 'Add Photo', to: '/admin/gallery', icon: Image },
    { label: 'Add Video', to: '/admin/videos', icon: Video },
    { label: 'New Destination', to: '/admin/destinations', icon: MapPin },
    { label: 'New Journey', to: '/admin/journeys', icon: Calendar },
    { label: 'Add Product', to: '/admin/shop', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} to={stat.to} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted/50" />
            </div>
            <p className="font-display text-2xl text-charcoal">{stat.value}{stat.total !== undefined ? <span className="text-muted/50 text-base">/{stat.total}</span> : ''}</p>
            <p className="text-xs text-muted mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-display text-xl text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map(action => (
            <Link key={action.label} to={action.to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream hover:bg-sand/50 transition-colors">
              <action.icon className="w-4 h-4 text-earth" />
              <span className="text-sm font-medium text-charcoal">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      {messages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-charcoal">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs text-earth hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 4).map(msg => (
              <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-lg ${!msg.isRead ? 'bg-earth/5' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-medium text-sm flex-shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-charcoal">{msg.name}</p>
                    <p className="text-xs text-muted flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
                {!msg.isRead && <div className="w-2 h-2 rounded-full bg-earth flex-shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
