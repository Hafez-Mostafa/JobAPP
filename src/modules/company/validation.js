import joi from 'joi';
import { objectValidator ,generalFields} from '../../../utils/generalFields.js';

export const companyValidation = {
    body: joi.object({
        companyName: joi.string().required(),
        description: joi.string().required(),
        companyEmail: joi.string().email().required(),
        numberOfEmployees:joi.number().required(), 
        industry:joi.string().required(),
        address:joi.string().required(),
       
    }),
    
};
export const companyIdValidation = {
    params:  joi.object({ companyId:generalFields.id.required()})
  
};
export const jobIdValidation = {
    params:  joi.object({ jobId:generalFields.id.required()})
  
};
export const nameValidation = {
    params: joi.string().required()  
};
