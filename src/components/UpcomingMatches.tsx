import { useState, useEffect } from "react";
import MatchCard from "./MatchCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";

interface Match {
  _id: string;
  tournament: { _id: string; title: string };
  opponentX: { _id: string; title: string; banner?: string };
  opponentY: { _id: string; title: string; banner?: string };
  winner?: { _id: string; title: string };
  status: "scheduled" | "live" | "completed" | "abandoned";
  won_by_run?: number;
  won_by_wicket?: number;
  semifinal?: boolean;
  final?: boolean;
  createdAt: string;
}

const UpcomingMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("/api/match/all");
      setMatches(res.data.matches || []);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMatchStatus = (status: string): "live" | "upcoming" | "completed" => {
    if (status === "scheduled") return "upcoming";
    if (status === "live") return "live";
    return "completed";
  };

  const formatMatchTime = (match: Match): string => {
    if (match.status === "live") return "Live Now";
    if (match.status === "completed") {
      return "Completed";
    }
    return new Date(match.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getMatchType = (match: Match): string => {
    if (match.final) return "Final";
    if (match.semifinal) return "Semi-Final";
    return "League";
  };

  // Extract clean team name (handles corrupted data with objects in title)
  const getTeamName = (team: { title: string } | null): string => {
    if (!team?.title) return "TBD";
    // If title contains object notation, extract just the team name part
    const title = team.title;
    if (title.includes("}")) {
      const parts = title.split("}");
      return parts[parts.length - 1].trim() || "Team";
    }
    return title;
  };

  return (
    <section id="matches" className="bg-background py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Upcoming Matches
            </h2>
            <p className="text-muted-foreground">
              Don't miss the action-packed cricket matches
            </p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex">
            View All Matches
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No matches scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {matches.slice(0, 4).map((match, index) => (
              <div key={match._id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <MatchCard
                  team1={getTeamName(match.opponentX)}
                  team2={getTeamName(match.opponentY)}
                  team1Logo={match.opponentX?.banner}
                  team2Logo={match.opponentY?.banner}
                  status={formatMatchStatus(match.status)}
                  time={formatMatchTime(match)}
                  venue={match.tournament?.title || "Tournament"}
                  matchType={getMatchType(match)}
                  winner={match.winner ? getTeamName(match.winner) : undefined}
                />
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full">
            View All Matches
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;
