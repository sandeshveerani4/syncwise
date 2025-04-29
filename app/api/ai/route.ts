import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chatToken = await prisma.chatToken.create({
      data: { user: { connect: { id: session.user.id } } },
    });

    return NextResponse.json({ chatToken });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
