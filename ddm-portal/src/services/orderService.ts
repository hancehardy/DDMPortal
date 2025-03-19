/**
 * Order Service
 * 
 * This service provides functions for interacting with the orders API.
 * In the current implementation, it works with localStorage for demo purposes,
 * but it includes commented code showing how it would work with a real API.
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
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
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
  // In a real API implementation:
  // return fetch('/api/orders?userId=current').then(res => res.json());
  
  // Demo implementation using localStorage:
  try {
    const savedOrders = localStorage.getItem('completedOrders');
    if (!savedOrders) return [];
    
    const orders = JSON.parse(savedOrders) as Order[];
    
    // Sort by date (newest first)
    return orders.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  // In a real API implementation:
  // return fetch(`/api/orders/${orderId}`).then(res => {
  //   if (!res.ok) throw new Error('Order not found');
  //   return res.json();
  // });
  
  // Demo implementation using localStorage:
  try {
    const savedOrders = localStorage.getItem('completedOrders');
    if (!savedOrders) return null;
    
    const orders = JSON.parse(savedOrders) as Order[];
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
  // In a real API implementation:
  // return fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderData)
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to create order');
  //   return res.json();
  // });
  
  // Demo implementation using localStorage:
  try {
    // Create the new order object
    const newOrder: Order = {
      ...orderData,
      id: uuidv4(),
      orderDate: new Date().toISOString(),
      status: 'Processing'
    };
    
    // Save to localStorage
    const savedOrders = localStorage.getItem('completedOrders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('completedOrders', JSON.stringify(orders));
    
    // Clear the cart
    localStorage.removeItem('cartItems');
    
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
  // In a real API implementation:
  // return fetch(`/api/orders/${orderId}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to update order');
  //   return res.json();
  // });
  
  // Demo implementation using localStorage:
  try {
    const savedOrders = localStorage.getItem('completedOrders');
    if (!savedOrders) {
      throw new Error('Order not found');
    }
    
    const orders = JSON.parse(savedOrders) as Order[];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const currentOrder = orders[orderIndex];
    const previousStatus = currentOrder.status;
    
    // Update the order
    orders[orderIndex] = {
      ...currentOrder,
      ...updates
    };
    
    // Save back to localStorage
    localStorage.setItem('completedOrders', JSON.stringify(orders));
    
    const updatedOrder = orders[orderIndex];
    
    // Send status update email if status changed
    if (updates.status && updates.status !== previousStatus) {
      sendOrderStatusUpdate(updatedOrder, previousStatus).catch(err => {
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
  // In a real API implementation:
  // return fetch(`/api/orders/${orderId}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status: 'Cancelled' })
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to cancel order');
  //   return;
  // });
  
  // Demo implementation using localStorage:
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

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cartItems: OrderItem[]): OrderSummary {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  
  // Free shipping on orders over $139
  const shipping = subtotal > 139 ? 0 : 15.99;
  
  // Discount would be calculated based on promo codes or other rules
  const discount = 0;
  
  const total = subtotal + shipping - discount;
  
  return {
    subtotal,
    shipping,
    discount,
    total
  };
} 