import { ApplicationsTable } from "@/components/dashboard/ApplicationsTable";

const readyForReviewApplications = [
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

export const ReadyForReview = () => {
  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <ApplicationsTable
        title="Ready for Review"
        applications={readyForReviewApplications}
        showAll={true}
      />
    </div>
  );
};