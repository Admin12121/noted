"use client"

import { useEffect, useState } from "react"
import { useGetArchiveDocumentsQuery, useRecoverArchivedDocumentMutation, useDeleteDocumentMutation } from "@/lib/store/api"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CircleHelp, File, LoaderCircleIcon, SearchIcon, Trash, Undo2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/ui/spinner"
import { toast } from "sonner"
import { delay } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setTrash, removeFromTrash } from '@/lib/store/slice/archive';
import { addDocument } from '@/lib/store/slice/documents';
import { DocumentType } from '@/lib/store/slice/archive';

export default function TrashPopOver() {
    const [inputValue, setInputValue] = useState("")
    const [recover] = useRecoverArchivedDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const dispatch = useDispatch();
    const trashdata = useSelector((state: RootState) => state.archive.data);

    useEffect(() => {
        if (inputValue) {
            setIsLoading(true)
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 500)
            return () => clearTimeout(timer)
        }
        setIsLoading(false)
    }, [inputValue])


    const { data, isLoading: isDataLoading, refetch } = useGetArchiveDocumentsQuery({
        params: {
            page: 1,
            limit: 10,
        },
    })

    useEffect(() => {
        if (data) {
            dispatch(setTrash(data.data));
        }
    }, [data])

    const HandleRecover = async (doc: DocumentType) => {
        try {
            toast.loading("Recovering document...", {
                id: "recover-toast",
            });
            await delay(500)
            const response = await recover({ id: doc.id }).unwrap();
            await delay(500)
            if (response) {
                toast.success("Document recovered successfully!", {
                    id: "recover-toast",
                });
                const parentId = doc.parentDocumentId;
                const docState = (window as any).store?.getState().documents || {};
                if (parentId && docState[parentId]) {
                    dispatch(addDocument({ parentId: doc.parentDocumentId || 'root', doc }));
                }
                refetch();
            }
        } catch (error) {
            console.error("Failed to recover document:", error);
        }
    }

    const HandleDelete = async (id: string) => {
        try {
            toast.loading("Deleting document...", {
                id: "delete-toast",
            });
            await delay(500)
            const response = await deleteDocument({ id }).unwrap();
            await delay(500)
            if (response) {
                toast.success("Document deleted successfully!", {
                    id: "delete-toast",
                });
                dispatch(removeFromTrash(id));
                refetch();
            }
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className='bg-transparent dark:hover:bg-[#FFFFFF0E] h-10'
                >
                    <span className="flex grow items-center text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300 cursor-pointer">
                        <Trash
                            className="-ms-1 me-3"
                            size={16}
                            aria-hidden="true"
                        />
                        <span className="text-[1rem]">Trash</span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-[450px] p-1">
                <div className="flex items-baseline justify-between gap-4 p-1 mb-5">
                    <div className="*:not-first:mt-2 w-full">
                        <div className="relative w-full">
                            <Input
                                className="peer ps-9 pe-9 w-full"
                                placeholder="Search..."
                                type="search"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                {isLoading ? (
                                    <LoaderCircleIcon
                                        className="animate-spin"
                                        size={16}
                                        role="status"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <SearchIcon size={16} aria-hidden="true" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex items-center h-[450px] flex-col gap-2 overflow-hidden overflow-y-auto pb-8">
                    {isDataLoading && (
                        <div className="flex items-center justify-center w-full h-full">
                            <Spinner className="size-8" />
                        </div>
                    )}
                    {Array.isArray(trashdata) && trashdata.length > 0 ? trashdata.map((data: DocumentType) => (
                        <div
                            key={data.id}
                            className="hover:bg-accent rounded-md p-1 cursor-pointer text-sm transition-colors flex items-center justify-between w-full"
                        >
                            <div className="relative flex items-center gap-2">
                                <File />
                                {data.title}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant={"ghost"} className="size-7 hover:!bg-neutral-900" onClick={() => HandleRecover(data)}><Undo2 /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant={"ghost"} className="size-7 hover:!bg-neutral-900"><Trash /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this page from Trash?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => HandleDelete(data.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )) :
                        <span className="w-full h-full flex items-center justify-center">
                            <p>No data available</p>
                        </span>
                    }
                    <span className="fixed bottom-0 px-1 w-full pb-1">
                        <span className="bg-neutral-800 h-7 flex w-full rounded-sm items-center justify-between text-xs px-2">
                            Pages in Trash for over 30days will be permanently deleted. <CircleHelp size={15} />
                        </span>
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    )
}
