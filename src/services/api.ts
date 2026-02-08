import { User, LoginRequest, RegisterRequest, AuthResponse, SubscriptionPlan } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1234/api';

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

  register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiCall('/auth/register', 'POST', { fullName, email, password });
    if (response.accessToken) {
      setToken(response.accessToken);
    }
    return response;
  },

  logout: () => {
    clearToken();
  },

  getCurrentUser: async (): Promise<User> => {
    return apiCall('/auth/me', 'GET');
  },
};

// Subscription API calls
export const subscriptionApi = {
  getAll: async (): Promise<SubscriptionPlan[]> => {
    return apiCall('/subscriptions', 'GET');
  },

  getById: async (id: string): Promise<SubscriptionPlan> => {
    return apiCall(`/subscriptions/${id}`, 'GET');
  },

  create: async (plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiCall('/subscriptions', 'POST', plan);
  },

  update: async (id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return apiCall(`/subscriptions/${id}`, 'PUT', plan);
  },

  delete: async (id: string): Promise<void> => {
    return apiCall(`/subscriptions/${id}`, 'DELETE');
  },
};
