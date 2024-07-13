import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import jobModel from '../../../db/models/job.model.js';
import companyModel from '../../../db/models/company.model.js';


import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import systemRoles from '../../../utils/systemRoles.js';
import mongoose, { mongo } from 'mongoose';


export const createjob = asyncHandling(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills,company
    } = req.body;

    // Create new job
    const job = new jobModel({
        jobTitle, jobLocation, workingTime, seniorityLevel,
        jobDescription, technicalSkills, softSkills, addedBy: req.user.id,company
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



// 4. Get all Jobs with their company’s information.
//     - apply authorization with the role ( User , Company_HR )
export const getAllJobsWithCompaniesInfo= asyncHandling(async (req,res,next)=>{
    const jobs = await jobModel.find({}).populate([{path:'company' }])
    !jobs &&  next(new AppError('Error fetching job', 400));
    res.status(200).json({ msg: 'jobs fetched successfully', jobs });
})


//========================================================================================
// // 5. Get all Jobs for a specific company.
// //     - apply authorization with the role ( User , Company_HR )
// //     - send the company name in the query and get this company jobs.

export const getAllJobsWithACompanyInfo= asyncHandling(async (req,res,next)=>{

    const {compName}=req.query
    const jobs = await jobModel.find({company:compName}).populate([{path:'company' }])
    !jobs &&  next(new AppError('Error fetching job', 400));
    res.status(200).json({ msg: 'jobs fetched successfully', jobs });
})



// // 6. Get all Jobs that match the following filters 

// //     - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
// //     - one or more of them should applied
// //     **Exmaple** : if the user selects the   
// //     **workingTime** is **part-time** and the **jobLocation** is **onsite** 
// //     , we need to return all jobs that match these conditions
// //     - apply authorization with the role ( User , Company_HR )

// export const getAllJobsWithMatching= asyncHandling(async (req,res,next)=>{
    
    
// })

