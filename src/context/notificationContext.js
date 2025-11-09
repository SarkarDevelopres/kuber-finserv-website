"use client";
import { createContext, useContext, useState } from "react";

// 1. Create the context
const NotificationContext = createContext();

// 2. Provider component that wraps your layout
export const NotificationProvider = ({ children }) => {
  const [hasNotification, setHasNotification] = useState(false);

  const value = { hasNotification, setHasNotification };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useNotification = () => useContext(NotificationContext);
