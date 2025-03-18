import { NextResponse } from 'next/server';
import { getAllManufacturers, createManufacturer } from '@/lib/db';

export async function GET() {
  try {
    const manufacturers = await getAllManufacturers();
    return NextResponse.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manufacturers' },
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
    
    const manufacturer = await createManufacturer(data);
    return NextResponse.json(manufacturer);
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    return NextResponse.json(
      { error: 'Failed to create manufacturer' },
      { status: 500 }
    );
  }
} 