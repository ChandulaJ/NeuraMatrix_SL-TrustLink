import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";

const allApplications = [
  {
    id: "A-1001",
    businessName: "Anusha's Guesthouse",
    location: "Mirissa\nSouthern",
    auditDate: "8/8/2025",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-1002", 
    businessName: "Coconut Bay Villas",
    location: "Galle\nSouthern",
    auditDate: "-",
    auditor: "N/A",
    status: "pending" as const
  },
  {
    id: "A-1003",
    businessName: "Green Leaf Homestay",
    location: "Kandy\nCentral", 
    auditDate: "7/20/2025",
    auditor: "Nilanka Senanayake",
    status: "approved" as const
  },
  {
    id: "A-1004",
    businessName: "Mountain View Lodge", 
    location: "Nuwara Eliya\nCentral",
    auditDate: "8/2/2025",
    auditor: "Sanjeewa Fonseka",
    status: "rejected" as const
  },
  {
    id: "A-1005",
    businessName: "Lagoon Breeze Cabins",
    location: "Trincomalee\nEastern",
    auditDate: "8/7/2025", 
    auditor: "Nilanka Senanayake",
    status: "audit-passed" as const
  },
  {
    id: "A-200",
    businessName: "Sea Coral Villa 0",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-201", 
    businessName: "Sea Coral Villa 1",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025",
    auditor: "Sanjeewa Fonseka", 
    status: "audit-passed" as const
  },
  {
    id: "A-202",
    businessName: "Sea Coral Villa 2", 
    location: "Colombo\nWestern",
    auditDate: "8/6/2025",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-203",
    businessName: "Sea Coral Villa 3",
    location: "Colombo\nWestern", 
    auditDate: "8/6/2025",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-204",
    businessName: "Sea Coral Villa 4",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025", 
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-205",
    businessName: "Sea Coral Villa 5",
    location: "Colombo\nWestern",
    auditDate: "8/6/2025",
    auditor: "Sanjeewa Fonseka",
    status: "audit-passed" as const
  },
  {
    id: "A-300", 
    businessName: "Rejected Place 0",
    location: "Matara\nSouthern",
    auditDate: "8/4/2025",
    auditor: "Nilanka Senanayake",
    status: "rejected" as const
  },
  {
    id: "A-301",
    businessName: "Rejected Place 1", 
    location: "Matara\nSouthern",
    auditDate: "8/4/2025",
    auditor: "Nilanka Senanayake",
    status: "rejected" as const
  },
  {
    id: "A-400",
    businessName: "Volume Test 0",
    location: "Kandy\nCentral",
    auditDate: "-",
    auditor: "N/A", 
    status: "pending" as const
  },
  {
    id: "A-401",
    businessName: "Volume Test 1",
    location: "Kandy\nCentral",
    auditDate: "-",
    auditor: "N/A",
    status: "pending" as const
  },
  {
    id: "A-402",
    businessName: "Volume Test 2",
    location: "Kandy\nCentral", 
    auditDate: "-",
    auditor: "N/A",
    status: "pending" as const
  }
];

export const Applications = () => {
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

      <ApplicationsTable
        title=""
        applications={allApplications}
        showAll={true}
      />
    </div>
  );
};