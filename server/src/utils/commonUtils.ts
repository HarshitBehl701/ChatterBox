import { nanoid } from 'nanoid';

const responseStructure = (status: boolean, message: string, data: any = null) => {
    const responseObj: { status: boolean; message: string; data?: string } = { status, message };
    if (data) responseObj.data = JSON.stringify(data);
    return responseObj;
};

const handleCatchErrorResponse = (error: any): string => {
    return error instanceof Error ? error.message : 'Something Went Wrong';
};

const getRandomString = (length: number): string => {
    return nanoid(length);
};

export { getRandomString, responseStructure, handleCatchErrorResponse };