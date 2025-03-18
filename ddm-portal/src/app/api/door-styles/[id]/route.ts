import { NextResponse } from 'next/server';
import { updateDoorStyle, deleteDoorStyle } from '@/lib/db';

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
    
    const doorStyle = await updateDoorStyle(id, data);
    return NextResponse.json(doorStyle);
  } catch (error) {
    console.error('Error updating door style:', error);
    return NextResponse.json(
      { error: 'Failed to update door style' },
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
    await deleteDoorStyle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting door style:', error);
    return NextResponse.json(
      { error: 'Failed to delete door style' },
      { status: 500 }
    );
  }
} 