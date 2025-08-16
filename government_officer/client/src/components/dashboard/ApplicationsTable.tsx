import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Application {
  id: string;
  businessName: string;
  location: string;
  auditDate: string;
  auditor: string;
  status: "pending" | "approved" | "rejected" | "audit-passed";
}

interface ApplicationsTableProps {
  applications: Application[];
  showAll?: boolean;
}

export const ApplicationsTable = ({ applications, showAll = false }: ApplicationsTableProps) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
  // use lighter background colors with darker text for subtler chips
  case "approved": return "bg-green-200 text-green-800";
  case "rejected": return "bg-red-200 text-red-800";
  case "pending": return "bg-yellow-200 text-yellow-800";
  case "audit-passed": return "bg-green-200 text-green-800";
      default: return "bg-government-300 text-government-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "audit-passed": return "Audit Passed";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const displayApplications = showAll ? applications : applications.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border border-government-200 overflow-hidden"
    >
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-government-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                Audit Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                Auditor
              </th>
              {showAll && (
                <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-government-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-government-200">
            {displayApplications.map((application, index) => (
              <motion.tr
                key={application.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-government-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-government-900">{application.businessName}</div>
                    <div className="text-sm text-government-500">ID: {application.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-government-900">{application.location.split('\n')[0]}</div>
                  <div className="text-sm text-government-500">{application.location.split('\n')[1]}</div>
                </td>
                <td className="px-6 py-4 text-government-900">{application.auditDate}</td>
                <td className="px-6 py-4 text-government-900">{application.auditor}</td>
                {showAll && (
                  <td className="px-6 py-4">
                    <Badge
                      className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(application.status)} bg-opacity-25`}
                    >
                      {getStatusText(application.status)}
                    </Badge>
                  </td>
                )}
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/application/${application.id}`)}
                    className="bg-government-primary text-white hover:bg-government-primary-light border-government-primary"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};