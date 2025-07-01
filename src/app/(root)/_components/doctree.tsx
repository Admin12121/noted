import React from 'react'
import { Home, Plus, SearchIcon, Settings } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import TrashPopOver from './trash';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import CommandModal from './command';

const Doctree = ({ renderDocuments, handleCreateDocument }: { renderDocuments: any, handleCreateDocument: any }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className='flex flex-col gap-2 px-2'>
            <Button
                onClick={() => setOpen(true)}
                variant="secondary"
                className='bg-transparent dark:hover:bg-[#FFFFFF0E] h-10'
            >
                <span className="flex grow items-center text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300 cursor-pointer">
                    <SearchIcon
                        className="-ms-1 me-3"
                        size={16}
                        aria-hidden="true"
                    />
                    <span className="text-[1rem]">Search</span>
                </span>
            </Button>
            <CommandModal open={open} onOpenChange={setOpen} />
            <Button
                variant="secondary"
                className='bg-transparent dark:hover:bg-[#FFFFFF0E] h-10'
            >
                <span className="flex grow items-center text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300 cursor-pointer">
                    <Home
                        className="-ms-1 me-3"
                        size={16}
                        aria-hidden="true"
                    />
                    <span className="text-[1rem]">Home</span>
                </span>
            </Button>
            <span className='my-2 w-full' />
            <span
                className={cn(buttonVariants({ variant: "secondary" }), 'group/item bg-transparent dark:hover:bg-[#FFFFFF0E] h-10 pl-3 pr-2')}
            >
                <span className="flex grow items-center text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300 cursor-pointer">
                    <span className="text-[1rem]">Private</span>
                </span>
                <span>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant={"ghost"} className='size-7 cursor-pointer dark:hover:bg-neutral-900 opacity-0 group-hover/item:opacity-100 transition duration-300 ease-in-out' onClick={() => handleCreateDocument({})}><Plus /></Button>
                            </TooltipTrigger>
                            <TooltipContent className="px-2 py-1 text-xs">
                                Add a page
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
            </span>
            {renderDocuments()}
            <div
                onClick={() => handleCreateDocument({})}
                className={cn("group/item cursor-pointer bg-transparent hover:bg-gray-200 dark:hover:bg-[#FFFFFF0E] p-2 rounded-md gap-3 flex")}
            >
                <Plus />
                <p className="w-full h-full flex items-center">New Page</p>
            </div>
            <Button
                variant="secondary"
                className='bg-transparent dark:hover:bg-[#FFFFFF0E] h-10 mt-5'
            >
                <span className="flex grow items-center text-muted-foreground hover:text-foreground transition-colors ease-in-out duration-300 cursor-pointer">
                    <Settings
                        className="-ms-1 me-3"
                        size={16}
                        aria-hidden="true"
                    />
                    <span className="text-[1rem]">Settings</span>
                </span>
            </Button>
            <TrashPopOver />
        </div>
    )
}

export default Doctree