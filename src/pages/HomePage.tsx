import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import HeroSection from '@/sections/HeroSection';
import StatsSection from '@/sections/StatsSection';
import AboutSection from '@/sections/AboutSection';
import GallerySection from '@/sections/GallerySection';
import DestinationsSection from '@/sections/DestinationsSection';
import BlogSection from '@/sections/BlogSection';
import ContentSections from '@/sections/ContentSections';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <GallerySection />
        <DestinationsSection />
        <ContentSections />
        <BlogSection />
      </main>
      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default HomePage;
