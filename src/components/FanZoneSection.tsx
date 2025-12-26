import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Users, Sparkles } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FanZoneSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const posts = [
    {
      user: "Raj Kumar",
      avatar: "RK",
      time: "15 mins ago",
      content: "What a match! Mumbai's batting lineup is absolutely unstoppable this season! 🔥",
      likes: 234,
      comments: 45,
    },
    {
      user: "Priya Sharma",
      avatar: "PS",
      time: "1 hour ago",
      content: "Bumrah's last over was pure magic! Best death bowler in the tournament hands down! 🎯",
      likes: 567,
      comments: 89,
    },
    {
      user: "Arjun Patel",
      avatar: "AP",
      time: "2 hours ago",
      content: "Can't wait for the finals! Who do you think will win? Drop your predictions below! 🏆",
      likes: 423,
      comments: 156,
    },
  ];

  return (
    <section ref={ref} className="relative bg-gradient-to-br from-background via-primary/5 to-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" />
            Fan Zone
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Join the Conversation
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Connect with fellow cricket enthusiasts and share your passion
          </p>
        </motion.div>

        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white"
                    >
                      {post.avatar}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-foreground">{post.user}</h4>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-foreground">{post.content}</p>

                  <div className="flex items-center gap-4 border-t border-border/50 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-3xl border border-border/50 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"
          >
            <Users className="h-10 w-10 text-white" />
          </motion.div>
          
          <h3 className="mb-4 text-3xl font-bold text-foreground">
            Become Part of Our Community
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join 50,000+ cricket fans sharing their love for the game. Get exclusive updates, 
            participate in polls, and win exciting prizes!
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join Community
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FanZoneSection;
