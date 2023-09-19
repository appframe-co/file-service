import mongoose from 'mongoose';
import File from '@/models/file.model';
import {TErrorResponse, TParameters} from '@/types/types';

const ObjectId = mongoose.Types.ObjectId;

type TFilesInput = {
    userId: string;
    projectId: string;
}

export default async function TotalFiles(fileInput: TFilesInput, parameters: TParameters = {}): Promise<TErrorResponse | {total: number}> {
    try {
        const {userId, projectId} = fileInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId query required');
        }

        const data: {_id: null, total: number}[] = await File.aggregate([
            { $match: { userId: new ObjectId(userId), projectId: new ObjectId(projectId) } },
            { $group: { _id: null, total: { $sum: "$size" } } }
        ]);

        return {total: data[0].total};
    } catch (error) {
        throw error;
    }
}