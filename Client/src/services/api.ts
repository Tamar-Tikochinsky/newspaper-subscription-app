import type { User, AuthResponse, SubscriptionPlan } from '../types/models';
// import.meta.env.VITE_API_URL || 
const API_URL = 'http://localhost:5000/api';

// Store token in localStorage
const setToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const clearToken = () => {
  localStorage.removeItem('accessToken');
};

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
    console.error('Failed to parse JWT in api helper:', err);
    return null;
  }
};

// API request helper with authorization
const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
};

// Auth API calls
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiCall('/auth/login', 'POST', { email, password });
    if (response.accessToken) {
      setToken(response.accessToken);
    }
    return response;
  },

  register: async (fullName: string, email: string, password: string, cardDetails?: any): Promise<AuthResponse> => {
    const body: any = { fullName, email, password };
    if (cardDetails) {
      body.cardDetails = cardDetails;
    }
    const response = await apiCall('/auth/register', 'POST', body);
    if (response.accessToken) {
      setToken(response.accessToken);
    }
    return response;
  },

  logout: () => {
    clearToken();
  },

  getCurrentUser: async (): Promise<User> => {
    const token = getToken();
    if (!token) {
      throw new Error('No auth token available');
    }
    const payload = parseJwt(token);
    if (!payload?.id && !payload?._id) {
      throw new Error('Invalid auth token');
    }
    const userId = payload.id || payload._id;
    return apiCall(`/user/${userId}`, 'GET');
  },
};

// Subscription API calls
export const subscriptionApi = {
  getAll: async (): Promise<SubscriptionPlan[]> => {
    return apiCall('/subscription', 'GET');
  },

  getById: async (id: string): Promise<SubscriptionPlan> => {
    return apiCall(`/subscription/${id}`, 'GET');
  },

  create: async (plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiCall('/subscription', 'POST', plan);
  },

  update: async (id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiCall(`/subscription/${id}`, 'PUT', plan);
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/subscription/${id}`, 'DELETE');
  },
};

// User API for admin actions
export const userApi = {
  getAll: async (): Promise<User[]> => {
    return apiCall('/user', 'GET');
  },
  cancelSubscription: async (_userId: string): Promise<void> => {
    throw new Error('Cancel subscription is not supported by the server API');
  },
  delete: async (userId: string): Promise<void> => {
    return apiCall(`/user/${userId}`, 'DELETE');
  },
};

// Payment-related API calls
export const paymentApi = {
  getMyPayments: async (): Promise<any[]> => {
    try {
      return await apiCall('/payment/my', 'GET');
    } catch (err) {
      console.warn('paymentApi.getMyPayments: failed to fetch server history, returning empty array', err);
      return [];
    }
  },
  createSimple: async (subscriptionId: string, amount: number) => {
    return apiCall('/payment/start', 'POST', { subscriptionId, amount });
  },
  getAllPayments: async (): Promise<any[]> => {
    return apiCall('/payment/all', 'GET');
  },
};
