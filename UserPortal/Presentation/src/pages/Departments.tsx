import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Users, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // call axios and get from backend
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch('http://localhost:3000/departments');
      const data = await response.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

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