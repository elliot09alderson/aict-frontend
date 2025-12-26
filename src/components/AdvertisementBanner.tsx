import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const AdvertisementBanner = () => {
  return (
    <section className="bg-gradient-to-r from-cricket-blue via-cricket-blue-light to-cricket-blue py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          {/* Content */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              🎉 Special Offer
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Get Premium Access
            </h2>
            <p className="mb-6 text-lg text-white/90">
              Watch all matches live in HD, access exclusive content, and get detailed statistics.
              Subscribe now and get 30% off on annual plans!
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Subscribe Now
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm animate-pulse-glow">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-5xl font-bold text-white">30%</p>
                  <p className="text-lg font-semibold text-white">OFF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementBanner;
