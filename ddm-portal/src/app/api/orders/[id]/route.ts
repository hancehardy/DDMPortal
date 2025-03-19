import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In a real app, this would be a database connection
// This is just a demo using memory storage from the parent route
// For simplicity, we'll just simulate the database operations
let orders: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the order ID from the route params
    const orderId = params.id;
    
    // In a real app, this would query a database
    const order = orders.find(order => order.id === orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to view this order
    const session = await getServerSession(authOptions);
    
    if (!session || (order.userId !== session.user.id && !session.user.isAdmin)) {
      return NextResponse.json(
        { error: 'Unauthorized to view this order' },
        { status: 403 }
      );
    }
    
    // Return the order
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the order ID from the route params
    const orderId = params.id;
    
    // Check if the user is authorized
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find the order to update
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to update this order
    if (orders[orderIndex].userId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to update this order' },
        { status: 403 }
      );
    }
    
    // Get the request body
    const updates = await request.json();
    
    // Update the order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Return the updated order
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the order ID from the route params
    const orderId = params.id;
    
    // Check if the user is authorized
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find the order to delete
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to delete this order
    // Usually only admins can delete orders
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this order' },
        { status: 403 }
      );
    }
    
    // Delete the order
    const deletedOrder = orders[orderIndex];
    orders.splice(orderIndex, 1);
    
    // Return success message
    return NextResponse.json({
      message: 'Order deleted successfully',
      orderId
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 