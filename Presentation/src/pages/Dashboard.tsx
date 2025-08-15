import { useState,useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Calendar, Clock, QrCode, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { getAllServices } from "@/services/servicesApi";
import {appointmentApi} from "@/services/appointmentApi";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/services/authApi";


const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [recentServices, setRecentServices] = useState<any>(null);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {

      const fetchService = async () => {
        try {
          const userData = await authApi.getUserByEmail(JSON.parse(localStorage.getItem('email') || '""'));
          setUserData(userData);
          const serviceData = await getAllServices();
          const bookingData = await appointmentApi.getUserAppointments(1);
          setRecentServices(serviceData);
          setBookedAppointments(bookingData);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load dashboard details",
            variant: "destructive"
          });
        }
      };
  
    fetchService();
    }, [toast]);

  // const recentServices = [
  //   { name: "Passport Renewal", department: "Immigration", date: "2024-01-15", status: "completed" },
  //   { name: "Driving License", department: "Motor Traffic", date: "2024-01-10", status: "pending" },
  //   { name: "Birth Certificate", department: "Registrar General", date: "2024-01-05", status: "completed" }
  // ];

  // const bookedAppointments = [
  //   {
  //     id: 1,
  //     service: "Passport Renewal",
  //     department: "Immigration Department",
  //     date: "2024-01-25",
  //     time: "10:00 AM",
  //     status: "upcoming",
  //     reference: "APP-2024-001"
  //   },
  //   {
  //     id: 2,
  //     service: "Vehicle Registration",
  //     department: "Motor Traffic Department",
  //     date: "2024-01-30",
  //     time: "2:00 PM",
  //     status: "upcoming",
  //     reference: "APP-2024-002"
  //   },
  //   {
  //     id: 3,
  //     service: "Business License",
  //     department: "Trade Department",
  //     date: "2024-01-20",
  //     time: "11:00 AM",
  //     status: "completed",
  //     reference: "APP-2024-003"
  //   }
  // ];
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const latestAppointment = bookedAppointments.find(apt => apt.status === "upcoming");

  if (!recentServices) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome back, {userData.firstName}!</h1>
          <p className="text-primary-foreground/90">Manage your government services and appointments</p>
        </div>

        {/* NFT Permit Card Section */}
        {latestAppointment && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Digital Permit Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-semibold">{latestAppointment.service}</h3>
                    <p className="text-primary-foreground/90">{latestAppointment.department}</p>
                  </div>
                  <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-foreground/70">Date & Time</p>
                    <p className="font-medium">{latestAppointment.date} at {latestAppointment.time}</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Reference</p>
                    <p className="font-medium">{latestAppointment.reference}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Services */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentServices.slice(0, 3).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.department.name}</p>
                      <p className="text-xs text-muted-foreground">{service.department.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.status === "available" ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge variant={service.status === "not available" ? "default" : "secondary"}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booked Appointments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Booked Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookedAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium">{appointment.service.name}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.service.department.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(appointment.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(appointment.scheduledAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

