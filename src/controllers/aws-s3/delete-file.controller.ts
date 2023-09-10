import { S3Client, DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
});

export default async function DeleteFileS3(key: string): Promise<boolean> {
    try {
        if (!key) {
            throw new Error('key is empty');
        }

        const {AWS_S3_BUCKET: s3Bucket} = process.env;

        const arKey = key.split('/');
        arKey.splice(arKey.length-1, 1);
        const folder = arKey.join('/') + '/';

        const listObjects = await client.send(new ListObjectsCommand({Bucket: s3Bucket, Prefix: folder}));
        if (!listObjects.Contents) {
            return false;
        }

        for (const obj of listObjects.Contents) {
            await client.send(new DeleteObjectCommand({Bucket: s3Bucket, Key: obj.Key}));
        }

        await client.send(new DeleteObjectCommand({Bucket: s3Bucket, Key: folder}));

        return true;
    } catch (error) {
        return false;
    }
}