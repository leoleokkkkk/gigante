'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  role: Role;
  isOwner: boolean;
  loginAsCustomer: (name: string, email: string, phone?: string) => void;
  loginAsOwner: (password: string) => { success: boolean; message?: string };
  logout: () => void;
  isOwnerModalOpen: boolean;
  setIsOwnerModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OWNER_PASSWORD_DEFAULT = 'gigante123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gm_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loginAsCustomer = (name: string, email: string, phone?: string) => {
    const custUser: User = {
      id: `usr-cust-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer'
    };
    setUser(custUser);
    localStorage.setItem('gm_user', JSON.stringify(custUser));
  };

  const loginAsOwner = (password: string) => {
    if (password === OWNER_PASSWORD_DEFAULT || password === 'admin' || password === 'gigante2026') {
      const ownerUser: User = {
        id: 'usr-owner-01',
        name: 'Rodrigo Gigante',
        email: 'proprietario@gigantemultimarcas.com.br',
        role: 'owner',
        phone: '(11) 98765-4321'
      };
      setUser(ownerUser);
      localStorage.setItem('gm_user', JSON.stringify(ownerUser));
      setIsOwnerModalOpen(false);
      return { success: true };
    }
    return { success: false, message: 'Senha de administrador incorreta.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gm_user');
  };

  const role: Role = user?.role || 'customer';
  const isOwner = role === 'owner';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isOwner,
        loginAsCustomer,
        loginAsOwner,
        logout,
        isOwnerModalOpen,
        setIsOwnerModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
