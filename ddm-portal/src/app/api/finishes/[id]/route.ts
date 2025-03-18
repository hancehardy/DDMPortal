import { NextResponse } from 'next/server';
import { updateFinish, deleteFinish } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
    }
    
    const finish = await updateFinish(id, data);
    return NextResponse.json(finish);
  } catch (error) {
    console.error('Error updating finish:', error);
    return NextResponse.json(
      { error: 'Failed to update finish' },
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
    await deleteFinish(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting finish:', error);
    return NextResponse.json(
      { error: 'Failed to delete finish' },
      { status: 500 }
    );
  }
} 