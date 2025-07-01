import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { DocumentSchema } from "@/schema";
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

    const params = await context.params;
    const documentId = params.slug;
    if (!documentId) {
      return NextResponse.json({ error: "Document ID (slug) is required" }, { status: 400 });
    }

    const UpdateDocumentSchema = DocumentSchema.pick({
      content: true,
      coverImage: true,
      icon: true,
      title: true,
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