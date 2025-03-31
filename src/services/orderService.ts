/**
 * Order Service
 * 
 * This service provides functions for interacting with the orders API.
 */

import { v4 as uuidv4 } from 'uuid';
import { sendOrderConfirmation, sendOrderStatusUpdate } from './emailService';

// Types
export interface OrderItem {
  id: string;
  qty: number;
  width: number;
  height: number;
  doorStyle: string;
  color: string;
  glass: boolean;
  glassType: string;
  centerRail: boolean;
  price: number;
}

export interface Customer {
  name: string;
  email: string;
  company?: string;
  jobName?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  shippingNotes?: string;
  paymentMethod: string;
  orderDate: string;
  status: string;
  summary: OrderSummary;
}

// API Functions

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch order');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const newOrder = await response.json();
    
    // Send order confirmation email
    sendOrderConfirmation(newOrder).catch(err => {
      console.error('Error sending order confirmation email:', err);
    });
    
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

/**
 * Update an existing order
 */
export async function updateOrder(
  orderId: string, 
  updates: Partial<Omit<Order, 'id' | 'orderDate'>>
): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
    
    const updatedOrder = await response.json();
    
    // Send status update email if status changed
    if (updates.status) {
      sendOrderStatusUpdate(updatedOrder, updates.status).catch(err => {
        console.error('Error sending order status update email:', err);
      });
    }
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string): Promise<void> {
  try {
    await updateOrder(orderId, { status: 'Cancelled' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

/**
 * Add items from an order to cart (reorder)
 */
export async function addOrderItemsToCart(order: Order): Promise<void> {
  try {
    // Format items for cart with new IDs
    const cartItems = order.items.map(item => ({
      ...item,
      id: uuidv4(),  // Generate new IDs for cart items
    }));
    
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Add new items to cart
    const updatedCart = [...existingCart, ...cartItems];
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Error adding order items to cart:', error);
    throw new Error('Failed to add items to cart');
  }
} 