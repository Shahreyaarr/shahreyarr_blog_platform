import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminStore } from '@/store';

// Public Pages
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import SingleBlogPage from '@/pages/SingleBlogPage';
import GalleryPage from '@/pages/GalleryPage';
import GalleryCategoryPage from '@/pages/GalleryCategoryPage';
import DestinationsPage from '@/pages/DestinationsPage';
import SingleDestinationPage from '@/pages/SingleDestinationPage';
import CountriesPage from '@/pages/CountriesPage';
import JourneysPage from '@/pages/JourneysPage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import ContactPage from '@/pages/ContactPage';

// Admin Pages
import AdminLogin from '@/admin/AdminLogin';
import AdminLayout from '@/admin/AdminLayout';
import AdminDashboard from '@/admin/AdminDashboard';
import AdminBlogs from '@/admin/AdminBlogs';
import AdminGallery from '@/admin/AdminGallery';
import AdminVideos from '@/admin/AdminVideos';
import AdminDestinations from '@/admin/AdminDestinations';
import AdminCountries from '@/admin/AdminCountries';
import AdminJourneys from '@/admin/AdminJourneys';
import AdminShop from '@/admin/AdminShop';
import AdminMessages from '@/admin/AdminMessages';
import AdminChat from '@/admin/AdminChat';
import AdminSettings from '@/admin/AdminSettings';
import AdminOrders from '@/admin/AdminOrders';

const Guard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  return isAuthenticated() ? <>{children}</> : <Navigate to="/admin-login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<SingleBlogPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:slug" element={<GalleryCategoryPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:slug" element={<SingleDestinationPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/journeys" element={<JourneysPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Guard><AdminLayout /></Guard>}>
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="countries" element={<AdminCountries />} />
          <Route path="journeys" element={<AdminJourneys />} />
          <Route path="shop" element={<AdminShop />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
