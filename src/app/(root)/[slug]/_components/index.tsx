'use client'

import React from 'react'
import ToolKit from './toolkit'
import Editor from './editor'
import Header from './header'
import Spinner from '@/components/ui/spinner'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { updateDocumentMeta } from '@/lib/store/slice/documents'
import { useGetDocumentdataQuery } from '@/lib/store/api'

const DocumentPage = ({ slug }: { slug: string }) => {


    // const [updateDocument] = useUpdateDocumentMutation();
    const { data, isLoading, error } = useGetDocumentdataQuery({ id: slug }, { skip: !slug })

    const docState = useSelector((state: RootState) => state.documents);
    console.log(docState)
    const dispatch = useDispatch();
    const doc = useSelector((state: RootState) => {
        for (const group of Object.values(state.documents)) {
            const found = group.data.find(d => d.id === slug);
            if (found) return found;
        }
        return null;
    });
    const meta = doc || data;

    // React.useEffect(() => {
    //     if (data) {
    //         setMetadata({
    //             title: data.title || "",
    //             icon: data.icon || "",
    //         });
    //     }
    // }, [data]);

    if (isLoading && !data) {
        return <div className='w-full h-full flex items-center justify-center'><Spinner size='sm' /></div>
    }

    const handleUpdateMeta = (val: { title?: string; icon?: string }) => {
        console.log('before document meta:', val);
        if (!doc) return;
        console.log('Updating document meta:', val);
        dispatch(updateDocumentMeta({ id: doc.id, ...val }));
    }

    return (
        <div className='pb-40 relative'>
            {data && <Header title={meta.title} icon={meta.icon} setValue={handleUpdateMeta} />}
            <div className='h-[20vh]' />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
                {data && <ToolKit metaData={meta} data={data} setValue={handleUpdateMeta} />}
                {data && <Editor initialContent={data.content} onChange={() => { }} />}
            </div>
        </div>
    )
}

export default DocumentPage