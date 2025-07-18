import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  businessName?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real app, you'd check the session with the backend
      // For demo purposes, we'll simulate a logged-in state
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call to /auth/login
      // For demo purposes, we'll simulate a successful login
      const demoUser: User = {
        id: 1,
        email,
        role: email.includes('business') ? 'business' : 'client',
        firstName: 'Demo',
        lastName: 'User',
        businessName: email.includes('business') ? 'Demo Business' : undefined
      };

      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // In a real app, this would make an API call to /auth/register
      // For demo purposes, we'll simulate a successful registration
      const newUser: User = {
        id: Date.now(),
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName
      };

      localStorage.setItem('demo_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('demo_user');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
};