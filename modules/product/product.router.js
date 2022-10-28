import {Router} from 'express'
import {validation} from '../../middleware/validation.js'
import {auth} from '../../middleware/auth.js'
import * as productValidators from '../product/product.validator.js'
import * as productController from './controller/product.js'
import { checkIfProfileCompletedOrNot } from '../../services/checkCompleteFile.js'
const router = Router()

router.post('/addProduct',auth(),checkIfProfileCompletedOrNot(),validation(productValidators.addProduct),productController.addProduct)

router.patch('/updateProduct/:productID',auth(),validation(productValidators.updateProduct),productController.updateProduct)

router.delete('/deleteProduct/:productID',auth(),validation(productValidators.deleteProduct),productController.deleteProduct)
router.patch('/softDeleteProduct/:productID',auth(),validation(productValidators.deleteProduct),productController.softDeleteProduct)
router.get('/getProductByID/:productID',validation(productValidators.deleteProduct),productController.getProductByID)
router.post('/likeProduct/:productID',auth(),validation(productValidators.deleteProduct),productController.likeProduct)
router.post('/unLikeProduct/:productID',auth(),validation(productValidators.deleteProduct),productController.unLikeProduct)
router.get('/productTitleSearch',validation(productValidators.productTitleSearch),productController.productTitleSearch)
router.get('/getAllProductWithTheirComment',productController.getAllProductWithTheirComment)
export default router