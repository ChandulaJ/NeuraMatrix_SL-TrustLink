import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Save, X, User, Mail, Phone, MapPin, Building, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUser = {
  id: "U-001",
  name: "Sanjeewa Fonseka",
  email: "sanjeewa.fonseka@gov.lk",
  phone: "+94 77 234 5678",
  department: "Tourism Development Authority",
  role: "Senior Inspector",
  location: "Colombo District",
  joinDate: "January 15, 2020",
  avatar: "",
  permissions: ["View Applications", "Audit Properties", "Generate Reports"],
  bio: "Experienced tourism inspector with over 8 years in hospitality compliance and safety auditing."
};

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [formData, setFormData] = useState(mockUser);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(userData);
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-government-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-government-800 mb-2">Profile Settings</h1>
          <p className="text-government-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-lg bg-government-primary text-white">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-government-800">{userData.name}</h3>
                    <p className="text-government-600">{userData.role}</p>
                    <Badge className="mt-2 bg-government-primary-light text-government-800">
                      ID: {userData.id}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-government-200">
                    <h4 className="font-medium text-government-700 mb-2">Permissions</h4>
                    <div className="space-y-1">
                      {userData.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="block text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-government-800">Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="bg-status-approved hover:bg-status-approved/90">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </label>
                    {isEditing ? (
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Senior Inspector">Senior Inspector</SelectItem>
                          <SelectItem value="Inspector">Inspector</SelectItem>
                          <SelectItem value="Junior Inspector">Junior Inspector</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Department
                    </label>
                    {isEditing ? (
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tourism Development Authority">Tourism Development Authority</SelectItem>
                          <SelectItem value="Ministry of Tourism">Ministry of Tourism</SelectItem>
                          <SelectItem value="Sri Lanka Tourism Board">Sri Lanka Tourism Board</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.department}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-government-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-government-700">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full p-2 border border-government-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-government-primary focus:border-transparent"
                      rows={3}
                    />
                  ) : (
                    <p className="text-government-900 bg-government-50 p-2 rounded border">{userData.bio}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-government-200">
                  <div className="flex items-center gap-2 text-sm text-government-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};