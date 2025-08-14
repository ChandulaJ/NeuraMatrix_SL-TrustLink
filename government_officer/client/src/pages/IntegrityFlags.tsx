import { motion } from "framer-motion";
import { AlertTriangle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrityFlags = [
  {
    id: 1,
    type: "Volume Spike",
    description: "Unusual application volume from a single owner: Volume Spike Owner (3 in 30 days)",
    severity: "High" as const,
    icon: "🔺",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    id: 2, 
    type: "Applicant Pattern",
    description: "Applicant with multiple recent rejections: Rejected Place 0 (2)",
    severity: "Low" as const,
    icon: "😟",
    color: "bg-orange-100 text-orange-800 border-orange-200"
  }
];

export const IntegrityFlags = () => {
  return (
    <div className="p-6 bg-government-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-government-800">System Integrity Flags</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All <span className="ml-1 bg-government-200 px-2 py-1 rounded text-xs">2</span></Button>
            <Button variant="outline" size="sm">High <span className="ml-1 bg-red-200 px-2 py-1 rounded text-xs">1</span></Button>
            <Button variant="outline" size="sm">Medium <span className="ml-1 bg-yellow-200 px-2 py-1 rounded text-xs">0</span></Button>
            <Button variant="outline" size="sm">Low <span className="ml-1 bg-orange-200 px-2 py-1 rounded text-xs">1</span></Button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {integrityFlags.map((flag, index) => (
          <motion.div
            key={flag.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${flag.color} bg-white`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-current/10 flex items-center justify-center text-xl">
                  {flag.type === "Volume Spike" ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : (
                    <span className="text-orange-600">😟</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-government-800">{flag.type}</h3>
                    <Badge 
                      className={`px-2 py-1 text-xs font-medium ${
                        flag.severity === "High" 
                          ? "bg-red-100 text-red-800 border-red-200" 
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }`}
                    >
                      {flag.severity}
                    </Badge>
                  </div>
                  <p className="text-government-700">{flag.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                <Button 
                  size="sm"
                  className="bg-status-approved hover:bg-green-600 text-white"
                >
                  Mark resolved
                </Button>
                <Button variant="outline" size="sm">
                  View related
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};