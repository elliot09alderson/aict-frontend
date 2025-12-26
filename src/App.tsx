import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdministratorLogin from "./pages/AdministratorLogin";
import AdministratorLayout from "./layouts/AdministratorLayout";
import Dashboard from "./pages/administrator/Dashboard";
import ManageOrganizers from "./pages/administrator/ManageOrganizers";
import ManageTeams from "./pages/administrator/ManageTeams";
import ManageTournaments from "./pages/administrator/ManageTournaments";
import OrganizerLayout from "./layouts/OrganizerLayout";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import OrganizerTournaments from "./pages/organizer/OrganizerTournaments";
import OrganizerTeams from "./pages/organizer/OrganizerTeams";
import MatchMaking from "./pages/organizer/MatchMaking";
import TournamentDetails from "./pages/organizer/TournamentDetails";
import AdminScoreboard from "./pages/administrator/AdminScoreboard";
import Settings from "./pages/administrator/Settings";
import NotFound from "./pages/NotFound";
import PublicTournamentDetails from "./pages/PublicTournamentDetails";
import Tournaments from "./pages/Tournaments";

import { ReactLenis } from "@studio-freight/react-lenis";

const queryClient = new QueryClient();

const App = () => (
  // @ts-ignore
  <ReactLenis root>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournament/:id" element={<PublicTournamentDetails />} />
            {/* Organizer Routes */}
            <Route path="/organizer/login" element={<AdminLogin />} />
            <Route path="/organizer" element={<OrganizerLayout />}>
                <Route path="dashboard" element={<OrganizerDashboard />} />
                <Route path="tournaments" element={<OrganizerTournaments />} />
                <Route path="tournaments/:id" element={<TournamentDetails />} />
                <Route path="teams" element={<OrganizerTeams />} />
                <Route path="match-making" element={<MatchMaking />} />
            </Route>
            {/* Administrator Routes */}
            <Route path="/admin/login" element={<AdministratorLogin />} />
            <Route path="/admin" element={<AdministratorLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tournaments" element={<ManageTournaments />} />
              <Route path="scoreboard" element={<AdminScoreboard />} />
              <Route path="organizers" element={<ManageOrganizers />} />
              <Route path="teams" element={<ManageTeams />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ReactLenis>
);

export default App;
