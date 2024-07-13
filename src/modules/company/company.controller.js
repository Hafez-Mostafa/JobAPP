import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

//models
import companyModel from '../../../db/models/company.model.js';
import applicationModel from '../../../db/models/application.model.js';
import jobModel from '../../../db/models/job.model.js';


import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import mongoose from 'mongoose';
//===============================createCompany=======================================================
export const createCompany = asyncHandling(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    const { role } = req.user;
    // Check if the company exists
    const existingCompanyByName = await companyModel.findOne({ companyName });
    if (existingCompanyByName) return next(new AppError('Company already exists', 409));
    // Check if the email is already in use
    const existingCompanyByEmail = await companyModel.findOne({ companyEmail });
    if (existingCompanyByEmail) return next(new AppError('Company email is already in use', 400));
    // Create new company
    const company = new companyModel({
        companyName, description, industry, address,
        numberOfEmployees, companyEmail, companyHR: req.user.id
    });
    const newCompany = await company.save();
    if (!newCompany) return next(new AppError('Company could not be created', 400));

    res.status(201).json({ msg: 'Company created successfully', newCompany });
});

//===============================updateCompany=======================================================
export const updateCompany = asyncHandling(async (req, res, next) => {
    const { companyName, newCompName, description, industry,
        address, numberOfEmployees, newEmail } = req.body;
    const targetCompany = await companyModel.findOne({ companyName });
    if (!targetCompany) return next(new AppError('Company not found', 404));
    if (!targetCompany.companyHR.equals(new mongoose.Types.ObjectId(req.user.id)))
        return next(new AppError('You are not allowed to update the company', 403));
    const existingCompanyByName = await companyModel.findOne({ companyName: newCompName });
    if (existingCompanyByName) return next(new AppError('Company name already exists', 409));
    const existingCompanyByEmail = await companyModel.findOne({ companyEmail: newEmail });
    if (existingCompanyByEmail) return next(new AppError('Company email is already in use', 400));
    const updatedCompany = await companyModel.updateOne({
        companyName: newCompName || targetCompany.companyName,
        description: description || targetCompany.description,
        industry: industry || targetCompany.industry,
        address: address || targetCompany.address,
        numberOfEmployees: numberOfEmployees || targetCompany.numberOfEmployees,
        companyEmail: newEmail || targetCompany.companyEmail,
    });
    if (!updatedCompany) return next(new AppError('Error Updating Company', 400));
    res.status(200).json({ msg: 'Company updated successfully', updatedCompany: updatedCompany });
});

//===============================deleteCompany=======================================================

export const deleteCompany = asyncHandling(async (req, res, next) => {
    const { companyName } = req.params
    const company = await companyModel.findOne({ companyName });
    if (!company) return next(new AppError('Company not found', 404));
    if (!company.companyHR.equals(new mongoose.Types.ObjectId(req.user.id)))
        return next(new AppError('You are not allowed to update the company', 403));
    const deleteCompany = await companyModel.deleteOne({_id:company._id});
    if (!deleteCompany) return next(new AppError('Error Updating Company', 400));
    res.status(200).json({ msg: 'Company delete successfully', deleteCompany: deleteCompany });
});

//===============================companyData=======================================================
export const companyData = asyncHandling(async(req,res,next)=>{
    const {companyId}=req.params
    const company = await companyModel.findById(companyId)
    company || next(new AppError('company not found',404))
    const jobs = await jobModel.find({ addedBy: company.companyHR });
    jobs || next(new AppError('company not found',404))
   res.status(201).json({msg:"success",jobs})
})
//===============================CompanSearchy=======================================================
export const searchCompany = asyncHandling(async(req,res,next)=>{
    const {companyName}=req.params
   const company = await companyModel.findOne({companyName})
   company || next(new AppError('company not found',404))
   res.status(201).json({msg:"success",company})
})

//===============================jobApplications=======================================================
export const jobApplications = asyncHandling(async (req, res, next) => {
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId);
    job ||  next(new AppError('Job not found', 404));
    if (job.addedBy.toString() !== req.user.id) { 
        return next(new AppError('You do not have permission to view applications for this job', 403));
    }
    const applications = await applicationModel.find({ jobId }).populate('userId', '-password -__v');
    !applications.length && next(new AppError('No applications found for this job', 404));
    res.status(200).json({ msg: "success", applications });
});