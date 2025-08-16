// All API endpoint definitions for the client
// Update these constants if server endpoints change

export const API_BASE_URL = 'http://localhost:4000';

// Auth
export const API_AUTH_REGISTER = `${API_BASE_URL}/auth/register`;
export const API_AUTH_LOGIN = `${API_BASE_URL}/auth/login`;

// Application
export const API_APPLICATION_LIST = `${API_BASE_URL}/applications`;
export const API_APPLICATION_DETAIL = (id: string) => `${API_BASE_URL}/applications/${id}`;
export const API_APPLICATION_ACCEPT_APPOINTMENT = (id: string) => `${API_BASE_URL}/applications/${id}/appointment/accept`;
export const API_APPLICATION_APPROVE = (id: string) => `${API_BASE_URL}/applications/${id}/approve`;
export const API_APPLICATION_REJECT = (id: string) => `${API_BASE_URL}/applications/${id}/reject`;
export const API_APPLICATION_AUDIT_REPORT = (id: string) => `${API_BASE_URL}/applications/${id}/audit-report`;

// Flag
export const API_FLAG_LIST = `${API_BASE_URL}/flag`;
export const API_FLAG_RESOLVE = (id: string) => `${API_BASE_URL}/flag/${id}/resolve`;

// Notification
export const API_NOTIFICATION_LIST = `${API_BASE_URL}/notifications`;
export const API_NOTIFICATION_READ = (id: string) => `${API_BASE_URL}/notifications/${id}/read`;

// Report
export const API_REPORT_SUMMARY = `${API_BASE_URL}/reports/summary`;
export const API_REPORT_APPROVALS_VS_REJECTIONS = `${API_BASE_URL}/reports/approvals-vs-rejections`;
export const API_REPORT_AUDITOR_PERFORMANCE = `${API_BASE_URL}/reports/auditor-performance`;
export const API_REPORT_STATUS_BREAKDOWN = `${API_BASE_URL}/reports/status-breakdown`;

// Schedule
export const API_SCHEDULE_MY = `${API_BASE_URL}/admin-schedule/my`;
export const API_SCHEDULE_CREATE = `${API_BASE_URL}/admin-schedule`;
export const API_SCHEDULE_DELETE = (id: string) => `${API_BASE_URL}/admin-schedule/${id}`;
