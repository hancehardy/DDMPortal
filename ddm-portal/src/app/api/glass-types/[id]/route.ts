import { NextResponse } from 'next/server';
import { updateGlassType, deleteGlassType } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
    }
    
    if (data.sqftMinimum) {
      data.sqftMinimum = parseFloat(data.sqftMinimum);
    }
    
    const glassType = await updateGlassType(id, data);
    return NextResponse.json(glassType);
  } catch (error) {
    console.error('Error updating glass type:', error);
    return NextResponse.json(
      { error: 'Failed to update glass type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteGlassType(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting glass type:', error);
    return NextResponse.json(
      { error: 'Failed to delete glass type' },
      { status: 500 }
    );
  }
} 