import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildNextAuthOptions } from "../../auth/[...nextauth]/route";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(buildNextAuthOptions());

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio } = updateProfileBodySchema.parse(body);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bio: bio,
    },
  });

  return NextResponse.json({ status: 204 });
}
