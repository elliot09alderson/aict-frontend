import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdministratorSidebar } from "@/components/AdministratorSidebar";

const AdministratorLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdministratorSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-primary/20 flex items-center px-4 bg-card/50 backdrop-blur-sm">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-heading font-semibold text-foreground">Administrator Panel</h1>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdministratorLayout;
