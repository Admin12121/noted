'use client'
import React, { useEffect, useRef } from 'react'
import { PartialBlock } from '@blocknote/core'
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useTheme } from 'next-themes';

// import * as Y from "yjs";
// import { SocketIOProvider } from "y-socket.io";
// import { useAuthUser } from '@/hooks/use-auth-user'
// const WS_SERVER = "http://localhost:3001"

interface EditorProps {
    onChange?: (content: string) => void;
    initialContent?: string;
    slug: string;
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

const Editor = ({ onChange, initialContent }: EditorProps) => {
    // const { user } = useAuthUser();
    // const [connected, setConnected] = useState(false);
    // const [text, setText] = useState("");
    // const ydocRef = useRef<Y.Doc | null>(null);
    // const ytextRef = useRef<Y.Text | null>(null);
    // const providerRef = useRef<SocketIOProvider | null>(null);

    const { resolvedTheme } = useTheme();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile,
    });

    const handleEditorChange = () => {
        const content = JSON.stringify(editor.document);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onChange?.(content);
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    // useEffect(() => {
    //     if (!user) return;

    //     const ydoc = new Y.Doc();
    //     ydocRef.current = ydoc;
    //     const userid = user.id || "anonymous";
    //     const provider = new SocketIOProvider(WS_SERVER, slug, ydoc, {
    //         params: { userid }
    //     } as any);
    //     providerRef.current = provider;

    //     provider.socket.on("connect", () => {
    //         provider.socket.emit("auth-join", { userId: userid, docId: slug });
    //         console.log("[Yjs] Emitted auth-join");
    //     });

    //     provider.on("status", (event: { status: string }) => {
    //         setConnected(event.status === "connected");
    //         console.log(`[Yjs] Connection status: ${event.status}`);
    //     });

    //     // Log when a sync event occurs
    //     provider.on("sync", (isSynced: boolean) => {
    //         console.log(`[Yjs] Sync event: isSynced = ${isSynced}`);
    //     });

    //     // Log all messages sent/received (if supported by your provider)
    //     provider.on("message", (message: any) => {
    //         console.log("[Yjs] Message event:", message);
    //     });

    //     // Log awareness updates (e.g., user cursors)
    //     provider.awareness.on("update", () => {
    //         const states = Array.from(provider.awareness.getStates().values());
    //         console.log("[Yjs] Awareness update:", states);
    //     });
    //     return () => {
    //         provider.destroy();
    //         ydoc.destroy();
    //     };
    // }, [user, slug, editor]);

    // const handleEditorChange = () => {
    //     const content = JSON.stringify(editor.document);
    //     if (providerRef.current?.socket?.connected) {
    //         providerRef.current.socket.emit("content-update", content);
    //         console.log("[Yjs] Emitted content-update to socket");
    //     }
    //     if (onChange) onChange(content);
    // };

    return (
        <BlockNoteView
            editor={editor}
            theme={resolvedTheme == "dark" ? "dark" : "light"}
            className='!bg-transparent'
            onChange={handleEditorChange}
        />
    );
}

export default Editor