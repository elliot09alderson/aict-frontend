import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MatchesList } from "./MatchComponents";
import axios from "axios";

interface Tournament {
  _id: string;
  title: string;
  location: any;
  startDate: string;
  endDate: string;
  banner1?: string;
}

const AdminScoreboard = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await axios.get("/api/tournament/all");
            setTournaments(res.data.tournaments);
        } catch (error) {
            console.error("Failed to fetch tournaments");
        }
    };

    const filteredTournaments = tournaments.filter(
        (t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Scoreboard</h2>
                <p className="text-muted-foreground mt-1">View match results and schedules</p>
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
                        <Card 
                            className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden group cursor-pointer"
                            onClick={() => {
                                setSelectedTournament(tournament);
                                setIsDialogOpen(true);
                            }}
                        >
                            <div className="h-32 w-full bg-muted relative overflow-hidden">
                                {tournament.banner1 ? (
                                    <img src={tournament.banner1} alt={tournament.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <Trophy className="w-12 h-12 text-primary/40" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-foreground text-lg mb-1">{tournament.title}</h3>
                                <p className="text-xs text-muted-foreground">Click to view scoreboard</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Scoreboard - {selectedTournament?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4">
                        <MatchesList tournamentId={selectedTournament?._id} key={selectedTournament?._id} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminScoreboard;
