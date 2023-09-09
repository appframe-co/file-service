import express, { Request, Response, NextFunction } from 'express';

import UploadFileController from '@/controllers/aws-s3/upload-file.controller'

import File from '@/models/file.model'
import { TFile } from '@/types/types';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId, projectId, structureId, files } = req.body;

        const filesOutput: TFile[] = [];

        for (const file of files) {
            const fileUploaded = await UploadFileController(file.originalSource);

            const arUrl = file.originalSource.split('/');
            const srcFilename = arUrl[arUrl.length-1];
            const filename = srcFilename;

            const savedImage = await File.create({
                ...fileUploaded,
                projectId, structureId, 
                filename,
                contentType: file.contentType,
                createdBy: userId,
                updatedBy: userId
            });

            filesOutput.push({
                id: savedImage.id,
                filename: savedImage.filename,
                uuidName: savedImage.uuidName,
                width: savedImage.width,
                height: savedImage.height,
                size: savedImage.size,
                mimeType: savedImage.mimeType,
                contentType: savedImage.mediaContentType,
                src: process.env.AWS_S3_URL_WEBSITE + '/' + savedImage.awsS3Key
            });
        }

        res.json({files: filesOutput});
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

export default router;