export interface OrderFormData {
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
  name: string;
  available: boolean;
}

export interface Finish {
  name: string;
  manufacturer: string;
}

export interface GlassType {
  name: string;
  sqftPrice: number;
  sqftMinimum: number;
}

export interface SizeParameter {
  name: string;
  inches: number;
  mm: number;
} 