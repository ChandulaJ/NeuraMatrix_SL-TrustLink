import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi, type Role } from "@/services/authApi";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "" as "MALE" | "FEMALE" | "OTHER" | "",
    dateOfBirth: "",
    role: "CITIZEN" as Role,
    nationalId: "",
    passportNo: "",
    businessRegNo: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    try {
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        role: formData.role,
      };
      if (formData.role === 'CITIZEN') payload.nationalId = formData.nationalId;
      if (formData.role === 'FOREIGNER') payload.passportNo = formData.passportNo;
      if (formData.role === 'BUSINESS_OWNER') payload.businessRegNo = formData.businessRegNo;

      const res = await authApi.register(payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast({ title: "Success", description: "Account created successfully!" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">User Portal</h1>
          <p className="text-muted-foreground mt-2">Create your citizen account</p>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Join the unified government services platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select className="h-11 w-full border rounded px-3" value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}>
                    <option value="">Select gender (optional)</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dateOfBirth}
                         onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <select className="h-11 w-full border rounded px-3" value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}>
                  <option value="CITIZEN">Citizen</option>
                  <option value="FOREIGNER">Foreigner</option>
                  <option value="BUSINESS_OWNER">Business Owner</option>
                </select>
              </div>

              {formData.role === 'CITIZEN' && (
                <div className="space-y-2">
                  <Label>National ID</Label>
                  <Input placeholder="Enter national ID"
                         value={formData.nationalId}
                         onChange={(e) => handleInputChange('nationalId', e.target.value)}
                         required />
                </div>
              )}

              {formData.role === 'FOREIGNER' && (
                <div className="space-y-2">
                  <Label>Passport Number</Label>
                  <Input placeholder="Enter passport number"
                         value={formData.passportNo}
                         onChange={(e) => handleInputChange('passportNo', e.target.value)}
                         required />
                </div>
              )}

              {formData.role === 'BUSINESS_OWNER' && (
                <div className="space-y-2">
                  <Label>Business Registration Number</Label>
                  <Input placeholder="Enter business registration number"
                         value={formData.businessRegNo}
                         onChange={(e) => handleInputChange('businessRegNo', e.target.value)}
                         required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 mt-6" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;