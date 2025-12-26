import { Menu, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
     // Function to check auth state
     const checkAuth = () => {
         const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
         const storedUser = localStorage.getItem("user");
         if (isAdminLoggedIn && storedUser) {
             try {
                setUser(JSON.parse(storedUser));
             } catch (e) {
                 console.error("Failed to parse user data", e);
                 setUser(null);
             }
         } else {
             setUser(null);
         }
     };

     // Check on mount
     checkAuth();

     // Listen for custom events or just interval/check on focus?
     // For now, let's just use an interval or rely on navigation.
     // Adding a simplified listener for storage changes (works across tabs)
     window.addEventListener('storage', checkAuth);
     
     // Custom event dispatcher from login page could be better but interval is robust for simplistic needs
     // Or just assume single tab flow mainly.
     
     return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/");
      // Force reload or dispatch event if needed to clear state in other components
  };

  const isActive = (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cricket-gold">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="hidden text-xl font-bold text-primary-foreground md:block">
                AICT
              </span>
            </a>

            {/* Navigation Links */}
            <div className="hidden items-center gap-6 lg:flex">
              <span 
                onClick={() => navigate('/')} 
                className={`cursor-pointer text-sm transition-colors hover:text-primary-foreground ${isActive('/') ? 'font-bold text-cricket-gold' : 'font-medium text-primary-foreground/90'}`}
              >
                Home
              </span>
              <span 
                onClick={() => navigate('/tournaments')} 
                className={`cursor-pointer text-sm transition-colors hover:text-primary-foreground ${isActive('/tournaments') || isActive('/tournament') ? 'font-bold text-cricket-gold' : 'font-medium text-primary-foreground/90'}`}
              >
                Tournaments
              </span>
              <a href="/#matches" className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground">
                Matches
              </a>
              <a href="/#teams" className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground">
                Teams
              </a>
              <a href="/#news" className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground">
                News
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search matches, teams..."
                  className="w-48 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 md:w-64"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* User Login - KEEPING THIS AS IS FOR NORMAL USERS */}
            {/* Might differentiate later, but for now assuming this is "Fan" login vs "Organizer" login */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Organizer Login OR Profile */}
            {user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent/20">
                            <Avatar className="h-9 w-9 border-2 border-accent">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "O"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/organizer/dashboard")} className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button 
                className="hidden bg-accent hover:bg-accent/90 md:inline-flex"
                onClick={() => navigate("/organizer/login")}
                >
                Organizer Login
                </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
