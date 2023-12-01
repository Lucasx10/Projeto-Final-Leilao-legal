import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const user = await prisma.user.findUnique({
    where: {
        id: String(id),
    },
  });
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const json = await req.json();

  const updated = await prisma.user.update({
    where: {
      id: String(id),
    },
    data: {
      lances: json.lances
    },
  });

  return NextResponse.json(updated);
}