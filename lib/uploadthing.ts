import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

import { ourFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton<ourFileRouter>();
export const UploadDropzone = generateUploadDropzone<ourFileRouter>();


