import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel} from '@/types/types';
import DeleteFileS3 from '@/controllers/aws-s3/delete-file.controller'

export default async function DeleteFileController({userId, projectId, id}: {userId: string, projectId: string, id: string}): 
    Promise<TErrorResponse | {file: TFile}>
    {
    try {
        const file: TFileModel|null = await File.findOneAndDelete({
            userId, 
            projectId, 
            _id: id
        });
        if (!file) {
            throw new Error('invalid file');
        }

        await DeleteFileS3(file.awsS3Key);

        let src = '';
        if (file.storage === 'aws') {
            src += process.env.URL_STORAGE_AWS + '/' + file.awsS3Key;
        }

        const output: TFile = {
            id: file.id,
            filename: file.filename,
            uuidName: file.uuidName,
            width: file.width,
            height: file.height,
            size: file.size,
            mimeType: file.mimeType,
            contentType: file.contentType,
            src,
            alt: file.alt
        }

        return {file: output};
    } catch (error) {
        throw error;
    }
}