'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrderFormData, OrderItem, DoorStyle, Finish, GlassType, SizeParameter, Manufacturer } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface OrderContextType {
  orderData: OrderFormData;
  updateOrderData: (data: Partial<OrderFormData>) => void;
  addOrderItem: () => void;
  updateOrderItem: (id: string, data: Partial<OrderItem>) => void;
  removeOrderItem: (id: string) => void;
  resetOrderData: () => void;
  resetOrderItems: () => void;
  doorStyles: DoorStyle[];
  finishes: Finish[];
  glassTypes: GlassType[];
  sizeParameters: SizeParameter[];
  manufacturers: Manufacturer[];
  isLoading: boolean;
  addDoorStyle: (doorStyle: DoorStyle) => Promise<void>;
  addFinish: (finish: Finish) => Promise<void>;
  addGlassType: (glassType: GlassType) => Promise<void>;
  addManufacturer: (manufacturer: Manufacturer) => Promise<void>;
  updateDoorStyle: (id: string, doorStyle: Partial<DoorStyle>) => Promise<void>;
  updateFinish: (id: string, finish: Partial<Finish>) => Promise<void>;
  updateGlassType: (id: string, glassType: Partial<GlassType>) => Promise<void>;
  updateManufacturer: (id: string, manufacturer: Partial<Manufacturer>) => Promise<void>;
  deleteDoorStyle: (id: string) => Promise<void>;
  deleteFinish: (id: string) => Promise<void>;
  deleteGlassType: (id: string) => Promise<void>;
  deleteManufacturer: (id: string) => Promise<void>;
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
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load data from API on initial render - only on client side
  useEffect(() => {
    // Skip API calls during server-side rendering
    if (!isMounted) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try to restore order data from localStorage first
        const savedOrderData = localStorage.getItem('savedOrderData');
        if (savedOrderData) {
          setOrderData(JSON.parse(savedOrderData));
        }

        console.log('OrderContext: Starting data fetch...');
        
        // Fetch door styles
        console.log('OrderContext: Fetching door styles...');
        const doorStylesResponse = await axios.get('/api/door-styles');
        console.log('OrderContext: Raw door styles response:', doorStylesResponse.data);
        
        // Filter to only include available door styles
        const availableDoorStyles = doorStylesResponse.data.filter((style: any) => style.available);
        console.log('OrderContext: Filtered door styles (available only):', availableDoorStyles);
        setDoorStyles(availableDoorStyles);

        // Fetch finishes
        console.log('OrderContext: Fetching finishes...');
        const finishesResponse = await axios.get('/api/finishes');
        console.log('OrderContext: Raw finishes response:', finishesResponse.data);
        setFinishes(finishesResponse.data);
        
        // Save finishes to localStorage for use in OrderViewClient
        localStorage.setItem('finishes', JSON.stringify(finishesResponse.data));

        // Fetch glass types
        console.log('OrderContext: Fetching glass types...');
        const glassTypesResponse = await axios.get('/api/glass-types');
        console.log('OrderContext: Raw glass types response:', glassTypesResponse.data);
        setGlassTypes(glassTypesResponse.data);
        
        // Save glass types to localStorage for use in OrderViewClient
        localStorage.setItem('glassTypes', JSON.stringify(glassTypesResponse.data));

        // Fetch manufacturers
        console.log('OrderContext: Fetching manufacturers...');
        const manufacturersResponse = await axios.get('/api/manufacturers');
        console.log('OrderContext: Raw manufacturers response:', manufacturersResponse.data);
        setManufacturers(manufacturersResponse.data);

        console.log('OrderContext: All data fetched successfully.');

        // For now, we'll keep size parameters in memory since they don't have an API endpoint yet
        setSizeParameters([
          { name: 'Standard Height', inches: 30, mm: 762 },
          { name: 'Standard Width', inches: 24, mm: 610 },
          { name: 'Minimum Height', inches: 10, mm: 254 },
          { name: 'Maximum Height', inches: 96, mm: 2438 }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty arrays if API calls fail
        setDoorStyles([]);
        setFinishes([]);
        setGlassTypes([]);
        setManufacturers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isMounted]);

  // Order data functions
  const updateOrderData = (data: Partial<OrderFormData>) => {
    setOrderData(prev => {
      const newData = { ...prev, ...data };
      // Save to localStorage whenever order data is updated
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedOrderData', JSON.stringify(newData));
      }
      return newData;
    });
  };

  // Function to reset order data back to defaults
  const resetOrderData = () => {
    setOrderData(defaultOrderData);
    // Clear saved order data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedOrderData');
    }
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

  // Function to reset only order items while preserving order details
  const resetOrderItems = () => {
    setOrderData(prev => ({
      ...prev,
      items: [{
        id: uuidv4(),
        qty: 1,
        width: 0,
        height: 0,
        centerRail: false,
        glass: false,
        glassType: '',
        notes: ''
      }]
    }));
  };

  // Door Style functions
  const addDoorStyle = async (doorStyle: DoorStyle) => {
    try {
      const response = await axios.post('/api/door-styles', doorStyle);
      // Re-fetch all door styles to ensure we have the latest data
      const doorStylesResponse = await axios.get('/api/door-styles');
      const availableDoorStyles = doorStylesResponse.data.filter((style: any) => style.available);
      setDoorStyles(availableDoorStyles);
      return response.data;
    } catch (error) {
      console.error('Error adding door style:', error);
      throw error;
    }
  };

  const updateDoorStyle = async (id: string, doorStyle: Partial<DoorStyle>) => {
    try {
      const response = await axios.put(`/api/door-styles/${id}`, doorStyle);
      // Re-fetch all door styles to ensure we have the latest data
      const doorStylesResponse = await axios.get('/api/door-styles');
      const availableDoorStyles = doorStylesResponse.data.filter((style: any) => style.available);
      setDoorStyles(availableDoorStyles);
      return response.data;
    } catch (error) {
      console.error('Error updating door style:', error);
      throw error;
    }
  };

  const deleteDoorStyle = async (id: string) => {
    try {
      await axios.delete(`/api/door-styles/${id}`);
      // Re-fetch all door styles to ensure we have the latest data
      const doorStylesResponse = await axios.get('/api/door-styles');
      const availableDoorStyles = doorStylesResponse.data.filter((style: any) => style.available);
      setDoorStyles(availableDoorStyles);
    } catch (error) {
      console.error('Error deleting door style:', error);
      throw error;
    }
  };

  // Finish functions
  const addFinish = async (finish: Finish) => {
    try {
      const response = await axios.post('/api/finishes', finish);
      // Re-fetch all finishes to ensure we have the latest data
      const finishesResponse = await axios.get('/api/finishes');
      setFinishes(finishesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('finishes', JSON.stringify(finishesResponse.data));
      return response.data;
    } catch (error) {
      console.error('Error adding finish:', error);
      throw error;
    }
  };

  const updateFinish = async (id: string, finish: Partial<Finish>) => {
    try {
      const response = await axios.put(`/api/finishes/${id}`, finish);
      // Re-fetch all finishes to ensure we have the latest data
      const finishesResponse = await axios.get('/api/finishes');
      setFinishes(finishesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('finishes', JSON.stringify(finishesResponse.data));
      return response.data;
    } catch (error) {
      console.error('Error updating finish:', error);
      throw error;
    }
  };

  const deleteFinish = async (id: string) => {
    try {
      await axios.delete(`/api/finishes/${id}`);
      // Re-fetch all finishes to ensure we have the latest data
      const finishesResponse = await axios.get('/api/finishes');
      setFinishes(finishesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('finishes', JSON.stringify(finishesResponse.data));
    } catch (error) {
      console.error('Error deleting finish:', error);
      throw error;
    }
  };

  // Glass Type functions
  const addGlassType = async (glassType: GlassType) => {
    try {
      const response = await axios.post('/api/glass-types', glassType);
      // Re-fetch all glass types to ensure we have the latest data
      const glassTypesResponse = await axios.get('/api/glass-types');
      setGlassTypes(glassTypesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('glassTypes', JSON.stringify(glassTypesResponse.data));
      return response.data;
    } catch (error) {
      console.error('Error adding glass type:', error);
      throw error;
    }
  };

  const updateGlassType = async (id: string, glassType: Partial<GlassType>) => {
    try {
      const response = await axios.put(`/api/glass-types/${id}`, glassType);
      // Re-fetch all glass types to ensure we have the latest data
      const glassTypesResponse = await axios.get('/api/glass-types');
      setGlassTypes(glassTypesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('glassTypes', JSON.stringify(glassTypesResponse.data));
      return response.data;
    } catch (error) {
      console.error('Error updating glass type:', error);
      throw error;
    }
  };

  const deleteGlassType = async (id: string) => {
    try {
      await axios.delete(`/api/glass-types/${id}`);
      // Re-fetch all glass types to ensure we have the latest data
      const glassTypesResponse = await axios.get('/api/glass-types');
      setGlassTypes(glassTypesResponse.data);
      // Update local storage for OrderViewClient
      localStorage.setItem('glassTypes', JSON.stringify(glassTypesResponse.data));
    } catch (error) {
      console.error('Error deleting glass type:', error);
      throw error;
    }
  };

  // Manufacturer functions
  const addManufacturer = async (manufacturer: Manufacturer) => {
    try {
      const response = await axios.post('/api/manufacturers', manufacturer);
      // Re-fetch all manufacturers to ensure we have the latest data
      const manufacturersResponse = await axios.get('/api/manufacturers');
      setManufacturers(manufacturersResponse.data);
      return response.data;
    } catch (error) {
      console.error('Error adding manufacturer:', error);
      throw error;
    }
  };

  const updateManufacturer = async (id: string, manufacturer: Partial<Manufacturer>) => {
    try {
      const response = await axios.put(`/api/manufacturers/${id}`, manufacturer);
      // Re-fetch all manufacturers to ensure we have the latest data
      const manufacturersResponse = await axios.get('/api/manufacturers');
      setManufacturers(manufacturersResponse.data);
      return response.data;
    } catch (error) {
      console.error('Error updating manufacturer:', error);
      throw error;
    }
  };

  const deleteManufacturer = async (id: string) => {
    try {
      await axios.delete(`/api/manufacturers/${id}`);
      // Re-fetch all manufacturers to ensure we have the latest data
      const manufacturersResponse = await axios.get('/api/manufacturers');
      setManufacturers(manufacturersResponse.data); 
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      throw error;
    }
  };

  const value = {
    orderData,
    updateOrderData,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    resetOrderData,
    resetOrderItems,
    doorStyles,
    finishes,
    glassTypes,
    sizeParameters,
    manufacturers,
    isLoading,
    addDoorStyle,
    addFinish,
    addGlassType,
    addManufacturer,
    updateDoorStyle,
    updateFinish,
    updateGlassType,
    updateManufacturer,
    deleteDoorStyle,
    deleteFinish,
    deleteGlassType,
    deleteManufacturer
  };

  return (
    <OrderContext.Provider value={value}>
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