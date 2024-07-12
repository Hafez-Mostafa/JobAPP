import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import jobModel from '../../../db/models/job.model.js';
import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import systemRoles from '../../../utils/systemRoles.js';
import mongoose, { mongo } from 'mongoose';


export const createjob = asyncHandling(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills
    } = req.body;
    const { role } = req.user;


    // Create new job
    const job = new jobModel({
        jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills, addedBy: req.user.id
    });
    const newjob = await job.save();
    if (!newjob) return next(new AppError('job could not be created', 400));

    res.status(201).json({ msg: 'job created successfully', newjob });
});



export const updatejob = asyncHandling(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills } = req.body;
    const { id } = req.params
    const job = await jobModel.findById(id);
    if (!job) return next(new AppError('job not found', 404));

    if (!job.addedBy.equals(new mongoose.Types.ObjectId(req.user.id)))
        return next(new AppError('You are not allowed to update the job', 403));


    const updatedjob = await jobModel.findByIdAndUpdate(job._id, {
        jobTitle: jobTitle || job.jobTitle,
        jobLocation: jobLocation || job.jobLocation,
        workingTime: workingTime,
        seniorityLevel: seniorityLevel || job.seniorityLevel,
        jobDescription: jobDescription || job.jobDescription,
        technicalSkills: technicalSkills || job.technicalSkills,
        softSkills: softSkills || job.softSkills
    }, { new: true });

    if (!updatedjob) return next(new AppError('Error Updating job', 400));
    res.status(200).json({ msg: 'job updated successfully', updatedjob: updatedjob });
});


export const deletejob = asyncHandling(async (req, res, next) => {
    const { id } = req.params
    const job = await jobModel.findById(id);
    if (!job) return next(new AppError('job not found', 404));

    if (!job.addedBy.equals(new mongoose.Types.ObjectId(req.user.id)))
        return next(new AppError('You are not allowed to update the job', 403));


    const deletejob = await jobModel.deleteOne({ _id: job._id });

    if (!deletejob) return next(new AppError('Error Updating job', 400));
    res.status(200).json({ msg: 'job delete successfully', deletejob: deletejob });
});
