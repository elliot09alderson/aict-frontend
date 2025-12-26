import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, ImageIcon, Plus, MapPin, Calendar, Users, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Tournament {
  _id: string;
  title: string;
  banner1: string;
  maxTeams: number;
  startDate: string;
  endDate: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    nearby?: string;
  };
  teams: string[];
  status: string;
  prize: {
    firstPrize: number;
    secondPrize: number;
    extraPrize?: number;
  };
  rules: string;
}

const OrganizerTournaments = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [tournamentName, setTournamentName] = useState("");
    const [banner, setBanner] = useState("");
    const [maxTeamSize, setMaxTeamSize] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [firstPrize, setFirstPrize] = useState("");
    const [secondPrize, setSecondPrize] = useState("");
    const [otherPrize, setOtherPrize] = useState("");
    const [venueName, setVenueName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await axios.get("/api/tournament/my-tournaments");
            setTournaments(res.data.tournaments);
        } catch (error: any) {
            console.error(error);
            toast({ 
                title: "Error fetching tournaments", 
                description: error.response?.data?.message || "Could not load data. Please try logging in again.",
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBanner(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCreateTournament = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!banner) {
             toast({ title: "Banner Required", description: "Please upload a banner.", variant: "destructive" });
             return;
        }

        try {
             const payload = {
                title: tournamentName,
                startDate,
                endDate,
                days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
                rules: "Standard Rules",
                banner1: banner,
                location: { address, city, state, pincode, nearby: venueName },
                prize: { firstPrize: Number(firstPrize), secondPrize: Number(secondPrize), extraPrize: Number(otherPrize) },
                maxTeams: Number(maxTeamSize)
            };

            await axios.post("/api/tournament/create", payload);
            toast({ title: "Success", description: "Tournament created successfully!" });
            fetchTournaments();
            setIsCreating(false);
            // Optional: Reset form fields here
        } catch (error: any) {
             toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
        }
    };

    const handleViewDetails = (tournament: Tournament) => {
        navigate(`/organizer/tournaments/${tournament._id}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground">My Tournaments</h2>
                    <p className="text-muted-foreground">Manage and track your cricket events</p>
                </div>
                <Button onClick={() => setIsCreating(!isCreating)} size="lg" className="shadow-lg hover:shadow-primary/25 transition-all">
                    {isCreating ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Create Tournament</>}
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {isCreating ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-primary/20 shadow-xl overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-6">
                                <CardTitle className="text-2xl">Create New Tournament</CardTitle>
                                <CardDescription>Launch your next big event in minutes</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleCreateTournament} className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column: Banner */}
                                        <div className="lg:col-span-1 space-y-4">
                                            <Label className="text-base">Tournament Banner</Label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()} 
                                                className="cursor-pointer border-2 border-dashed border-primary/30 rounded-2xl aspect-[4/5] flex flex-col items-center justify-center overflow-hidden relative hover:bg-primary/5 transition-colors group bg-muted/10"
                                            >
                                                {banner ? (
                                                    <>
                                                        <img src={banner} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Upload className="w-8 h-8 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                                        <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20">
                                                            <ImageIcon className="w-8 h-8" />
                                                        </div>
                                                        <span className="font-medium">Upload Banner</span>
                                                        <span className="text-xs mt-1">1080x1350 recommended</span>
                                                    </div>
                                                )}
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                                            </div>
                                        </div>

                                        {/* Right Column: Details */}
                                        <div className="lg:col-span-2 space-y-6">
                                             <div className="space-y-4">
                                                <h3 className="font-semibold flex items-center gap-2 text-primary border-b pb-2"><Trophy className="w-4 h-4" /> Basic Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label>Tournament Name</Label><Input placeholder="e.g. Summer Cup 2024" value={tournamentName} onChange={e => setTournamentName(e.target.value)} required className="bg-muted/30" /></div>
                                                    <div className="space-y-2"><Label>Max Teams</Label><Input type="number" placeholder="16" value={maxTeamSize} onChange={e => setMaxTeamSize(e.target.value)} required className="bg-muted/30" /></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="bg-muted/30" /></div>
                                                    <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="bg-muted/30" /></div>
                                                </div>
                                             </div>

                                             <div className="space-y-4">
                                                <h3 className="font-semibold flex items-center gap-2 text-primary border-b pb-2"><MapPin className="w-4 h-4" /> Location</h3>
                                                <div className="space-y-2"><Label>Venue Name</Label><Input placeholder="Stadium Name" value={venueName} onChange={e => setVenueName(e.target.value)} required className="bg-muted/30" /></div>
                                                <div className="space-y-2"><Label>Address</Label><Input placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} required className="bg-muted/30" /></div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="bg-muted/30" />
                                                    <Input placeholder="State" value={state} onChange={e => setState(e.target.value)} required className="bg-muted/30" />
                                                    <Input placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} required className="bg-muted/30" />
                                                </div>
                                             </div>

                                             <div className="space-y-4">
                                                <h3 className="font-semibold flex items-center gap-2 text-primary border-b pb-2"><Trophy className="w-4 h-4" /> Prizes</h3>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2"><Label>1st Prize (₹)</Label><Input type="number" value={firstPrize} onChange={e => setFirstPrize(e.target.value)} required className="bg-muted/30" /></div>
                                                    <div className="space-y-2"><Label>2nd Prize (₹)</Label><Input type="number" value={secondPrize} onChange={e => setSecondPrize(e.target.value)} required className="bg-muted/30" /></div>
                                                    <div className="space-y-2"><Label>Other (₹)</Label><Input type="number" value={otherPrize} onChange={e => setOtherPrize(e.target.value)} className="bg-muted/30" /></div>
                                                </div>
                                             </div>
                                             
                                             <div className="pt-4">
                                                 <Button type="submit" size="lg" className="w-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Launch Tournament 🚀</Button>
                                             </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tournaments.length === 0 && !isLoading && (
                            <div className="col-span-full text-center py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/5">
                                <Trophy className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-semibold mb-2">No Tournaments found</h3>
                                <p>Create your first tournament to get started.</p>
                                <Button onClick={() => setIsCreating(true)} variant="outline" className="mt-4">Create Now</Button>
                            </div>
                        )}

                        {tournaments.map((tournament, index) => (
                            <motion.div
                                key={tournament._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group border-none shadow-md h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                        <img 
                                            src={tournament.banner1} 
                                            alt={tournament.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute bottom-3 left-3 z-20 text-white">
                                            <h3 className="font-bold text-lg leading-tight">{tournament.title}</h3>
                                            <p className="text-xs text-white/80 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {tournament.location?.city}</p>
                                        </div>
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                                                tournament.status === 'ongoing' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 
                                                tournament.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 
                                                'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                            }`}>
                                                {tournament.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="pt-4 flex-1">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs">Teams</span>
                                                <span className="font-semibold flex items-center gap-1"><Users className="w-3 h-3 text-primary"/> {tournament.teams.length}/{tournament.maxTeams}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs">Start Date</span>
                                                <span className="font-semibold flex items-center gap-1"><Calendar className="w-3 h-3 text-primary"/> {new Date(tournament.startDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-4">
                                        <Button 
                                            onClick={() => handleViewDetails(tournament)}
                                            variant="secondary" 
                                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrganizerTournaments;
