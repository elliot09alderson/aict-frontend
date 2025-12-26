import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";

interface Team {
  _id: string;
  title: string;
  banner?: string;
  tournament: {
    _id: string;
    title: string;
  } | null;
  description?: string;
  players: any[]; // refine if needed
  createdAt: string;
}

const ManageTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
        const res = await axios.get("/api/team/all", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(res.data.teams);
    } catch (error) {
        console.error("Failed to fetch teams", error);
        toast({ title: "Error", description: "Failed to load teams", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;
    try {
        await axios.delete(`/api/team/${teamToDelete}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(teams.filter(t => t._id !== teamToDelete));
        toast({ title: "Success", description: "Team deleted successfully" });
        setTeamToDelete(null);
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to delete team",
            variant: "destructive"
        });
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.tournament?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Manage Teams</h2>
          <p className="text-muted-foreground mt-1">View and manage registered teams</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams or tournaments..."
          className="pl-10 bg-background/50 border-primary/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team, index) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden group">
              <div className="h-32 w-full bg-muted relative overflow-hidden">
                  {team.banner ? (
                      <img src={team.banner} alt={team.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Shield className="w-12 h-12 text-primary/40" />
                      </div>
                  )}
                  <div className="absolute top-2 right-2">
                       <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                           {team.players.length} Players
                       </Badge>
                  </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-foreground text-lg line-clamp-1">
                          {team.title.replace(/^\{[\s\S]*\}\s*/, "")}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {team.tournament ? team.tournament.title : "No Tournament"}
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end mt-4 pt-4 border-t border-primary/10">
                    <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setTeamToDelete(team._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Team
                    </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredTeams.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No teams found matching your search.
          </div>
        )}
      </div>

      <Dialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone and will remove the team from the tournament.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTeamToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTeams;
