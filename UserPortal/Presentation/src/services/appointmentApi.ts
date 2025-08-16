const API_BASE_URL = 'http://localhost:3000';

export interface CreateAppointmentRequest {
  userId: number;
  serviceId: number;
  type: 'IN_PERSON' | 'ONLINE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  scheduledAt: string;
  notes?: string;
  reference: string;
  documents?: File[];
}

export interface DocumentInfo {
  url: string;
  name: string;
}

export interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  type: 'IN_PERSON' | 'ONLINE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  scheduledAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  documents?: DocumentInfo[];
  qrcode?: string; // URL to the QR code image
  // Additional fields for UI display
  service?: {
    name: string;
    department: {
      name: string;
    };
  };
}

export const appointmentApi = {
  // Create appointment with file uploads
  create: async (appointment: CreateAppointmentRequest): Promise<Appointment> => {
    const formData = new FormData();
    
    // Add appointment data
    formData.append('userId', appointment.userId.toString());
    formData.append('serviceId', appointment.serviceId.toString());
    formData.append('type', appointment.type);
    formData.append('status', appointment.status);
    formData.append('scheduledAt', appointment.scheduledAt);
    formData.append('reference', appointment.reference);
    if (appointment.notes) {
      formData.append('notes', appointment.notes);
    }
    
    // Add documents if provided
    if (appointment.documents && appointment.documents.length > 0) {
      appointment.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header, let browser set it with boundary
    });
    
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    
    return response.json();
  },

  // Get user appointments
  getUserAppointments: async (userId: number): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    return response.json();
  },

  // Update appointment status
  updateStatus: async (appointmentId: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update appointment status');
    }
    
    return response.json();
  },

  // Delete appointment
  delete: async (appointmentId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }
  },
};