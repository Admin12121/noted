'use client'

import React from 'react'
import { useGetDocumentdataQuery } from '@/lib/store/api'
import ToolKit from './toolkit'
import Editor from './editor'

const DocumentPage = ({ slug }: { slug: string }) => {

    const { data, isLoading, error } = useGetDocumentdataQuery({ id: slug }, { skip : !slug })

    return (
        <div className='pb-40'>
            <div className='h-[20vh]'/>
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
                {data && <ToolKit data={data}/>}
                {data && <Editor initialContent={data.content} onChange={()=>{}}/>}
            </div>
        </div>
    )
}

export default DocumentPage