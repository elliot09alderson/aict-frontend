import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Trophy,
      value: "150+",
      label: "Tournaments Hosted",
      color: "text-cricket-gold",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Active Players",
      color: "text-cricket-green",
    },
    {
      icon: Calendar,
      value: "2000+",
      label: "Matches Organized",
      color: "text-cricket-blue",
    },
    {
      icon: Target,
      value: "10M+",
      label: "Fans Engaged",
      color: "text-accent",
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Tournament By Numbers
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join India's fastest-growing cricket community
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center"
              >
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="relative mb-2 text-5xl font-bold text-foreground"
              >
                {stat.value}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="relative text-sm font-medium text-muted-foreground"
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
