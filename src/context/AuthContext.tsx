import React, { createContext, useContext, useState } from 'react';
import type { User, PaymentMethod, SubscriptionPlan } from '../types/models';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  subscription: SubscriptionPlan | null;
  paymentMethod: PaymentMethod | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  updateSubscription: (subscriptionPlan: SubscriptionPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod | null>(null);

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await authApi.register(fullName, email, password);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setSubscription(null);
    setPaymentMethodState(null);
  };

  const updatePaymentMethod = async (method: PaymentMethod) => {
    // TODO: Replace with actual API call to save payment method
    setPaymentMethodState(method);
  };

  const updateSubscription = async (subscriptionPlan: SubscriptionPlan) => {
    // TODO: Replace with actual API call to update subscription
    setSubscription(subscriptionPlan);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        paymentMethod,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updatePaymentMethod,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
