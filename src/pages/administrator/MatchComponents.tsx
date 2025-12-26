import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

// Helper component for Matches List
export const MatchesList = ({ tournamentId }: { tournamentId?: string }) => {
    const [matches, setMatches] = useState<any[]>([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if(tournamentId) fetchMatches();
    }, [tournamentId]);

    const fetchMatches = async () => {
        // We probably need getMatchesByTournament route or filter on client
        // For MVP, filter on client from "getAllMatches" or create new route
        // Let's use getAllMatches and filter (inefficient but works for small app)
        try {
            const res = await axios.get("/api/match/all");
            const tournamentMatches = res.data.matches.filter((m: any) => m.tournament._id === tournamentId);
            setMatches(tournamentMatches);
        } catch (error) {
            console.error("Failed to load matches");
        }
    }

    if(matches.length === 0) return <div className="text-center text-muted-foreground p-4">No matches scheduled.</div>

    return (
        <div className="space-y-3">
            {matches.map(match => (
                <div key={match._id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                        <div className="text-right w-32 font-semibold">{match.opponentX?.title.replace(/^\{[\s\S]*\}\s*/, "")}</div>
                        <div className="text-xs text-muted-foreground">VS</div>
                        <div className="text-left w-32 font-semibold">{match.opponentY?.title.replace(/^\{[\s\S]*\}\s*/, "")}</div>
                    </div>
                    <div>
                         <Badge variant={match.status === 'completed' ? 'default' : 'outline'}>{match.status}</Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Helper component for Create Match Form
export const CreateMatchForm = ({ tournamentId, onSuccess }: { tournamentId?: string, onSuccess: () => void }) => {
    const [teams, setTeams] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        opponentX: "",
        opponentY: "",
        matchDate: "",
    });
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
         const res = await axios.get("/api/team/all", { headers: { Authorization: `Bearer ${token}` } });
         // Filter teams belonging to this tournament? 
         // For now, allow picking any team, or better, allow filtering by tournament if team has that info
         // The team model has tournament field.
         const tournamentTeams = res.data.teams.filter((t: any) => t.tournament && t.tournament._id === tournamentId);
         setTeams(tournamentTeams);
    }

    const handleSubmit = async () => {
        try {
             await axios.post("/api/match/create", {
                 tournamentId,
                 opponentX: formData.opponentX,
                 opponentY: formData.opponentY,
                 // matchDate: formData.matchDate 
             }, { headers: { Authorization: `Bearer ${token}` } });
             onSuccess();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-4 py-4">
             <div className="grid gap-2">
                 <Label>Team A</Label>
                 <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.opponentX}
                    onChange={e => setFormData({...formData, opponentX: e.target.value})}
                 >
                     <option value="">Select Team A</option>
                     {teams.map(t => <option key={t._id} value={t._id}>{t.title.replace(/^\{[\s\S]*\}\s*/, "")}</option>)}
                 </select>
             </div>
             <div className="grid gap-2">
                 <Label>Team B</Label>
                 <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.opponentY}
                    onChange={e => setFormData({...formData, opponentY: e.target.value})}
                 >
                     <option value="">Select Team B</option>
                     {teams.map(t => <option key={t._id} value={t._id}>{t.title.replace(/^\{[\s\S]*\}\s*/, "")}</option>)}
                 </select>
             </div>
             <Button className="w-full" onClick={handleSubmit}>Schedule Match</Button>
        </div>
    )
}
