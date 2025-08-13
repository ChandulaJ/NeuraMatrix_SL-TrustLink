import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Users, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const departments = [
    {
      id: 1,
      name: "Immigration Department",
      code: "IMM",
      description: "Passport services, visa applications, and immigration matters",
      servicesCount: 12,
      avgWaitTime: "45 mins",
      icon: "🛂",
      popular: true
    },
    {
      id: 2,
      name: "Motor Traffic Department",
      code: "MTD",
      description: "Driving licenses, vehicle registration, and traffic permits",
      servicesCount: 18,
      avgWaitTime: "30 mins",
      icon: "🚗",
      popular: true
    },
    {
      id: 3,
      name: "Police Department",
      code: "POL",
      description: "Character certificates, police reports, and clearances",
      servicesCount: 8,
      avgWaitTime: "25 mins",
      icon: "👮",
      popular: false
    },
    {
      id: 4,
      name: "Wildlife Department",
      code: "WLD",
      description: "Wildlife permits, conservation licenses, and environmental clearances",
      servicesCount: 6,
      avgWaitTime: "60 mins",
      icon: "🦋",
      popular: false
    },
    {
      id: 5,
      name: "Registrar General",
      code: "REG",
      description: "Birth certificates, marriage certificates, and vital records",
      servicesCount: 15,
      avgWaitTime: "20 mins",
      icon: "📋",
      popular: true
    },
    {
      id: 6,
      name: "Trade Department",
      code: "TRD",
      description: "Business licenses, trade permits, and commercial registrations",
      servicesCount: 10,
      avgWaitTime: "35 mins",
      icon: "🏢",
      popular: false
    },
    {
      id: 7,
      name: "Health Department",
      code: "HTH",
      description: "Health certificates, medical licenses, and sanitary permits",
      servicesCount: 9,
      avgWaitTime: "40 mins",
      icon: "🏥",
      popular: false
    },
    {
      id: 8,
      name: "Education Department",
      code: "EDU",
      description: "School certificates, educational verifications, and academic documents",
      servicesCount: 7,
      avgWaitTime: "30 mins",
      icon: "🎓",
      popular: false
    }
  ];

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewServices = (departmentId: number) => {
    navigate(`/departments/${departmentId}/services`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Government Departments</h1>
          <p className="text-muted-foreground">Choose a department to access their services</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search departments or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Popular Departments */}
        {searchQuery === "" && (
          <div>
            <h2 className="text-xl font-heading font-semibold mb-4">Popular Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {departments.filter(dept => dept.popular).map((department) => (
                <Card key={department.id} className="shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewServices(department.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{department.icon}</div>
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    </div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <CardDescription className="text-sm">{department.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {department.servicesCount} services
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {department.avgWaitTime}
                      </span>
                    </div>
                    <Button className="w-full" onClick={() => handleViewServices(department.id)}>
                      View Services
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Departments */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">
            {searchQuery ? `Search Results (${filteredDepartments.length})` : "All Departments"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewServices(department.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{department.icon}</div>
                    {department.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                  </div>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription className="text-sm">{department.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {department.servicesCount} services
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {department.avgWaitTime}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => handleViewServices(department.id)}>
                    View Services
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredDepartments.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No departments found matching "{searchQuery}"</div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Departments;