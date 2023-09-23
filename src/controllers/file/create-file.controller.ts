import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel} from '@/types/types';
import UploadFileS3 from '@/controllers/aws-s3/upload-file.controller'

export default async function DeleteFileController({userId, projectId, files}: {userId: string, projectId: string, files: any}): 
    Promise<TErrorResponse | {files: TFile[]}>
    {
    try {
        const output: TFile[] = [];

        for (const file of files) {
            const fileUploaded = await UploadFileS3(file.originalSource);

            const arUrl = file.originalSource.split('/');
            const srcFilename = arUrl[arUrl.length-1];
            const filename = srcFilename;

            const savedImage: TFileModel = await File.create({
                ...fileUploaded,
                userId, projectId,
                filename,
                contentType: file.contentType,
                createdBy: userId,
                updatedBy: userId
            });

            output.push({
                id: savedImage.id,
                filename: savedImage.filename,
                uuidName: savedImage.uuidName,
                width: savedImage.width,
                height: savedImage.height,
                size: savedImage.size,
                mimeType: savedImage.mimeType,
                contentType: savedImage.contentType,
                src: process.env.AWS_S3_URL_WEBSITE + '/' + savedImage.awsS3Key,
                alt: savedImage.alt
            });
        }

        return {files: output};
    } catch (error) {
        throw error;
    }
}