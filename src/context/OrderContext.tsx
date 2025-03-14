import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrderFormData, OrderItem, DoorStyle, Finish, GlassType, SizeParameter } from '@/types';
import { fetchExcelData, extractDoorStyles, extractFinishes, extractGlassTypes, extractSizeParameters } from '@/utils/dataUtils';
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
      hinge: 'None',
      bore: false,
      centerRail: false,
      glass: false,
      glassType: '',
      notes: ''
    }
  ]
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderData, setOrderData] = useState<OrderFormData>(defaultOrderData);
  const [doorStyles, setDoorStyles] = useState<DoorStyle[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [glassTypes, setGlassTypes] = useState<GlassType[]>([]);
  const [sizeParameters, setSizeParameters] = useState<SizeParameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchExcelData();
        if (data) {
          setDoorStyles(extractDoorStyles(data));
          setFinishes(extractFinishes(data));
          setGlassTypes(extractGlassTypes(data));
          setSizeParameters(extractSizeParameters(data));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

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
          hinge: 'None',
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