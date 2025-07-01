import { NextRequest, NextResponse } from "next/server";
import { getValidSessionUserId } from "@/lib/auth-helper";
import { DocumentSchema } from "@/schema";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateDocumentSchema = DocumentSchema.pick({
  title: true,
  parentDocumentId: true,
  isArchived: true,
  isPublic: true,
}).extend({
  isArchived: z.boolean().optional().default(false),
  isPublic: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized or session expired" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = CreateDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { title, parentDocumentId, isArchived, isPublic } = parsed.data;
    const created = await db.document.create({
      data: {
        title,
        parentDocumentId: parentDocumentId || null,
        isArchived: isArchived || false,
        isPublic: isPublic || false,
        userId,
      },
      select: {
        id: true,
        title: true,
        icon: true,
        parentDocumentId: true,
      },
    });
    return NextResponse.json(
      { message: "Document created successfully", data: created },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
          parentDocumentId: parentId || null,
          isArchived: false,
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
          parentDocumentId: true,
          _count: {
            select: {
              childDocuments: {
                where: { isArchived: false },
              },
            },
          },
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
      icon: doc.icon,
      parentDocumentId: doc.parentDocumentId,
      child: doc._count.childDocuments > 0,
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

export async function DELETE(req: Request) {
  try {
    const userId = await getValidSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
    }
    const userIdStr = userId as string;

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
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

    return NextResponse.json({ message: "Moved to Arched" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}