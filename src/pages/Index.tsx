import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UpcomingTournaments from "@/components/UpcomingTournaments";
import UpcomingMatches from "@/components/UpcomingMatches";
import StatsSection from "@/components/StatsSection";
import ReelsSection from "@/components/ReelsSection";
import FeaturedPlayersSection from "@/components/FeaturedPlayersSection";
import TournamentGallerySection from "@/components/TournamentGallerySection";
import SponsorsBanner from "@/components/SponsorsBanner";
import NewsUpdatesSection from "@/components/NewsUpdatesSection";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import FanZoneSection from "@/components/FanZoneSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <UpcomingTournaments />
        <UpcomingMatches />
        {/* <StatsSection />
        <ReelsSection />
        <FeaturedPlayersSection />
        <TournamentGallerySection />
        <SponsorsBanner />
        <NewsUpdatesSection />
        <AdvertisementBanner />
        <FanZoneSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
