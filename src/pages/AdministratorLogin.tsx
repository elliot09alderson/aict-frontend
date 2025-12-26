import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AdministratorLogin = () => {
  const [email, setEmail] = useState("pratikverma9691@gmail.com");
  const [password, setPassword] = useState("Deadpool@123");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await axios.post("/api/auth/login", { email, password });
        
        // Check if direct login (OTP disabled)
        if (res.data.token) {
             localStorage.setItem("accessToken", res.data.token);
             localStorage.setItem("user", JSON.stringify(res.data.user));
             
             toast({
                title: "Login Successful",
                description: "Welcome back, Administrator!",
            });
            navigate("/admin/dashboard");
            return;
        }

        toast({
            title: "OTP Sent",
            description: res.data.message,
        });
        setShowOtpInput(true);
    } catch (error: any) {
        toast({
            title: "Login Failed",
            description: error.response?.data?.message || "Invalid credentials",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const res = await axios.post("/api/auth/verify-otp", { email, otp });
           
          // Check role
          if (res.data.user.role !== "admin") {
              toast({
                  title: "Access Denied",
                  description: "You are not an administrator",
                  variant: "destructive"
              });
              // Optionally logout/clear token
              return;
          }

          localStorage.setItem("accessToken", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user info
          
          toast({
              title: "Login Successful",
              description: "Welcome back, Administrator!",
          });
          navigate("/admin/dashboard");
      } catch (error: any) {
           toast({
              title: "Verification Failed",
              description: error.response?.data?.message || "Invalid OTP",
              variant: "destructive"
          });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
            >
              <Shield className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Administrator
            </h1>
            <p className="text-muted-foreground mt-2">
              Super Admin Control Panel
            </p>
          </div>

          {!showOtpInput ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@cricket.com"
                      className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50 border-primary/20 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg shadow-primary/30"
                >
                  {isLoading ? "Signing In..." : "Sign In via OTP"}
                </Button>
              </form>
          ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Enter OTP</label>
                      <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="123456"
                              className="pl-10 bg-background/50 border-primary/20 focus:border-primary tracking-widest text-center text-lg"
                              required
                              maxLength={6}
                          />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                          OTP sent to {email}
                      </p>
                  </div>
                   <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg shadow-primary/30"
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
              </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Secure Admin Verification
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdministratorLogin;
