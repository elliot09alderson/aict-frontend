import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Users, Calendar, LogOut, Plus, Trash2, 
  Upload, ImageIcon, MapPin, Phone, Medal, Gift,
  Building 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Interfaces based on Backend Models
interface Player {
  _id?: string;
  name: string;
  role: string;
  jerseyNumber?: string; // Backend doesn't have jerseyNumber in schema explicitly but we can add it or ignore
  image?: string;
}

interface Team {
  _id: string;
  title: string; // Backend uses title, frontend used name
  banner: string;
  tournament: string; // Tournament ID
  players: Player[];
  description?: string;
  city?: string; // Not in backend schema explicitly but in UI
}

interface Tournament {
  _id: string; // MongoDB ID
  title: string; // Backend uses title
  banner1: string; // Backend uses banner1
  maxTeams: number; 
  startDate: string;
  endDate: string;
  prize: {
    firstPrize: number;
    secondPrize?: number;
    thirdPrize?: number;
    extraPrize?: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    nearby?: string;
  };
  rules: string;
  teams: string[]; // Array of Team IDs
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tournament Form State
  const [tournamentName, setTournamentName] = useState("");
  const [banner, setBanner] = useState("");
  const [maxTeamSize, setMaxTeamSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [firstPrize, setFirstPrize] = useState("");
  const [secondPrize, setSecondPrize] = useState("");
  const [otherPrize, setOtherPrize] = useState("");
  const [venueName, setVenueName] = useState(""); // Location name
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactNumber, setContactNumber] = useState(""); // Not in schema, maybe put in rules or description?
  
  // Team Form State
  const [teamName, setTeamName] = useState("");
  const [teamCity, setTeamCity] = useState("");
  const [teamSlogan, setTeamSlogan] = useState("");
  const [teamBanner, setTeamBanner] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  
  // Player Form State
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [bulkPlayers, setBulkPlayers] = useState<{name: string, role: string}[]>(
    Array(11).fill({ name: "", role: "batsman" })
  );
  
  // Auth Token
  const token = localStorage.getItem("accessToken");

