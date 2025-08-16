import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UIApplication } from "./types";

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

export const StatusCard = ({ application }: { application: UIApplication }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-government-800">Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="font-medium text-government-700">Current Status:</label>
            <Badge className={getStatusBadgeClass(application.currentStatus)}>{application.currentStatus}</Badge>
          </div>
        </div>
        <div>
          <label className="font-medium text-government-700">License #:</label>
          <span className="ml-2 text-government-900">{application.licenseNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
};
