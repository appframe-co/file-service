import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel} from '@/types/types';

export default async function FileController({projectId, id}: {projectId: string, id: string}): 
    Promise<TErrorResponse | {file: TFile}>
    {
    try {
        const file: TFileModel|null = await File.findOne({_id: id, projectId});
        if (!file) {
            throw new Error('invalid file');
        }

        let src = `${process.env.URL_STORAGE}/upload/p/${projectId}/f/${file.filename}.${file.ext}`;

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
            alt: file.alt,
            caption: file.caption,
            state: file.state,
            ext: file.ext
        };

        return {file: output};
    } catch (error) {
        throw error;
    }
}