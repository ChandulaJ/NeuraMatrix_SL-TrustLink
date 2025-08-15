import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, MoreVertical, Eye, RotateCcw, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { appointmentApi, type Appointment } from "@/services/appointmentApi";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/authApi";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const userData = await authApi.getUserByEmail(JSON.parse(localStorage.getItem('email') || '""'));
      if (!userData) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const userAppointments = await appointmentApi.getUserAppointments(userData.id); // In real app, get from auth
      setAppointments(userAppointments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": 
      case "pending": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await appointmentApi.updateStatus(appointmentId, 'CANCELLED');
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const handleRescheduleAppointment = async (appointmentId: number) => {
    // In a real app, this would open a reschedule dialog
    toast({
      title: "Reschedule",
      description: "Reschedule functionality would be implemented here.",
    });
  };

  const filterAppointments = (status?: string) => {
    if (!status) return appointments;
    return appointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAppointmentReference = (appointment: Appointment) => {
    return `APP-${appointment.id}-${appointment.createdAt.slice(-6)}`;
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{appointment.service?.name || 'Service Name'}</CardTitle>
            <p className="text-sm text-muted-foreground">{appointment.service?.department?.name || 'Department'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {(appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
                  <>
                    <DropdownMenuItem onClick={() => handleRescheduleAppointment(appointment.id)}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Cancel Appointment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(appointment.scheduledAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(appointment.scheduledAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{appointment.type === 'ONLINE' ? 'Online Meeting' : 'In-Person Visit'}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-sm text-muted-foreground">Reference: </span>
              <span className="text-sm font-medium">{getAppointmentReference(appointment)}</span>
            </div>
            <Badge variant="outline">{appointment.type}</Badge>
          </div>

          {appointment.notes && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">Notes: </span>
              <span className="text-sm">{appointment.notes}</span>
            </div>
          )}

          {(appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
            <div className="pt-2">
              <QRCodeDisplay 
                appointmentId={appointment.id} 
                reference={getAppointmentReference(appointment)} 
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground">Manage your government service appointments</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading appointments...</div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filterAppointments("pending").length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filterAppointments("completed").length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filterAppointments("cancelled").length})</TabsTrigger>
            </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {filterAppointments("pending").map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {filterAppointments("completed").map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {filterAppointments("cancelled").map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        )}

        {!isLoading && appointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No appointments found</div>
            <Button onClick={() => window.location.href = "/departments"}>
              Book Your First Appointment
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyAppointments;