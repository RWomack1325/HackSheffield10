'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  userId: string;
  characterId: string;
  characterName?: string;
  campaignName?: string;
  campaignCode?: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  setUserPartial: (patch: Partial<UserData>) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'dnd-companion-user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUser = (userData: UserData) => {
    setUserState(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const setUserPartial = (patch: Partial<UserData>) => {
    setUserState((prev) => {
      const next = { ...(prev || {}), ...patch } as UserData;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error('Error saving partial user to localStorage:', error);
      }
      return next;
    });
  };

  const clearUser = () => {
    setUserState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, setUserPartial, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
