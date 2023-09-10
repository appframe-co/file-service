import express, { Request, Response, NextFunction } from 'express';

import FilesByIdsController from '@/controllers/file/files-by-ids.controller'

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.query as {projectId: string};
        const { fileIds } = req.body as {fileIds: string[]};

        const data = await FilesByIdsController({
            projectId,
            fileIds
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

export default router;