import File from '@/models/file.model';
import {TErrorResponse, TParameters} from '@/types/types';

type TFileInput = {
    userId: string;
    projectId: string;
}

type TFileFilter = {
    userId: string;
    projectId: string;
}

export default async function CountFiles(fileInput: TFileInput, parameters: TParameters = {}): Promise<TErrorResponse | {count: number}> {
    try {
        const {userId, projectId} = fileInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId query required');
        }

        const filter: TFileFilter = {userId, projectId};
        const count: number = await File.countDocuments(filter);

        return {count};
    } catch (error) {
        throw error;
    }
}