import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel} from '@/types/types';

export default async function FileController({projectId, fileIds}: {projectId: string, fileIds?: string[]}): 
    Promise<TErrorResponse | {files: TFile[]}>
    {
    try {
        const filter: {projectId: string, _id?: {$in: string[]}} = {projectId};

        if (fileIds) {
            filter['_id'] = {$in: fileIds};
        }

        const files: TFileModel[] = await File.find(filter);
        if (!files) {
            throw new Error('invalid files');
        }

        const output: TFile[] = files.map(f  => ({
            id: f.id,
            filename: f.filename,
            uuidName: f.uuidName,
            width: f.width,
            height: f.height,
            size: f.size,
            mimeType: f.mimeType,
            contentType: f.contentType,
            src: process.env.AWS_S3_URL_WEBSITE + '/' + f.awsS3Key
        }));

        return {files: output};
    } catch (error) {
        throw error;
    }
}