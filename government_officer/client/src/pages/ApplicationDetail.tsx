import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Check, X, Calendar, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data for application details
const mockApplications: { [key: string]: any } = {
  "A-1001": {
    id: "A-1001",
    businessName: "Anusha's Guesthouse",
    location: "Mirissa • Southern",
    owner: "Anusha Perera",
    address: "23 Beach Rd, Mirissa",
    phone: "+94 77 123 4567",
    email: "anusha@example.com",
    submitted: "7/25/2025, 3:53:08 PM",
    documents: [
      { name: "Deed.pdf", url: "#" },
      { name: "Company_Registration.pdf", url: "#" },
      { name: "Utility_Bill_1.pdf", url: "#" }
    ],
    auditor: "Sanjeewa Fonseka",
    auditDate: "8/8/2025, 3:53:08 PM",
    result: "PASSED",
    checklist: {
      fireSafety: "Pass",
      hygiene: "Pass",
      emergencyExits: "Pass"
    },
    notes: "All safety measures verified.",
    photoEvidence: "photo1.jpg",
    currentStatus: "Audit Passed",
    licenseNumber: "-"
  }
};

export const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const application = mockApplications[id || ""];
  
  const handleApproveAndSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the license minting schedule.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Approved!",
      description: `License minting scheduled for ${format(scheduleDate, "PPP")} at ${scheduleTime}`,
    });
    setIsScheduleDialogOpen(false);
  };

  const handleReject = () => {
    toast({
      title: "Application Rejected",
      description: "The application has been rejected and the applicant will be notified.",
      variant: "destructive"
    });
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-government-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-government-800 mb-4">Application Not Found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-government-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-government-200 px-6 py-4">
        <div className="flex items-center gap-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-government-600 hover:text-government-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-government-500" />
            <input
              type="text"
              placeholder="Search business, license, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-government-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-government-primary focus:border-transparent text-sm"
            />
          </div>
          <Button className="bg-government-primary hover:bg-government-primary-light px-6">
            Search
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-government-800 mb-2">
                {application.businessName}
              </h1>
              <p className="text-government-600">
                ID: {application.id} • {application.location}
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-status-approved hover:bg-status-approved/90 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Approve & Schedule License
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-government-800">Schedule License Minting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-government-700">Select Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-government-700">Select Time</label>
                      <Select value={scheduleTime} onValueChange={setScheduleTime}>
                        <SelectTrigger className="w-full">
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleApproveAndSchedule}
                        className="flex-1 bg-status-approved hover:bg-status-approved/90 text-white"
                      >
                        Confirm Schedule
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsScheduleDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={handleReject}
                className="bg-status-rejected hover:bg-status-rejected/90 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Applicant Submission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-government-800">Applicant Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-medium text-government-700">Owner:</label>
                  <p className="text-government-900">{application.owner}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Address:</label>
                  <p className="text-government-900">{application.address}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Phone:</label>
                  <p className="text-government-900">{application.phone}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Email:</label>
                  <p className="text-government-900">{application.email}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Submitted:</label>
                  <p className="text-government-900">{application.submitted}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700 block mb-2">Documents:</label>
                  <ul className="space-y-2">
                    {application.documents.map((doc: any, index: number) => (
                      <li key={index}>
                        <a
                          href={doc.url}
                          className="text-government-primary hover:text-government-primary-light underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auditor's Report */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-government-800">Auditor's Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-medium text-government-700">Auditor:</label>
                  <p className="text-government-900">{application.auditor}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Audit Date:</label>
                  <p className="text-government-900">{application.auditDate}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Result:</label>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-status-approved" />
                    <span className="font-medium text-status-approved">{application.result}</span>
                  </div>
                </div>
                <div>
                  <label className="font-medium text-government-700 block mb-2">Checklist (read-only):</label>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Fire Safety:</span>
                      <Badge className="bg-status-approved text-white text-xs">
                        {application.checklist.fireSafety}
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Hygiene:</span>
                      <Badge className="bg-status-approved text-white text-xs">
                        {application.checklist.hygiene}
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Emergency Exits:</span>
                      <Badge className="bg-status-approved text-white text-xs">
                        {application.checklist.emergencyExits}
                      </Badge>
                    </li>
                  </ul>
                </div>
                <div>
                  <label className="font-medium text-government-700">Notes:</label>
                  <p className="text-government-900">{application.notes}</p>
                </div>
                <div>
                  <label className="font-medium text-government-700">Photo Evidence:</label>
                  <p className="text-government-900">{application.photoEvidence}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-government-800">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="font-medium text-government-700">Current Status:</label>
                  <Badge className="ml-2 bg-status-audit-passed text-white">
                    {application.currentStatus}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="font-medium text-government-700">License #:</label>
                <span className="ml-2 text-government-900">{application.licenseNumber}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};