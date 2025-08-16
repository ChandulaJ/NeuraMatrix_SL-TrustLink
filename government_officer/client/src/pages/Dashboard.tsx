import { motion } from "framer-motion";
import { Clock, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";
import type { Application } from "@/components/dashboard/ApplicationsTable";

type RawApplication = {
  id: string;
  user?: { fullName?: string; username?: string };
  locationText?: string;
  region?: string;
  createdAt?: string;
  status?: string;
};

type ApplicationsApiResponse = { items: RawApplication[] };
import { useState, useEffect } from "react";


import { Api } from "@/lib/api";
import * as apiEndpoints from "@/lib/api-endpoints";

export const Dashboard = () => {
  const [summary, setSummary] = useState<{ applicationsAwaitingFinalReview: number; auditsScheduledToday: number; avgApprovalTime30d: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Api.get<{ applicationsAwaitingFinalReview: number; auditsScheduledToday: number; avgApprovalTime30d: number }>(
          apiEndpoints.API_REPORT_SUMMARY
        );
        // assign fetched summary to state so MetricCard can display real values
        setSummary(res);
      } catch (err) {
        setError((err as Error).message || "Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      setAppLoading(true);
      setAppError(null);
      try {
        const res = await Api.get<ApplicationsApiResponse>(
          apiEndpoints.API_APPLICATION_LIST
        );
        const mapped: Application[] = res.items.map(app => ({
          id: app.id,
          businessName: app.user?.fullName || app.user?.username || "-",
          location: `${app.locationText || "-"}\n${app.region || "-"}`,
          auditDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-",
          auditor: app.user?.fullName || "N/A",
          status: (app.status || "pending").toLowerCase().replace("_", "-") as Application["status"]
        }));
        setApplications(mapped.slice(0, 5)); // Show only 5 recent
      } catch (err) {
        setAppError((err as Error).message || "Failed to load applications");
      } finally {
        setAppLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-government-50 min-h-screen">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Applications Awaiting Final Review"
          value={loading ? "-" : summary?.applicationsAwaitingFinalReview ?? "-"}
          subtitle="Click to open queue"
          icon={Clock}
          color="blue"
          clickable
        />
        <MetricCard
          title="Audits Scheduled Today"
          value={loading ? "-" : summary?.auditsScheduledToday ?? "-"}
          subtitle="Based on audit dates"
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Average Approval Time (30d)"
          value={
            loading
              ? "-"
              : typeof summary?.avgApprovalTime30d === "number"
              ? `${summary.avgApprovalTime30d.toFixed(2)} days`
              : "-"
          }
          subtitle="Demo metric"
          icon={TrendingUp}
          color="orange"
        />
      </div>
      {/* Applications Table Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {appLoading ? (
          <div>Loading...</div>
        ) : appError ? (
          <div className="text-red-500">{appError}</div>
        ) : (
          <ApplicationsTable title="Recent Applications" applications={applications} showAll={false} />
        )}
      </div>
    </div>
  );
}
