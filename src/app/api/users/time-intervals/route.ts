import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildNextAuthOptions } from "../../auth/[...nextauth]/route";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
 const body = await req.json()
  const session = await getServerSession(buildNextAuthOptions());

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { intervals } = timeIntervalsBodySchema.parse(body);

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_end_in_minutes: interval.endTimeInMinutes,
          time_start_in_minutes: interval.startTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  return NextResponse.json({ status: 201 });
}
