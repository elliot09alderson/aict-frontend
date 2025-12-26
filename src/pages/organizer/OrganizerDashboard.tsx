import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, TrendingUp, Users, ArrowRight, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/tournament/my-tournaments");
                setTournaments(res.data.tournaments);
            } catch (error: any) {
                console.error("Error fetching stats", error);
                // Optional: Toast error here too
            }
        };
        fetchStats();
    }, []);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const stats = [
        { 
            title: "Total Tournaments", 
            value: tournaments.length, 
            icon: Trophy, 
            color: "from-blue-500 to-indigo-500",
            bg: "bg-blue-500/10",
            trend: "+12%" 
        },
        { 
            title: "Active Events", 
            value: tournaments.filter((t: any) => t.status === 'ongoing' || new Date(t.endDate) >= new Date()).length, 
            icon: Zap, 
            color: "from-amber-500 to-orange-500",
            bg: "bg-amber-500/10",
            trend: "Now Live" 
        },
        { 
            title: "Total Teams", 
            value: tournaments.reduce((acc: number, t: any) => acc + (t.teams?.length || 0), 0), 
            icon: Users, 
            color: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-500/10",
            trend: "+5 this week" 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-primary p-8 text-primary-foreground shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-4xl font-heading font-bold mb-2">Welcome back, Organizer! 👋</h2>
                        <p className="text-primary-foreground/80 text-lg max-w-xl">
                            Ready to manage your next big cricket event? Your tournaments are looking great today.
                        </p>
                    </div>
                    <Button 
                        onClick={() => navigate("/organizer/tournaments")} 
                        size="lg" 
                        variant="secondary" 
                        className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        Create New Tournament <ArrowRight className="ml-2 w-4 h-4"/>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        onClick={() => {
                            if (stat.title === "Total Teams") navigate("/organizer/teams");
                            if (stat.title === "Total Tournaments" || stat.title === "Active Events") navigate("/organizer/tournaments");
                        }}
                    >
                        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group cursor-pointer">
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                <stat.icon className="w-24 h-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="z-10 relative">
                                <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <span className="text-emerald-500">{stat.trend}</span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Status */}
                <Card className="lg:col-span-2 border-none shadow-md bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Target className="w-5 h-5 text-primary"/> Tournament Overview
                        </CardTitle>
                        <CardDescription>Status of your ongoing events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {tournaments.slice(0, 3).map((t: any, i) => (
                                <div key={i} onClick={() => navigate("/organizer/tournaments")} className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background transition-colors border border-transparent hover:border-border/50 group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden relative">
                                            {t.banner1 ? (
                                                <img src={t.banner1} className="h-full w-full object-cover" alt={t.title} />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                    <Trophy className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</h4>
                                            <p className="text-xs text-muted-foreground">{t.location?.city || "Singrauli"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            t.status === 'ongoing' ? 'bg-amber-100 text-amber-700' : 
                                            t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {tournaments.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No tournaments yet. Start your journey!</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-none shadow-md bg-gradient-to-b from-card to-card/50">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your platform</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/organizer/teams")} 
                            className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left group"
                        >
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Manage Teams</h4>
                                <p className="text-xs text-muted-foreground">Add or edit squads</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/organizer/tournaments")} 
                            className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left group"
                        >
                            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">New Tournament</h4>
                                <p className="text-xs text-muted-foreground">Host a new event</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </motion.button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
