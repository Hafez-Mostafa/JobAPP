import { Router } from "express";
//contoller
import * as UC from './application.controller.js'
//validation
import * as UV from "./application.validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";



const route = Router()

route.post('/',configureUpload(fileTypes.pdf).single('userResume'),UC.createApplication)






export default route