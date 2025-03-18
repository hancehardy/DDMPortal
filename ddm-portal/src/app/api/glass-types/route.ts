import { NextResponse } from 'next/server';
import { getAllGlassTypes, createGlassType } from '@/lib/db';

export async function GET() {
  try {
    const glassTypes = await getAllGlassTypes();
    return NextResponse.json(glassTypes);
  } catch (error) {
    console.error('Error fetching glass types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glass types' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Ensure numeric values are numbers
    if (data.sqftPrice) {
      data.sqftPrice = parseFloat(data.sqftPrice);
    } else {
      data.sqftPrice = 0;
    }
    
    if (data.sqftMinimum) {
      data.sqftMinimum = parseFloat(data.sqftMinimum);
    } else {
      data.sqftMinimum = 1;
    }
    
    const glassType = await createGlassType(data);
    return NextResponse.json(glassType);
  } catch (error) {
    console.error('Error creating glass type:', error);
    return NextResponse.json(
      { error: 'Failed to create glass type' },
      { status: 500 }
    );
  }
} 