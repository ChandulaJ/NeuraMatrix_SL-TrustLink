import { AdminScheduleList } from "@/components/dashboard/AdminScheduleList";
import { useState, useEffect, useCallback } from "react";
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

import { Api } from "@/lib/api";
import { API_APPLICATION_DETAIL, API_SCHEDULE_CREATE, API_APPLICATION_ACCEPT_APPOINTMENT, API_APPLICATION_APPROVE, API_APPLICATION_REJECT } from "@/lib/api-endpoints";

export const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface ApiDocument {
    id: number;
    applicationId: number;
    name: string;
    url: string;
  }

  interface ApiUser {
    id: number;
    fullName?: string;
    username?: string;
    email?: string;
    address?: string;
    phone?: string;
  }

  interface ApiAuditReport {
    auditorName?: string;
    result?: string;
    checklist?: {
      fireSafety?: string;
      hygiene?: string;
      emergencyExits?: string;
    };
    photoEvidence?: string;
  }

  interface ApiApplication {
    id: number;
    userId: number;
    serviceId: number;
    type: string;
    status: string;
    scheduledAt?: string;
    notes?: string;
    region?: string;
    locationText?: string;
    licenseNumber?: string | null;
    createdAt?: string;
    updatedAt?: string;
    documents?: ApiDocument[];
    auditReport?: ApiAuditReport | null;
    user?: ApiUser;
  }

  interface UIDocument {
    name: string;
    url: string;
  }

  interface UIAuditChecklist {
    fireSafety: string;
    hygiene: string;
    emergencyExits: string;
  }

  interface UIApplication {
    id: number;
    businessName: string;
    location: string;
    owner: string;
    address: string;
    phone: string;
    email: string;
    submitted: string;
    documents: UIDocument[];
    auditor: string;
    auditDate: string;
    result: string;
    checklist: UIAuditChecklist;
    notes: string;
    photoEvidence: string;
    currentStatus: string;
    licenseNumber: string | null;
  }

  const [application, setApplication] = useState<UIApplication | null>(null);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.get<ApiApplication>(
        API_APPLICATION_DETAIL(String(id))
      );
      // Map server response to UI fields
      setApplication({
        id: res.id,
        businessName: res.user?.fullName || res.user?.username || "-",
        location: `${res.locationText || "-"} • ${res.region || "-"}`,
        owner: res.user?.fullName || "-",
        address: res.user?.address || "-",
        phone: res.user?.phone || "-",
        email: res.user?.email || "-",
        submitted: res.createdAt ? new Date(res.createdAt).toLocaleString() : "-",
        documents: (res.documents || []).map((doc) => ({ name: doc.name, url: doc.url })),
        auditor: res.auditReport?.auditorName || "-",
        auditDate: res.scheduledAt ? new Date(res.scheduledAt).toLocaleString() : "-",
        result: res.auditReport?.result || "-",
        checklist: {
          fireSafety: res.auditReport?.checklist?.fireSafety || "-",
          hygiene: res.auditReport?.checklist?.hygiene || "-",
          emergencyExits: res.auditReport?.checklist?.emergencyExits || "-",
        },
        notes: res.notes || "-",
        photoEvidence: res.auditReport?.photoEvidence || "-",
        currentStatus: res.status ? res.status.charAt(0) + res.status.slice(1).toLowerCase().replace("_", " ") : "-",
        licenseNumber: res.licenseNumber || "-",
      });
    } catch (err) {
      setError((err as Error).message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchApplication();
  }, [id, fetchApplication]);
  
  interface AppointmentAcceptResponse {
    appointmentId: number;
    accepted: boolean;
    overlapDetected: boolean;
  overlaps: unknown[];
  }

  interface ApproveResponse {
    status: string;
    licenseNumber?: string;
    appointment?: {
      accepted: boolean;
      overlapDetected: boolean;
    };
  }

  // Helper to create admin schedule
  const createAdminSchedule = async (start: string, end: string, title: string) => {
    return Api.post<{ id: number; adminId: number; start: string; end: string; title: string }>(
      API_SCHEDULE_CREATE,
      { start, end, title }
    );
  };

  const handleApproveAndSchedule = async () => {
    if (!scheduleDate || !scheduleTime || !id) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the license minting schedule.",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreatingSchedule(true);
  // Api will inject Authorization header from cookie
      // Combine date and time into ISO string
      const [hours, minutes] = scheduleTime.split(":");
      const scheduledFor = new Date(scheduleDate);
      scheduledFor.setHours(Number(hours), Number(minutes), 0, 0);
      const isoString = scheduledFor.toISOString();

      // 0. Create admin schedule
      await createAdminSchedule(isoString, isoString, `License Minting for Application #${id}`);

      // 1. Accept appointment
      await Api.post<AppointmentAcceptResponse>(
        API_APPLICATION_ACCEPT_APPOINTMENT(String(id)),
        { scheduledFor: isoString, force: true }
      );

      // 2. Approve application
      const approveRes = await Api.post<ApproveResponse>(
        API_APPLICATION_APPROVE(String(id)),
        { appointment: { scheduledFor: isoString, force: true } }
      );

      toast({
        title: approveRes.status === "APPROVED" ? "Application Approved!" : "Approval Failed",
        description: approveRes.status === "APPROVED"
          ? `License minting scheduled for ${format(scheduledFor, "PPP")} at ${scheduleTime}. License #: ${approveRes.licenseNumber || "-"}`
          : "Approval failed or returned unexpected status.",
      });
      setIsScheduleDialogOpen(false);
      setCreatingSchedule(false);
  // Refresh application to reflect new status and license
  await fetchApplication();
    } catch (err) {
      setCreatingSchedule(false);
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to approve application.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await Api.post<{ status: string }>(
        API_APPLICATION_REJECT(String(id)),
        { reason: "Rejected by officer" }
      );
      toast({
        title: "Application Rejected",
        description: "The application has been rejected and the applicant will be notified.",
        variant: "destructive"
      });
      // Optionally update UI or refetch application
  await fetchApplication();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to reject application.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase?.() || "";
    switch (s) {
      case "approved":
        return "ml-2 bg-status-approved text-white";
      case "rejected":
        return "ml-2 bg-status-rejected text-white";
      case "pending":
        return "ml-2 bg-status-pending text-white";
      case "audit passed":
      case "audit-passed":
        return "ml-2 bg-status-audit-passed text-white";
      default:
        return "ml-2 bg-government-300 text-government-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-government-50 flex items-center justify-center">
        <div className="text-center text-government-700">Loading...</div>
      </div>
    );
  }
  if (error || !application) {
    return (
      <div className="min-h-screen bg-government-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-government-800 mb-4">Application Not Found</h2>
          <div className="text-red-500 mb-4">{error}</div>
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
                  <div className="mb-4">
                    <div className="font-semibold mb-2">Your Schedules</div>
                    <div className="max-h-[50vh] overflow-auto pr-2">
                      <AdminScheduleList />
                    </div>
                  </div>
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
                        disabled={creatingSchedule}
                      >
                        {creatingSchedule ? "Processing..." : "Confirm Schedule"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsScheduleDialogOpen(false)}
                        className="flex-1"
                        disabled={creatingSchedule}
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
                    {application.documents.map((doc, index) => (
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
                  <Badge className={getStatusBadgeClass(application.currentStatus)}>
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