'use client';

import { SingleImageDropzone } from '@/components/upload/single-image';
import {
  UploaderProvider,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import * as React from 'react';

export function SingleImageDropzoneUsage() {
  const { edgestore } = useEdgeStore();

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
      });
      return res;
    },
    [edgestore],
  );

  return (
    <UploaderProvider uploadFn={uploadFn} autoUpload>
      <SingleImageDropzone
        height={30}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 5,
        }}
      />
      <p className="text-muted-foreground p-1 mt-1 text-center text-xs">Images wider than 1500px work best</p>
      <p className="text-muted-foreground p-1 mb-1 text-center text-xs">The maximum size per file is 5MB</p>
    </UploaderProvider>
  );
}