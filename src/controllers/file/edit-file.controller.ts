import File from '@/models/file.model';
import { TFile, TFileModel } from '@/types/types';
import { validateString } from '@/utils/validators/string.validator';

function isErrorFile(data: null|TFileModel): data is null {
    return (data as null) === null;
}

export default async function UpdateFile(fileInput: {userId:string, projectId:string, id:string, alt:string}): Promise<{file: TFile|null, userErrors: any}> {
    try {
        const {userId, projectId, id, alt} = fileInput;

        if (!id) {
            throw new Error('id required');
        }

        if (!projectId || !userId) {
            throw new Error('projectId & userId required');
        }

        const {errors: errorsForm, data: validatedData} = await (async (data) => {
            try {
                const errors: any = [];
                const output: any = {};

                data = data ?? [];

                output.file = await (async function() {
                    const file: any = {};

                    const valueData = data['alt'];

                    const [errorsValue, valueValue] = validateString(valueData, {max: 350});
                    if (errorsValue.length > 0) {
                        errors.push({field: ['alt'], message: errorsValue[0]}); 
                    }
                    file['alt'] = valueValue;

                    return file;
                }());

                return {errors, data: output};
            } catch (e) {
                let message = 'Error';
                if (e instanceof Error) {
                    message = e.message;
                }

                return {errors: [{message}]};
            }
        })({alt});
        if (Object.keys(errorsForm).length > 0) {
            return {
                file: null,
                userErrors: errorsForm
            };
        }

        const {errors: errorsDB, data: savedData} = await (async (data) => {
            try {
                const errors: any = [];
                const output: any = {};

                const file: TFileModel|null = await File.findOneAndUpdate({userId, projectId, _id: id}, {...data.file});
                if (isErrorFile(file)) {
                    throw new Error('Failed to update file');
                }

                const {id: fileId} = file;
                output.fileId = fileId;

                if (errors.length > 0) {
                    return {errors};
                }

                return {errors, data: output};
            } catch (e) {
                let message;
                if (e instanceof Error) {
                    message = e.message;
                }
                return {errors: [{message}]};
            }
        })(validatedData);
        if (Object.keys(errorsDB).length > 0) {
            return {
                file: null,
                userErrors: errorsDB
            }
        }

        const {errors: errorsRes, data: obtainedData} = await (async (data): Promise<{errors: any, data: {file: TFile|null}}> => {
            try {
                const errors: any = [];
                let output: {file: TFile|null} = {file: null};

                const {fileId} = data;

                const file: TFileModel|null = await File.findOne({userId, projectId, _id: fileId});
                if (isErrorFile(file)) {
                    output.file = null;
                } else {
                    output.file = {
                        id: file.id,
                        filename: file.filename,
                        uuidName: file.uuidName,
                        width: file.width,
                        height: file.height,
                        size: file.size,
                        mimeType: file.mimeType,
                        contentType: file.contentType,
                        src: process.env.AWS_S3_URL_WEBSITE + '/' + file.awsS3Key,
                        alt: file.alt,
                    }
                }

                return {errors, data: output};
            } catch (e) {
                let message;
                if (e instanceof Error) {
                    message = e.message;
                }
                return {errors: [{message}], data: {file: null}};
            }
        })(savedData);
        if (Object.keys(errorsRes).length > 0) {
            return {
                file: null,
                userErrors: errorsRes
            }
        }

        return {
            file: obtainedData.file,
            userErrors: []
        };
    } catch (e) {
        let message;
        if (e instanceof Error) {
            message = e.message;
        }
        return {
            file: null,
            userErrors: [{message}]
        };
    }
}