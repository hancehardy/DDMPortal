import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrderById, updateOrder as dbUpdateOrder } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the order ID from the route params
    const orderId = params.id;
    
    // Get order from database
    const order = await getOrderById(orderId);
    
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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the order ID from the route params
    const orderId = params.id;
    
    // Get the request body
    const body = await request.json();
    
    // Update order in database
    const updatedOrder = await dbUpdateOrder(orderId, body);
    
    // Return the updated order
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
} 