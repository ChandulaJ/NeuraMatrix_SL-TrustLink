import { motion } from "framer-motion";
import { Clock, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";

const mockApplications = [
  {
    id: "A-1001",
    businessName: "Anusha's Guesthouse",
    location: "Mirissa\nSouthern",
    auditDate: "8/8/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-1005",
    businessName: "Lagoon Breeze Cabins", 
    location: "Trincomalee\nEastern",
    auditDate: "8/7/2025, 3:53:08 PM",
    auditor: "Nilanka Senanayake",
    status: "audit-passed" as const
  },
  {
    id: "A-200",
    businessName: "Sea Coral Villa 0",
    location: "Colombo\nWestern", 
    auditDate: "8/6/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-201",
    businessName: "Sea Coral Villa 1",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025, 3:53:08 PM", 
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-202",
    businessName: "Sea Coral Villa 2",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka", 
    status: "audit-passed" as const
  },
  {
    id: "A-203",
    businessName: "Sea Coral Villa 3",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-204", 
    businessName: "Sea Coral Villa 4",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-205",
    businessName: "Sea Coral Villa 5", 
    location: "Colombo\nWestern",
    auditDate: "8/6/2025, 3:53:08 PM",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  }
];

export const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-government-50 min-h-screen">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Applications Awaiting Final Review"
          value="8"
          subtitle="Click to open queue"
          icon={Clock}
          color="blue"
          clickable
        />
        <MetricCard
          title="Audits Scheduled Today"
          value="0"
          subtitle="Based on audit dates"
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Average Approval Time (30d)"
          value="10 days"
          subtitle="Demo metric"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Ready for Review Table */}
      <ApplicationsTable
        title="Ready for Review"
        applications={mockApplications}
      />
    </div>
  );
};