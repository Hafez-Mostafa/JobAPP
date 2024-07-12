import { Router } from "express";
//contoller
import * as UC from './user.controller.js'
//validation
import * as UV from "./user.validation.js";
import {validation} from '../../middleware/validation.js'
// file management
import configureUpload from "../../middleware/multer.js";
import {fileTypes} from "../../middleware/multer.js";
//authenticatin & authentfizierung
import { auth } from "../../middleware/auth.js";
import systemRoles from "../../../utils/systemRoles.js";




const route = Router()

route.post('/signUp',UC.signUp)
route.post('/signIn',UC.signIn)
route.get('/verifyEmail/:token',UC.emailConfirmation)
route.get('/refreshToken/:refreshToken',UC.refreshToken)
route.patch('/update', auth([systemRoles.user]), UC.updateUser);
route.delete('/delete', auth([systemRoles.user]), UC.deleteUser);
route.get('/user', auth([systemRoles.user]), UC.getUserbyOwner);
route.get('/visitProfile/:otherId', UC.visitUser);
route.patch('/updatePassword', auth([systemRoles.user]), UC.updatePassword);
route.get('/verifiedUsers', auth([systemRoles.Admin]), UC.verifiedUsers);
route.patch('/forgotPassword', UC.forgotPassword);
route.get('/recoverEmail/:token',UC.confirmRecoverEmail)









export default route