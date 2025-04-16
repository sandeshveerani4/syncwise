import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching user projects:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
