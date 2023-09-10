import { RoutesInput } from '@/types/types'
import stagedUploadsCreate from './staged-uploads-create.route'
import getFilesByIds from './get-files-by-ids.route'
import files from './files.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/files', files);
    app.use('/api/staged_uploads_create', stagedUploadsCreate);
    app.use('/api/get_files_by_ids', getFilesByIds);
};