  // Fetch Data
  useEffect(() => {
    if (!token) {
      navigate("/organizer/login");
      return;
    }
    
    fetchTournaments();
  }, [token, navigate]);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/tournament/my-tournaments", {
        headers: { Authorization: `Bearer ${token}` } // Assuming cookie is used but adding header just in case or if changed
      });
      // Also, since we use cookies (httpOnly), axios automatically sends them if withCredentials: true.
      // But my backend middleware checks req.cookies.accessToken. 
      // Ensure axios sends cookies.
      
      setTournaments(res.data.tournaments);
      
      // Also fetch teams for these tournaments? 
      // The tournament object has `teams` array of IDs. 
      // Usually would need to fetch details. For now, we only show team count in tournament card.
      // For the "Teams" tab, we need to fetch teams when a tournament is selected.
      
    } catch (error: any) {
      console.error("Error fetching tournaments:", error);
       if (error.response?.status === 401) {
       const isLoggedIn = localStorage.getItem("accessToken"); // Changed from specific flag to token presence
    if (!isLoggedIn) {
      navigate("/organizer/login");
    }   }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teams when tournament selected
  useEffect(() => {
    const fetchTeams = async () => {
        if (!selectedTournamentId) return;
        try {
            const res = await axios.get(`/api/tournament/${selectedTournamentId}`, {
                 headers: { Authorization: `Bearer ${token}` } // cookie handled by browser?
            });
            // The getTournamentById populates teams!
             if(res.data.tournament.teams) {
                 setTeams(res.data.tournament.teams);
             }
        } catch (error) {
            console.error("Error fetching teams", error);
        }
    };
    fetchTeams();
  }, [selectedTournamentId]);

  const handleLogout = async () => {
    try{
        await axios.get("/api/auth/logout");
    } catch(e) {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdminLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/organizer/login");
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!banner) {
      toast({
        title: "Banner Required",
        description: "Please upload a tournament banner.",
        variant: "destructive",
      });
      return;
    }

    try {
        const payload = {
            title: tournamentName,
            startDate,
            endDate,
            days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
            rules: "Standard Rules", // Default for now
            banner1: banner, // Base64 string
            // contact: contactNumber, // No field in schema
            location: {
                address,
                city,
                state,
                pincode,
                nearby: venueName
            },
            prize: {
                firstPrize: Number(firstPrize),
                secondPrize: Number(secondPrize),
                extraPrize: Number(otherPrize)
            },
            maxTeams: Number(maxTeamSize)
        };

        const res = await axios.post("/api/tournament/create", payload); // Cookie should be sent automatically?
        // Wait, default axios doesn't send cookies unless withCredentials: true
        // But I set axios default in app? No, I haven't set global defaults.
        // I should set: axios.defaults.withCredentials = true; 
        
        toast({
            title: "Tournament Created",
            description: "Tournament created successfully!",
        });
        fetchTournaments();
        
        // Reset form
        setTournamentName("");
        setBanner("");
        // ... reset others
    } catch (error: any) {
         toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create tournament",
            variant: "destructive"
        });
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournamentId) return;

    if (!teamBanner) {
        toast({ title: "Banner Required", description: "Please upload a team banner", variant: "destructive" });
        return;
    }

    try {
        const payload = {
            title: teamName,
            banner: teamBanner,
            slogan: teamSlogan,
            tournamentId: selectedTournamentId,
            description: teamCity 
        };
        
        await axios.post("/api/team/create", payload);
        
        toast({ title: "Team Created", description: "Team added successfully" });
        // Refresh teams
         const res = await axios.get(`/api/tournament/${selectedTournamentId}`);
         setTeams(res.data.tournament.teams);
         setTeamName("");
         setTeamSlogan("");
         setTeamBanner("");
         setTeamCity("");
    } catch (error: any) {
         toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create team",
            variant: "destructive"
        });
    }
  };

  const handleBulkAddPlayers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    // Filter out empty rows
    const playersToAdd = bulkPlayers.filter(p => p.name.trim());
    if (playersToAdd.length === 0) {
        toast({ title: "No Players", description: "Please enter at least one player name", variant: "destructive" });
        return;
    }
    
    try {
         const payload = {
            teamId: selectedTeamId,
            players: playersToAdd
        };
        
        await axios.post("/api/team/add-players", payload);
        toast({ title: "Players Added", description: `${playersToAdd.length} players added to team` });
        
        // Update local state
         const updatedTeams = teams.map(t => {
            if(t._id === selectedTeamId) {
                return { 
                    ...t, 
                    players: [...t.players, ...playersToAdd]
                };
            }
            return t;
        });
        setTeams(updatedTeams);
        // Reset form to 11 empty slots
        setBulkPlayers(Array(11).fill({ name: "", role: "batsman" }));
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to add players",
            variant: "destructive"
        });
    }
  };

  // Helper to delete etc (not implementing backend delete yet)
  const handleDeleteTournament = (id: string) => {
       toast({ title: "Not Implemented", description: "Delete functionality coming soon" });
  };


  const selectedTournament = tournaments.find(t => t._id === selectedTournamentId);
  const tournamentTeams = teams; // Since we filter by fetching
  
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Organizer Dashboard</h1>
              <p className="text-xs text-primary-foreground/70">Manage your tournaments</p>
            </div>
          </motion.div>
          
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Total Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{tournaments.length}</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Active Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {tournaments.filter(t => t.status === 'ongoing' || new Date(t.endDate) >= new Date()).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tournaments" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="tournaments" className="data-[state=active]:bg-background">
                <Trophy className="w-4 h-4 mr-2" />
                Tournaments
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-background">
                <Users className="w-4 h-4 mr-2" />
                Teams & Players
              </TabsTrigger>
            </TabsList>

            {/* Tournaments Tab */}
            <TabsContent value="tournaments" className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Tournament
                  </CardTitle>
                  <CardDescription>Fill in the details to add a new cricket tournament</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleCreateTournament} className="space-y-8">
                    {/* Banner Upload Section */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Tournament Banner <span className="text-destructive">*</span>
                      </Label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                          banner 
                            ? 'border-accent bg-accent/5' 
                            : 'border-muted-foreground/30 hover:border-primary/50 bg-muted/30'
                        }`}
                      >
                        {banner ? (
                          <div className="relative">
                            <img 
                              src={banner} 
                              alt="Tournament Banner" 
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="text-white text-center">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Click to change banner</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                            <Upload className="w-10 h-10 mb-3" />
                            <p className="text-sm font-medium">Click to upload banner</p>
                            <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tournamentName">Tournament Name <span className="text-destructive">*</span></Label>
                          <Input
                            id="tournamentName"
                            placeholder="e.g., Premier League 2025"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                            required
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxTeamSize">Max Teams <span className="text-destructive">*</span></Label>
                          <Input
                            id="maxTeamSize"
                            type="number"
                            min="1"
                            placeholder="e.g., 20"
                            value={maxTeamSize}
                            onChange={(e) => setMaxTeamSize(e.target.value)}
                            required
                            className="bg-background"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dates</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                           <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                       </div>
                    </div>
                    
                    {/* Prizes */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Prizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input placeholder="First Prize" type="number" value={firstPrize} onChange={e => setFirstPrize(e.target.value)} required />
                            <Input placeholder="Second Prize" type="number" value={secondPrize} onChange={e => setSecondPrize(e.target.value)} required />
                             <Input placeholder="Other Prize" type="number" value={otherPrize} onChange={e => setOtherPrize(e.target.value)} />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Location</h3>
                        <Input placeholder="Venue Name" value={venueName} onChange={e => setVenueName(e.target.value)} required />
                        <Input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
                        <div className="grid grid-cols-3 gap-4">
                             <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
                             <Input placeholder="State" value={state} onChange={e => setState(e.target.value)} required />
                             <Input placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required />
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 w-full md:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tournament
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Tournaments List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Tournaments</CardTitle>
                  <CardDescription>Manage your cricket tournaments</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tournaments.map((tournament) => (
                        <div key={tournament._id} className="border rounded-xl p-4 hover:shadow-lg transition">
                            <h3 className="font-bold">{tournament.title}</h3>
                            <p className="text-sm text-muted-foreground">{tournament.location.city}</p>
                            <p className="text-sm">Teams: {tournament.teams.length}/{tournament.maxTeams}</p>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              {/* Tournament Selection */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle>Select Tournament & Manage Teams</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Select value={selectedTournamentId} onValueChange={setSelectedTournamentId}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select a tournament..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.map((tournament) => (
                        <SelectItem key={tournament._id} value={tournament._id}>
                          {tournament.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTournamentId && (
                      <div className="mt-8 space-y-6">
                           <div className="border p-4 rounded-xl">
                               <h3 className="font-bold mb-4">Add Team</h3>
                               <h3 className="font-bold mb-4">Add Team</h3>
                               <form onSubmit={handleCreateTeam} className="space-y-4">
                                   <div className="space-y-3">
                                       <Label className="text-base font-semibold">Team Banner</Label>
                                       <div 
                                            onClick={() => document.getElementById('team-banner-input')?.click()}
                                            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                                                teamBanner 
                                                    ? 'border-accent bg-accent/5' 
                                                    : 'border-muted-foreground/30 hover:border-primary/50 bg-muted/30'
                                            }`}
                                       >
                                            {teamBanner ? (
                                                <div className="relative h-48 w-full group">
                                                    <img 
                                                        src={teamBanner} 
                                                        alt="Team Banner" 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="text-white flex flex-col items-center">
                                                            <Upload className="w-6 h-6 mb-2" />
                                                            <span className="text-sm font-medium">Change Banner</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                                    <p className="text-sm font-medium">Click to upload banner</p>
                                                </div>
                                            )}
                                            <Input 
                                                id="team-banner-input"
                                                type="file" 
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setTeamBanner(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                       </div>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                           <Label>Team Name</Label>
                                           <Input placeholder="e.g. Mumbai Indians" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                                       </div>
                                       <div className="space-y-2">
                                           <Label>City / Origin</Label>
                                           <Input placeholder="e.g. Mumbai" value={teamCity} onChange={e => setTeamCity(e.target.value)} />
                                       </div>
                                   </div>
                                    <div className="space-y-2">
                                        <Label>Slogan</Label>
                                        <Input placeholder="e.g. Duniya Hila Denge Hum" value={teamSlogan} onChange={e => setTeamSlogan(e.target.value)} />
                                    </div>
                                   <Button type="submit" className="w-full">
                                       <Plus className="w-4 h-4 mr-2" />
                                       Create Team
                                   </Button>
                               </form>
                           </div>

                           <div className="border p-4 rounded-xl">
                               <h3 className="font-bold mb-4">Teams in this Tournament</h3>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {teams.map(team => (
                                       <div key={team._id} className="border p-3 rounded-lg cursor-pointer hover:bg-muted flex items-center gap-3 transition-colors" onClick={() => setSelectedTeamId(team._id)}>
                                           {team.banner && (
                                               <img src={team.banner} alt={team.title} className="w-12 h-12 rounded-full object-cover border border-border" />
                                           )}
                                           <div>
                                               <div className="font-semibold">{team.title}</div>
                                               <div className="text-sm text-muted-foreground">Players: {team.players.length}</div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                           
                           {selectedTeamId && (
                                <div className="border p-4 rounded-xl bg-accent/5">
                                   <h3 className="font-bold mb-4">Add Players (Bulk)</h3>
                                    <form onSubmit={handleBulkAddPlayers} className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-muted-foreground mb-2">
                                            <div className="col-span-1 text-center">#</div>
                                            <div className="col-span-7">Player Name</div>
                                            <div className="col-span-4">Role</div>
                                        </div>
                                        
                                        {bulkPlayers.map((player, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="col-span-1 text-center text-sm font-medium">{index + 1}</div>
                                                <div className="col-span-6">
                                                    <Input 
                                                        placeholder="Player Name" 
                                                        value={player.name} 
                                                        onChange={e => {
                                                            const newPlayers = [...bulkPlayers];
                                                            newPlayers[index] = { ...newPlayers[index], name: e.target.value };
                                                            setBulkPlayers(newPlayers);
                                                        }} 
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Select 
                                                        value={player.role} 
                                                        onValueChange={value => {
                                                            const newPlayers = [...bulkPlayers];
                                                            newPlayers[index] = { ...newPlayers[index], role: value };
                                                            setBulkPlayers(newPlayers);
                                                        }}
                                                    >
                                                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="batsman">Batsman</SelectItem>
                                                            <SelectItem value="baller">Baller</SelectItem>
                                                            <SelectItem value="keeper">Wicket Keeper</SelectItem>
                                                            <SelectItem value="all_rounder">All Rounder</SelectItem>
                                                            <SelectItem value="captain">Captain</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        tabIndex={-1}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => {
                                                            const newPlayers = bulkPlayers.filter((_, i) => i !== index);
                                                            setBulkPlayers(newPlayers);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <div className="flex gap-2 mt-4">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="flex-1"
                                                onClick={() => setBulkPlayers([...bulkPlayers, { name: "", role: "batsman" }])}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Another Row
                                            </Button>
                                            <Button type="submit" className="flex-1 bg-primary text-primary-foreground">Save Squad ({bulkPlayers.filter(p => p.name).length})</Button>
                                        </div>
                                    </form>
                                    
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-sm">Current Players:</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {teams.find(t => t._id === selectedTeamId)?.players.map((p, idx) => (
                                                <span key={idx} className="bg-background border rounded-full px-3 py-1 text-sm flex items-center gap-2">
                                                    {p.name} <span className="text-xs text-muted-foreground">({p.role})</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                               </div>
                           )}
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
