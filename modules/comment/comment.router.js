import { Router } from 'express'
import * as commentValidators from './comment.validators.js'
import * as commentController from '../comment/controller/comment.js'
import {validation} from '../../middleware/validation.js'
import {auth} from '../../middleware/auth.js'
const router = Router()

router.post("/addComment/:productID",auth(),validation(commentValidators.addComment),commentController.addComment)
router.post("/updateComment/:commentID",auth(),validation(commentValidators.updateComment),commentController.updateComment)
router.patch('/softDeleteComment/:commentID',auth(),validation(commentValidators.softDeleteComment),commentController.softDeleteComment)


export default router