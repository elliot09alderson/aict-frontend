import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Trophy, Users, Share2, ArrowLeft, Loader2 } from "lucide-react";
import MatchCard from "@/components/MatchCard"; // Assuming we can reuse this or creating a similar one
import axios from "axios";

interface Tournament {
  _id: string;
  title: string;
  banner1: string;
  status: string;
  startDate: string;
  endDate: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  maxTeams: number;
  teams: string[];
  prize: {
    firstPrize: number;
    secondPrize: number;
    extraPrize?: number;
  };
  rules: string;
  description?: string;
}

interface Match {
    _id: string;
    opponentX: { title: string; banner?: string };
    opponentY: { title: string; banner?: string };
    status: "scheduled" | "live" | "completed" | "abandoned";
    winner?: { title: string };
    createdAt: string;
}

const PublicTournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
        const [tournRes, matchesRes] = await Promise.all([
            axios.get(`/api/tournament/${id}`),
             axios.get("/api/match/all") // Using all matches and filtering client side as per plan
        ]);
        
        setTournament(tournRes.data.tournament);
        
        // Filter matches for this tournament
        // Assuming match object has tournament field which is either ID string or object
        const allMatches = matchesRes.data.matches || [];
        const tournamentMatches = allMatches.filter((m: any) => {
            const tId = typeof m.tournament === 'object' ? m.tournament._id : m.tournament;
            return tId === id;
        });
        setMatches(tournamentMatches);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchStatus = (status: string): "live" | "upcoming" | "completed" => {
    if (status === "scheduled") return "upcoming";
    if (status === "live") return "live";
    return "completed";
  };

  const formatMatchTime = (match: Match): string => {
      if (match.status === 'live') return 'Live Now';
      if (match.status === 'completed') return 'Completed';
      return new Date(match.createdAt).toLocaleDateString();
  }
  
  const getTeamName = (team: any) => {
      if (!team?.title) return "TBD";
       const title = team.title;
        if (title.includes("}")) {
            const parts = title.split("}");
            return parts[parts.length - 1].trim() || "Team";
        }
        return title;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
             <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
               <h2 className="text-2xl font-bold mb-2">Tournament Not Found</h2>
               <p className="mb-4 text-muted-foreground">The tournament you are looking for does not exist or has been removed.</p>
               <Button onClick={() => navigate("/tournaments")}>Browse Tournaments</Button>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Banner Section */}
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
            <img 
                src={tournament.banner1 || "/placeholder-tournament.jpg"} 
                alt={tournament.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <div className="container mx-auto">
                    <div className="mb-4">
                        <Badge className="text-base px-3 py-1 uppercase">{tournament.status}</Badge>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-2 shadow-sm">{tournament.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tournament.location?.city}, {tournament.location?.state}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => navigate("/tournaments")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 mb-6">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground px-6 py-3">Overview</TabsTrigger>
                            <TabsTrigger value="matches" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground px-6 py-3">Matches</TabsTrigger>
                            {/* <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground px-6 py-3">Teams</TabsTrigger> */}
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                             <Card className="border-none shadow-none bg-transparent">
                                <CardContent className="p-0 space-y-6">
                                    {tournament.description && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-3">About Tournament</h3>
                                            <p className="text-muted-foreground leading-relaxed">{tournament.description}</p>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Rules & Regulations</h3>
                                        <div className="bg-muted/30 p-4 rounded-lg text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed border">
                                            {tournament.rules || "No specific rules mentioned."}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Location</h3>
                                        <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3 border">
                                            <MapPin className="w-5 h-5 text-primary mt-1" />
                                            <div>
                                                <p className="font-semibold">{tournament.location?.address}</p>
                                                <p className="text-muted-foreground">{tournament.location?.city}, {tournament.location?.state} - {tournament.location?.pincode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>
                        </TabsContent>
                        
                        <TabsContent value="matches" className="animate-in fade-in slide-in-from-bottom-2">
                            {matches.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                    <p className="text-muted-foreground">No matches scheduled yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                     {matches.map((match) => (
                                         <MatchCard
                                            key={match._id}
                                            team1={getTeamName(match.opponentX)}
                                            team2={getTeamName(match.opponentY)}
                                            team1Logo={match.opponentX?.banner}
                                            team2Logo={match.opponentY?.banner}
                                            status={getMatchStatus(match.status)}
                                            time={formatMatchTime(match)}
                                            venue={tournament.title}
                                            matchType="League" // Defaulting as specific type isn't always available in list view
                                            winner={match.winner ? getTeamName(match.winner) : undefined}
                                         />
                                     ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">Tournament Info</h3>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Trophy className="w-4 h-4" />
                                    <span>Prize Pool</span>
                                </div>
                                <span className="font-bold text-lg text-primary">₹{(tournament.prize?.firstPrize + (tournament.prize?.secondPrize || 0)).toLocaleString()}</span>
                            </div>
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span>First Prize</span>
                                </div>
                                <span className="font-bold">₹{tournament.prize?.firstPrize?.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>Teams</span>
                                </div>
                                <span className="font-bold">{tournament.teams?.length || 0} / {tournament.maxTeams}</span>
                            </div>

                             <Button className="w-full gap-2" variant="outline">
                                <Share2 className="w-4 h-4" /> Share Tournament
                             </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicTournamentDetails;
