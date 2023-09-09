import express, { Request, Response, NextFunction } from 'express';

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import { TStagedTarget, TStagedUploadFile } from '@/types/types';

const client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
});

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        let { files }: {files: TStagedUploadFile[]} = req.body;

        const Bucket = process.env.AWS_S3_BUCKET as string;

        const stagedTargets: TStagedTarget[] = [];
        for (const file of files) {
            const getHashFilename = (filename: string) => crypto.createHash('md5').update(filename).digest('hex');
            const getFilename = (filename: string) => {
                filename = filename.replace(' ', '');
                if (new RegExp('^[a-z0-9-_\.]+$', 'i').test(filename) === false) {
                    const arFilename = filename.split('.');
                    return getHashFilename(filename) + '.' + arFilename[arFilename.length-1];
                } else {
                    return filename;
                }
            };

            const Key = `projects/${projectId}/files/${file.resource}/${uuidv4()}/${getFilename(file.filename)}`;

            const { url, fields } = await createPresignedPost(client, {
                Bucket,
                Key,
                Fields: {
                    acl: "public-read",
                },
                Conditions: [
                    ["starts-with", "$Content-Type", "image/"],
                    ["content-length-range", 0, 1000000],
                ],
                Expires: 30,
            });

            const parameters = Object.keys(fields).map(f => ({name: f, value: fields[f]}));
            parameters.push({name: 'Content-Type', value: file.mimeType});
            stagedTargets.push({parameters, url, resourceUrl: url+Key});
        }

        res.json({stagedTargets});
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

export default router;