import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Typing the request more explicitly for multer
interface MulterRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
    file: Express.Multer.File;
}

// Configure storage
const storage: StorageEngine = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Set up file filter to check file types
const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const isAcceptedExtension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isAcceptedMimeType = allowedTypes.test(file.mimetype);

    if (isAcceptedExtension && isAcceptedMimeType) {
        cb(null, true);  // Accept file
    } else {
        cb(new Error('Error: Unsupported file format!'));  // Reject file
    }
};

// Initialize multer with the above settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },  // 1MB limit
    fileFilter: fileFilter
});

// Middleware to handle single file upload, field name 'file'
export const uploadSingle = upload.single('file');

// Export default if only one type of upload is mostly used
export default uploadSingle;
