'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrderFormData, OrderItem, DoorStyle, Finish, GlassType, SizeParameter } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface OrderContextType {
  orderData: OrderFormData;
  updateOrderData: (data: Partial<OrderFormData>) => void;
  addOrderItem: () => void;
  updateOrderItem: (id: string, data: Partial<OrderItem>) => void;
  removeOrderItem: (id: string) => void;
  doorStyles: DoorStyle[];
  finishes: Finish[];
  glassTypes: GlassType[];
  sizeParameters: SizeParameter[];
  isLoading: boolean;
}

const defaultOrderData: OrderFormData = {
  company: '',
  contact: '',
  address: '',
  phone: '',
  email: '',
  jobName: '',
  doorStyle: '',
  manufacturer: '',
  color: '',
  measurementUnit: 'Inches',
  quoteOrOrder: 'Quote',
  poNumber: '',
  items: [
    {
      id: uuidv4(),
      qty: 1,
      width: 0,
      height: 0,
      bore: false,
      centerRail: false,
      glass: false,
      glassType: '',
      notes: ''
    }
  ]
};

// Mock data for development
const mockDoorStyles: DoorStyle[] = [
  { name: 'Shaker', available: true },
  { name: 'Raised Panel', available: true },
  { name: 'Flat Panel', available: true },
  { name: 'Slab', available: true }
];

const mockFinishes: Finish[] = [
  { name: 'White', manufacturer: 'Sherwin Williams' },
  { name: 'Oak', manufacturer: 'Natural Wood' },
  { name: 'Cherry', manufacturer: 'Natural Wood' },
  { name: 'Maple', manufacturer: 'Natural Wood' }
];

const mockGlassTypes: GlassType[] = [
  { name: 'Clear', sqftPrice: 10, sqftMinimum: 1 },
  { name: 'Frosted', sqftPrice: 15, sqftMinimum: 1 },
  { name: 'Textured', sqftPrice: 20, sqftMinimum: 1 }
];

const mockSizeParameters: SizeParameter[] = [
  { name: 'Standard Height', inches: 30, mm: 762 },
  { name: 'Standard Width', inches: 24, mm: 610 },
  { name: 'Minimum Height', inches: 10, mm: 254 },
  { name: 'Maximum Height', inches: 96, mm: 2438 }
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderData, setOrderData] = useState<OrderFormData>(defaultOrderData);
  const [doorStyles, setDoorStyles] = useState<DoorStyle[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [glassTypes, setGlassTypes] = useState<GlassType[]>([]);
  const [sizeParameters, setSizeParameters] = useState<SizeParameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setDoorStyles(mockDoorStyles);
        setFinishes(mockFinishes);
        setGlassTypes(mockGlassTypes);
        setSizeParameters(mockSizeParameters);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateOrderData = (data: Partial<OrderFormData>) => {
    setOrderData(prev => ({ ...prev, ...data }));
  };

  const addOrderItem = () => {
    setOrderData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: uuidv4(),
          qty: 1,
          width: 0,
          height: 0,
          bore: false,
          centerRail: false,
          glass: false,
          glassType: '',
          notes: ''
        }
      ]
    }));
  };

  const updateOrderItem = (id: string, data: Partial<OrderItem>) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    }));
  };

  const removeOrderItem = (id: string) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  return (
    <OrderContext.Provider
      value={{
        orderData,
        updateOrderData,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        doorStyles,
        finishes,
        glassTypes,
        sizeParameters,
        isLoading
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
} 