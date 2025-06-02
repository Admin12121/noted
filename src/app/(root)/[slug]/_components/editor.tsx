'use client'
import React, { useEffect } from 'react'
import { PartialBlock, Block } from '@blocknote/core'
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useTheme } from 'next-themes';

interface EditorProps {
    onChange?: (content: string) => void;
    initialContent?: string;
    editable?: boolean;
}

async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: body,
    });
    return (await ret.json()).data.url.replace(
        "tmpfiles.org/",
        "tmpfiles.org/dl/",
    );
}

async function saveToStorage(jsonBlocks: Block[]) {
    //   localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {

    const { resolvedTheme } = useTheme();

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        // onEditorContentChange: (editorInstance: BlockNoteEditor) => {
        //     if (onChange) {
        //         onChange(JSON.stringify(editorInstance.topLevelBlocks, null, 2));
        //     }
        // },
        uploadFile,
    });

    return (
        <BlockNoteView
            editor={editor}
            theme={resolvedTheme == "dark" ? "dark" : "light"}
            className='!bg-transparent'
            onChange={() => {
                saveToStorage(editor.document);
            }}
        />
    );
}

export default Editor