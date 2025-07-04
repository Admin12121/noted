import React from "react";
import dynamic from "next/dynamic";

const ProductObject = dynamic(() => import("./_components"));

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return <ProductObject slug={slug}/>;
}