import { AdminScheduleList } from "@/components/dashboard/AdminScheduleList";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
// schedule dialog moved to its own component
import { ApplicantSubmission } from "./application/ApplicantSubmission";
import { AuditorReport } from "./application/AuditorReport";
import { StatusCard } from "./application/StatusCard";
import { ScheduleDialog } from "./application/ScheduleDialog";
import type { ApiApplication, UIApplication } from "./application/types";
// Start time uses native input instead of the Select control
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Api } from "@/lib/api";
import { API_APPLICATION_DETAIL, API_SCHEDULE_CREATE, API_APPLICATION_ACCEPT_APPOINTMENT, API_APPLICATION_APPROVE, API_APPLICATION_REJECT } from "@/lib/api-endpoints";
export const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // schedule UI moved to ScheduleDialog component
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [application, setApplication] = useState<UIApplication | null>(null);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    const url = API_APPLICATION_DETAIL(String(id));
    console.log("[ApplicationDetail] fetching", { id, url });
    try {
      const res = await Api.get<ApiApplication>(url);
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
      const message = (err as Error).message || "Failed to load application";
      setError(message);
      try {
        setErrorDetails(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      } catch (e) {
        setErrorDetails(String(err));
      }
      console.error("[ApplicationDetail] fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // Fetch application when the component mounts or when the id changes
  useEffect(() => {
    if (!id) {
      setError("Invalid application id");
      setLoading(false);
      return;
    }
    fetchApplication();
  }, [fetchApplication, id]);
  // Do NOT prefill title; let the officer enter it explicitly via advanced options
  
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

  // schedule actions handled inside ScheduleDialog

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
          {errorDetails && (
            <pre className="text-xs text-left bg-gray-50 p-2 rounded mb-4 max-w-xl mx-auto overflow-auto">{errorDetails}</pre>
          )}
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => fetchApplication()} className="bg-government-primary">
              Retry
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
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
              <ScheduleDialog applicationId={id} onSuccess={fetchApplication} />
              
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <ApplicantSubmission application={application} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <AuditorReport application={application} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <StatusCard application={application} />
        </motion.div>
      </div>
    </div>
  );
};