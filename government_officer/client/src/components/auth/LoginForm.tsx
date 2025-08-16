import { useState } from "react";
import { Api } from "@/lib/api";
import * as apiEndpoints from "@/lib/api-endpoints";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import SLTDA_logo from "@/assets/SLTDA_logo.png";

interface LoginFormProps {
  onLogin: (userData: { name: string; role: string }) => void;
}


export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Create account fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      type LoginResponse = {
        accessToken?: string;
        token?: string;
        user?: { name: string; role: string };
        fullName?: string;
        name?: string;
        role?: string;
      };
      const res = await Api.post<LoginResponse>(
        apiEndpoints.API_AUTH_LOGIN,
        { username, password }
      );
      // Accept either accessToken or token for compatibility
      const token = res.accessToken || res.token;
      if (token) {
        Cookies.set("token", token, { expires: 7 });
        console.log("Token saved:", token);
      } else {
        setError("No token received from server");
        setLoading(false);
        return;
      }
      // Try to extract user info if present, else pass minimal user
      if (res.user && res.user.name && res.user.role) {
        onLogin(res.user);
      } else if (res.fullName || res.name || username) {
        // Fallback: use available info
        onLogin({ name: res.fullName || res.name || username, role: res.role || "User" });
      } else {
        setError("Login succeeded but user info missing");
      }
      console.log("Login response:", res);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create account handler
  const handleCreateAccount = async () => {
    setCreateLoading(true);
    setCreateError(null);
    if (createPassword !== confirmPassword) {
      setCreateError("Passwords do not match");
      setCreateLoading(false);
      return;
    }
    try {
      type RegisterResponse = {
        fullName?: string;
        username?: string;
        role?: string;
      };
      const res = await Api.post<RegisterResponse>(
        apiEndpoints.API_AUTH_REGISTER,
        {
          fullName,
          username,
          email,
          password: createPassword,
          role: "ADMIN"
        }
      );
      // Optionally, auto-login after registration
      onLogin({ name: res.fullName || res.username, role: res.role || "ADMIN" });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed";
      setCreateError(errorMsg);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-government-secondary flex">
      {/* Left side - Welcome content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-12 flex flex-col justify-center"
      >
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto mb-8 relative">
            <img
              src={SLTDA_logo}
              alt="SLTDA logo"
              className="w-64 h-64 rounded-full object-cover mx-auto"
            />
          </div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-bold text-government-800 mb-6"
        >
          Welcome back
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-government-600 mb-8"
        >
          Review, approve, and safeguard tourism standards with confidence.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
              <span className="text-white text-sm font-semibold leading-none">✓</span>
            </div>
            <span className="text-government-700">Pre-filtered review queue</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
              <span className="text-white text-sm font-semibold leading-none">✓</span>
            </div>
            <span className="text-government-700">Consolidated audit reports</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
              <span className="text-white text-sm font-semibold leading-none">✓</span>
            </div>
            <span className="text-government-700">Integrity flags & analytics</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Auth forms */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-[500px] p-12 bg-white flex items-center justify-center"
      >
        <Card className="w-full border-0 shadow-none">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="create">Create account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <CardContent className="space-y-6 p-0">
                <div className="space-y-2">
                  <Label htmlFor="username-signin">Username</Label>
                  <Input 
                    id="username-signin" 
                    type="text" 
                    placeholder="Enter your username"
                    className="h-12"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password-signin" 
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className="h-12 pr-12"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button 
                  onClick={handleSignIn}
                  className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="create">
              <CardContent className="space-y-6 p-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full name</Label>
                    <Input 
                      id="fullname" 
                      placeholder="Rohan Perera"
                      className="h-12"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="rohan"
                      className="h-12"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-create">Work email</Label>
                  <Input 
                    id="email-create" 
                    type="email" 
                    placeholder="name@sltourism.gov.lk"
                    className="h-12"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-create">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password-create" 
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        className="h-12 pr-12"
                        value={createPassword}
                        onChange={e => setCreatePassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-government-500">Weak</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        className="h-12 pr-12"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <span className="text-government-primary underline">Terms</span> and <span className="text-government-primary underline">Privacy</span>
                  </Label>
                </div>
                
                {createError && <div className="text-red-500 text-sm">{createError}</div>}
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create account"}
                </Button>
                <p className="text-sm text-government-500 text-center">
                  You'll be signed in automatically after creating your account
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};