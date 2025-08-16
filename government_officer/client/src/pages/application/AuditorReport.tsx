import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UIApplication } from "./types";

export const AuditorReport = ({ application }: { application: UIApplication }) => {
  return (
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
              <Badge className="bg-status-approved text-white text-xs">{application.checklist.fireSafety}</Badge>
            </li>
            <li className="flex justify-between">
              <span>Hygiene:</span>
              <Badge className="bg-status-approved text-white text-xs">{application.checklist.hygiene}</Badge>
            </li>
            <li className="flex justify-between">
              <span>Emergency Exits:</span>
              <Badge className="bg-status-approved text-white text-xs">{application.checklist.emergencyExits}</Badge>
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
  );
};
