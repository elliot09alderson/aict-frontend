import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy } from "lucide-react";

interface MatchCardProps {
  team1: string;
  team2: string;
  team1Logo?: string;
  team2Logo?: string;
  team1Score?: string;
  team2Score?: string;
  status: "live" | "upcoming" | "completed";
  time: string;
  venue: string;
  matchType: string;
  winner?: string;
}

const MatchCard = ({
  team1,
  team2,
  team1Logo,
  team2Logo,
  team1Score,
  team2Score,
  status,
  time,
  venue,
  matchType,
  winner,
}: MatchCardProps) => {
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="group overflow-hidden border-0 bg-gradient-to-br from-card to-muted/30 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Status Bar */}
      <div className={`h-1 w-full ${
        status === "live"
          ? "bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
          : status === "upcoming"
            ? "bg-gradient-to-r from-blue-500 to-cyan-500"
            : "bg-gradient-to-r from-green-500 to-emerald-500"
      }`} />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Badge
            className={`font-bold text-xs px-3 py-1 ${
              status === "live"
                ? "bg-red-500/10 text-red-500 border-red-500/30"
                : status === "upcoming"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                  : "bg-green-500/10 text-green-500 border-green-500/30"
            }`}
            variant="outline"
          >
            {status === "live" && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
            {status.toUpperCase()}
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {matchType}
          </span>
        </div>

        {/* Teams Container */}
        <div className="flex items-center justify-between gap-3">
          {/* Team 1 */}
          <div className="flex-1 text-center">
            <div className="relative mx-auto mb-3">
              {team1Logo ? (
                <img
                  src={team1Logo}
                  alt={team1}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-md mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md mx-auto">
                  {getInitials(team1)}
                </div>
              )}
              {winner === team1 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Trophy className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className="font-bold text-sm text-foreground truncate" title={team1}>{team1}</p>
            {team1Score && (
              <p className="text-xl font-black text-primary mt-1">{team1Score}</p>
            )}
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center px-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-black text-muted-foreground">VS</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 text-center">
            <div className="relative mx-auto mb-3">
              {team2Logo ? (
                <img
                  src={team2Logo}
                  alt={team2}
                  className="w-16 h-16 rounded-full object-cover border-2 border-secondary/20 shadow-md mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-white font-bold text-lg shadow-md mx-auto">
                  {getInitials(team2)}
                </div>
              )}
              {winner === team2 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Trophy className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className="font-bold text-sm text-foreground truncate" title={team2}>{team2}</p>
            {team2Score && (
              <p className="text-xl font-black text-secondary mt-1">{team2Score}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-border/50 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="truncate">{time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{venue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
