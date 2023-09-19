import express, { Request, Response, NextFunction } from 'express';

import FilesController from '@/controllers/file/files.controller'
import CreateFileController from '@/controllers/file/create-file.controller'
import DeleteFileController from '@/controllers/file/delete-file.controller'
import TotalFileController from '@/controllers/file/total-files.controller'

import { TErrorResponse, TFile } from '@/types/types';

const router = express.Router();

function isErrorCreatedFiles(data: TErrorResponse|{files: TFile[]}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}
function isErrorDeletedFile(data: TErrorResponse|{file: TFile}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.query as {projectId: string};

        const data = await FilesController({
            projectId
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.get('/total', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};

        const data = await TotalFileController({
            userId,
            projectId
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { userId, projectId, files } = req.body;

        const data = await CreateFileController({
            userId,
            projectId,
            files
        });
        if (isErrorCreatedFiles(data)) {
            throw new Error('Error fetch files');
        }

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        const { id } = req.params;

        const data = await DeleteFileController({
            userId,
            projectId,
            id
        });
        if (isErrorDeletedFile(data)) {
            throw new Error('Error fetch file delete');
        }

        res.json({});
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

export default router;