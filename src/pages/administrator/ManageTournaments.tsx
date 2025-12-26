import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, Calendar, MapPin, Plus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { MatchesList, CreateMatchForm } from "./MatchComponents";

interface Tournament {
  _id: string;
  title: string;
  location: any; // Can be string or object
  startDate: string;
  endDate: string;
  banner1?: string;
  status?: string;
}

const ManageTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isCreateMatchOpen, setIsCreateMatchOpen] = useState(false);
  
  const [newTournament, setNewTournament] = useState({
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      prize: "",
      rules: ""
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const { toast } = useToast();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
        const res = await axios.get("/api/tournament/all"); // Admin can see all
        setTournaments(res.data.tournaments);
    } catch (error) {
        toast({ title: "Error", description: "Failed to load tournaments", variant: "destructive" });
    }
  };

  const handleCreate = async () => {
      try {
          const formData = new FormData();
          formData.append("title", newTournament.title);
          formData.append("location", newTournament.location);
          formData.append("startDate", newTournament.startDate);
          formData.append("endDate", newTournament.endDate);
          formData.append("description", newTournament.description);
          formData.append("prize", newTournament.prize);
          formData.append("rules", newTournament.rules);
          if (bannerFile) {
              formData.append("banner1", bannerFile);
          }

          await axios.post("/api/tournament/create", formData, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data" 
              }
          });
          toast({ title: "Success", description: "Tournament created successfully" });
          setIsDialogOpen(false);
          fetchTournaments();
          // Reset form
          setNewTournament({
              title: "",
              location: "",
              startDate: "",
              endDate: "",
              description: "",
              prize: "",
              rules: ""
          });
          setBannerFile(null);
      } catch (error: any) {
          toast({
              title: "Error",
              description: error.response?.data?.message || "Failed to create tournament",
              variant: "destructive"
          });
      }
  }

  const filteredTournaments = tournaments.filter(
    (t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Manage Tournaments</h2>
          <p className="text-muted-foreground mt-1">Create and manage tournaments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Plus className="w-4 h-4" /> Create Tournament
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Tournament</DialogTitle>
                    <DialogDescription>Fill in the details for the new tournament.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input value={newTournament.title} onChange={e => setNewTournament({...newTournament, title: e.target.value})} placeholder="IPL 2025" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                             <Label>Start Date</Label>
                             <Input type="date" value={newTournament.startDate} onChange={e => setNewTournament({...newTournament, startDate: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                             <Label>End Date</Label>
                             <Input type="date" value={newTournament.endDate} onChange={e => setNewTournament({...newTournament, endDate: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input value={newTournament.location} onChange={e => setNewTournament({...newTournament, location: e.target.value})} placeholder="Stadium or City" />
                    </div>
                     <div className="grid gap-2">
                        <Label>Prize Pool</Label>
                        <Input value={newTournament.prize} onChange={e => setNewTournament({...newTournament, prize: e.target.value})} placeholder="100000" />
                    </div>
                     <div className="grid gap-2">
                        <Label>Banner Image</Label>
                        <Input type="file" accept="image/*" onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                                setBannerFile(e.target.files[0]);
                            }
                        }} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Rules</Label>
                        <Textarea value={newTournament.rules} onChange={e => setNewTournament({...newTournament, rules: e.target.value})} placeholder="Tournament rules..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Create Tournament</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

       <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tournaments..."
          className="pl-10 bg-background/50 border-primary/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.map((tournament, index) => (
          <motion.div
            key={tournament._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
             <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden group h-full flex flex-col">
                 <div className="h-32 w-full bg-muted relative overflow-hidden">
                    {tournament.banner1 ? (
                        <img src={tournament.banner1} alt={tournament.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                         <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <Trophy className="w-12 h-12 text-primary/40" />
                        </div>
                    )}
                 </div>
                 <CardContent className="p-4 flex-1 flex flex-col">
                     <h3 className="font-semibold text-foreground text-lg mb-2">{tournament.title}</h3>
                     <div className="space-y-2 text-sm text-muted-foreground mb-4">
                         <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4" /> 
                             {typeof tournament.location === 'object' ? (
                                 <span>{tournament.location.city}{tournament.location.state ? `, ${tournament.location.state}` : ''}</span>
                             ) : (
                                 tournament.location
                             )}
                         </div>
                         <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4" /> 
                             {new Date(tournament.startDate).toLocaleDateString()}
                         </div>
                     </div>
                      <div className="mt-auto pt-4 border-t border-primary/10 flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                              setSelectedTournament(tournament);
                              setIsMatchDialogOpen(true);
                          }}>Manage Matches</Button>
                       </div>
                 </CardContent>
             </Card>
          </motion.div>
        ))}

        <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Matches - {selectedTournament?.title}</DialogTitle>
                    <DialogDescription>Schedule and update matches for this tournament.</DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Matches</h3>
                        <Button size="sm" onClick={() => setIsCreateMatchOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Schedule Match
                        </Button>
                    </div>

                    <MatchesList tournamentId={selectedTournament?._id} key={selectedTournament?._id} />
                </div>
            </DialogContent>
        </Dialog>

        {/* Create Match Dialog (Nested or separate) */}
        <Dialog open={isCreateMatchOpen} onOpenChange={setIsCreateMatchOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule New Match</DialogTitle>
                </DialogHeader>
                <CreateMatchForm 
                    tournamentId={selectedTournament?._id} 
                    onSuccess={() => {
                        setIsCreateMatchOpen(false);
                    }} 
                />
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ManageTournaments;
