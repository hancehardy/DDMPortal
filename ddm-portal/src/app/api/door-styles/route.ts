import { NextResponse } from 'next/server';
import { getAllDoorStyles, createDoorStyle } from '@/lib/db';

export async function GET() {
  try {
    const doorStyles = await getAllDoorStyles();
    return NextResponse.json(doorStyles);
  } catch (error) {
    console.error('Error fetching door styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch door styles' },
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
    
    const doorStyle = await createDoorStyle(data);
    return NextResponse.json(doorStyle);
  } catch (error) {
    console.error('Error creating door style:', error);
    return NextResponse.json(
      { error: 'Failed to create door style' },
      { status: 500 }
    );
  }
} 