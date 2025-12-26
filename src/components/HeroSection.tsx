import { Button } from "@/components/ui/button";
import { PlayCircle, Calendar } from "lucide-react";
import heroStadium from "@/assets/hero-stadium.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

const HeroSection = () => {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const res = await axios.get("/api/tournament/live-count");
        setLiveCount(res.data.count);
      } catch (error) {
        console.error("Failed to fetch live count", error);
      }
    };
    fetchLiveCount();
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroStadium}
          alt="Cricket Stadium"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full items-center px-4">
        <div className="max-w-2xl animate-fade-in">
          <div className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent backdrop-blur-sm">
            🏏 Live Tournament
          </div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
            All India Cricket
            <span className="block bg-gradient-to-r from-accent to-cricket-gold bg-clip-text text-transparent">
              Tournament 2025
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
            Experience the thrill of India's premier cricket tournament. Watch live matches,
            catch up on highlights, and follow your favorite teams.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Schedule
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Highlights
            </Button>
          </div>

          {/* Live Match Indicator */}
          {liveCount > 0 && (
            <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cricket-red opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-cricket-red"></span>
                </span>
                <span className="text-sm font-medium text-primary-foreground">
                    {liveCount} Tournaments Live Now
                </span>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
