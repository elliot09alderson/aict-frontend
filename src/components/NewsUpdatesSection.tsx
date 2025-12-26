import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Flame } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const NewsUpdatesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const news = [
    {
      badge: "Breaking",
      badgeColor: "bg-cricket-red text-white",
      title: "Mumbai Masters Secure Spot in Finals with Thrilling Victory",
      excerpt: "In a nail-biting finish, Mumbai Masters defeated Chennai Champions by 15 runs...",
      time: "2 hours ago",
      hot: true,
    },
    {
      badge: "Analysis",
      badgeColor: "bg-cricket-blue text-white",
      title: "Top 5 Performers of the Week: Statistical Breakdown",
      excerpt: "Our expert panel analyzes the standout performances from the past seven days...",
      time: "5 hours ago",
    },
    {
      badge: "Announcement",
      badgeColor: "bg-accent text-accent-foreground",
      title: "New Tournament Schedule Released for Knockout Stage",
      excerpt: "The Cricket Board announces revised timings for upcoming playoff matches...",
      time: "8 hours ago",
    },
    {
      badge: "Interview",
      badgeColor: "bg-cricket-green text-white",
      title: "Captain's Corner: Exclusive Chat with Rohit Sharma",
      excerpt: "The Mumbai skipper shares insights on team strategy and tournament goals...",
      time: "1 day ago",
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-muted/30 py-24">
      {/* Decorative Element */}
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                <Flame className="h-4 w-4" />
                Latest Updates
              </div>
              <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                News & Updates
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Stay updated with the latest cricket news, match analyses, and exclusive interviews
              </p>
            </div>
            <Button variant="outline" className="hidden lg:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-xl">
                {item.hot && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute right-4 top-4"
                  >
                    <Flame className="h-6 w-6 fill-cricket-red text-cricket-red" />
                  </motion.div>
                )}
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className={`${item.badgeColor} border-0`}>
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="mb-4 text-muted-foreground line-clamp-2">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-sm font-semibold text-primary"
                    >
                      Read More →
                    </motion.div>
                  </div>
                </CardContent>

                {/* Hover Effect Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-1 bg-gradient-to-r from-primary to-accent origin-left"
                />
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center lg:hidden"
        >
          <Button variant="outline" className="w-full">
            View All Updates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsUpdatesSection;
