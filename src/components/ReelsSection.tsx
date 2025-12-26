import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PlayCircle, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import cricketAction1 from "@/assets/cricket-action-1.jpg";
import cricketAction2 from "@/assets/cricket-action-2.jpg";
import cricketCelebration from "@/assets/cricket-celebration.jpg";

const ReelsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reels = [
    {
      id: 1,
      title: "Massive Six!",
      thumbnail: cricketAction1,
      views: "2.5M",
      duration: "0:45",
    },
    {
      id: 2,
      title: "Unbelievable Catch",
      thumbnail: cricketAction2,
      views: "1.8M",
      duration: "0:30",
    },
    {
      id: 3,
      title: "Championship Moment",
      thumbnail: cricketCelebration,
      views: "3.2M",
      duration: "1:15",
    },
    {
      id: 4,
      title: "Hat-trick Bowling",
      thumbnail: cricketAction1,
      views: "1.5M",
      duration: "1:00",
    },
  ];

  return (
    <section ref={ref} id="reels" className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background py-24">
      {/* Background Elements */}
      <div className="absolute left-0 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
          >
            <PlayCircle className="h-4 w-4" />
            Trending Now
          </motion.div>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Cricket Reels
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Experience the best moments in bite-sized videos
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -10 }}
            >
              <Card className="group relative overflow-hidden border-0 bg-transparent">
                <CardContent className="p-0">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl">
                    <motion.img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="h-full w-full object-cover"
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Play Button */}
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{
                        scale: hoveredIndex === index ? 1.2 : 1,
                      }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.div
                        animate={{
                          boxShadow:
                            hoveredIndex === index
                              ? "0 0 40px rgba(255, 255, 255, 0.4)"
                              : "0 0 0px rgba(255, 255, 255, 0)",
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
                      >
                        <PlayCircle className="h-8 w-8 fill-primary text-primary" />
                      </motion.div>
                    </motion.div>

                    {/* Duration Badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {reel.duration}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        className="mb-2 text-lg font-bold text-white"
                      >
                        {reel.title}
                      </motion.h3>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        className="flex items-center gap-2 text-sm text-white/80"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{reel.views} views</span>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
