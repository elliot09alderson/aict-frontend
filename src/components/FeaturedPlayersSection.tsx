import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FeaturedPlayersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const players = [
    {
      name: "Rohit Sharma",
      role: "Captain & Opener",
      team: "Mumbai Masters",
      stats: { runs: "2,458", avg: "52.3", sr: "145.2" },
      rating: 4.9,
      gradient: "from-cricket-blue to-cricket-blue-light",
    },
    {
      name: "Virat Kohli",
      role: "Batsman",
      team: "Delhi Dynamites",
      stats: { runs: "2,892", avg: "58.4", sr: "138.7" },
      rating: 5.0,
      gradient: "from-cricket-green to-cricket-green-light",
    },
    {
      name: "Jasprit Bumrah",
      role: "Fast Bowler",
      team: "Mumbai Masters",
      stats: { wickets: "145", avg: "18.2", econ: "6.8" },
      rating: 4.8,
      gradient: "from-accent to-cricket-gold",
    },
  ];

  return (
    <section ref={ref} className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Badge variant="outline" className="mb-4 border-accent/50 text-accent">
            ⭐ Star Performers
          </Badge>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Featured Players
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Meet the champions dominating the tournament
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-2xl">
                <div className={`h-2 bg-gradient-to-r ${player.gradient}`} />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-foreground">
                        {player.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{player.role}</p>
                      <p className="text-xs text-muted-foreground">{player.team}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1"
                    >
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-bold text-accent">{player.rating}</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                    {Object.entries(player.stats).map(([key, value], idx) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.15 + idx * 0.1 }}
                        className="text-center"
                      >
                        <p className="mb-1 text-xl font-bold text-foreground">{value}</p>
                        <p className="text-xs uppercase text-muted-foreground">{key}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                    className="mt-4 flex items-center gap-2 text-sm text-cricket-green"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Form trending upward</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlayersSection;
