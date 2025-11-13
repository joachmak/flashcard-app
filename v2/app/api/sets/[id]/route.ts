import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, sets, cards } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET /api/sets/[id] - Get a specific set with its cards
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const setId = parseInt(id);
    if (isNaN(setId)) {
      return NextResponse.json({ error: 'Invalid set ID' }, { status: 400 });
    }

    // Get the set
    const [set] = await db
      .select()
      .from(sets)
      .where(and(eq(sets.id, setId), eq(sets.userId, userId)));

    if (!set) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 });
    }

    // Get all cards for this set
    const setCards = await db
      .select()
      .from(cards)
      .where(eq(cards.setId, setId));

    return NextResponse.json({
      ...set,
      cards: setCards,
    });
  } catch (error) {
    console.error('Error fetching set:', error);
    return NextResponse.json({ error: 'Failed to fetch set' }, { status: 500 });
  }
}

// PUT /api/sets/[id] - Update a set
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const setId = parseInt(id);
    if (isNaN(setId)) {
      return NextResponse.json({ error: 'Invalid set ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, folderId } = body;

    // Verify ownership
    const [existingSet] = await db
      .select()
      .from(sets)
      .where(and(eq(sets.id, setId), eq(sets.userId, userId)));

    if (!existingSet) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 });
    }

    const updated = await db
      .update(sets)
      .set({
        title: title?.trim() || existingSet.title,
        description: description?.trim() ?? existingSet.description,
        folderId: folderId ?? existingSet.folderId,
      })
      .where(eq(sets.id, setId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating set:', error);
    return NextResponse.json({ error: 'Failed to update set' }, { status: 500 });
  }
}

// DELETE /api/sets/[id] - Delete a set
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const setId = parseInt(id);
    if (isNaN(setId)) {
      return NextResponse.json({ error: 'Invalid set ID' }, { status: 400 });
    }

    // Verify ownership before deleting
    const [existingSet] = await db
      .select()
      .from(sets)
      .where(and(eq(sets.id, setId), eq(sets.userId, userId)));

    if (!existingSet) {
      return NextResponse.json({ error: 'Set not found' }, { status: 404 });
    }

    await db.delete(sets).where(eq(sets.id, setId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting set:', error);
    return NextResponse.json({ error: 'Failed to delete set' }, { status: 500 });
  }
}
