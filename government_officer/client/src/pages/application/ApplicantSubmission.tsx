import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UIApplication } from "./types";

export const ApplicantSubmission = ({ application }: { application: UIApplication }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-government-800">Applicant Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="font-medium text-government-700">Owner:</label>
          <p className="text-government-900">{application.owner}</p>
        </div>
        <div>
          <label className="font-medium text-government-700">Address:</label>
          <p className="text-government-900">{application.address}</p>
        </div>
        <div>
          <label className="font-medium text-government-700">Phone:</label>
          <p className="text-government-900">{application.phone}</p>
        </div>
        <div>
          <label className="font-medium text-government-700">Email:</label>
          <p className="text-government-900">{application.email}</p>
        </div>
        <div>
          <label className="font-medium text-government-700">Submitted:</label>
          <p className="text-government-900">{application.submitted}</p>
        </div>
        <div>
          <label className="font-medium text-government-700 block mb-2">Documents:</label>
          <ul className="space-y-2">
            {application.documents.map((doc, index) => (
              <li key={index}>
                <a
                  href={doc.url}
                  className="text-government-primary hover:text-government-primary-light underline"
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
