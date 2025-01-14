import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel, TParameters} from '@/types/types';

export default async function Files({userId, projectId}: {userId: string, projectId: string}, parameters: TParameters = {}): Promise<TErrorResponse | {files: TFile[]}> {
    try {
        if (!projectId) {
            throw new Error('projectId query required');
        }

        const defaultLimit = 10;

        const filter: any = {projectId};
        if (userId) {
            filter['userId'] = userId;
        }

        let {limit=defaultLimit, page=1, filename} = parameters;

        if (limit > 250) {
            limit = defaultLimit;
        }
        const skip = (page - 1) * limit;

        if (filename) {
            filter['filename'] = filename;
        }

        const files: TFileModel[] = await File.find(filter).skip(skip).limit(limit);
        if (!files) {
            throw new Error('invalid files');
        }

        const output: TFile[] = files.map(f  => {
            return {
                id: f.id,
                filename: f.filename,
                uuidName: f.uuidName,
                width: f.width,
                height: f.height,
                size: f.size,
                mimeType: f.mimeType,
                contentType: f.contentType,
                src: process.env.URL_STORAGE + '/' + f.src,
                alt: f.alt,
                caption: f.caption,
                state: f.state,
                ext: f.ext,
                S3Key: f.S3Key
            };
        });

        return {files: output};
    } catch (error) {
        throw error;
    }
}