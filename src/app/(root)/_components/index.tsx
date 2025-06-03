'use client'

import React, { useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn, delay } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import UserModal from '@/components/global/header/user-modal';
import { useAuthUser } from '@/hooks/use-auth-user';
import { ChevronsLeft, CornerUpRight, Ellipsis, File, FilePenLine, MoveUpRight, Plus, Trash } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { useCreateDocumentMutation, useLazyGetDocumentsQuery, useArchiveDocumentMutation } from '@/lib/store/api';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Doctree from './doctree';
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Link as Linkit,
} from "lucide-react"
import { RootState } from '@/lib/store';
import { useSelector, useDispatch } from 'react-redux';
import {
    setDocuments,
    setExpanded,
    addDocument,
    updateChildFlag,
    removeDocument,
    setPage,
    DocumentType,
} from '@/lib/store/slice/documents';
import { motion, AnimatePresence } from "framer-motion";
import { addToTrash } from '@/lib/store/slice/archive';
import Spinner from "@/components/ui/spinner";

interface SidebarProps {
    navCollapsedSize?: number;
    className?: string;
    layout?: string;
    collapsed?: string;
}

export default function ResizableLayout({
    layout,
    collapsed,
    navCollapsedSize = 4,
    children,
}: React.PropsWithChildren<SidebarProps>) {
    const defaultLayout = layout ? JSON.parse(layout) : [20, 80];
    const defaultCollapsed = collapsed ? JSON.parse(collapsed) : false;
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const route = useRouter();

    const dispatch = useDispatch();
    const docState = useSelector((state: RootState) => state.documents);

    const [loadingNodes, setLoadingNodes] = React.useState<{ [key: string]: boolean }>({});

    const [triggerGetDocuments] = useLazyGetDocumentsQuery();
    const [deletePage] = useArchiveDocumentMutation();
    const { user, signOut } = useAuthUser();

    const [createDocument] = useCreateDocumentMutation();

    const collapseHandle = () => {
        setIsCollapsed(!isCollapsed);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            !isCollapsed
        )}`;
    }

    const handleCreateDocument = async ({ parentDocumentId }: { parentDocumentId?: string }) => {
        try {
            toast.loading("Creating document...", {
                id: "create-document",
            });
            await delay(500);
            const data = parentDocumentId ? { title: "Untitled", parentDocumentId } : {
                title: "Untitled"
            }
            const response = await createDocument({ data }).unwrap();
            await delay(500);
            if (response && response.data) {
                toast.success("Document created successfully!", {
                    id: "create-document",
                });
                route.push(`/${response.data.id}`);
                const targetId = parentDocumentId || "root";
                dispatch(addDocument({
                    parentId: targetId,
                    doc: response.data,
                }));
                if (parentDocumentId) {
                    dispatch(updateChildFlag({
                        parentId: parentDocumentId,
                        child: true,
                    }));
                }
            } else {
                toast.error("Failed to create document.", {
                    id: "create-document",
                });
            }
        } catch (error) {
            console.error("Failed to create document:", error);
        }
    };

    const fetchDocs = async (parentId = "root") => {
        setLoadingNodes((prev) => ({ ...prev, [parentId]: true }));
        const { page, limit } = docState[parentId] || { page: 1, limit: 10 };
        try {
            const res = await triggerGetDocuments({
                params: {
                    parentId: parentId === "root" ? undefined : parentId,
                    page,
                    limit,
                },
            }).unwrap();
            await delay(500);
            dispatch(setDocuments({
                parentId,
                data: res.data,
                hasNext: res.next ?? false,
                page,
                limit,
            }));
        } catch (err) {
            console.error("Error fetching documents:", err);
        } finally {
            setLoadingNodes((prev) => ({ ...prev, [parentId]: false }));
        }
    };

    const toggleExpand = (parentId: string) => {
        dispatch(
            setExpanded({ parentId, expanded: !docState[parentId]?.expanded })
        )

        if (!docState[parentId]?.data?.length) {
            fetchDocs(parentId);
        }
    };

    const loadMore = (parentId: string) => {
        dispatch(setPage({ parentId, page: docState[parentId].page + 1 }));
        fetchDocs(parentId);
    };

    const handleMovetoTrash = async (doc: DocumentType) => {
        try {
            toast.loading("Moving to Trash...", {
                id: "create-document",
            });
            await delay(500);
            const response = await deletePage({ id: doc.id }).unwrap();
            if (!response) {
                toast.error("Failed to move document to Trash.", {
                    id: "create-document",
                });
                return;
            }
            toast.success("Moved to Trash successfully!", {
                id: "create-document",
            });
            await delay(500);
            dispatch(removeDocument({ id: doc.id, parentId: doc.parentDocumentId }));
            if (doc.child) {
                Object.values(docState).forEach(group => {
                    group.data.forEach(childDoc => {
                        if (childDoc.parentDocumentId === doc.id) {
                            handleMovetoTrash(childDoc);
                        }
                    });
                });
            }
            dispatch(addToTrash(doc));
            if (doc.parentDocumentId) {
                const parentGroup = docState[doc.parentDocumentId];
                if (parentGroup && parentGroup.data.filter(d => d.parentDocumentId === doc.parentDocumentId).length === 0) {
                    dispatch(updateChildFlag({ parentId: doc.parentDocumentId, child: false }));
                }
            }
            if (doc.parentDocumentId) {
                dispatch(updateChildFlag({
                    parentId: doc.parentDocumentId,
                    child: false,
                }));
            }

        } catch (error) {
            console.error("Failed to delete document:", error);
            toast.error("Failed to delete document.");
        }
    };

    const renderDocuments = (parentId = "root", level = 0) => {
        const docs = docState[parentId]?.data || [];
        const isLoading = loadingNodes[parentId];

        if (docs.length === 0 && parentId !== "root") {
            return (
                <div className="w-full flex items-center justify-center pt-3  px-4">
                    <p className="text-muted-foreground">No document found.</p>
                </div>
            )
        }
        return (
            <AnimatePresence initial={false}>
                {
                    isLoading ?
                        <div className="w-full flex items-center justify-center p-4">
                            <Spinner size="sm" className="invert" />
                        </div>
                        :
                        docs.map((doc, idx) => {
                            const isExpanded = !!docState[doc.id]?.expanded;
                            return (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                                    layout="position" >
                                    <div
                                        className={cn("group/item cursor-pointer bg-gray-200 dark:bg-[#FFFFFF0E] p-2 rounded-md justify-between flex", level > 0 && `mt-2`)}
                                        style={{ marginLeft: `${level * 16}px` }}
                                    >
                                        <span className="flex gap-2 items-center">
                                            <Avatar className="rounded-md bg-[#191919] items-center justify-center" onClick={() => toggleExpand(doc.id)}>
                                                <AvatarImage src="/icons/arrow-left.svg" className={cn("invert opacity-0 transition duration-300 rotate-180 h-5 w-5 group-hover/item:opacity-100", isExpanded && "rotate-[275deg]")} alt="Kelly King" />
                                                {doc.icon ? <p className={cn("absolute transition duration-300 group-hover/item:opacity-0")}>{doc.icon}</p> : <File size={24} className={cn("absolute transition duration-300 group-hover/item:opacity-0")} />}
                                            </Avatar>
                                            <p className="w-full h-full flex items-center" onClick={() => route.push(`/${doc.id}`)}>{doc.title}</p>
                                        </span>
                                        <span className="gap-2 flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" className="size-6" variant="ghost" aria-label="Open account menu">
                                                        <Ellipsis size={16} aria-hidden="true" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="max-w-96  w-[250px]">
                                                    <DropdownMenuLabel className="flex items-start gap-3">
                                                        <div className="flex min-w-0 flex-col">
                                                            <span className="text-muted-foreground truncate text-xs font-normal my-1">
                                                                page
                                                            </span>
                                                        </div>
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <Linkit size={16} className="opacity-60" aria-hidden="true" />
                                                            <span>Copy Link</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FilePenLine size={16} className="opacity-60" aria-hidden="true" />
                                                            <span>Rename</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MoveUpRight size={16} className="opacity-60" aria-hidden="true" />
                                                            <span>Move to </span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleMovetoTrash(doc)}>
                                                            <Trash size={16} className="opacity-60" aria-hidden="true" />
                                                            <span>Move to Trash</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem>
                                                            <CornerUpRight size={16} className="opacity-60" aria-hidden="true" />
                                                            <span>Open in new tab</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={"ghost"} size={"icon"} className="size-6 cursor-pointer dark:hover:bg-neutral-900" onClick={() => handleCreateDocument({ parentDocumentId: doc.id })}><Plus /></Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="px-2 py-1 text-xs">
                                                        Add a page inside
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </span>
                                    </div>
                                    <AnimatePresence>
                                        {docState[doc.id]?.expanded &&
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                style={{ overflow: "hidden" }}
                                            >

                                                {renderDocuments(doc.id, level + 1)}
                                            </motion.div>}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })
                }

                {/* {docState[parentId]?.hasNext && (
                    <button
                        onClick={() => loadMore(parentId)}
                        className="text-sm text-blue-500 hover:underline ml-4 mt-2"
                    >
                        Load More
                    </button>
                )} */}
            </AnimatePresence>
        );
    };

    useEffect(() => {
        fetchDocs("root");
    }, []);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                    sizes
                )}`;
            }}>
            <ResizablePanel
                defaultSize={defaultLayout[0] || 20}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={10}
                maxSize={20}
                onResize={() => {
                    setIsCollapsed(false);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                        false
                    )}`;
                }}
                className={cn(
                    "h-[100dvh] min-w-[260px] group bg-[#f8f8f7] dark:bg-[#202020]",
                    isCollapsed &&
                    "hidden",
                )}
            >
                <div
                    className={cn(buttonVariants({ variant: "ghost" }), "gap-2 p-2 flex flex-row items-center justify-between h-11 m-1 px-2")}
                >
                    <UserModal detailed={true} user={user} signOut={signOut} className="hover:!bg-none !bg-transparent !px-0" variant={"default"} />
                    <span className='flex flex-row items-center gap-2'>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"} className='hidden group-hover:flex hover:dark:!bg-neutral-900' onClick={() => collapseHandle()}>
                                        <ChevronsLeft className='!h-5 !w-5' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="px-2 py-1 text-xs">
                                    Close sidebar
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"} onClick={() => handleCreateDocument({})} className="hover:dark:!bg-neutral-900">
                                        <FilePenLine className='!h-5 !w-5' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="px-2 py-1 text-xs">
                                    Create a new page
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </span>
                </div>
                <Doctree renderDocuments={renderDocuments} handleCreateDocument={handleCreateDocument} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1] || 80} className='flex flex-col h-[100dvh] overflow-hidden'>
                <header className="flex h-12 shrink-0 items-center gap-2 px-2">
                    <Button variant={"ghost"} size={"icon"} className={cn("hidden", isCollapsed && 'flex')} onClick={() => collapseHandle()}>
                        <ChevronsLeft className='!h-5 !w-5 rotate-180' />
                    </Button>
                    <Separator
                        orientation="vertical"
                        className={cn("mr-2 data-[orientation=vertical]:h-4 hidden", isCollapsed && "flex")}
                    />
                </header>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}


