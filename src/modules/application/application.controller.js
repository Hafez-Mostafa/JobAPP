import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import applicationModel from '../../../db/models/application.model.js';
import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import cloudinary from '../../../services/cloudinary.js';
import fs from 'fs';

export const createApplication = asyncHandling(async (req, res, next) => {
    const { jobId, userId, userTechSkills, userSoftSkills } = req.body;
    const userResumePath = req.file ? req.file.path : null;
    if (userResumePath) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(userResumePath, {
            folder: 'JobApp', use_filename: true, unique_filename: false });

        // Delete the local file after uploading to Cloudinary
        fs.unlink(userResumePath, (err) => {
            if (err) console.error(`Failed to delete local file: ${userResumePath}`, err); 
        });

        const application = await applicationModel.create({
            jobId, userId, userTechSkills, userSoftSkills, userResume: { secure_url, public_id }
        });

        if (!application)  return next(new AppError('Error Creating Application', 400));
    

        res.status(201).json({ msg: 'Application created successfully', application });
    } else {
        return next(new AppError('Resume is required', 400));
    }
});
