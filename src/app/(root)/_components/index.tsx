'use client'

import React, { useEffect, useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn, delay } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import UserModal from '@/components/global/header/user-modal';
import { useAuthUser } from '@/hooks/use-auth-user';
import { ChevronsLeft, CornerUpRight, Ellipsis, EllipsisVertical, File, FilePenLine, icons, Link2, MoveUpRight, Plus, SlashIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation";
import Link from 'next/link';
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
    AvatarFallback,
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



interface SidebarProps {
    navCollapsedSize?: number;
    className?: string;
    layout?: string;
    collapsed?: string;
}

type DocumentType = {
    id: string;
    title: string;
    parentDocumentId?: string;
    child?: boolean;
};

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

    const [docState, setDocState] = useState<{
        [parentId: string]: {
            page: number;
            limit: number;
            expanded: boolean;
            data: DocumentType[];
            hasNext: boolean;
        };
    }>({
        root: { page: 1, limit: 10, expanded: true, data: [], hasNext: true },
    });

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

    const path = usePathname();
    const pathSegments = path.split("/").filter((segment) => segment);

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
            if (response) {
                toast.success("Document created successfully!", {
                    id: "create-document",
                });
                const targetId = parentDocumentId || "root";
                setDocState((prev) => ({
                    ...prev,
                    [targetId]: {
                        ...(prev[targetId] || {
                            page: 1,
                            limit: 10,
                            expanded: true,
                            data: [],
                            hasNext: true,
                        }),
                        page: 1,
                    },
                }));
                await delay(500);
                fetchDocs(targetId);
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
        const { page, limit } = docState[parentId] || { page: 1, limit: 10 };

        try {
            const res = await triggerGetDocuments({
                params: {
                    parentId: parentId === "root" ? undefined : parentId,
                    page,
                    limit,
                },
            }).unwrap();

            setDocState((prev) => ({
                ...prev,
                [parentId]: {
                    ...prev[parentId],
                    data: page === 1 ? res.data : [...(prev[parentId]?.data || []), ...res.data],
                    hasNext: res.next ?? false,
                },
            }));
        } catch (err) {
            console.error("Error fetching documents:", err);
        }
    };

    const toggleExpand = (parentId: string) => {
        setDocState((prev) => ({
            ...prev,
            [parentId]: {
                ...prev[parentId],
                expanded: !prev[parentId]?.expanded,
            },
        }));

        if (!docState[parentId]?.data?.length) {
            fetchDocs(parentId);
        }
    };

    const loadMore = (parentId: string) => {
        setDocState((prev) => ({
            ...prev,
            [parentId]: {
                ...prev[parentId],
                page: prev[parentId].page + 1,
            },
        }));
        fetchDocs(parentId);
    };

    const handleDeleteDocument = async (id: string) => {
        try {
            toast.loading("Moving to Trash...", {
                id: "create-document",
            });
            await delay(500);
            const response = await deletePage({ id }).unwrap();
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
            setDocState((prev) => {
                const newState = { ...prev };
                Object.keys(newState).forEach((key) => {
                    newState[key].data = newState[key].data.filter((doc) => doc.id !== id);
                });
                return newState;
            });
        } catch (error) {
            console.error("Failed to delete document:", error);
            toast.error("Failed to delete document.");
        }
    };


    const renderDocuments = (parentId = "root") => {
        const docs = docState[parentId]?.data || [];
        console.log(docs)
        return (
            <>
                {docs.map((doc) => (
                    <div key={doc.id}>
                        <div
                            className={cn("group/item cursor-pointer bg-gray-200 dark:bg-[#FFFFFF0E] p-2 rounded-md justify-between flex", doc.parentDocumentId && "ml-5 mt-2")}
                        >
                            <span className="flex gap-2 items-center">
                                <Avatar className="rounded-md bg-[#191919] items-center justify-center" onClick={() => toggleExpand(doc.id)}>
                                    <AvatarImage src="/icons/arrow-left.svg" className={cn("invert opacity-0 transition duration-300 rotate-180 h-5 w-5 group-hover/item:opacity-100")} alt="Kelly King" />
                                    <File size={24} className={cn("absolute transition duration-300 group-hover/item:opacity-0")} />
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
                                            <DropdownMenuItem onClick={() => handleDeleteDocument(doc.id)}>
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
                                            Create a new page
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </span>
                        </div>
                        {docState[doc.id]?.expanded && renderDocuments(doc.id)}
                    </div>
                ))}
                {docState[parentId]?.hasNext && (
                    <button
                        onClick={() => loadMore(parentId)}
                        className="text-sm text-blue-500 hover:underline ml-4 mt-2"
                    >
                        Load More
                    </button>
                )}
            </>
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
                    "h-[100dvh] min-w-[260px] group bg-[#202020]",
                    isCollapsed &&
                    "hidden",
                )}
            >
                <div
                    className={cn(buttonVariants({ variant: "ghost" }), "gap-2 p-2 flex flex-row items-center justify-between h-11 m-1 px-2")}
                >
                    <UserModal detailed={true} user={user} signOut={signOut} className="hover:!bg-none !bg-transparent !px-0" variant={"default"} />
                    <span className='flex flex-row items-center gap-2'>
                        <Button variant={"ghost"} size={"icon"} className='hidden group-hover:flex' onClick={() => collapseHandle()}>
                            <ChevronsLeft className='!h-5 !w-5' />
                        </Button>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"} onClick={() => handleCreateDocument({})}>
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
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/documents">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            {pathSegments.map((segment, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbSeparator>
                                        <SlashIcon className="-rotate-[25deg] text-foreground/50" />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        {index === pathSegments.length - 1 ? (
                                            <BreadcrumbPage>{segment}</BreadcrumbPage>
                                        ) : (
                                            <Link
                                                href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                                            >
                                                {segment}
                                            </Link>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}


