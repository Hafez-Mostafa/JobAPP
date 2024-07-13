
import joi from 'joi';
import { objectValidator ,generalFields} from '../../../utils/generalFields.js';
// { jobId, userId, userTechSkills, userSoftSkills ,userResume} 

//jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, company
export const applicationValidation = {
    body: joi.object({
        userId:generalFields.id.required()    ,   
        jobId:generalFields.id.required()    ,  
        userTechSkills: joi.string().alphanum().min(3).max(30).required(),
        userSoftSkills: joi.string().alphanum().min(3).max(30).required(),
    }),
    file:generalFields.file.required(),
};

