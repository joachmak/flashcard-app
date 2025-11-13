import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, sets, cards } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET /api/sets - Get all sets for the authenticated user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userSets = await db
      .select()
      .from(sets)
      .where(eq(sets.userId, userId))
      .orderBy(desc(sets.lastUpdatedDate));

    return NextResponse.json(userSets);
  } catch (error) {
    console.error('Error fetching sets:', error);
    return NextResponse.json({ error: 'Failed to fetch sets' }, { status: 500 });
  }
}

// POST /api/sets - Create a new set
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description = '', folderId } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newSet = await db
      .insert(sets)
      .values({
        title: title.trim(),
        description: description?.trim() || '',
        userId,
        folderId: folderId || null,
      })
      .returning();

    return NextResponse.json(newSet[0], { status: 201 });
  } catch (error) {
    console.error('Error creating set:', error);
    return NextResponse.json({ error: 'Failed to create set' }, { status: 500 });
  }
}
