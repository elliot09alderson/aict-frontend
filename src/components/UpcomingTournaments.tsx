import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users, ChevronRight, Loader2 } from "lucide-react";
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

const UpcomingTournaments = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("/api/tournament/all");
      // Filter for upcoming or ongoing
      const upcoming = res.data.tournaments
        .filter((t: Tournament) => t.status === "upcoming" || t.status === "open" || t.status === "ongoing")
        .sort((a: Tournament, b: Tournament) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 4); // Show top 4
      setTournaments(upcoming);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tournaments" className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Upcoming Tournaments
            </h2>
            <p className="text-muted-foreground">
              Register for the biggest cricket events near you
            </p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex" onClick={() => navigate("/tournaments")}>
            View All Tournaments
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No upcoming tournaments at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tournaments.map((tournament) => (
              <Card 
                key={tournament._id} 
                className="group cursor-pointer overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/tournament/${tournament._id}`)}
              >
                <div className="aspect-video relative overflow-hidden">
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
                
                <CardContent className="p-5 relative">
                  <h3 className="font-heading text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                    {tournament.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{tournament.location?.city || "TBD"}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span>₹{tournament.prize?.firstPrize?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <Users className="w-3 h-3" />
                            <span>{tournament.teams?.length || 0}/{tournament.maxTeams} Teams</span>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full" onClick={() => navigate("/tournaments")}>
            View All Tournaments
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments;
