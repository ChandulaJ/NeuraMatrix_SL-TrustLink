const API_BASE_URL = 'http://localhost:3000';

export interface CreateAppointmentRequest {
  userId: number;
  serviceId: number;
  type: 'IN_PERSON' | 'ONLINE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  scheduledAt: string;
  notes?: string;
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
  // Additional fields for UI display
  service?: {
    name: string;
    department: {
      name: string;
    };
  };
}

export const appointmentApi = {
  // Create appointment
  create: async (appointment: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
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