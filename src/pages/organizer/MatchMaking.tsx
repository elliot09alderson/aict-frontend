import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, Reorder, useDragControls } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Trophy, GripVertical, X, Swords, Calendar, Users, Clock } from "lucide-react";

interface Team {
    _id: string;
    title: string;
    banner?: string;
}

interface Match {
    _id: string;
    opponentX: Team;
    opponentY: Team;
    matchDate: string;
    status: string;
}

const MatchMaking = () => {
    const { toast } = useToast();
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState("");
    
    // All available teams for the selected tournament
    const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
    const [scheduledMatches, setScheduledMatches] = useState<Match[]>([]);
    
    // Slots for the match
    const [slotA, setSlotA] = useState<Team | null>(null);
    const [slotB, setSlotB] = useState<Team | null>(null);
    const [matchDate, setMatchDate] = useState("");

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await axios.get("/api/tournament/my-tournaments");
            setTournaments(res.data.tournaments);
        } catch (error) {
             console.error(error);
             toast({ title: "Error", description: "Failed to load tournaments", variant: "destructive" });
        }
    };

    const fetchMatches = async (tournamentId: string) => {
        try {
            const res = await axios.get(`/api/match/all?tournamentId=${tournamentId}`);
            setScheduledMatches(res.data.matches);
        } catch (error) {
            console.error("Failed to load matches", error);
        }
    };

    const handleTournamentChange = async (tournamentId: string) => {
        setSelectedTournament(tournamentId);
        setSlotA(null);
        setSlotB(null);
        setScheduledMatches([]); // Clear previous
        if (!tournamentId) {
            setAvailableTeams([]);
            return;
        }

        try {
             // Parallel fetch
             const [teamsRes, matchesRes] = await Promise.all([
                 axios.get(`/api/tournament/${tournamentId}`),
                 axios.get(`/api/match/all?tournamentId=${tournamentId}`)
             ]);

             setAvailableTeams(teamsRes.data.tournament.teams || []);
             setScheduledMatches(matchesRes.data.matches || []);
        } catch (error) {
            console.error("Failed to load data", error);
            toast({ title: "Error", description: "Failed to load tournament data", variant: "destructive" });
        }
    };

    const handleDragStart = (e: any, team: Team) => {
        e.dataTransfer.setData("teamId", team._id);
    };

    const handleDrop = (e: any, slot: 'A' | 'B') => {
        e.preventDefault();
        const teamId = e.dataTransfer.getData("teamId");
        const team = availableTeams.find(t => t._id === teamId);
        
        if (!team) return;

        // Prevent same team in both slots
        if (slot === 'A' && slotB?._id === team._id) return;
        if (slot === 'B' && slotA?._id === team._id) return;

        if (slot === 'A') setSlotA(team);
        if (slot === 'B') setSlotB(team);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };


    const handleCreateMatch = async () => {
        if (!slotA || !slotB || !matchDate) {
            toast({ title: "Error", description: "Please select teams and a date", variant: "destructive" });
            return;
        }

        try {
            await axios.post("/api/match/create", {
                tournamentId: selectedTournament,
                opponentX: slotA._id,
                opponentY: slotB._id,
                matchDate: matchDate
            });
            
            toast({
                title: "Match Scheduled",
                description: `${slotA.title} vs ${slotB.title} on ${new Date(matchDate).toLocaleDateString()}`,
            });
            
            // Refresh matches list
            fetchMatches(selectedTournament);

            // Reset
            setSlotA(null);
            setSlotB(null);
            setMatchDate("");
        } catch (error: any) {
             toast({ title: "Error", description: error.response?.data?.message || "Failed to create match", variant: "destructive" });
        }
    };

    const clearSlot = (slot: 'A' | 'B') => {
        if (slot === 'A') setSlotA(null);
        if (slot === 'B') setSlotB(null);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold">Match Making</h2>
                    <p className="text-muted-foreground">Drag and drop teams to schedule matches</p>
                </div>
                
                <div className="w-full md:w-64">
                    <Select onValueChange={handleTournamentChange} value={selectedTournament}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Tournament" />
                        </SelectTrigger>
                        <SelectContent>
                             {tournaments.map((t: any) => (
                                 <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedTournament ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                        {/* Available Teams Column */}
                        <Card className="flex flex-col h-full bg-card/50 backdrop-blur border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    Available Teams
                                </CardTitle>
                                <CardDescription>Drag teams from here</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                                {availableTeams.filter(t => t._id !== slotA?._id && t._id !== slotB?._id).map((team) => (
                                    <motion.div
                                        key={team._id}
                                        draggable
                                        onDragStart={(e: any) => handleDragStart(e, team)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 bg-background rounded-xl border shadow-sm cursor-grab active:cursor-grabbing flex items-center gap-3 group hover:border-blue-500/50 transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            {team.banner ? (
                                                <img src={team.banner} className="h-full w-full object-cover rounded-full" alt={team.title}/>
                                            ) : (
                                                <span className="font-bold text-blue-600">{team.title.charAt(0)}</span>
                                            )}
                                        </div>
                                        <span className="font-medium truncate">{team.title}</span>
                                        <GripVertical className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-blue-500" />
                                    </motion.div>
                                ))}
                                {availableTeams.length === 0 && (
                                    <div className="text-center text-muted-foreground py-10">
                                        No teams found in this tournament
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Match Arena - Center Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Match Drop Zone */}
                            <div className="flex-1 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-slate-700">
                                {/* Background decoration */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
                                
                                <h3 className="relative z-10 text-white/50 font-heading text-xl mb-8 tracking-widest uppercase">Match Scheduler</h3>

                                <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 max-w-3xl">
                                    {/* Slot A */}
                                    <div 
                                        onDrop={(e) => handleDrop(e, 'A')}
                                        onDragOver={handleDragOver}
                                        className={`w-full md:w-5/12 aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center relative group
                                            ${slotA ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-blue-400/50 hover:bg-slate-800/80'}
                                        `}
                                    >
                                        {slotA ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => clearSlot('A')}
                                                    className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                                <div className="w-20 h-20 rounded-full bg-blue-500 mb-4 p-1 shadow-lg ring-4 ring-blue-500/30">
                                                    {slotA.banner ? (
                                                        <img src={slotA.banner} className="w-full h-full object-cover rounded-full" alt={slotA.title}/>
                                                    ) : (
                                                        <div className="w-full h-full rounded-full flex items-center justify-center bg-white text-blue-600 text-2xl font-black">
                                                            {slotA.title.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-white text-center">{slotA.title}</h3>
                                                <p className="text-blue-200 text-sm">Home Team</p>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 pointer-events-none">
                                                <div className="w-16 h-16 rounded-full bg-slate-700 mx-auto mb-3 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-slate-500 animate-ping"></div>
                                                </div>
                                                <p className="text-slate-400 font-medium">Drop Team A Here</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* VS Badge */}
                                    <div className="shrink-0 relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/50 z-10 relative border-4 border-slate-900">
                                            <span className="font-black text-white italic text-xl">VS</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-0.5 bg-slate-700 -z-0 md:block hidden"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-0.5 bg-slate-700 -z-0 md:hidden block"></div>
                                    </div>

                                    {/* Slot B */}
                                    <div 
                                        onDrop={(e) => handleDrop(e, 'B')}
                                        onDragOver={handleDragOver}
                                        className={`w-full md:w-5/12 aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center relative group
                                            ${slotB ? 'border-red-500 bg-red-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-red-400/50 hover:bg-slate-800/80'}
                                        `}
                                    >
                                        {slotB ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => clearSlot('B')}
                                                    className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/10"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                                <div className="w-20 h-20 rounded-full bg-red-500 mb-4 p-1 shadow-lg ring-4 ring-red-500/30">
                                                     {slotB.banner ? (
                                                        <img src={slotB.banner} className="w-full h-full object-cover rounded-full" alt={slotB.title}/>
                                                    ) : (
                                                        <div className="w-full h-full rounded-full flex items-center justify-center bg-white text-red-600 text-2xl font-black">
                                                            {slotB.title.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-white text-center">{slotB.title}</h3>
                                                <p className="text-red-200 text-sm">Away Team</p>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 pointer-events-none">
                                                <div className="w-16 h-16 rounded-full bg-slate-700 mx-auto mb-3 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-slate-500 animate-ping"></div>
                                                </div>
                                                <p className="text-slate-400 font-medium">Drop Team B Here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Action Area */}
                                <div className="mt-8 flex flex-col items-center gap-4 relative z-10 min-h-[50px]">
                                    {slotA && slotB && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center gap-4 w-full max-w-xs"
                                        >
                                            <div className="w-full bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                                <p className="text-xs text-slate-400 mb-1 ml-1">Match Date & Time</p>
                                                <input 
                                                    type="datetime-local" 
                                                    className="w-full bg-transparent text-white p-2 text-sm outline-none cursor-pointer placeholder-gray-500"
                                                    value={matchDate}
                                                    onChange={(e) => setMatchDate(e.target.value)}
                                                />
                                            </div>
                                            
                                            <Button 
                                                size="lg" 
                                                onClick={handleCreateMatch}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 shadow-lg shadow-green-900/20 w-full"
                                            >
                                                <Swords className="mr-2 w-5 h-5" />
                                                Schedule Match
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scheduled Matches List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                           <Calendar className="w-5 h-5 text-primary"/> Scheduled Matches
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {scheduledMatches.map(match => (
                                 <Card key={match._id} className="overflow-hidden group hover:shadow-md transition-all">
                                     <div className="p-4 flex flex-col gap-3">
                                         <div className="flex justify-between items-center text-sm text-muted-foreground pb-2 border-b">
                                             <div className="flex items-center gap-1">
                                                 <Clock className="w-3 h-3" />
                                                 {new Date(match.matchDate).toLocaleDateString()} • {new Date(match.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                             </div>
                                             <div className="capitalize px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                                                 {match.status}
                                             </div>
                                         </div>
                                         
                                         <div className="flex justify-between items-center gap-4">
                                            {/* Team A */}
                                             <div className="flex flex-col items-center gap-1 flex-1 text-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-blue-500 transition-colors">
                                                    {match.opponentX.banner ? (
                                                        <img src={match.opponentX.banner} className="h-full w-full object-cover rounded-full" />
                                                    ) : (
                                                        <span className="font-bold text-blue-600">{match.opponentX.title?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-sm truncate w-full">{match.opponentX.title}</span>
                                             </div>

                                             <div className="font-black text-muted-foreground/30 text-lg">VS</div>

                                            {/* Team B */}
                                             <div className="flex flex-col items-center gap-1 flex-1 text-center">
                                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-red-500 transition-colors">
                                                    {match.opponentY.banner ? (
                                                        <img src={match.opponentY.banner} className="h-full w-full object-cover rounded-full" />
                                                    ) : (
                                                        <span className="font-bold text-red-600">{match.opponentY.title?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-sm truncate w-full">{match.opponentY.title}</span>
                                             </div>
                                         </div>
                                     </div>
                                 </Card>
                             ))}
                             {scheduledMatches.length === 0 && (
                                 <div className="col-span-full py-12 text-center text-muted-foreground bg-accent/20 rounded-xl border border-dashed">
                                     No matches scheduled yet for this tournament.
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/20 rounded-3xl border-2 border-dashed border-muted p-8 text-center animate-in zoom-in-50 duration-500">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Trophy className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Select a Tournament</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        Choose a tournament from the dropdown above to start scheduling matches for its registered teams.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MatchMaking;
