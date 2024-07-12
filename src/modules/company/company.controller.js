import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import companyModel from '../../../db/models/company.model.js';
import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import systemRoles from '../../../utils/systemRoles.js';
import { ta } from 'date-fns/locale';
import mongoose, { mongo } from 'mongoose';


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


// 4. Get company data
//     - send the companyId in params to get the desired company data
//     - return all jobs related to this company
//     - apply authorization with role ( Company_HR)
// 5. Search for a company with a name.
//     - apply authorization with the role ( Company_HR and User)
// 6. Get all applications for specific Job
//     - each company Owner can take a look at the applications for his jobs only, he has no access to other companies’ application
//     - return each application with the user data, not the userId
//     - apply authorization with role (  Company_HR )