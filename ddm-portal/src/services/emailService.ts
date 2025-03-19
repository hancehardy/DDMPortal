/**
 * Email Service
 * 
 * This service provides functions for sending email notifications.
 * In a real implementation, this would connect to an email sending service
 * like SendGrid, Mailgun, AWS SES, etc. For this demo, it logs mock emails
 * to the console.
 */

import { Order } from './orderService';

export enum EmailTemplate {
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PASSWORD_RESET = 'password_reset',
  WELCOME = 'welcome',
}

interface EmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
  templateData: any;
}

/**
 * Send an email using the specified template and data
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In a real implementation, this would use an email service API
    // For this demo, we just log the email to the console
    console.log('📧 SENDING EMAIL:');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Template: ${options.template}`);
    console.log('Template Data:', options.templateData);
    
    // Simulate success after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  return sendEmail({
    to: order.customer.email,
    subject: `Order Confirmation - #${order.id.slice(0, 8).toUpperCase()}`,
    template: EmailTemplate.ORDER_CONFIRMATION,
    templateData: {
      order,
      customerName: order.customer.name,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      orderDate: new Date(order.orderDate).toLocaleDateString(),
      orderTotal: order.summary.total.toFixed(2),
      itemCount: order.items.length,
    }
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdate(order: Order, previousStatus: string): Promise<boolean> {
  let template: EmailTemplate;
  let subject: string;
  
  switch (order.status) {
    case 'Shipped':
      template = EmailTemplate.ORDER_SHIPPED;
      subject = `Your Order #${order.id.slice(0, 8).toUpperCase()} Has Shipped`;
      break;
    case 'Delivered':
      template = EmailTemplate.ORDER_DELIVERED;
      subject = `Your Order #${order.id.slice(0, 8).toUpperCase()} Has Been Delivered`;
      break;
    case 'Cancelled':
      template = EmailTemplate.ORDER_CANCELLED;
      subject = `Your Order #${order.id.slice(0, 8).toUpperCase()} Has Been Cancelled`;
      break;
    default:
      template = EmailTemplate.ORDER_CONFIRMATION;
      subject = `Order Status Update - #${order.id.slice(0, 8).toUpperCase()}`;
  }
  
  return sendEmail({
    to: order.customer.email,
    subject,
    template,
    templateData: {
      order,
      customerName: order.customer.name,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      orderStatus: order.status,
      previousStatus,
      orderDate: new Date(order.orderDate).toLocaleDateString(),
      orderTotal: order.summary.total.toFixed(2),
    }
  });
} 