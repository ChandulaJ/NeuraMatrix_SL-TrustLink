import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLogin: (userData: { name: string; role: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSignIn = () => {
    onLogin({ name: "Rohan", role: "Admin" });
  };

  const handleCreateAccount = () => {
    onLogin({ name: "Rohan", role: "Admin" });
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
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <div className="w-full h-full rounded-full bg-government-primary flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-2 rounded-full border-4 border-government-700 bg-government-primary flex items-center justify-center">
                <div className="w-16 h-16 bg-government-700 rounded-sm flex items-center justify-center">
                  <div className="w-8 h-8 bg-government-primary rounded-sm"></div>
                </div>
              </div>
              {/* Decorative spikes around the circle */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-2 bg-government-700"
                  style={{
                    transformOrigin: '3px 96px',
                    transform: `rotate(${i * 10}deg)`,
                    top: '0px',
                    left: '50%',
                    marginLeft: '-3px',
                  }}
                />
              ))}
            </div>
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
            <div className="w-6 h-6 rounded-full bg-status-approved flex items-center justify-center">
              <div className="w-3 h-3 text-white">✓</div>
            </div>
            <span className="text-government-700">Pre-filtered review queue</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-status-approved flex items-center justify-center">
              <div className="w-3 h-3 text-white">✓</div>
            </div>
            <span className="text-government-700">Consolidated audit reports</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-status-approved flex items-center justify-center">
              <div className="w-3 h-3 text-white">✓</div>
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
                  <Label htmlFor="email-signin">Work email</Label>
                  <Input 
                    id="email-signin" 
                    type="email" 
                    placeholder="name@sltourism.gov.lk"
                    className="h-12"
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
                
                <Button 
                  onClick={handleSignIn}
                  className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
                >
                  Sign in
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="rohan"
                      className="h-12"
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
                
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full h-12 bg-government-primary hover:bg-government-primary-light text-white font-medium"
                >
                  Create account
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