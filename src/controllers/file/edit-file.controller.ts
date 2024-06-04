import File from '@/models/file.model';
import { TFile, TFileModel } from '@/types/types';
import { validateString } from '@/utils/validators/string.validator';
import { validateNumber } from '@/utils/validators/number.validator';

function isErrorFile(data: null|TFileModel): data is null {
    return (data as null) === null;
}

export default async function EditFileController(
    fileInput: {userId:string, projectId:string, id:string, alt:string, caption:string, state:string, width:number, height:number}): 
    Promise<{file: TFile|null, userErrors: any}> {
    try {
        const {userId, projectId, id, alt, caption, state, width, height} = fileInput;

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

                    if (data.hasOwnProperty('alt')) {
                        const {alt} = data;
                        if (alt !== undefined && alt !== null) {
                            const [errorsAlt, valueAlt] = validateString(data['alt'], {max: 350});
                            if (errorsAlt.length > 0) {
                                errors.push({field: ['alt'], message: errorsAlt[0]}); 
                            }
                            file['alt'] = valueAlt;
                        }
                    }
 
                    if (data.hasOwnProperty('caption')) {
                        const {caption} = data;
                        if (caption !== undefined && caption !== null) {
                            const [errorsCaption, valueCaption] = validateString(data['caption'], {max: 350});
                            if (errorsCaption.length > 0) {
                                errors.push({field: ['caption'], message: errorsCaption[0]}); 
                            }
                            file['caption'] = valueCaption;
                        }
                    }

                    if (data.hasOwnProperty('state')) {
                        const {state} = data;
                        if (state !== undefined && state !== null) {
                            const [errorsState, valueState] = validateString(data['state'], {
                                enumList: ['pending', 'fulfilled', 'rejected']
                            });
                            if (errorsState.length > 0) {
                                errors.push({field: ['state'], message: errorsState[0]}); 
                            }
                            file['state'] = valueState;
                        }
                    }

                    if (data.hasOwnProperty('width')) {
                        const {width} = data;
                        if (width !== undefined && width !== null) {
                            const [errorsWidth, valueWidth] = validateNumber(data['width']);
                            if (errorsWidth.length > 0) {
                                errors.push({field: ['width'], message: errorsWidth[0]}); 
                            }
                            file['width'] = valueWidth;
                        }
                    }
                    if (data.hasOwnProperty('height')) {
                        const {height} = data;
                        if (height !== undefined && height !== null) {
                            const [errorHeight, valueHeight] = validateNumber(data['height']);
                            if (errorHeight.length > 0) {
                                errors.push({field: ['height'], message: errorHeight[0]}); 
                            }
                            file['height'] = valueHeight;
                        }
                    }

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
        })({alt, caption, state, width, height});
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
                    let src = `${process.env.URL_STORAGE}/upload/p/${projectId}/f/${file.filename}.${file.ext}`;
                    // if (file.storage === 'aws') {
                    //     src = process.env.URL_STORAGE_AWS + '/' + file.awsS3Key;
                    // }

                    output.file = {
                        id: file.id,
                        filename: file.filename,
                        uuidName: file.uuidName,
                        width: file.width,
                        height: file.height,
                        size: file.size,
                        mimeType: file.mimeType,
                        contentType: file.contentType,
                        src,
                        alt: file.alt,
                        caption: file.caption,
                        state: file.state,
                        ext: file.ext
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