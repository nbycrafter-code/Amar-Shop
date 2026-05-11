"use client";

import { createContext, useContext, useState, ReactNode } from "react";


// Create context with default value
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const isBn = language === 'bn';


  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isBn
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};