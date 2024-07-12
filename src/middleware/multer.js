import AppError from '../../utils/AppError.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export  const fileTypes = {
   images: ["image/jpeg" ,"image/jpg","image/png"],
    pdf: ["application/pdf"],
    videos: ["video/mp4","video/mp4","video/avi","video/mkv","video/mov"]
};

const configureUpload= (validateType,directoryPath) => {
    const resolvedPath = path.resolve(`uploads/${directoryPath}`);
    if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, resolvedPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${uuidv4()}-${file.originalname}`);
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


export default configureUpload