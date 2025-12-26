import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Heart, Share2 } from "lucide-react";
import cricketAction1 from "@/assets/cricket-action-1.jpg";
import cricketAction2 from "@/assets/cricket-action-2.jpg";
import cricketCelebration from "@/assets/cricket-celebration.jpg";

const TournamentGallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const gallery = [
    {
      image: cricketAction1,
      title: "Championship Final",
      views: "2.5M",
      likes: "145K",
      category: "Match Highlights",
    },
    {
      image: cricketAction2,
      title: "Best Catches",
      views: "1.8M",
      likes: "98K",
      category: "Skills",
    },
    {
      image: cricketCelebration,
      title: "Victory Celebration",
      views: "3.2M",
      likes: "210K",
      category: "Moments",
    },
    {
      image: cricketAction1,
      title: "Record Breaking",
      views: "2.1M",
      likes: "167K",
      category: "Records",
    },
    {
      image: cricketAction2,
      title: "Team Spirit",
      views: "1.5M",
      likes: "89K",
      category: "Behind the Scenes",
    },
    {
      image: cricketCelebration,
      title: "Fan Moments",
      views: "1.9M",
      likes: "123K",
      category: "Fans",
    },
  ];

  return (
    <section ref={ref} className="bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Tournament Gallery
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Relive the most memorable moments from the tournament
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                />
              </div>

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end transition-opacity"
              >
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {item.category}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{item.views}</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{item.likes}</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="ml-auto cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Top Corner Badge */}
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
                >
                  <Heart className="h-5 w-5 text-cricket-red" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentGallerySection;
