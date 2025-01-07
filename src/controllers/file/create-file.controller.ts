import File from '@/models/file.model';
import {TErrorResponse, TFile, TFileModel, TInputFile} from '@/types/types';
import getDataFileByUrl from '@/controllers/aws-s3/get-file-by-url.controller';
import validateFilename from '@/helpers/filename.helper';

export default async function CreateFileController({userId, projectId, files}: {userId: string, projectId: string, files: TInputFile[]}): 
    Promise<TErrorResponse | {files: TFile[]}>
    {
    try {
        const output: TFile[] = [];

        const storage: string = 'timeweb-s3';

        const newFiles = [];
        for (const file of files) {
            const fileData = await getDataFileByUrl(file.originalSource);
            if (!fileData) continue;

            // validate filename and set unique it in project
            const filename = await validateFilename(fileData.filename, fileData.uuidName, {projectId});

            newFiles.push({
                ...fileData,
                filename,
                storage,
                state: 'fulfilled',
                contentType: file.contentType,
                userId, projectId,
                createdBy: userId,
                updatedBy: userId
            });
        }

        const savedFiles: TFileModel[] = await File.create(newFiles);
        for (const file of savedFiles) {
            output.push({
                id: file.id,
                filename: file.filename,
                uuidName: file.uuidName,
                width: file.width,
                height: file.height,
                size: file.size,
                mimeType: file.mimeType,
                contentType: file.contentType,
                src: process.env.URL_STORAGE + '/' + file.src,
                alt: file.alt,
                caption: file.caption,
                state: file.state,
                ext: file.ext
            });
        }

        return {files: output};
    } catch (error) {
        throw error;
    }
}