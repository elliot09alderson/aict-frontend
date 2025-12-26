import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const SponsorsBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const sponsors = [
    "Dream11",
    "CEAT Tyres",
    "PayTM",
    "MRF",
    "Britannia",
    "Vivo",
    "BYJU'S",
    "Swiggy",
  ];

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-border/50 bg-card py-16">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Proudly Supported By
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-2 h-1 w-24 bg-gradient-to-r from-primary to-accent"
          />
        </motion.div>
        
        {/* Sponsors Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-12">
            {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: (index % sponsors.length) * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
                className="flex-shrink-0"
              >
                <div className="group relative flex h-20 w-40 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg">
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 opacity-0 transition-opacity group-hover:opacity-20" />
                  
                  <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg font-bold text-transparent transition-all group-hover:from-primary group-hover:to-accent">
                    {sponsor}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SponsorsBanner;
