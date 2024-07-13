import { Router } from "express";
//contoller
import * as UC from './application.controller.js'
//validation
import * as AV from "./validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";



const route = Router()

route.post('/',configureUpload(fileTypes.pdf).single('userResume'),validation(AV.applicationValidation),auth(systemRoles.user),UC.createApplication)






export default route