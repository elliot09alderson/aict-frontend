import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Search, Trophy, Users, Loader2, Filter } from "lucide-react";
import axios from "axios";

interface Tournament {
  _id: string;
  title: string;
  banner1: string;
  status: string;
  startDate: string;
  endDate: string;
  location: {
    city: string;
  };
  maxTeams: number;
  teams: string[];
  prize: {
    firstPrize: number;
  };
}

const Tournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [searchQuery, activeTab, tournaments]);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("/api/tournament/all");
      setTournaments(res.data.tournaments || []);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      setTournaments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTournaments = () => {
    if (!tournaments) return;
    let filtered = [...tournaments];

    // Filter by tab
    if (activeTab !== "all") {
        if (activeTab === "upcoming") {
             filtered = filtered.filter(t => t.status === "upcoming" || t.status === "open");
        } else {
             filtered = filtered.filter(t => t.status === activeTab);
        }
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        (t.title && t.title.toLowerCase().includes(query)) || 
        (t.location?.city && t.location.city.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first for completed, nearest first for upcoming)
    filtered.sort((a, b) => {
        const dateA = new Date(a.startDate || Date.now()).getTime();
        const dateB = new Date(b.startDate || Date.now()).getTime();
        if (activeTab === 'completed') return dateB - dateA;
        return dateA - dateB;
    });

    setFilteredTournaments(filtered);
  };

  const TournamentGrid = ({ items }: { items: Tournament[] }) => {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Trophy className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No Tournaments Found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((tournament) => (
          <Card 
            key={tournament._id} 
            className="group cursor-pointer overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            onClick={() => navigate(`/tournament/${tournament._id}`)}
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img 
                src={tournament.banner1 || "/placeholder-tournament.jpg"} 
                alt={tournament.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge variant={tournament.status === 'ongoing' ? 'default' : 'secondary'} className="uppercase font-bold shadow-sm backdrop-blur-md">
                  {tournament.status}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
            
            <CardContent className="p-5 flex flex-col flex-grow">
              <h3 className="font-heading text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                {tournament.title}
              </h3>
              
              <div className="space-y-3 text-sm text-muted-foreground flex-grow">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{tournament.location?.city || "TBD"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>₹{tournament.prize?.firstPrize?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{tournament.teams?.length || 0}/{tournament.maxTeams} Teams</span>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 text-foreground">
                    Tournaments
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Discover and register for the best cricket tournaments happening around you. Compete, win prizes, and make your mark.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end md:items-center">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="completed">Past</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search tournaments..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading tournaments...</p>
                </div>
            ) : (
                <TournamentGrid items={filteredTournaments} />
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tournaments;
