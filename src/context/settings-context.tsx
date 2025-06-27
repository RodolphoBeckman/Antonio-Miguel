'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SettingsContextType = {
  isCustomAudioEnabled: boolean;
  toggleCustomAudio: () => void;
  isInitialized: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isCustomAudioEnabled, setIsCustomAudioEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem('isCustomAudioEnabled');
      if (storedValue !== null) {
        setIsCustomAudioEnabled(JSON.parse(storedValue));
      }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const toggleCustomAudio = () => {
    const newValue = !isCustomAudioEnabled;
    setIsCustomAudioEnabled(newValue);
    try {
        localStorage.setItem('isCustomAudioEnabled', JSON.stringify(newValue));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  };

  const value = { isCustomAudioEnabled, toggleCustomAudio, isInitialized };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
