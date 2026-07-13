import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.userSettings.findFirst();
    if (!settings) {
      settings = await db.userSettings.create({
        data: { darkTheme: true, notifications: false, sounds: true, animations: true },
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    let settings = await db.userSettings.findFirst();
    if (!settings) {
      settings = await db.userSettings.create({ data: body });
    } else {
      settings = await db.userSettings.update({
        where: { id: settings.id },
        data: body,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}