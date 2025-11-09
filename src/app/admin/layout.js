"use client";
import React from "react";
import { NotificationProvider } from "@/context/notificationContext";
export default function AdminDashboardLayout({ children }) {
  return (
    <NotificationProvider>
      <div className="flex">
        <main className="flex-1">{children}</main>
      </div>
    </NotificationProvider>
  );
}
