import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Clock, Users, FileText, ChevronRight } from "lucide-react";

const DepartmentServices = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock department data - in real app, fetch based on departmentId
  const department = {
    id: departmentId,
    name: "Immigration Department",
    code: "IMM",
    description: "Complete immigration services for citizens and visitors",
    icon: "🛂"
  };

  const services = [
    {
      id: 1,
      name: "New Passport Application",
      description: "Apply for a new Sri Lankan passport with all required documents",
      duration: "60 mins",
      price: "LKR 3,500",
      requirements: ["Birth Certificate", "National ID", "Photos"],
      availableSlots: 15,
      category: "Passport Services"
    },
    {
      id: 2,
      name: "Passport Renewal",
      description: "Renew your existing passport before expiration",
      duration: "45 mins",
      price: "LKR 5,000",
      requirements: ["Current Passport", "National ID", "Photos"],
      availableSlots: 8,
      category: "Passport Services"
    },
    {
      id: 3,
      name: "Emergency Travel Document",
      description: "Obtain emergency travel documents for urgent travel needs",
      duration: "30 mins",
      price: "LKR 7,500",
      requirements: ["Police Report", "Travel Tickets", "Photos"],
      availableSlots: 3,
      category: "Emergency Services"
    },
    {
      id: 4,
      name: "Visa Endorsement",
      description: "Get visa endorsements for international travel",
      duration: "90 mins",
      price: "LKR 2,000",
      requirements: ["Passport", "Visa Application", "Supporting Documents"],
      availableSlots: 12,
      category: "Visa Services"
    },
    {
      id: 5,
      name: "Exit Permit",
      description: "Apply for exit permits for special circumstances",
      duration: "75 mins",
      price: "LKR 1,500",
      requirements: ["National ID", "Application Form", "Supporting Evidence"],
      availableSlots: 6,
      category: "Permits"
    },
    {
      id: 6,
      name: "Dual Citizenship Certificate",
      description: "Apply for dual citizenship certification",
      duration: "120 mins",
      price: "LKR 25,000",
      requirements: ["Birth Certificate", "Foreign Passport", "Tax Clearance"],
      availableSlots: 2,
      category: "Citizenship Services"
    }
  ];

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(services.map(service => service.category))];

  const handleBookAppointment = (serviceId: number) => {
    navigate(`/book-appointment/${serviceId}`);
  };

  const getAvailabilityColor = (slots: number) => {
    if (slots > 10) return "bg-success text-success-foreground";
    if (slots > 5) return "bg-muted text-muted-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getAvailabilityText = (slots: number) => {
    if (slots > 10) return "High Availability";
    if (slots > 5) return "Limited Slots";
    if (slots > 0) return "Few Slots Left";
    return "Fully Booked";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/departments")} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{department.icon}</div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">{department.name}</h1>
              <p className="text-muted-foreground">{department.description}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Category Filter */}
        {searchQuery === "" && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="px-3 py-1">
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">
            Available Services {searchQuery && `(${filteredServices.length} found)`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                      <Badge variant="outline" className="mb-2">{service.category}</Badge>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{service.availableSlots} slots</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">{service.price}</span>
                      <Badge className={getAvailabilityColor(service.availableSlots)}>
                        {getAvailabilityText(service.availableSlots)}
                      </Badge>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Required Documents
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {service.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookAppointment(service.id)}
                      disabled={service.availableSlots === 0}
                    >
                      {service.availableSlots === 0 ? "Fully Booked" : "Book Appointment"}
                      {service.availableSlots > 0 && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredServices.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No services found matching "{searchQuery}"</div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DepartmentServices;