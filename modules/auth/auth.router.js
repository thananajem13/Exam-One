import {Router} from 'express'
import { validation } from '../../middleware/validation.js'
import * as validators from './auth.validator.js'
import * as ac  from './controller/auth.js'
const router = Router()
router.post('/signup',validation(validators.SignUp),ac.SignUp)
router.get('/confirmEmail/:token',validation(validators.token),ac.confirmEmail)
router.get('/refToken/:token',validation(validators.token),ac.refToken)

router.post('/signin',validation(validators.SignIn),ac.SignIn)

router.get('/getUserByID/:id',validation(validators.validId),ac.getUserByID)
 


router.get('/forgetPass',validation(validators.validEmail),ac.sendLink)
router.get('/resetPass/:token',
validation(validators.token),
ac.resetPass)
router.post('/postResetpass' ,validation(validators.postResetpass) ,ac.postResetpass)


export default router