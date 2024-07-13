import multer from 'multer';
import path from 'path';
import AppError from '../../utils/AppError.js';

export const fileTypes = {
    images: ["image/jpeg", "image/jpg", "image/png"],
    pdf: ["application/pdf"],
    videos: ["video/mp4", "video/avi", "video/mkv", "video/mov"]
};

const configureUpload = (validateType) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${Date.now()}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (validateType.includes(file.mimetype)) {
            return cb(null, true);
        }
        return cb(new AppError(`Invalid file type: ${file.mimetype}`, 400), false);
    };

    return multer({
        storage,
        fileFilter
    });
};

export default configureUpload;
