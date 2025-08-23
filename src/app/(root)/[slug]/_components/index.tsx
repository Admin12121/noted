'use client'

import React, { useState } from 'react'
import ToolKit from './toolkit'
import Editor from './editor'
import Header from './header'
import Spinner from '@/components/ui/spinner'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { updateDocumentMeta } from '@/lib/store/slice/documents'
import { useGetDocumentdataQuery, useUpdateDocumentMutation } from '@/lib/store/api'
import { delay } from '@/lib/utils'
import { toast } from 'sonner'

const DocumentPage = ({ slug }: { slug: string }) => {
    const { data, isLoading } = useGetDocumentdataQuery({ id: slug }, { skip: !slug })
    
    const [updateDocument] = useUpdateDocumentMutation();
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    const doc = useSelector((state: RootState) => {
        for (const group of Object.values(state.documents)) {
            const found = group.data.find(d => d.id === slug);
            if (found) return found;
        }
        return null;
    });

    const prevMetaRef = React.useRef<{ title?: string; icon?: string }>({});

    const meta = doc || data;

    if (isLoading && !data) {
        return <div className='w-full h-full flex items-center justify-center'><Spinner size='sm' /></div>
    }

    const handleUpdateMeta = (val: { title?: string; icon?: string }) => {
        if (!doc) return;
        dispatch(updateDocumentMeta({ id: doc.id, ...val }));
    }

    const handleSaveMeta = async (val: { title?: string; icon?: string }) => {
        if (!doc) return;
        try {
            await updateDocument({ id: doc.id, data: val }).unwrap();
        } catch (error) {
            toast.error(`Failed to save document metadata ${error}`);
            dispatch(updateDocumentMeta({ id: doc.id, ...prevMetaRef.current }));
        }
    };

    const handleContentChange = async (content: string) => {
        setIsSaving(true);
        if (!content) return;
        await delay(500)
        await updateDocument({ id: slug, data: { content } });
        await delay(500)
        setIsSaving(false);
    }

    return (
        <div className='pb-40 relative'>
            {data && <Header title={meta.title} icon={meta.icon} setValue={handleUpdateMeta} handleSaveMeta={handleSaveMeta} saving={isSaving}/>}
            <div className='h-[20vh]' />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
                {data && <ToolKit metaData={meta} data={data} setValue={handleUpdateMeta} handleSaveMeta={handleSaveMeta} />}
                {data && <Editor initialContent={data.content} slug={slug} onChange={handleContentChange} />}
            </div>
        </div>
    )
}

export default DocumentPage