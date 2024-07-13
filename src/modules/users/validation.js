import joi from 'joi';
import {  generalFields} from '../../../utils/generalFields.js';




//  { firstname, lastname, email, password, cpassword, DOB, mobileNumber, recoveryEmail,role}
export const signUpValidation = {
    body: joi.object({
        firstname: joi.string().alphanum().min(3).max(30).required(),
        lastname: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
        cpassword:joi.any().valid(joi.ref('password')).required(),
        DOB:joi.date().min(8).max(20).required(),
        mobileNumber:joi.number(), 
        recoveryEmail:joi.string().email(),
        role:joi.string().alphanum()
    }),
    
};

export const verfiyValidation = {
    body: joi.object({
        recoveryEmail:joi.string().email(),
      
    }),
    
};


export const signInValidation = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required()
    }),
  
};

// route.get('/visitProfile/:otherId', UC.visitUser);
export const visitProfileValidation = {
    params: joi.object({ otherId:generalFields.id.required()})
  
};
