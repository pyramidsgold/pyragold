
export enum UserRole {
  ADMIN = 'Admin',
  LIMITED = 'Limited'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Added for auth logic
  role: UserRole;
  lastLogin: string;
}

export type TransactionType = 'BUY' | 'SELL' | 'ANALYSIS' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  customerName?: string; // Or employee name for expense
  description?: string;
  weight?: number; // in grams
  karat?: number; // 18, 21, 24
  pricePerGram?: number; // Calculated or Reference
  totalAmount: number;
  technicianId?: string;
  isPaid: boolean;
  discount?: number;
  details?: any; // JSON blob for specific details (e.g., expense category)
}

export interface Employee {
  id: string;
  name: string;
  code: string;
  jobTitle: string;
  phone: string;
  email?: string;
}

export interface Partner {
  id: string;
  name: string;
  capital: number;
  percentage: number;
}

export interface Permission {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  destination: string;
  items: string; // Description of items/gold being transported
  status: 'PENDING' | 'COMPLETED';
}

export interface Settings {
  goldPrice24: number;
  goldPrice21: number;
  goldPrice18: number;
  taxRate: number;
  currency: string;
}
