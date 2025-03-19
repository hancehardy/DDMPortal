import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would be a database connection
// This is just a demo using memory storage
let orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would be protected via authentication
    const session = await getServerSession(authOptions);
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    
    // Filter orders based on query parameters
    let filteredOrders = [...orders];
    
    if (userId) {
      filteredOrders = filteredOrders.filter(order => order.userId === userId);
    }
    
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
    // In a real app, this would be protected via authentication
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
    
    // Create a new order
    const newOrder = {
      id: uuidv4(),
      userId: session.user.id,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'Processing'
    };
    
    // In a real app, this would save to a database
    orders.push(newOrder);
    
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

export async function PUT(request: NextRequest) {
  try {
    // In a real app, this would be protected via authentication
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
    if (!body.id) {
      return NextResponse.json(
        { error: 'Invalid order data: id is required' },
        { status: 400 }
      );
    }
    
    // Find the order to update
    const orderIndex = orders.findIndex(order => order.id === body.id);
    
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
    
    // Update the order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...body,
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