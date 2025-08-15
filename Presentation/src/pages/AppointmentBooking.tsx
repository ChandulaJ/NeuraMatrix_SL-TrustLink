import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Clock, Calendar as CalendarIcon, MapPin, CheckCircle, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { appointmentApi } from "@/services/appointmentApi";

const AppointmentBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("IN_PERSON");
  const [notes, setNotes] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>("");

  // Mock service data
  const service = {
    id: serviceId,
    name: "Passport Renewal",
    description: "Renew your existing passport before expiration",
    department: "Immigration Department",
    duration: "45 mins",
    price: "LKR 5,000",
    location: "Immigration Office, Colombo 07",
    requirements: ["Current Passport", "National ID", "Photos"]
  };

  // Mock available time slots
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const bookedSlots = ["10:00 AM", "11:30 AM", "03:00 PM"];
  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirmation = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive"
      });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || !serviceId) return;
    
    setIsLoading(true);
    try {
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(' ')[0].split(':');
      const isPM = selectedTime.includes('PM');
      let hour24 = parseInt(hours);
      if (isPM && hour24 !== 12) hour24 += 12;
      if (!isPM && hour24 === 12) hour24 = 0;
      
      scheduledAt.setHours(hour24, parseInt(minutes));

      const appointmentData = {
        userId: 1, // Hardcoded as requested since backend only supports userId = 1
        serviceId: 1, // Hardcoded as requested since backend only supports serviceId = 1
        type: selectedType as 'IN_PERSON' | 'ONLINE',
        status: 'PENDING' as const,
        scheduledAt: scheduledAt.toISOString(),
        notes: notes || undefined,
      };

      const appointment = await appointmentApi.create(appointmentData);
      const referenceNumber = `APP-${appointment.id}-${Date.now().toString().slice(-6)}`;
      setBookingReference(referenceNumber);
      setBookingConfirmed(true);
      setShowConfirmation(false);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment has been booked. Reference: ${referenceNumber}`,
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your appointment has been successfully booked</p>
          </div>

          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-semibold">{service.name}</h3>
                    <p className="text-primary-foreground/90">{service.department}</p>
                  </div>
                  <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-foreground/70">Date & Time</p>
                    <p className="font-medium">{selectedDate?.toLocaleDateString()} at {selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Reference</p>
                    <p className="font-medium">{bookingReference}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Service Fee</span>
                  <span className="font-semibold">USD:{service.price}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {service.duration}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Important Reminders:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Arrive 15 minutes before your appointment time</li>
                  <li>• Bring all required documents</li>
                  <li>• Show this confirmation at the reception</li>
                  <li>• Payment can be made at the counter</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button className="flex-1" onClick={() => navigate("/my-appointments")}>
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Book Appointment</h1>
            <p className="text-muted-foreground">Select your preferred date and time</p>
          </div>
        </div>

        {/* Service Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{service.location}</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-primary">{service.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border w-full"
              />
              <p className="text-sm text-muted-foreground mt-3">
                Appointments are available Monday to Friday
              </p>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Available Time Slots
              </CardTitle>
              <CardDescription>
                {selectedDate ? `for ${selectedDate.toLocaleDateString()}` : "Select a date first"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelection(time)}
                      className="h-12"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Please select a date to view available time slots
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Date</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Duration</span>
                  <span className="font-medium">{service.duration}</span>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <Label htmlFor="appointment-type">Appointment Type</Label>
                    <RadioGroup value={selectedType} onValueChange={setSelectedType} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="IN_PERSON" id="in-person" />
                        <Label htmlFor="in-person">In-Person Visit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ONLINE" id="online" />
                        <Label htmlFor="online">Online Meeting</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Service Fee</span>
                    <span className="text-lg font-semibold text-primary">{service.price}</span>
                  </div>
                </div>
              </div>
              
              <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-6" size="lg" onClick={handleBookingConfirmation}>
                    Confirm Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Your Appointment</DialogTitle>
                    <DialogDescription>
                      Please review your appointment details before confirming
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div><strong>Service:</strong> {service.name}</div>
                      <div><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</div>
                      <div><strong>Time:</strong> {selectedTime}</div>
                      <div><strong>Type:</strong> {selectedType === 'IN_PERSON' ? 'In-Person Visit' : 'Online Meeting'}</div>
                      <div><strong>Location:</strong> {selectedType === 'IN_PERSON' ? service.location : 'Online Meeting Link'}</div>
                      <div><strong>Fee:</strong> {service.price}</div>
                      {notes && <div><strong>Notes:</strong> {notes}</div>}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={confirmBooking}
                        disabled={isLoading}
                      >
                        {isLoading ? "Booking..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentBooking;