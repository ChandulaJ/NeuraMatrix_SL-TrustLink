import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Api } from "@/lib/api";
import { API_NOTIFICATION_LIST, API_NOTIFICATION_READ } from "@/lib/api-endpoints";

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
  const res = await Api.get<Notification[]>(API_NOTIFICATION_LIST);
      setNotifications(res || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // poll every 60s for new notifications
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, []);

  const markAsRead = async (id: number) => {
    try {
  const res = await Api.post<Notification>(API_NOTIFICATION_READ(String(id)), {});
      setNotifications((prev) => prev.map((n) => (n.id === id ? res : n)));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const value: NotificationContextValue = {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    refresh: fetchNotifications,
    markAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Hook is provided in a separate file `useNotifications.ts` to avoid Fast Refresh issues when exporting
