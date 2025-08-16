import { useContext } from "react";
import { NotificationContext, NotificationContextValue } from "./notifications";

export const useNotifications = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext) as NotificationContextValue | undefined;
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
