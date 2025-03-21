import { getGoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import { addHours } from "date-fns";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { schedule } = body;

  const user = await prisma.user.findUnique({
    where: {
      id: schedule.user_id,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "user not found" }, { status: 400 });
  }

  await prisma.scheduling.create({
    data: {
      date: schedule.date,
      email: schedule.email,
      name: schedule.name,
      user_id: schedule.user_id,
      observations: schedule.observations,
    },
  });

  const calendar = google.calendar({
    version: "v3",
    auth: await getGoogleOAuthToken(user.id),
  });

  const endTimeCalendarEvent = addHours(new Date(schedule.date), 1).toISOString();

  await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${schedule.name}`,
      description: schedule.description,
      start: {
        dateTime: new Date(schedule.date).toISOString(),
      },
      end: {
        dateTime: endTimeCalendarEvent, 
      },
      attendees: [{ email: schedule.email }],
      conferenceData: {
        createRequest: {
          requestId: schedule.id,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return NextResponse.json({ schedule });
}
