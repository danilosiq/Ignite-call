import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { searchParams } = new URL(req.url);
  const username = await params.username;
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
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


  const avabilityTimes = await prisma.userTimeInterval.findMany({
    select:{
        week_day:true
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedTimes = [0,1,2,3,4,5,6].filter((times)=> (
    !avabilityTimes.some((availableWeekDay)=> availableWeekDay.week_day === times)
  ))


  return NextResponse.json(blockedTimes);
}
