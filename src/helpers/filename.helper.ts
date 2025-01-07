import File from '@/models/file.model';
import slugify from 'slugify';

export default async function validateFilename(filename:string, uuidName:string, payload: {projectId:string}): Promise<string> {
    try {
        const {projectId} = payload;

        if (!filename) {
            throw new Error('Filename empty');
        }

        filename = filename.trim();

        const arFilename = filename.split('.');
        arFilename.pop();
        filename = arFilename.join('.');

        filename = slugify(filename, {replacement: '_', remove: /[<>{}/\\|?`*+~()'"!:@,]/g});

        const regex = new RegExp('_([0-9]+)x([0-9]+)(\\..*)$');
        filename = filename.replace(regex, '_$1x$2_'+uuidName+'$3');

        if (filename.length > 255) {
            throw new Error('Filename error max length');
        }

        const fileWithSameFilename = await File.findOne({projectId, filename: new RegExp('^'+filename+'$', 'i')});
        if (fileWithSameFilename) {
            filename = filename + '_' + uuidName;
        }

        return filename;
    } catch (e) {
        return uuidName;
    }
}