import { NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { db } from "@/lib/db";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const docId = searchParams.get("docId");

    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId } });
      const sessionUserId = await getValidSessionUserId();
      const isAuthenticated = !!sessionUserId && sessionUserId === userId;
      if (!user) {
        return NextResponse.json({ ok: false, userExists: false, isAuthenticated: false });
      }
      return NextResponse.json({ ok: isAuthenticated, userExists: true, isAuthenticated });
    }

    if (docId) {
      const document = await db.document.findUnique({
        where: { id: docId },
        select: {
          id: true,
          content: true,
        },
      });
      if (!document) {
        return NextResponse.json({ ok: false, docExists: false });
      }
      return NextResponse.json({
        ok: true,
        docExists: true,
        document,
      });
    }
    
    return NextResponse.json({ ok: false, error: "No userId or docId provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}