
import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { db } from "@/lib/db";



export async function DELETE(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
    }
    const userIdStr = userId as string;

    const params = await context.params;
    const documentId = params.slug;
    if (!documentId) {
      return NextResponse.json({ error: "Document ID (slug) is required" }, { status: 400 });
    }

    async function archiveChildren(docId: string) {
      const children = await db.document.findMany({
        where: {
          userId: userIdStr,
          parentDocumentId: docId,
          isArchived: false,
        },
        select: { id: true },
      });

      for (const child of children) {
        await db.document.update({
          where: { id: child.id },
          data: { isArchived: true },
        });
        await archiveChildren(child.id);
      }
    }

    await db.document.updateMany({
      where: {
        id: documentId,
        userId,
        isArchived: false,
      },
      data: { isArchived: true },
    });

    await archiveChildren(documentId);

    return NextResponse.json({ message: "Moved to Archived" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}