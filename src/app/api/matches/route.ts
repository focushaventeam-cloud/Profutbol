import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const matches = await db.match.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const match = await db.match.create({
      data: {
        homeTeamId: body.homeTeamId ?? '',
        awayTeamId: body.awayTeamId ?? '',
        homeTeamName: body.homeTeamName ?? '',
        awayTeamName: body.awayTeamName ?? '',
        homeTeamShort: body.homeTeamShort ?? '',
        awayTeamShort: body.awayTeamShort ?? '',
        homeLogo: body.homeLogo ?? '',
        awayLogo: body.awayLogo ?? '',
        homeColor: body.homeColor ?? '#000',
        awayColor: body.awayColor ?? '#000',
        homeScore: body.homeScore ?? 0,
        awayScore: body.awayScore ?? 0,
        status: body.status ?? 'scheduled',
        minute: body.minute ?? 0,
        period: body.period ?? 'first_half',
        addedTime: body.addedTime ?? 0,
        startTime: body.startTime ?? '',
        league: body.league ?? '',
        stadium: body.stadium ?? '',
        events: JSON.stringify(body.events ?? []),
        homeStats: JSON.stringify(body.homeStats ?? {}),
        awayStats: JSON.stringify(body.awayStats ?? {}),
        homeLineup: JSON.stringify(body.homeLineup ?? []),
        awayLineup: JSON.stringify(body.awayLineup ?? []),
        homeFormation: body.homeFormation ?? '4-3-3',
        awayFormation: body.awayFormation ?? '4-3-3',
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}