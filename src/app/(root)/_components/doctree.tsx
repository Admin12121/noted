import React from 'react'
import { useCreateDocumentMutation, useGetDocumentsQuery } from '@/lib/store/api';
import Spinner from '@/components/ui/spinner';
import type { DocumentType } from '@/schema';
import { Home, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Doctree = ({renderDocuments}:{renderDocuments:any}) => {

    return (
        <div className='flex flex-col gap-2 px-2'>
            <Button
                variant="secondary"
                className='dark:bg-[#FFFFFF0E] h-10'
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
            <Button
                variant="secondary"
                className='dark:bg-[#FFFFFF0E] h-10'
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
            <span className='my-3 w-full' />
            {/* {documents && documents?.map((doc: Pick<DocumentType, "id" | "title" | "icon" | "parentDocumentId">) => (
                <div key={doc.id} className='p-2 px-3 bg-gray-100 dark:bg-[#FFFFFF0E] rounded-md shadow-sm'>
                    <h3 className='text-lg font-semibold'>{doc.title}</h3>
                </div>
            ))}
            {loading && <Spinner />} */}
            {renderDocuments()}
        </div>
    )
}

export default Doctree