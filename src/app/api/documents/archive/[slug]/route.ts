import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest, context: { params: { slug: string } }) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized or session expired" },
        { status: 401 }
      );
    }

    const userIdStr = userId as string;

    const params = await context.params;
    const documentId = params.slug;
    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID (slug) is required" },
        { status: 400 }
      );
    }

    const document = await db.document.findFirst({
      where: { id: documentId, userId },
      include: { childDocuments: true, parentDocument: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }
    

    async function recoverTree(docId: string) {
      await db.document.update({
        where: { id: docId },
        data: { isArchived: false },
      });
      const children = await db.document.findMany({
        where: { parentDocumentId: docId, userId: userIdStr },
        select: { id: true },
      });
      for (const child of children) {
        await recoverTree(child.id);
      }
    }

    if (document.parentDocument && document.parentDocument.isArchived) {
      await db.document.update({
        where: { id: document.id },
        data: { parentDocumentId: undefined, isArchived: false },
      });
    } else {
      await db.document.update({
        where: { id: document.id },
        data: { isArchived: false },
      });
    }

    if (document.childDocuments.length > 0) {
      for (const child of document.childDocuments) {
        await recoverTree(child.id);
      }
    }

    return NextResponse.json(
      { message: "Document recovered successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
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