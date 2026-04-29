import React, { createContext, useContext, useState } from 'react';
import type { User, PaymentMethod, SubscriptionPlan } from '../types/models';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  subscription: SubscriptionPlan | null;
  paymentMethod: PaymentMethod | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
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

  const getCurrentUserId = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.id || payload?._id || null;
  };

  const loadSavedPaymentMethod = (userId: string): PaymentMethod | null => {
    try {
      const saved = localStorage.getItem(`paymentMethod_${userId}`);
      return saved ? (JSON.parse(saved) as PaymentMethod) : null;
    } catch (err) {
      console.error('Failed to load saved payment method:', err);
      return null;
    }
  };

  const savePaymentMethod = (userId: string, method: PaymentMethod) => {
    try {
      localStorage.setItem(`paymentMethod_${userId}`, JSON.stringify(method));
    } catch (err) {
      console.error('Failed to save payment method:', err);
    }
  };

  // helper to decode a JWT payload without needing the server
  const parseJwt = (token: string): any | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Failed to parse JWT:', err);
      return null;
    }
  };

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // try to get fresh user data from server
          const current = await authApi.getCurrentUser().catch(() => null);
          if (current) {
            setUser(current as User);
            const userId = (current as User).id || (current as User)._id;
            if (userId) {
              const saved = loadSavedPaymentMethod(userId);
              if (saved) setPaymentMethodState(saved);
            }
          } else {
            const payload = parseJwt(token);
            if (payload) {
              setUser({
                id: payload.id || payload._id,
                fullName: payload.fullName || '',
                email: payload.email,
                isAdmin: payload.isAdmin || false,
              } as User);
              const userId = payload.id || payload._id;
              if (userId) {
                const saved = loadSavedPaymentMethod(userId);
                if (saved) setPaymentMethodState(saved);
              }
            }
          }
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
      if (response.accessToken) {
        const payload = parseJwt(response.accessToken);
        if (payload) {
          setUser({
            id: payload.id || payload._id,
            fullName: payload.fullName || '',
            email: payload.email,
            isAdmin: payload.isAdmin || false,
          } as User);
        }
      } else if (response.user) {
        setUser(response.user);
      }
      // refresh with server-side info
      const me = await authApi.getCurrentUser().catch(() => null);
      if (me) {
        setUser(me as User);
        const userId = (me as User).id || (me as User)._id;
        if (userId) {
          const saved = loadSavedPaymentMethod(userId);
          if (saved) setPaymentMethodState(saved);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    console.log(fullName);

    try {
      const response = await authApi.register(fullName, email, password);
      console.log(response);

      if (response.accessToken) {
        const payload = parseJwt(response.accessToken);
        if (payload) {
          setUser({
            id: payload.id || payload._id,
            fullName: payload.fullName || fullName,
            email: payload.email,
            isAdmin: payload.isAdmin || false,
          } as User);
        }

        const me = await authApi.getCurrentUser().catch(() => null);
        if (me) {
          setUser(me as User);
          const userId = (me as User).id || (me as User)._id;
          if (userId) {
            const saved = loadSavedPaymentMethod(userId);
            if (saved) setPaymentMethodState(saved);
          }
        }
      } else if (response.user) {
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
    setPaymentMethodState(method);
    const userId = user?.id || user?._id;
    if (userId) {
      savePaymentMethod(userId, method);
    }
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
        isAdmin: user?.isAdmin || false,
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
