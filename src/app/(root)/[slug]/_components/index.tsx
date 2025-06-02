'use client'

import React from 'react'
import { useGetDocumentdataQuery } from '@/lib/store/api'
import ToolKit from './toolkit'
import Editor from './editor'
import Header from './header'
import Spinner from '@/components/ui/spinner'

const DocumentPage = ({ slug }: { slug: string }) => {

    const { data, isLoading, error } = useGetDocumentdataQuery({ id: slug }, { skip: !slug })

    const [metadata, setMetadata] = React.useState({
        title: "",
        icon: "",
    });

    React.useEffect(() => {
        if (data) {
            setMetadata({
                title: data.title || "",
                icon: data.icon || "",
            });
        }
    }, [data]);

    if (isLoading && !data) {
        return <div className='w-full h-full flex items-center justify-center'><Spinner size='sm' /></div>
    }

    return (
        <div className='pb-40 relative'>
            {data && <Header title={metadata.title} icon={metadata.icon} setValue={val => setMetadata(prev => ({ ...prev, ...val }))} />}
            <div className='h-[20vh]' />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
                {data && <ToolKit metaData={metadata} data={data} setValue={val => setMetadata(prev => ({ ...prev, ...val }))} />}
                {data && <Editor initialContent={data.content} onChange={() => { }} />}
            </div>
        </div>
    )
}

export default DocumentPage