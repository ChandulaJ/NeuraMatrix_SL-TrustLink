export interface ApiDocument {
  id: number;
  applicationId: number;
  name: string;
  url: string;
}

export interface ApiUser {
  id: number;
  fullName?: string;
  username?: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface ApiAuditReport {
  auditorName?: string;
  result?: string;
  checklist?: {
    fireSafety?: string;
    hygiene?: string;
    emergencyExits?: string;
  };
  photoEvidence?: string;
}

export interface ApiApplication {
  id: number;
  userId: number;
  serviceId: number;
  type: string;
  status: string;
  scheduledAt?: string;
  notes?: string;
  region?: string;
  locationText?: string;
  licenseNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  documents?: ApiDocument[];
  auditReport?: ApiAuditReport | null;
  user?: ApiUser;
}

export interface UIDocument {
  name: string;
  url: string;
}

export interface UIAuditChecklist {
  fireSafety: string;
  hygiene: string;
  emergencyExits: string;
}

export interface UIApplication {
  id: number;
  businessName: string;
  location: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  submitted: string;
  documents: UIDocument[];
  auditor: string;
  auditDate: string;
  result: string;
  checklist: UIAuditChecklist;
  notes: string;
  photoEvidence: string;
  currentStatus: string;
  licenseNumber: string | null;
}
