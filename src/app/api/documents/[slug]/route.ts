
import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { DocumentSchema } from "@/schema";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const params = await context.params;
    const documentId = params.slug;
    if (!documentId) {
      return NextResponse.json({ error: "Document ID (slug) is required" }, { status: 400 });
    }

    const document = await db.document.findFirst({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const userId = await getValidSessionUserId();

    if (userId && userId === document.userId) {
      return NextResponse.json(document, { status: 200 });
    }

    if (document.isPublic && !document.isArchived) {
      return NextResponse.json(document, { status: 200 });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { slug: string } }) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized or session expired" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const documentId = params.slug;
    if (!documentId) {
      return NextResponse.json({ error: "Document ID (slug) is required" }, { status: 400 });
    }

    const UpdateDocumentSchema = DocumentSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    }).partial();

    const body = await request.json();
    const parsed = UpdateDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const document = await db.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or not owned by user" },
        { status: 404 }
      );
    }


    const { title, parentDocumentId, isArchived, isPublic } = parsed.data;

    await db.document.update({
      where: { id: documentId },
      data: parsed.data,
    });

    return NextResponse.json(
      { message: "Document updated", },
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