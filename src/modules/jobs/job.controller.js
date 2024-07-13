import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import jobModel from '../../../db/models/job.model.js';
import companyModel from '../../../db/models/company.model.js';


import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";

//============================================createjob=================================

export const createJob = asyncHandling(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills, company
    } = req.body;

    // Create new job
    const job = new jobModel({
        jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills, addedBy: req.user.id, company
    });
    const newjob = await job.save();
    if (!newjob) return next(new AppError('job could not be created', 400));

    res.status(201).json({ msg: 'job created successfully', newjob });
});

//=================================updatejob=============================================


export const updateJob = asyncHandling(async (req, res, next) => {
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

//=================================deletejob===============================

export const deleteJob = asyncHandling(async (req, res, next) => {
    const { id } = req.params
    const job = await jobModel.findById(id);
    if (!job) return next(new AppError('job not found', 404));

    if (!job.addedBy.equals(new mongoose.Types.ObjectId(req.user.id)))
        return next(new AppError('You are not allowed to update the job', 403));
    const deletejob = await jobModel.deleteOne({ _id: job._id });

    if (!deletejob) return next(new AppError('Error Updating job', 400));
    res.status(200).json({ msg: 'job delete successfully', deletejob: deletejob });
});



//=================================getAllJobsWithCompaniesInfo===============================

export const getAllJobsWithCompaniesInfo = asyncHandling(async (req, res, next) => {
    const jobs = await jobModel.find({}).populate([{ path: 'company' }])
    !jobs && next(new AppError('Error fetching job', 400));
    res.status(200).json({ msg: 'jobs fetched successfully', jobs });
})


//=================================getAllJobsWithACompanyInfo================================

export const getAllJobsWithACompanyInfo = asyncHandling(async (req, res, next) => {
    const { companyName } = req.query
    const company = await companyModel.find({ companyName })
    const jobs = await jobModel.find({ company: company[0]._id }).populate([{ path: 'company' }])
    !jobs && next(new AppError('Error fetching job', 400));
    res.status(200).json({ msg: 'jobs fetched successfully', jobs });
})


//=================================getAllJobsWithMatching================================

export const getAllJobsWithMatching = asyncHandling(async (req, res, next) => {
    const { jobLocation, workingTime, seniorityLevel, jobTitle, technicalSkills } = req.query;
    let query = {};
    if (jobLocation) query.jobLocation = jobLocation;
    if (workingTime) query.workingTime = workingTime;
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;
    if (jobTitle) query.jobTitle = jobTitle;
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(',') };
    const jobs = await jobModel.find(query).exec();
    if (!jobs || jobs.length === 0) {
        return next(new AppError('No jobs found matching the specified criteria', 404));
    }
    res.status(200).json({ msg: 'Jobs fetched successfully', jobs });

});

