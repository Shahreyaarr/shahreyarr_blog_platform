import { Link } from 'react-router-dom';
import {
  useGalleryStore,
  useDestinationStore,
  useBlogStore,
  useMessageStore,
  useJourneyStore,
  useCountryStore,
  useSettingsStore,
} from '@/store';
import AdminLayout from './AdminLayout';
import { Image, MapPin, FileText, Mail, Calendar, Globe, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { images } = useGalleryStore();
  const { destinations } = useDestinationStore();
  const { blogs } = useBlogStore();
  const { messages, getUnreadCount } = useMessageStore();
  const { journeys } = useJourneyStore();
  const { getVisitedCountries } = useCountryStore();
  const { stats } = useSettingsStore();

  const unreadCount = getUnreadCount();
  const visitedCountries = getVisitedCountries();

  const statCards = [
    {
      title: 'Gallery Images',
      value: images.length,
      icon: Image,
      color: 'bg-blue-500',
      link: '/admin/gallery',
    },
    {
      title: 'Destinations',
      value: destinations.length,
      icon: MapPin,
      color: 'bg-orange-500',
      link: '/admin/destinations',
    },
    {
      title: 'Blog Posts',
      value: blogs.length,
      icon: FileText,
      color: 'bg-green-500',
      link: '/admin/blogs',
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: Mail,
      color: 'bg-red-500',
      link: '/admin/messages',
      badge: unreadCount,
    },
    {
      title: 'Journeys',
      value: journeys.length,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/journeys',
    },
    {
      title: 'Countries',
      value: visitedCountries.length,
      icon: Globe,
      color: 'bg-yellow-500',
      link: '/admin/countries',
    },
  ];

  const quickActions = [
    { label: 'Add Gallery Image', link: '/admin/gallery', color: 'bg-blue-500' },
    { label: 'Add Destination', link: '/admin/destinations', color: 'bg-orange-500' },
    { label: 'New Blog Post', link: '/admin/blogs', color: 'bg-green-500' },
    { label: 'Create Journey', link: '/admin/journeys', color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {card.value}
                      {card.badge ? (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
                          {card.badge} new
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${card.color} bg-opacity-10 flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.link}>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-4 px-6 hover:bg-gray-50"
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Travel Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Travel Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Distance Traveled</span>
                <span className="font-semibold">{stats.total_distance_km.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Countries Visited</span>
                <span className="font-semibold">{stats.countries_visited}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">States Covered</span>
                <span className="font-semibold">{stats.states_covered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Photos Captured</span>
                <span className="font-semibold">{stats.total_photos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stories Shared</span>
                <span className="font-semibold">{stats.total_blogs}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">New blog post published</p>
                    <p className="text-sm text-gray-500">{blog.title}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {images.slice(0, 2).map((image) => (
              <div
                key={image.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Image className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New image added to gallery</p>
                    <p className="text-sm text-gray-500">{image.title}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(image.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
