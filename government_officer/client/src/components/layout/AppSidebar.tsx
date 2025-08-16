import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  Bell,
  LogOut,
  Building
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },

  { title: "All Applications", url: "/applications", icon: Users },
  { title: "Integrity Flags", url: "/integrity-flags", icon: AlertTriangle },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Notifications Log", url: "/notifications", icon: Bell },
];

export function AppSidebar({ onLogout }: { onLogout: () => void }) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`border-r border-government-200 bg-white ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Header */}
        <motion.div 
          className="h-16 border-b border-government-200 flex items-center px-4"
          initial={false}
          animate={{ 
            justifyContent: collapsed ? "center" : "flex-start" 
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-government-primary rounded flex items-center justify-center text-white font-bold">
              <Building className="w-5 h-5" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="text-sm font-bold text-government-800">SLTDA</div>
                <div className="text-xs text-government-500">Admin</div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-government-primary text-white"
                            : "text-government-600 hover:bg-government-100 hover:text-government-800"
                        }`
                      }
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : ""}`} />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.title}
                        </motion.span>
                      )}
                      
                      {/* Active indicator */}
                      {isActive(item.url) && !collapsed && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute right-2 w-1 h-4 bg-white rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout button at bottom */}
        <div className="mt-auto p-2">
          <motion.button
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-government-600 hover:bg-government-100 hover:text-government-800 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                Log out
              </motion.span>
            )}
          </motion.button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}