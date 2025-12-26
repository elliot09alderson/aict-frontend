import { LayoutDashboard, Trophy, Users, LogOut, Shield, Swords } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/organizer/dashboard", icon: LayoutDashboard },
  { title: "My Tournaments", url: "/organizer/tournaments", icon: Trophy },
  { title: "Teams & Players", url: "/organizer/teams", icon: Users },
  { title: "Match Making", url: "/organizer/match-making", icon: Swords },
];

export function OrganizerSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
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

  return (
    <Sidebar className="border-r border-primary/20">
      <SidebarHeader className="p-4 border-b border-primary/20">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground">Organizer Panel</h2>
            <p className="text-xs text-muted-foreground">Manage Your Events</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                      activeClassName="bg-primary/20 text-primary font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-primary/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
