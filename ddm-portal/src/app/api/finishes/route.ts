import { NextResponse } from 'next/server';
import { getAllFinishes, createFinish } from '@/lib/db';

export async function GET() {
  try {
    const finishes = await getAllFinishes();
    return NextResponse.json(finishes);
  } catch (error) {
    console.error('Error fetching finishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finishes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.manufacturer) {
      return NextResponse.json(
        { error: 'Name and manufacturer are required' },
        { status: 400 }
      );
    }
    
    // Ensure sqftPrice is a number
    if (data.sqftPrice) {
      data.sqftPrice = parseFloat(data.sqftPrice);
    } else {
      data.sqftPrice = 0;
    }
    
    const finish = await createFinish(data);
    return NextResponse.json(finish);
  } catch (error) {
    console.error('Error creating finish:', error);
    return NextResponse.json(
      { error: 'Failed to create finish' },
      { status: 500 }
    );
  }
} 