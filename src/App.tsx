import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminStore } from '@/store';

// Public Pages
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import SingleBlogPage from '@/pages/SingleBlogPage';
import DestinationsPage from '@/pages/DestinationsPage';
import SingleDestinationPage from '@/pages/SingleDestinationPage';
import GalleryPage from '@/pages/GalleryPage';
import GalleryCategoryPage from '@/pages/GalleryCategoryPage';
import CountriesPage from '@/pages/CountriesPage';
import JourneysPage from '@/pages/JourneysPage';
import ContactPage from '@/pages/ContactPage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';

// Admin Pages
import AdminLogin from '@/admin/AdminLogin';
import AdminDashboard from '@/admin/AdminDashboard';
import AdminBlogs from '@/admin/AdminBlogs';
import AdminDestinations from '@/admin/AdminDestinations';
import AdminGallery from '@/admin/AdminGallery';
import AdminJourneys from '@/admin/AdminJourneys';
import AdminChat from '@/admin/AdminChat';
import AdminCountries from '@/admin/AdminCountries';
import AdminSettings from '@/admin/AdminSettings';
import AdminProducts from '@/admin/AdminProducts';
import AdminOrders from '@/admin/AdminOrders';
import AdminPaymentSettings from '@/admin/AdminPaymentSettings';
import AdminContent from '@/admin/AdminContent';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<SingleBlogPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:slug" element={<SingleDestinationPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:slug" element={<GalleryCategoryPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/journeys" element={<JourneysPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin Routes - Hidden from navigation */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute>
              <AdminBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/destinations"
          element={
            <ProtectedRoute>
              <AdminDestinations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/journeys"
          element={
            <ProtectedRoute>
              <AdminJourneys />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <ProtectedRoute>
              <AdminChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/countries"
          element={
            <ProtectedRoute>
              <AdminCountries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminPaymentSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute>
              <AdminContent />
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
