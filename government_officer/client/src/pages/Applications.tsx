import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationsTable, Application as AppType } from "@/components/dashboard/ApplicationsTable";
import { Api } from "@/lib/api";
import { API_APPLICATION_LIST } from "@/lib/api-endpoints";



interface ApiApplication {
  id: number;
  user?: { fullName?: string; username?: string };
  locationText?: string;
  region?: string;
  createdAt?: string;
  status?: string;
}

export const Applications = () => {
  const [applications, setApplications] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Api.get<ApiApplication[] | { items: ApiApplication[] }>(
          API_APPLICATION_LIST
        );
  const items: ApiApplication[] = Array.isArray(res) ? (res as ApiApplication[]) : ((res as { items?: ApiApplication[] }).items || []);
        // Map API response to table format
        const mapped = items.map((app) => ({
          id: String(app.id),
          businessName: app.user?.fullName || app.user?.username || "-",
          location: `${app.locationText || "-"}\n${app.region || "-"}`,
          auditDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-",
          auditor: app.user?.fullName || "N/A",
          status: (app.status || "pending").toLowerCase().replace("_", "-"),
        }));
        setApplications(mapped as AppType[]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-government-800">All Applications</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-government-300">
            All
          </Button>
          <Button variant="outline" className="border-government-300">
            All
          </Button>
          <Button variant="outline" className="border-government-300">
            All
          </Button>
          <Button className="bg-government-primary hover:bg-government-primary-light">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ApplicationsTable
          title=""
          applications={applications}
          showAll={true}
        />
      )}
    </div>
  );
};