import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const favorites = await db.favoriteTeam.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, teamName } = body;

    if (!teamId || !teamName) {
      return NextResponse.json({ error: 'teamId and teamName required' }, { status: 400 });
    }

    // Check if already favorited
    const existing = await db.favoriteTeam.findFirst({ where: { teamId } });
    if (existing) {
      await db.favoriteTeam.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    const favorite = await db.favoriteTeam.create({
      data: { teamId, teamName },
    });

    return NextResponse.json({ favorited: true, favorite }, { status: 201 });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}