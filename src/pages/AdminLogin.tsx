import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Lock, User, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("pratikverma9691@gmail.com");
  const [password, setPassword] = useState("Deadpool@123");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Check if direct login (OTP disabled)
      if (response.data.token) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("isAdminLoggedIn", "true"); // Compatibility
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          navigate("/organizer/dashboard");
          return;
      }

      toast({
        title: "OTP Sent",
        description: response.data.message || "Please check your email for the OTP.",
      });
      setOtpSent(true);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      // Save token and user info
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Also keep the old flag for compatibility if needed, but rely on token mostly
      localStorage.setItem("isAdminLoggedIn", "true");

      toast({
        title: "Login Successful",
        description: "Welcome back, Organizer!",
      });
      navigate("/organizer/dashboard");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary via-primary to-stadium-blue-light flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cricket-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-primary/20 bg-card/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-accent to-cricket-gold rounded-full flex items-center justify-center shadow-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Organizer Login
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Access your tournament management dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-border focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background border-border focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
                >
                  {loading ? "Sending OTP..." : "Sign In"}
                </Button>
              </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground">
                    Enter OTP
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 bg-background border-border focus:border-accent"
                      required
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
                >
                   {loading ? "Verifying..." : "Verify & Login"}
                </Button>
                 <div className="text-center">
                    <Button variant="link" onClick={() => setOtpSent(false)} className="text-muted-foreground">
                        Back to Login
                    </Button>
                 </div>
              </form>
            )}
            
            <div className="text-center text-sm text-muted-foreground mt-4">
               {/* Cleaned up demo credentials text */}
              </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
          >
            ← Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
