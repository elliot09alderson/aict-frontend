import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Calendar, Users, Trophy, Shield, Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  description?: string;
}

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const fetchTournament = async () => {
    try {
      const res = await axios.get(`/api/tournament/${id}`);
      setTournament(res.data.tournament);
      // Init form data
      const t = res.data.tournament;
      setEditForm({
          title: t.title,
          banner1: t.banner1,
          status: t.status,
          rules: t.rules,
          maxTeams: t.maxTeams,
          startDate: t.startDate?.split('T')[0],
          endDate: t.endDate?.split('T')[0],
          address: t.location?.address,
          city: t.location?.city,
          state: t.location?.state,
          pincode: t.location?.pincode,
          nearby: t.location?.nearby,
          firstPrize: t.prize?.firstPrize,
          secondPrize: t.prize?.secondPrize,
          extraPrize: t.prize?.extraPrize,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Could not load tournament",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
           const payload = {
                title: editForm.title,
                banner1: editForm.banner1,
                status: editForm.status,
                rules: editForm.rules,
                maxTeams: Number(editForm.maxTeams),
                startDate: editForm.startDate,
                endDate: editForm.endDate,
                location: {
                    address: editForm.address,
                    city: editForm.city,
                    state: editForm.state,
                    pincode: editForm.pincode,
                    nearby: editForm.nearby
                },
                prize: {
                    firstPrize: Number(editForm.firstPrize),
                    secondPrize: Number(editForm.secondPrize),
                    extraPrize: Number(editForm.extraPrize)
                }
           };

           const res = await axios.put(`/api/tournament/${id}`, payload);
           setTournament(res.data.tournament);
           setIsEditing(false);
           toast({ title: "Updated", description: "Tournament details updated successfully!" });
      } catch (error: any) {
           toast({ title: "Error", description: error.response?.data?.message || "Update failed", variant: "destructive" });
      } finally {
           setIsSaving(false);
      }
  };

  const handleCancel = () => {
      setIsEditing(false);
      // Reset form
      if (tournament) {
        setEditForm({
            title: tournament.title,
            banner1: tournament.banner1,
            status: tournament.status,
            rules: tournament.rules,
            maxTeams: tournament.maxTeams,
            startDate: tournament.startDate?.split('T')[0],
            endDate: tournament.endDate?.split('T')[0],
            address: tournament.location?.address,
            city: tournament.location?.city,
            state: tournament.location?.state,
            pincode: tournament.location?.pincode,
            nearby: tournament.location?.nearby,
            firstPrize: tournament.prize?.firstPrize,
            secondPrize: tournament.prize?.secondPrize,
            extraPrize: tournament.prize?.extraPrize,
        });
      }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tournament not found</h2>
        <Button onClick={() => navigate("/organizer/tournaments")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col w-full max-w-2xl gap-2">
          <Button variant="ghost" className="w-fit pl-0 hover:pl-2 transition-all" onClick={() => navigate("/organizer/tournaments")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="space-y-2">
             {isEditing ? (
                 <div className="space-y-3">
                     <Input 
                        value={editForm.title} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})} 
                        className="text-3xl md:text-4xl font-black font-heading h-auto py-2 px-3 border-dashed bg-background"
                        placeholder="Tournament Title"
                     />
                     <div className="flex items-center gap-3">
                         <select 
                            value={editForm.status} 
                            onChange={e => setEditForm({...editForm, status: e.target.value})}
                            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                         >
                             <option value="upcoming">Upcoming</option>
                             <option value="open">Open</option>
                             <option value="ongoing">Ongoing</option>
                             <option value="completed">Completed</option>
                         </select>
                     </div>
                 </div>
             ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-heading font-bold text-foreground">{tournament.title}</h2>
                  <Badge variant={tournament.status === 'ongoing' ? 'default' : 'secondary'} className="rounded-full px-3 capitalize">
                    {tournament.status}
                  </Badge>
                </div>
             )}
            {!isEditing && <p className="text-muted-foreground">Tournament Details</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-center">
            {isEditing ? (
                <>
                    <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isSaving} className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="border-primary/20 hover:bg-primary/5">
                        <Pencil className="w-4 h-4 mr-2" /> Edit Details
                    </Button>
                    <Button onClick={() => navigate(`/organizer/teams?tournamentId=${tournament._id}`)} className="shadow-lg shadow-primary/20 font-bold">
                        <Users className="w-4 h-4 mr-2" /> Manage Teams
                    </Button>
                </>
            )}
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-2xl overflow-hidden aspect-video relative shadow-lg max-h-[400px] group border bg-muted">
        <img src={isEditing && editForm.banner1 ? editForm.banner1 : tournament.banner1} alt={tournament.title} className="w-full h-full object-cover transition-opacity duration-300" style={{opacity: isEditing ? 0.8 : 1}} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        {isEditing && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4">
                <div className="bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border space-y-2">
                    <Label>Banner Image URL</Label>
                    <Input value={editForm.banner1 || ''} onChange={e => setEditForm({...editForm, banner1: e.target.value})} placeholder="https://..." />
                </div>
            </div>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`border shadow-sm transition-all ${isEditing ? 'border-primary/20 bg-primary/5' : ''}`}>
          <CardContent className="p-5 text-center h-full flex flex-col justify-center items-center">
            <Users className="w-6 h-6 mb-3 text-primary" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Max Teams</div>
            {isEditing ? (
                 <Input type="number" value={editForm.maxTeams || ''} onChange={e => setEditForm({...editForm, maxTeams: e.target.value})} className="text-center font-bold text-xl h-9 w-24 bg-background" />
            ) : (
                 <div className="font-heading font-bold text-2xl">{tournament.teams.length}/{tournament.maxTeams}</div>
            )}
          </CardContent>
        </Card>
        <Card className={`border shadow-sm transition-all ${isEditing ? 'border-primary/20 bg-primary/5' : ''}`}>
          <CardContent className="p-5 text-center h-full flex flex-col justify-center items-center">
            <Calendar className="w-6 h-6 mb-3 text-primary" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Dates</div>
             {isEditing ? (
                 <div className="space-y-2 w-full">
                     <Input type="date" value={editForm.startDate || ''} onChange={e => setEditForm({...editForm, startDate: e.target.value})} className="text-center text-xs h-8 bg-background" />
                     <Input type="date" value={editForm.endDate || ''} onChange={e => setEditForm({...editForm, endDate: e.target.value})} className="text-center text-xs h-8 bg-background" />
                 </div>
            ) : (
                 <div className="font-heading font-bold text-lg leading-tight">
                    {new Date(tournament.startDate).toLocaleDateString()}
                    <span className="block text-xs text-muted-foreground font-normal mt-1">to {new Date(tournament.endDate).toLocaleDateString()}</span>
                 </div>
            )}
          </CardContent>
        </Card>
        <Card className={`border shadow-sm transition-all ${isEditing ? 'border-primary/20 bg-primary/5' : ''}`}>
          <CardContent className="p-5 text-center h-full flex flex-col justify-center items-center">
            <Trophy className="w-6 h-6 mb-3 text-primary" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">1st Prize</div>
            {isEditing ? (
                <div className="flex items-center justify-center gap-1">
                    <span className="font-bold text-muted-foreground">₹</span>
                    <Input type="number" value={editForm.firstPrize || ''} onChange={e => setEditForm({...editForm, firstPrize: e.target.value})} className="text-center font-bold text-xl h-9 w-28 bg-background text-primary" />
                </div>
            ) : (
                <div className="font-heading font-bold text-2xl text-primary">₹{tournament.prize?.firstPrize || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card className={`border shadow-sm transition-all ${isEditing ? 'border-primary/20 bg-primary/5' : ''}`}>
          <CardContent className="p-5 text-center h-full flex flex-col justify-center items-center">
            <MapPin className="w-6 h-6 mb-3 text-primary" />
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">City</div>
            {isEditing ? (
                 <Input value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} className="text-center font-bold text-lg h-9 bg-background" />
            ) : (
                 <div className="font-heading font-bold text-lg">{tournament.location?.city || "N/A"}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border shadow-sm h-full">
          <CardContent className="p-6 space-y-4 h-full flex flex-col">
            <h4 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" /> Location Details
            </h4>
            <div className="space-y-4 flex-1">
                {isEditing ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground">Nearby / Venue Name</Label>
                             <Input placeholder="e.g. Wankhede Stadium" value={editForm.nearby || ''} onChange={e => setEditForm({...editForm, nearby: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground">Address Line 1</Label>
                             <Input placeholder="Street Address" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                        </div>
                         <div className="grid grid-cols-3 gap-2">
                             <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">City</Label>
                                <Input value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">State</Label>
                                <Input value={editForm.state || ''} onChange={e => setEditForm({...editForm, state: e.target.value})} />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Pincode</Label>
                                <Input value={editForm.pincode || ''} onChange={e => setEditForm({...editForm, pincode: e.target.value})} />
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm space-y-1">
                        {tournament.location?.nearby && <p className="font-bold text-lg mb-2 text-primary">{tournament.location.nearby}</p>}
                        <p className="text-foreground text-base">
                            {[tournament.location?.address, tournament.location?.city].filter(Boolean).join(", ") || "Address not available"}
                        </p>
                        <p className="text-muted-foreground">
                            {[tournament.location?.state, tournament.location?.pincode].filter(Boolean).join(" - ")}
                        </p>
                        {(!tournament.location?.address && !tournament.location?.city && !tournament.location?.state) && (
                            <span className="text-muted-foreground italic">Location details pending</span>
                        )}
                    </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm h-full">
          <CardContent className="p-6 space-y-4 h-full flex flex-col">
            <h4 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
              <Trophy className="w-5 h-5 text-primary" /> Prize Pool
            </h4>
             {isEditing ? (
                 <div className="space-y-4 flex-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                         <div className="flex items-center gap-3">
                             <Label className="w-20 shrink-0">1st Prize</Label>
                             <div className="relative w-full">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                <Input type="number" value={editForm.firstPrize || ''} onChange={e => setEditForm({...editForm, firstPrize: e.target.value})} className="pl-7" />
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <Label className="w-20 shrink-0">2nd Prize</Label>
                             <div className="relative w-full">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                <Input type="number" value={editForm.secondPrize || ''} onChange={e => setEditForm({...editForm, secondPrize: e.target.value})} className="pl-7" />
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <Label className="w-20 shrink-0">3rd Prize</Label>
                             <div className="relative w-full">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                <Input type="number" value={editForm.extraPrize || ''} onChange={e => setEditForm({...editForm, extraPrize: e.target.value})} className="pl-7" />
                             </div>
                         </div>
                    </div>
                 </div>
             ) : (
                <ul className="space-y-3 flex-1">
                <li className="flex justify-between items-center pb-2 border-b border-dashed border-muted-foreground/20">
                    <span className="font-medium text-muted-foreground">1st Prize</span>
                    <Badge variant="default" className="text-base px-3 py-0.5">₹{tournament.prize?.firstPrize || 0}</Badge>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-dashed border-muted-foreground/20">
                    <span className="font-medium text-muted-foreground">2nd Prize</span>
                    <Badge variant="secondary" className="text-base px-3 py-0.5">₹{tournament.prize?.secondPrize || 0}</Badge>
                </li>
                {tournament.prize?.extraPrize ? (
                    <li className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">3rd Prize</span>
                    <span className="font-mono font-bold text-primary">₹{tournament.prize?.extraPrize}</span>
                    </li>
                ) : null}
                </ul>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card className="border shadow-sm mb-8">
        <CardContent className="p-6 space-y-4">
          <h4 className="font-bold flex items-center gap-2 text-lg border-b pb-2">
            <Shield className="w-5 h-5 text-primary" /> Tournament Rules
          </h4>
          {isEditing ? (
               <Textarea 
                value={editForm.rules || ''} 
                onChange={e => setEditForm({...editForm, rules: e.target.value})} 
                className="min-h-[200px] font-mono text-sm leading-relaxed"
                placeholder="Enter tournament rules here..."
               />
          ) : (
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {tournament.rules || "Standard cricket rules apply. Please contact the organizer for specific regulations."}
                </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentDetails;
