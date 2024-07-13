import { Router } from "express";
//contoller
import * as UC from './job.controller.js'
//validation
import * as JV from "./validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";

const route = Router()

route.post('/',validation(JV.jobValidation),auth(systemRoles.company_HR),UC.createJob)
route.patch('/update/:id',validation(JV.idValidation),auth(systemRoles.company_HR),UC.updateJob)
route.delete('/delete/:id',validation(JV.idValidation),auth(systemRoles.company_HR),UC.deleteJob)
route.get('/jobsWithCompaniesInfo',auth(systemRoles.company_HR,systemRoles.user),UC.getAllJobsWithCompaniesInfo)
route.get('/jobsWithCompanyInfo',validation(JV.nameValidation),auth(systemRoles.company_HR,systemRoles.user),UC.getAllJobsWithACompanyInfo)
route.get('/jobsWithmatching',validation(JV.matchValidation),auth(systemRoles.company_HR,systemRoles.user),UC.getAllJobsWithMatching)


export default route