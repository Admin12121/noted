import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest, context: { params: { slug: string } }) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });

    const userIdStr = userId as string;

    const documentId = context.params.slug;
    if (!documentId) return NextResponse.json({ error: "Document ID is required" }, { status: 400 });

    const doc = await db.document.findUnique({
      where: { id: documentId },
      include: { parentDocument: true },
    });

    if (!doc || doc.userId !== userId) return NextResponse.json({ error: "Document not found" }, { status: 404 });

    async function recover(docId: string) {
      const currDoc = await db.document.findUnique({
        where: { id: docId },
        include: { parentDocument: true },
      });

      if (!currDoc) return;

      if (currDoc.parentDocumentId && currDoc.parentDocument?.isArchived) {
        await db.document.update({
          where: { id: currDoc.id },
          data: {
            parentDocumentId: null,
            isArchived: false,
          },
        });
      } else {
        await db.document.update({
          where: { id: currDoc.id },
          data: {
            isArchived: false,
          },
        });
      }

      const children = await db.document.findMany({
        where: { parentDocumentId: currDoc.id, userId: userIdStr },
        select: { id: true },
      });

      for (const child of children) {
        await recover(child.id);
      }
    }

    await recover(documentId);

    return NextResponse.json({ message: "Recovered" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}


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

    const document = await db.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found or not owned by user" }, { status: 404 });
    }

    await db.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: "Moved to Archived" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}