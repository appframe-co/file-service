import { RoutesInput } from '@/types/types'
import stagedUploadsCreate from './staged-uploads-create.route'
import uploadFile from './upload-file.route'
import getFile from './get-file.route'
import getFiles from './get-files.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/staged_uploads_create', stagedUploadsCreate);
    app.use('/api/upload_file', uploadFile);
    app.use('/api/get_file', getFile);
    app.use('/api/files', getFiles);
};