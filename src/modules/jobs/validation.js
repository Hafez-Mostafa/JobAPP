import joi from 'joi';
import { objectValidator ,generalFields} from '../../../utils/generalFields.js';

//jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, company
export const jobValidation = {
    body: joi.object({
        jobTitle: joi.string().alphanum().min(3).max(30).required(),
        jobLocation: joi.string().alphanum().min(3).max(100).required(),
        workingTime:joi.string().alphanum().min(3).max(15).required(),
        seniorityLevel:joi.string().alphanum().min(3).max(15).required(),
        jobDescription:joi.string().alphanum().min(3).max(100).required(),
        technicalSkills:joi.string().alphanum().min(3).max(15).required(),
        softSkills:joi.string().alphanum().min(3).max(15).required(),
        company: joi.string().custom(objectValidator).required()   , 
   
    }),
    
};

export const idValidation = {
    file: joi.string().custom(objectValidator).required() 
  
};

export const nameValidation = {
    query: joi.string().alphanum().min(3).max(30) 
};
export const matchValidation = {
    params: joi.string().alphanum().min(3).max(30) 
};