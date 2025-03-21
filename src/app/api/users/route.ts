import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, username } = body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: name,
      username: username,
    },
  });

  const response = NextResponse.json({ user }, { status: 201 });

  response.cookies.set({
    name: "@igniteCall:userId",
    value: user.id,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response
}
