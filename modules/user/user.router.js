import {Router} from 'express'
import { auth } from '../../middleware/auth.js'
import { validation } from '../../middleware/validation.js'
import * as userController from './controller/user.js'
import * as userValidators from './user.validators.js' 
const router = Router ()
router.put('/updateProfile',auth(),validation(userValidators.updateProfile),userController.updateProfile)
router.patch('/updatePassword',auth(),validation(userValidators.updatePassword),userController.updatePassword)
router.patch('/softDeleteProfile',auth(),validation(userValidators.softDeleteProfile),userController.softDeleteProfile)
router.patch('/blockAccount',auth(),validation(userValidators.blockAccount),userController.blockAccount) 
router.get('/logout',auth(),userController.logout)
router.get('/',userController.getAllUsers)






export default router