import React, { createContext, useContext, useState } from 'react';
import { User, PaymentMethod, SubscriptionPlan } from '../types/models';

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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod | null>(null);

  const login = async (email: string, _password: string) => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      _id: '1',
      fullName: 'משתמש',
      email,
      isAdmin: false,
    };
    setUser(mockUser);
  };

  const register = async (fullName: string, email: string, _password: string) => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      _id: '1',
      fullName,
      email,
      isAdmin: false,
    };
    setUser(mockUser);
  };

  const logout = () => {
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
