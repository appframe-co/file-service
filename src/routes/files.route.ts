import express, { Request, Response, NextFunction } from 'express';

import FilesController from '@/controllers/file/files.controller'
import CreateFileController from '@/controllers/file/create-file.controller'
import EditFileController from '@/controllers/file/edit-file.controller'
import DeleteFileController from '@/controllers/file/delete-file.controller'
import TotalFileController from '@/controllers/file/total-files.controller'
import CountFilesController from '@/controllers/file/count-files.controller'

import { TErrorResponse, TFile, TParameters } from '@/types/types';

const router = express.Router();

function isErrorCreatedFiles(data: TErrorResponse|{files: TFile[]}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}
function isErrorDeletedFile(data: TErrorResponse|{file: TFile}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

type TQueryGet = {
    userId: string;
    projectId: string;
    structureId: string;
    limit: string;
    page: string;
    sinceId: string;
    filename: string;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, limit, page, filename } = req.query as TQueryGet;

        const parameters: TParameters = {};
        if (limit) {
            parameters.limit = +limit;
        }
        if (page) {
            parameters.page = +page;
        }
        
        if (filename) {
            parameters.filename = filename;
        }

        const data = await FilesController({
            userId,
            projectId
        }, parameters);

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};

        const data = await CountFilesController({
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

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {userId, projectId, id, alt, caption, state, width, height}: 
        {userId:string, projectId:string, id:string, alt:string, caption:string, state:string, width:number, height:number} = req.body;

        if (req.params.id !== id) {
            throw new Error('id invalid');
        }

        const data = await EditFileController({
            userId, projectId,
            id,
            alt, caption, state, width, height
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