import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { searchParams } = new URL(req.url);
  const username = params.username;
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ message: "Date not provided" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 400 }
    );
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPastDate) {
    console.log("aqui ");
    return NextResponse.json({ availability: [] });
  }

  const userAvability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvability) {
    return NextResponse.json({ availability: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select:{
        date:true
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((times) => {
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === times
    );
  });

  return NextResponse.json({ possibleTimes,availableTimes });
}
