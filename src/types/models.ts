// User Models
export interface Address {
  _id?: string;
  city: string;
  street: string;
  houseNumber: string;
  zipCode: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
  includesDelivery: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  address?: Address | string;
  subscription?: SubscriptionPlan | string;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth Models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  address?: Address;
  subscription?: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: User;
}

// Payment Models
export interface PaymentMethod {
  id?: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv?: string;
  amount?: number;
  isDefault?: boolean;
}
