'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerInfo {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  company?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  customerInfo?: CustomerInfo;
}

interface UserUpdateData {
  name?: string;
  email?: string;
  customerInfo?: CustomerInfo;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, customerInfo?: CustomerInfo) => Promise<boolean>;
  updateUser: (data: UserUpdateData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on initial render - only on client side
  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      try {
        // Only access localStorage on the client side
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Debug user loading
            console.log('[Auth] Loaded user from localStorage:', parsedUser);
            console.log('[Auth] User role:', parsedUser.role);
            console.log('[Auth] Is admin?', parsedUser.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Get existing users to check for saved profile information
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // For demo purposes, we'll use a simple check
      // In a real app, this would validate against your backend
      if (email === 'admin@example.com' && password === 'password') {
        // Check if this user has any saved profile in the users array
        const savedUser = users.find((u: any) => u.email === email);
        
        const adminUser: User = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          // Use saved customer info if it exists
          customerInfo: savedUser?.customerInfo || undefined
        };
        
        console.log('[Auth] Logging in as admin:', adminUser);
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Make sure this user exists in the users array for future updates
        if (!savedUser) {
          // Add user to users array if not already there
          users.push({
            ...adminUser,
            password // In a real app, this would be hashed
          });
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        return true;
      } else if (email === 'user@example.com' && password === 'password') {
        // Check if this user has any saved profile in the users array
        const savedUser = users.find((u: any) => u.email === email);
        
        const regularUser: User = {
          id: '2',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
          // Use saved customer info if it exists
          customerInfo: savedUser?.customerInfo || undefined
        };
        
        console.log('[Auth] Logging in as regular user:', regularUser);
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        
        // Make sure this user exists in the users array for future updates
        if (!savedUser) {
          // Add user to users array if not already there
          users.push({
            ...regularUser,
            password // In a real app, this would be hashed
          });
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        return true;
      }
      
      // Check if user exists in localStorage (for newly registered users)
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        const loggedInUser: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role || 'user',
          customerInfo: foundUser.customerInfo
        };
        console.log('[Auth] Logging in as registered user:', loggedInUser);
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    customerInfo?: CustomerInfo
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'user',
        customerInfo
      };
      
      // Store user in localStorage (in a real app, this would be in your database)
      users.push({
        ...newUser,
        password // In a real app, this would be hashed
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set current user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user function
  const updateUser = async (data: UserUpdateData): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Update user data
      const updatedUser = {
        ...user,
        ...data,
        customerInfo: {
          ...user.customerInfo,
          ...data.customerInfo
        }
      };
      
      console.log('[Auth] Updating user:', updatedUser);
      
      // Update in the users array to ensure persistence between sessions
      const userIndex = users.findIndex((u: any) => u.email === user.email);
      
      if (userIndex !== -1) {
        // Check if email is being changed and it's already in use
        if (data.email && data.email !== user.email) {
          const emailExists = users.some((u: any, index: number) => 
            index !== userIndex && u.email === data.email
          );
          if (emailExists) {
            throw new Error('Email is already in use');
          }
        }
        
        // Update user in the users array
        users[userIndex] = {
          ...users[userIndex],
          name: updatedUser.name,
          email: updatedUser.email,
          customerInfo: updatedUser.customerInfo
        };
      } else {
        // If user doesn't exist in the users array (e.g., hardcoded demo users),
        // add them to ensure their data persists between sessions
        users.push({
          ...updatedUser,
          // For demo users, we'll add the default password
          password: 'password'
        });
      }
      
      // Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Always update the current user in localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('[Auth] User updated successfully:', updatedUser);
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  // Compute isAuthenticated and isAdmin
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  
  // Debug auth state on changes
  useEffect(() => {
    console.log('[Auth] Auth state updated:');
    console.log('[Auth] User:', user);
    console.log('[Auth] Is authenticated:', isAuthenticated);
    console.log('[Auth] Is admin:', isAdmin);
  }, [user, isAuthenticated, isAdmin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateUser,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 