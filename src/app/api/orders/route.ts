import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrdersByUserId, createOrder as dbCreateOrder } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    
    // Get orders from database
    const orders = await getOrdersByUserId(session.user.id);
    
    // Filter by orderId if provided
    let filteredOrders = orders;
    if (orderId) {
      filteredOrders = filteredOrders.filter(order => order.id === orderId);
    }
    
    // Return filtered orders
    return NextResponse.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data: items are required' },
        { status: 400 }
      );
    }
    
    // Create order in database
    const newOrder = await dbCreateOrder(body, session.user.id);
    
    // Return the new order
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 