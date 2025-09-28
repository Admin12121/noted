import React from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/db";
import { getValidSessionUserId } from "@/lib/auth-helper";

const ProductObject = dynamic(() => import("./_components"));

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const userId = await getValidSessionUserId();
  const doc = await db.document.findFirst({
    where: {
      id: slug,
      OR: [{ userId: userId ?? "" }, { isPublic: true, isArchived: false }],
    },
  });
  return <ProductObject slug={slug} data={doc ?? null} />;
}