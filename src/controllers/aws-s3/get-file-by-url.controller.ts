import { TDataFile } from "@/types/types";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {fromBuffer} from 'file-type';
import sizeOf from 'image-size';

const client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
});

export default async function getDataFileByUrl(url: string): Promise<TDataFile> {
    try {
        if (!url) {
            throw new Error('URL is empty');
        }

        const {AWS_S3_BUCKET: s3Bucket, AWS_S3_URL: s3Url} = process.env;

        const key = url.split(s3Url+'/')[1];
        const command = new GetObjectCommand({Bucket: s3Bucket, Key: key});
        const response = await client.send(command);

        const fileBuf = await response.Body?.transformToByteArray();
        const fileLength = response.ContentLength;

        if (!fileBuf || !fileLength) {
            throw new Error('Error S3 response');
        }

        const filesizeMB = fileLength / 1e+6;
        const sizeLimit = 5;

        if (filesizeMB > sizeLimit) {
            throw new Error(`File size max ${filesizeMB}MB`);
        }

        const mimeInfo = await fromBuffer(fileBuf);
        if (!mimeInfo) {
            throw new Error(`File format`);
        }

        const filetypes = /jpeg|jpg|png|gif/;
        const isMediaTypeImage = filetypes.test(mimeInfo.mime);
        if (!isMediaTypeImage) {
            throw new Error('Error media type image');
        }

        const {width=0, height=0} = sizeOf(fileBuf);

        const arUrl = url.split('/');
        const filename = arUrl[arUrl.length-1];
        const uuidName = arUrl[arUrl.length-2];

        return {
            filename,
            uuidName,
            ext: mimeInfo.ext,
            mimeType: mimeInfo.mime,
            width,
            height,
            size: fileLength
        };
    } catch (error) {
        throw error;
    }
}