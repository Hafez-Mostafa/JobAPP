import { Router } from "express";
//contoller
import * as UC from './job.controller.js'
//validation
import * as UV from "./job.validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";




const route = Router()

route.post('/',auth(systemRoles.company_HR),UC.createjob)
route.patch('/update/:id',auth(systemRoles.company_HR),UC.updatejob)
route.delete('/delete/:id',auth(systemRoles.company_HR),UC.deletejob)
route.get('/jobsWithCompaniesInfo',auth(systemRoles.company_HR,systemRoles.user),UC.getAllJobsWithCompaniesInfo)
route.get('/jobsWithCompanyInfo',auth(systemRoles.company_HR,systemRoles.user),UC.getAllJobsWithACompanyInfo)










export default route