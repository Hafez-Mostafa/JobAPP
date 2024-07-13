import { Router } from "express";
//contoller
import * as CC from './company.controller.js'
//validation
import * as CV from "./validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";




const route = Router()

route.post('/',validation(CV.companyValidation),auth([systemRoles.company_HR]),CC.createCompany)
route.patch('/update',auth([systemRoles.company_HR]),CC.updateCompany)
route.delete('/delete/:companyName',validation(CV.nameValidation),auth([systemRoles.company_HR]),CC.deleteCompany)


route.get('/data/:companyId',validation(CV.companyIdValidation),auth([systemRoles.company_HR]),CC.companyData)
route.get('/search/:companyName',validation(CV.nameValidation),auth([systemRoles.company_HR],systemRoles.user),CC.searchCompany)
route.get('/applications/:jobId',validation(CV.jobIdValidation),auth([systemRoles.company_HR]),CC.jobApplications)






export default route