import { motion } from "framer-motion";
import { Users, Trophy, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Organizers", value: "24", icon: Users, color: "from-primary to-accent" },
  { title: "Active Tournaments", value: "12", icon: Trophy, color: "from-accent to-primary" },
  { title: "Upcoming Matches", value: "48", icon: Calendar, color: "from-primary to-accent" },
  { title: "Monthly Growth", value: "+15%", icon: TrendingUp, color: "from-accent to-primary" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (identifier: string) => {
      switch (identifier) {
          case "Total Organizers":
          case "Add Organizer":
              navigate("/admin/organizers");
              break;
          case "Active Tournaments":
          case "Manage Tournaments":
              navigate("/admin/tournaments");
              break;
          case "Upcoming Matches":
          case "System Logs": // Mapping System Logs to matches/scoreboard for now as placeholder or settings
              navigate("/admin/scoreboard");
              break;
          case "Monthly Growth":
          case "View Reports":
              navigate("/admin/settings"); // Or show toast
              break;
          default:
              break;
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className="lg:hidden w-fit p-0 hover:bg-transparent" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of platform statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation(stat.title)}
            className="cursor-pointer"
          >
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors shadow-sm hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New organizer registered", time: "2 hours ago" },
                { action: "Tournament created: IPL 2024", time: "5 hours ago" },
                { action: "Organizer account verified", time: "1 day ago" },
                { action: "System settings updated", time: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-primary/10 last:border-0">
                  <span className="text-foreground">{item.action}</span>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add Organizer", icon: Users },
                { label: "View Reports", icon: TrendingUp },
                { label: "Manage Tournaments", icon: Trophy },
                { label: "System Logs", icon: Calendar },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/10 transition-colors border border-primary/20 cursor-pointer"
                  onClick={() => handleNavigation(action.label)}
                >
                  <action.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
