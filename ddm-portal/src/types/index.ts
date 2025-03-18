export interface OrderFormData {
  id?: string;
  company: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  jobName: string;
  doorStyle: string;
  manufacturer: string;
  color: string;
  measurementUnit: 'Inches' | 'MM';
  quoteOrOrder: 'Quote' | 'Order';
  poNumber: string;
  items: OrderItem[];
  orderDate?: string;
  status?: 'Pending' | 'In Production' | 'Completed' | 'Draft';
  totalItems?: number;
  totalSqFt?: number;
  totalPrice?: number;
}

export interface OrderItem {
  id: string;
  qty: number;
  width: number;
  height: number;
  centerRail: boolean;
  glass: boolean;
  glassType: string;
  notes: string;
}

export interface DoorStyle {
  id?: string;
  name: string;
  available: boolean;
}

export interface Finish {
  id?: string;
  name: string;
  manufacturer: string;
  sqftPrice: number;
}

export interface GlassType {
  id?: string;
  name: string;
  sqftPrice: number;
  sqftMinimum: number;
}

export interface SizeParameter {
  id?: string;
  name: string;
  inches: number;
  mm: number;
}

export interface Manufacturer {
  id?: string;
  name: string;
} 