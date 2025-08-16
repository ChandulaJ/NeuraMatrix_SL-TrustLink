import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/authApi";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Authentication Error", description: "Please login to update your profile", variant: "destructive" });
        return;
      }
      const updates = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth?.slice(0,10),
      };
      const updated = await authApi.updateProfile(token, updates);
      setProfileData(updated);
      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Your profile information has been updated successfully." });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast({ title: "Authentication Error", description: "Please login to view your profile", variant: "destructive" });
          return;
        }
        const user = await authApi.getProfile(token);
        setProfileData(user);
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to load profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
  };

  const activityHistory = [
    { action: "Booked appointment", service: "Passport Renewal", date: "2024-01-20", status: "completed" },
    { action: "Updated profile", service: "Profile Information", date: "2024-01-18", status: "completed" },
    { action: "Cancelled appointment", service: "Birth Certificate", date: "2024-01-15", status: "cancelled" },
    { action: "Account created", service: "Profile Setup", date: "2023-06-15", status: "completed" }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Unable to load profile data</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                 <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">
                     {profileData?.firstName?.[0] || 'U'}{profileData?.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                 <CardTitle className="text-xl">{profileData?.firstName} {profileData?.lastName}</CardTitle>
                <CardDescription>Verified Citizen</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Account Verified
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                     <span>{profileData?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                     <span>{profileData?.phoneNumber || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                     <span>-</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                     <span>Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                           <Input
                            id="firstName"
                             value={profileData?.firstName || ''}
                             onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                           <Input
                            id="lastName"
                             value={profileData?.lastName || ''}
                             onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                         <Input
                          id="email"
                          type="email"
                           value={profileData?.email || ''}
                           onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                         <Input
                          id="phone"
                           value={profileData?.phoneNumber || ''}
                           onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                           <Input
                            id="dateOfBirth"
                            type="date"
                             value={profileData?.dateOfBirth ? profileData.dateOfBirth.slice(0,10) : ''}
                             onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationalId">National ID</Label>
                           <Input
                            id="nationalId"
                             value={profileData?.nationalId || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Update your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            placeholder="Enter current password"
                            className="pr-10"
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
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your account activity history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityHistory.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <h4 className="font-medium">{activity.action}</h4>
                            <p className="text-sm text-muted-foreground">{activity.service}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                            <Badge 
                              variant={activity.status === "completed" ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;