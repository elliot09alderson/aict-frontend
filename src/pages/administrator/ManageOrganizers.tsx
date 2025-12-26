import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, MoreVertical, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Organizer {
  _id: string; // MongoDB uses _id
  name: string;
  email: string;
  phone: string;
  isActive: boolean; // Backend uses isActive boolean
  role: string;
  city?: string;
  createdAt: string;
}

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({ name: "", email: "", phone: "", password: "", city: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const token = localStorage.getItem("accessToken");

  // Fetch Organizers
  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
        const res = await axios.get("/api/user/organizers", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrganizers(res.data.organizers);
    } catch (error) {
        console.error("Failed to fetch organizers", error);
        toast({ title: "Error", description: "Failed to load organizers", variant: "destructive" });
    }
  };

  const filteredOrganizers = organizers.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrganizer = async () => {
    if (!newOrganizer.name || !newOrganizer.email || !newOrganizer.password) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
        setIsLoading(true);
        await axios.post("/api/user/create-organizer", newOrganizer, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast({ title: "Success", description: "Organizer added successfully" });
        setIsAddDialogOpen(false);
        setNewOrganizer({ name: "", email: "", phone: "", password: "", city: "" });
        fetchOrganizers(); // Refresh list
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create organizer",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
        const newStatus = !currentStatus;
        await axios.put(`/api/user/status/${id}`, 
            { status: newStatus ? "active" : "inactive" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrganizers(
            organizers.map((org) =>
                org._id === id ? { ...org, isActive: newStatus } : org
            )
        );
        toast({ title: "Status Updated", description: "Organizer status has been updated" });
    } catch (error: any) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // Not implementing delete for now as API wasn't requested, but UI has it. 
  // Can just disable instead.
  const handleDelete = (id: string) => {
     toggleStatus(id, true); // Deactivate essentially
     toast({ title: "Disabled", description: "Organizer de-activated" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Manage Organizers</h2>
          <p className="text-muted-foreground mt-1">Add, edit, and manage tournament organizers</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Organizer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Organizer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Name *</label>
                <Input
                  value={newOrganizer.name}
                  onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                  placeholder="Enter organizer name"
                  className="mt-1 bg-background/50 border-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input
                  type="email"
                  value={newOrganizer.email}
                  onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
                  placeholder="Enter email address"
                  className="mt-1 bg-background/50 border-primary/20"
                />
              </div>
              <div>
                 <label className="text-sm font-medium text-foreground">Password *</label>
                 <Input
                    type="password"
                    value={newOrganizer.password}
                    onChange={(e) => setNewOrganizer({ ...newOrganizer, password: e.target.value })}
                    placeholder="Set initial password"
                    className="mt-1 bg-background/50 border-primary/20"
                 />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  value={newOrganizer.phone}
                  onChange={(e) => setNewOrganizer({ ...newOrganizer, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="mt-1 bg-background/50 border-primary/20"
                />
              </div>
              <div>
                  <label className="text-sm font-medium text-foreground">City</label>
                  <Input 
                      value={newOrganizer.city}
                      onChange={(e) => setNewOrganizer({...newOrganizer, city: e.target.value})}
                      placeholder="City"
                      className="mt-1 bg-background/50 border-primary/20"
                  />
              </div>
              
              <Button onClick={handleAddOrganizer} disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent">
                {isLoading ? "Adding..." : "Add Organizer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search organizers..."
          className="pl-10 bg-background/50 border-primary/20"
        />
      </div>

      <div className="grid gap-4">
        {filteredOrganizers.map((organizer, index) => (
          <motion.div
            key={organizer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {organizer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{organizer.name}</h3>
                      <p className="text-sm text-muted-foreground">{organizer.email}</p>
                      <p className="text-xs text-muted-foreground">{organizer.phone} | {organizer.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                     {/* <p className="text-2xl font-bold text-primary">{organizer.tournaments}</p> */}
                      <p className="text-xs text-muted-foreground">Joined: {new Date(organizer.createdAt).toLocaleDateString()}</p>
                    </div>

                    <Badge
                      variant={organizer.isActive ? "default" : "secondary"}
                      className={organizer.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}
                    >
                      {organizer.isActive ? "Active" : "Inactive"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-primary/20">
                        <DropdownMenuItem onClick={() => toggleStatus(organizer._id, organizer.isActive)}>
                          {organizer.isActive ? (
                            <>
                              <UserX className="w-4 h-4 mr-2" /> Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                       {/* 
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                       */}
                        <DropdownMenuItem
                          onClick={() => handleDelete(organizer._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredOrganizers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No organizers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrganizers;
