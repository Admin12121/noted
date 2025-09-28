"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import ToolKit from "./toolkit";
import Header from "./header";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateDocumentMeta } from "@/lib/store/slice/documents";
import {
  useUpdateDocumentMutation,
} from "@/lib/store/api";
import { delay } from "@/lib/utils";
import { toast } from "sonner";
import CoverImageModal from "./modals/cover-image-modal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";

const Editor = dynamic(() => import("./editor"), { ssr: false });

const DocumentPage = ({ slug, data }: { slug: string; data: any }) => {
  const [updateDocument] = useUpdateDocumentMutation();
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const doc = useSelector((state: RootState) => {
    for (const group of Object.values(state.documents)) {
      const found = group.data.find((d) => d.id === slug);
      if (found) return found;
    }
    return null;
  });

  const [coverImage, setCoverImage] = useState<string | null>(
    data?.coverImage || null
  );
  const prevMetaRef = React.useRef<{ title?: string; icon?: string }>({});

  const meta = doc || data;

  const handleUpdateMeta = (val: { title?: string; icon?: string }) => {
    if (!doc) return;
    dispatch(updateDocumentMeta({ id: doc.id, ...val }));
  };

  const handleSaveMeta = async (val: {
    title?: string;
    icon?: string;
    coverImage?: string;
  }) => {
    if (!doc) return;
    try {
      await updateDocument({ id: doc.id, data: val }).unwrap();
      if (val.coverImage || val.coverImage === "") {
        setCoverImage(val.coverImage);
      }
    } catch (error) {
      toast.error(`Failed to save document metadata ${error}`);
      dispatch(updateDocumentMeta({ id: doc.id, ...prevMetaRef.current }));
    }
  };

  const handleContentChange = async (content: string) => {
    setIsSaving(true);
    if (!content) return;
    await delay(500);
    await updateDocument({ id: slug, data: { content } });
    await delay(500);
    setIsSaving(false);
  };

  return (
    <div className="pb-40 relative">
      {data && (
        <Header
          title={meta.title}
          icon={meta.icon}
          setValue={handleUpdateMeta}
          handleSaveMeta={handleSaveMeta}
          saving={isSaving}
        />
      )}
      {data.isArchived && (
        <div className="w-full text-center gap-5 bg-red-500/70 h-10 items-center justify-center flex">
          This document is archived.
          <span className="flex gap-2">
            <Button size={"sm"} variant={"outline"} className="cursor-pointer"><Undo2/> restore</Button>{" "}
            <Button size={"sm"} variant={"outline"} className="cursor-pointer"><Trash2/> delete</Button>
          </span>
        </div>
      )}
      <div className="h-[20vh] group">
        {coverImage && (
          <Image
            src={coverImage}
            alt="cover-image"
            className="w-full h-full object-cover"
            width={2000}
            height={200}
          />
        )}
        {coverImage && (
          <CoverImageModal
            handleSaveMeta={handleSaveMeta}
            className="absolute right-2 top-2  transition-all duration-200 ease-in-out"
          />
        )}
      </div>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto relative -top-[50px]">
        {data && (
          <ToolKit
            metaData={meta}
            data={data}
            setValue={handleUpdateMeta}
            handleSaveMeta={handleSaveMeta}
          />
        )}
        {data && (
          <Editor
            initialContent={data.content}
            slug={slug}
            onChange={handleContentChange}
            editable={data.isArchived ? false : true}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
