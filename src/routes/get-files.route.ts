import express, { Request, Response, NextFunction } from 'express';

import FileController from '@/controllers/file/file.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.query as {projectId: string};

        const data = await FileController({
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

export default router;