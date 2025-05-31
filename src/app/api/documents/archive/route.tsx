import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { db } from "@/lib/db";


export async function GET(req: Request) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const parentId = searchParams.get("parentId");

    const skip = (page - 1) * limit;

    const [documents, totalCount] = await Promise.all([
      db.document.findMany({
        where: {
          userId,
          isArchived: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          icon: true,
        },
      }),
      db.document.count({
        where: {
          userId,
          parentDocumentId: parentId || null,
          isArchived: false,
        },
      }),
    ]);

    const data = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      icon: doc.icon
    }));

    return NextResponse.json({
      next: skip + limit < totalCount,
      prev: page > 1,
      page,
      dataperrow: limit,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}