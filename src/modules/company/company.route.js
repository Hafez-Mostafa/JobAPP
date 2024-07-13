import { Router } from "express";
//contoller
import * as UC from './company.controller.js'
//validation
import * as UV from "./company.validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";




const route = Router()

route.post('/',auth(systemRoles.company_HR),UC.createCompany)
route.patch('/update',auth(systemRoles.company_HR),UC.updateCompany)
route.delete('/delete/:companyName',auth(systemRoles.company_HR),UC.deleteCompany)


route.get('/data/:companyId',auth(systemRoles.company_HR),UC.companyData)
route.get('/search/:companyName',auth(systemRoles.company_HR,systemRoles.user),UC.searchCompany)
route.get('/applications/:jobId',auth(systemRoles.company_HR),UC.jobApplications)






export default route