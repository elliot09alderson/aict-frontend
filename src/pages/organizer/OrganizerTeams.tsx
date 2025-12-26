import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Users, Save, Shield, ChevronRight, UserCircle2, Trophy, ImageIcon, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const OrganizerTeams = () => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    
    // Create Team State
    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamSlogan, setNewTeamSlogan] = useState("");
    const [newTeamBanner, setNewTeamBanner] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Bulk Form State
    const [squad, setSquad] = useState<{name: string, role: string}[]>([]);

    useEffect(() => {
        fetchTournaments();
    }, []);

    // Auto-select tournament from URL params
    useEffect(() => {
        const tid = searchParams.get('tournamentId');
        if (tid && tournaments.length > 0) {
            const exists = tournaments.find((t: any) => t._id === tid);
            if (exists && selectedTournament !== tid) {
                handleTournamentChange(tid);
            }
        }
    }, [tournaments, searchParams]);

    const fetchTournaments = async () => {
        try {
            const res = await axios.get("/api/tournament/my-tournaments");
            setTournaments(res.data.tournaments);
        } catch (error: any) {
             console.error(error);
             toast({ title: "Error", description: "Failed to load tournaments", variant: "destructive" });
        }
    };

    const handleTournamentChange = async (tournamentId: string) => {
        setSelectedTournament(tournamentId);
        setSelectedTeam(null);
        try {
            const res = await axios.get(`/api/tournament/${tournamentId}`);
            setTeams(res.data.tournament.teams);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTournament) return;
        
        try {
            await axios.post("/api/team/create", {
                title: newTeamName,
                slogan: newTeamSlogan,
                tournamentId: selectedTournament,
                banner: newTeamBanner || "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80", // Default cricket image
                paid: paymentStatus === "paid" // Send boolean
            });
            
            toast({ title: "Success", description: "Team created successfully!" });
            setIsCreateTeamOpen(false);
            setNewTeamName("");
            setNewTeamSlogan("");
            setNewTeamBanner("");
            // Refresh teams
            handleTournamentChange(selectedTournament);
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to create team", variant: "destructive" });
        }
    };

    const handleTeamBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setNewTeamBanner(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleTeamSelect = (team: any) => {
        setSelectedTeam(team);
        if (team.players && team.players.length > 0) {
             const existing = team.players.map((p: any) => ({ name: p.name, role: p.role }));
             if (existing.length < 11) {
                 const diff = 11 - existing.length;
                 const fillers = Array(diff).fill({ name: "", role: "batsman" });
                 setSquad([...existing, ...fillers]);
             } else {
                 setSquad(existing);
             }
        } else {
             setSquad(Array(11).fill({ name: "", role: "batsman" }));
        }
    };

    const handleUpdateSquad = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) return;

        const playersToSave = squad.filter(p => p.name.trim());
        
        try {
            await axios.put("/api/team/update-squad", {
                teamId: selectedTeam._id,
                players: playersToSave
            });
            
            toast({ title: "Squad Updated", description: "Team lineup saved successfully!" });
            
            const updatedTeams = teams.map((t: any) => {
                if (t._id === selectedTeam._id) {
                    return { ...t, players: playersToSave };
                }
                return t;
            });
            setTeams(updatedTeams as any);
            setSelectedTeam({ ...selectedTeam, players: playersToSave });
            
        } catch (error: any) {
             toast({ title: "Error", description: error.response?.data?.message || "Failed to update squad", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Teams & Players</h2>
                <p className="text-muted-foreground">Manage your squads and lineups</p>
            </div>

            {/* Create Team Dialog */}
            <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>Add a new team to this tournament.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Team Logo / Banner</Label>
                            <div 
                                onClick={() => fileInputRef.current?.click()} 
                                className="cursor-pointer border-2 border-dashed border-primary/30 rounded-xl h-32 flex flex-col items-center justify-center overflow-hidden relative hover:bg-primary/5 transition-colors group bg-muted/10"
                            >
                                {newTeamBanner ? (
                                    <img src={newTeamBanner} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <ImageIcon className="w-8 h-8 mb-1" />
                                        <span className="text-xs">Upload Logo</span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleTeamBannerUpload} className="hidden" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Team Name</Label>
                            <Input placeholder="e.g. Royal Challengers" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Slogan (Optional)</Label>
                            <Input placeholder="e.g. Ee Sala Cup Namde" value={newTeamSlogan} onChange={e => setNewTeamSlogan(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">⏳ Pending</SelectItem>
                                    <SelectItem value="paid">✅ Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">Create Team</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Selection */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-lg">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-primary"/>  Select Tournament</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                             <Select value={selectedTournament} onValueChange={handleTournamentChange}>
                                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Choose a Tournament" /></SelectTrigger>
                                <SelectContent>
                                    {tournaments.map((t: any) => (
                                        <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </CardContent>
                    </Card>

                    <AnimatePresence>
                    {selectedTournament && (
                        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                            <Card className="border-none shadow-lg overflow-hidden">
                                <CardHeader className="bg-primary/5 pb-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-primary"/> Teams</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{teams.length}</Badge>
                                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => setIsCreateTeamOpen(true)}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardDescription>Select a team to manage squad</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    <div className="space-y-1 p-2">
                                        {teams.map((team: any) => (
                                            <div 
                                                key={team._id} 
                                                onClick={() => handleTeamSelect(team)}
                                                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-200 group relative overflow-hidden ${selectedTeam?._id === team._id ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted'}`}
                                            >
                                                {/* Selection Indicator */}
                                                {selectedTeam?._id === team._id && <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
                                                
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${selectedTeam?._id === team._id ? 'border-white/30' : 'border-transparent group-hover:border-primary/20'}`}>
                                                    {team.banner ? <img src={team.banner} className="w-full h-full object-cover" /> : <Shield className="w-5 h-5"/>}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{team.title}</p>
                                                    <p className={`text-xs ${selectedTeam?._id === team._id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{team.players.length} Players</p>
                                                </div>
                                                {selectedTeam?._id === team._id && <ChevronRight className="w-4 h-4 opacity-50" />}
                                            </div>
                                        ))}
                                        {teams.length === 0 && <p className="text-center text-muted-foreground text-sm py-8 italic">No teams in this tournament yet.</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                {/* Right: Squad Editor */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {selectedTeam ? (
                            <motion.div 
                                key={selectedTeam._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border-none shadow-xl overflow-hidden">
                                    <CardHeader className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                 <div className="h-14 w-14 rounded-2xl bg-muted overflow-hidden border">
                                                    {selectedTeam.banner && <img src={selectedTeam.banner} className="w-full h-full object-cover" />}
                                                 </div>
                                                 <div>
                                                    <CardTitle className="text-xl">{selectedTeam.title}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2"><Users className="w-3 h-3"/> Managing Squad</CardDescription>
                                                 </div>
                                            </div>
                                            <Button onClick={handleUpdateSquad} className="shadow-lg hover:shadow-primary/25 transition-all">
                                                <Save className="w-4 h-4 mr-2" /> Save Squad
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="bg-muted/5 p-6">
                                        <form onSubmit={handleUpdateSquad} className="space-y-4">
                                             <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-muted-foreground mb-2 px-2 uppercase tracking-wide">
                                                <div className="col-span-1 text-center">#</div>
                                                <div className="col-span-6">Player Detail</div>
                                                <div className="col-span-4">Role</div>
                                                <div className="col-span-1"></div>
                                             </div>
                                             
                                             <div className="space-y-3">
                                                {squad.map((player, index) => (
                                                    <motion.div 
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="grid grid-cols-12 gap-4 items-center bg-card p-2 rounded-xl border hover:border-primary/30 transition-colors shadow-sm"
                                                    >
                                                        <div className="col-span-1 text-center font-mono text-muted-foreground">{index + 1}</div>
                                                        <div className="col-span-6">
                                                            <div className="relative">
                                                                <UserCircle2 className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                                                <Input 
                                                                    value={player.name} 
                                                                    onChange={e => {
                                                                        const newSquad = [...squad];
                                                                        newSquad[index] = { ...player, name: e.target.value };
                                                                        setSquad(newSquad);
                                                                    }}
                                                                    placeholder="Player Name"
                                                                    className="pl-9 border-none bg-transparent focus-visible:ring-0 shadow-none font-medium text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Select 
                                                                    value={player.role} 
                                                                    onValueChange={value => {
                                                                        const newSquad = [...squad];
                                                                        newSquad[index] = { ...player, role: value };
                                                                        setSquad(newSquad);
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="h-9 border bg-muted/30"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="batsman">🏏 Batsman</SelectItem>
                                                                        <SelectItem value="baller">⚾ Bowler</SelectItem>
                                                                        <SelectItem value="keeper">🧤 Wicket Keeper</SelectItem>
                                                                        <SelectItem value="all_rounder">⭐ All Rounder</SelectItem>
                                                                        <SelectItem value="captain">👑 Captain</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                        </div>
                                                        <div className="col-span-1 flex justify-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                                onClick={() => setSquad(squad.filter((_, i) => i !== index))}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                             </div>
                                             
                                             <div className="pt-6 flex justify-between items-center text-sm text-muted-foreground border-t mt-6">
                                                 <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Squad Size: <span className="text-foreground font-bold">{squad.filter(p => p.name).length}</span></span>
                                                 <Button type="button" variant="outline" size="sm" onClick={() => setSquad([...squad, { name: "", role: "batsman" }])} className="hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                                                     <Plus className="w-4 h-4 mr-2" />
                                                     Add Player Slot
                                                 </Button>
                                             </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-muted-foreground bg-muted/5 animate-in fade-in zoom-in-95 duration-500">
                                <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                    <Users className="w-10 h-10 text-primary opacity-50" />
                                </div>
                                <h3 className="font-bold text-2xl text-foreground mb-2">Manage Team Squad</h3>
                                <p className="max-w-md text-center">Select a tournament and a team from the left to view, edit, or add players to the lineup.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default OrganizerTeams;
